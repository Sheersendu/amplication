import { gql } from "@apollo/client";

export const MODULE_ACTION_FIELDS_FRAGMENT = gql`
  fragment ModuleActionFields on ModuleAction {
    id
    name
    displayName
    description
    enabled
    gqlOperation
    restVerb
    path
    lockedByUserId
    lockedAt
    lockedByUser {
      account {
        firstName
        lastName
      }
    }
  }
`;

export const DELETE_MODULE_ACTION = gql`
  mutation deleteModuleAction($where: WhereUniqueInput!) {
    deleteModuleAction(where: $where) {
      id
    }
  }
`;

export const GET_MODULE_ACTION = gql`
  ${MODULE_ACTION_FIELDS_FRAGMENT}
  query ModuleAction($moduleActionId: String!) {
    ModuleAction(where: { id: $moduleActionId }) {
      ...ModuleActionFields
    }
  }
`;

export const UPDATE_MODULE_ACTION = gql`
  ${MODULE_ACTION_FIELDS_FRAGMENT}
  mutation updateModuleAction(
    $data: ModuleActionUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updateModuleAction(data: $data, where: $where) {
      ...ModuleActionFields
    }
  }
`;

export const CREATE_MODULE_ACTION = gql`
  ${MODULE_ACTION_FIELDS_FRAGMENT}
  mutation createModuleAction($data: ModuleActionCreateInput!) {
    createModuleAction(data: $data) {
      ...ModuleActionFields
    }
  }
`;

export const FIND_MODULE_ACTIONS = gql`
  ${MODULE_ACTION_FIELDS_FRAGMENT}
  query ModuleActions(
    $where: ModuleActionWhereInput
    $orderBy: ModuleActionOrderByInput
  ) {
    ModuleActions(where: $where, orderBy: $orderBy) {
      ...ModuleActionFields
    }
  }
`;
