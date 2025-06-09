import { db } from '../../database/arango';

const taskCollection = db.collection('tasks');

export const taskMutations = {
  createTask: async (_: any, { input }: any, context: any) => {
    if (!context.user) throw new Error('Não autenticado');
    if (!input.title) throw new Error('Título da tarefa é obrigatório');

    const meta = await taskCollection.save(input);
    return {
      _key: meta._key,
      ...input
    };
  }
};
