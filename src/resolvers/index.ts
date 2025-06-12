import { collaboratorQueries } from "./queries/collaboratorQueries";
import { squadQueries } from "./queries/squadQueries";
import { taskQueries } from "./queries/taskQueries";

import { collaboratorMutations } from "./mutations/collaboratorMutations";
import { squadMutations } from "./mutations/squadMutations";
import { taskMutations } from "./mutations/taskMutations";
import { userMutations } from "./mutations/userMutations";

import { Task as TaskFieldResolvers } from "./task/TaskFieldResolvers";

export default {
  Task: TaskFieldResolvers,

  Query: {
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
