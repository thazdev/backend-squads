import { db } from '../../database/arango';

export const collaboratorQueries = {
  getAllCollaborators: async () => {
    const cursor = await db.query(`
      FOR doc IN collaborators
      RETURN doc
    `);
    return await cursor.all();
  }
};
