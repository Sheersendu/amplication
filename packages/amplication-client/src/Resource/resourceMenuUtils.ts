import { EnumResourceType } from "../models";
import { BillingFeature } from "../util/BillingFeature";

export type MenuItemLinks =
  | "entities"
  | "roles"
  | "git"
  | "settings"
  | "plugins"
  | "topics"
  | "services"
  | "connections"
  | "modules"
  | "pendingChanges";

export const resourceMenuLayout: {
  [key in EnumResourceType]: MenuItemLinks[];
} = {
  [EnumResourceType.Service]: [
    "modules",
    "entities",
    "roles",
    "plugins",
    "git",
    "connections",
    "settings",
  ],
  [EnumResourceType.ProjectConfiguration]: ["git", "settings"],
  [EnumResourceType.MessageBroker]: ["topics", "services", "git", "settings"],
};

export const linksMap: {
  [key in MenuItemLinks]: {
    title: string;
    icon: string;
    to: string;
    license?: BillingFeature;
  };
} = {
  entities: {
    title: "Entities",
    icon: "entity_outline",
    to: "/entities",
  },
  roles: {
    title: "Roles",
    icon: "roles_outline",
    to: "/roles",
  },
  git: {
    title: "Sync with Git",
    icon: "pending_changes",
    to: "/git-sync",
  },
  settings: {
    title: "Settings",
    icon: "settings",
    to: "/settings",
  },
  plugins: {
    title: "Plugins",
    icon: "plugins",
    to: "/plugins",
  },
  topics: {
    title: "Topics",
    icon: "topic",
    to: "/topics",
  },
  services: {
    title: "Connected Services",
    icon: "services",
    to: "/services",
  },
  connections: {
    title: "Connections",
    icon: "connection",
    to: "/service-connections",
  },
  pendingChanges: {
    title: "Pending Changes",
    icon: "pending_changes",
    to: "/pending-changes",
  },
  modules: {
    title: "Modules",
    icon: "box",
    to: "/modules/all",
    license: BillingFeature.CustomActions,
  },
};

export const setResourceUrlLink = (
  workspace: string,
  project: string,
  resource: string,
  itemUrl: string
): string => `/${workspace}/${project}/${resource}${itemUrl}`;
