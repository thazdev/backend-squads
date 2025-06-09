import { db } from '../../database/arango';

export const taskQueries = {
  getAllTasks: async () => {
    const cursor = await db.query(`
      FOR doc IN tasks
      RETURN doc
    `);
    return await cursor.all();
  }
};
