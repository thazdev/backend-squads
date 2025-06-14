/* src/resolvers/index.ts ─ versão final, sem graphql-upload */

import { collaboratorQueries } from "./queries/collaboratorQueries";
import { squadQueries } from "./queries/squadQueries";
import { taskQueries } from "./queries/taskQueries";
import { userQueries } from "./queries/userQueries";

import { collaboratorMutations } from "./mutations/collaboratorMutations";
import { squadMutations } from "./mutations/squadMutations";
import { taskMutations } from "./mutations/taskMutations";
import { userMutations } from "./mutations/userMutations";

import { Task as TaskFieldResolvers } from "./task/TaskFieldResolvers";

export default {
<<<<<<< HEAD
=======
  // Upload: GraphQLUpload,  ← removido

>>>>>>> e7ef432a45aebcd7043a73729b403dd322ba4f3a
  Task: TaskFieldResolvers,

  Query: {
    ...userQueries,
    ...taskQueries,
    ...collaboratorQueries,
    ...squadQueries,
  },

  Mutation: {
    ...userMutations,
    ...collaboratorMutations,
    ...squadMutations,
    ...taskMutations,
  },
};
