import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DSGResourceData } from "@amplication/code-gen-types";
import axios from "axios";
import { promises as fs } from "fs";
import { copy } from "fs-extra";
import { join, dirname } from "path";
import { Env } from "../env";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { CodeGeneratorSplitterService } from "../code-generator/code-generator-splitter.service";

@Traceable()
@Injectable()
export class BuildRunnerService {
  constructor(
    private readonly configService: ConfigService<Env, true>,
    private readonly codeGeneratorSplitterService: CodeGeneratorSplitterService
  ) {}

  async runJobs(
    resourceId: string,
    buildId: string,
    dsgResourceData: DSGResourceData,
    codeGeneratorVersion: string
  ) {
    const jobs = await this.codeGeneratorSplitterService.splitJobs(
      dsgResourceData,
      buildId
    );
    for (const [domainType, data] of jobs) {
      const jobBuildId = `${buildId}-${domainType}`;
      await this.saveDsgResourceData(jobBuildId, data, codeGeneratorVersion);

      const url = this.configService.get(Env.DSG_RUNNER_URL);
      try {
        await axios.post(url, {
          resourceId: resourceId,
          buildId: jobBuildId,
          codeGeneratorVersion,
        });
      } catch (error) {
        throw new Error(error.message, {
          cause: {
            code: error.response?.status,
            message: error.response?.data?.message,
            data: error.config?.data,
          },
        });
      }
    }
  }

  async saveDsgResourceData(
    buildId: string,
    dsgResourceData: DSGResourceData,
    codeGeneratorVersion: string
  ) {
    const savePath = join(
      this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
      buildId,
      this.configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE)
    );

    const saveDir = dirname(savePath);
    await fs.mkdir(saveDir, { recursive: true });

    await fs.writeFile(
      savePath,
      JSON.stringify({ ...dsgResourceData, codeGeneratorVersion })
    );
  }

  async getCodeGeneratorVersion(buildId: string) {
    const data = await fs.readFile(
      join(
        this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
        buildId,
        this.configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE)
      )
    );

    const config = <DSGResourceData & { codeGeneratorVersion: string }>(
      JSON.parse(data.toString())
    );

    return config.codeGeneratorVersion;
  }

  async copyFromJobToArtifact(
    resourceId: string,
    buildIdWithDomainName: string
  ): Promise<[string, boolean]> {
    const domainName = this.codeGeneratorSplitterService.extractDomainName(
      buildIdWithDomainName
    );
    const buildId = this.codeGeneratorSplitterService.extractBuildId(
      buildIdWithDomainName
    );

    try {
      const jobPath = join(
        this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
        buildIdWithDomainName,
        this.configService.get(Env.DSG_JOBS_CODE_FOLDER)
      );

      const artifactPath = join(
        this.configService.get(Env.BUILD_ARTIFACTS_BASE_FOLDER),
        resourceId,
        buildId
      );

      await copy(jobPath, artifactPath);
      return [domainName, true];
      return;
    } catch (error) {
      return [domainName, false];
    }
  }
}
