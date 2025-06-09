import { db } from '../../database/arango';

const collection = db.collection('collaborators');

export const collaboratorMutations = {
  createCollaborator: async (_: any, { input }: any, context: any) => {
    if (!context.user) throw new Error('Não autenticado');
    if (!input.name) throw new Error('Nome do colaborador é obrigatório');

    const meta = await collection.save({
      ...input,
      squadIds: []
    });

    return {
      _key: meta._key,
      ...input,
      squadIds: []
    };
  }
};
