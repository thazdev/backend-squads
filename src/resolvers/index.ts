/* src/resolvers/index.ts ─ versão final, sem graphql-upload */

import { collaboratorQueries } from "./queries/collaboratorQueries";
import { squadQueries } from "./queries/squadQueries";
import { taskQueries } from "./queries/taskQueries";
import { userQueries } from "./queries/userQueries";

import { collaboratorMutations } from "./mutations/collaboratorMutations";
import { squadMutations } from "./mutations/squadMutations";
import { taskMutations } from "./mutations/taskMutations";
import { userMutations } from "./mutations/userMutations";
import { authMutations } from "./mutations/authMutation";

import { Task as TaskFieldResolvers } from "./task/TaskFieldResolvers";

export default {
  // Upload: GraphQLUpload,  ← removido

  Task: TaskFieldResolvers,

  Query: {
    ...userQueries,
    ...taskQueries,
    ...collaboratorQueries,
    ...squadQueries,
  },
  
  Mutation: {
    ...authMutations,
    ...userMutations,
    ...collaboratorMutations,
    ...squadMutations,
    ...taskMutations,
  },
};
