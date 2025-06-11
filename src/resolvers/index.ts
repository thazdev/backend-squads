import { collaboratorQueries } from "./queries/collaboratorQueries";
import { squadQueries } from "./queries/squadQueries";
import { taskQueries } from "./queries/taskQueries";

import { userMutations } from "./mutations/userMutations";
import { collaboratorMutations } from "./mutations/collaboratorMutations";
import { squadMutations } from "./mutations/squadMutations";
import { taskMutations } from "./mutations/taskMutations";

import { Task as TaskFieldResolvers } from "./task/TaskFieldResolvers";

/**
 * Mapeamento final de resolvers a ser entregue ao ApolloServer.
 * A chave 'Task' precisa receber o objeto com os campos internos,
 * senão o loader reclama que "Task tem valor undefined".
 */
export default {
  Task: TaskFieldResolvers,  // <-- conecta campos de Task

  Query: {
    ...collaboratorQueries,
    ...squadQueries,
    ...taskQueries,
  },

  Mutation: {
    ...userMutations,
    ...collaboratorMutations,
    ...squadMutations,
    ...taskMutations,
  },
};
