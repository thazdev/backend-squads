import { db } from '../../database/arango';

export const squadQueries = {
  getAllSquads: async () => {
    const cursor = await db.query(`
      FOR doc IN squads
      RETURN doc
    `);
    return await cursor.all();
  }
};
