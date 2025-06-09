import { db } from '../../database/arango';

const squadCollection = db.collection('squads');

export const squadMutations = {
  createSquad: async (_: any, { input }: any, context: any) => {
    if (!context.user) throw new Error('Não autenticado');
    if (!input.name) throw new Error('Nome do squad é obrigatório');

    const meta = await squadCollection.save(input);
    return {
      _key: meta._key,
      ...input
    };
  }
};
