import { db } from '../database/arango';

const collection = db.collection('collaborators');
const squadCollection = db.collection('squads');
const taskCollection = db.collection('tasks');

const resolvers = {
  Query: {
    getAllCollaborators: async () => {
      const cursor = await db.query(`
        FOR doc IN collaborators
        RETURN doc
      `);
      return await cursor.all();
    },
    getAllSquads: async () => {
      const cursor = await db.query(`
        FOR doc IN squads
        RETURN doc
      `);
      return await cursor.all();
    },
    getAllTasks: async () => {
      const cursor = await db.query(`
        FOR doc IN tasks
        RETURN doc
      `);
      return await cursor.all();
    }
    
  },
  Mutation: {
    createCollaborator: async (_: any, { input }: any) => {
      const meta = await collection.save({
        ...input,
        squadIds: []
      });
      return {
        _key: meta._key,
        ...input,
        squadIds: []
      };
    },
    createSquad: async (_: any, { input }: any) => {
      const meta = await squadCollection.save(input);
      return {
        _key: meta._key,
        ...input
      };
    },
    createTask: async (_: any, { input }: any) => {
      const meta = await taskCollection.save(input);
      return {
        _key: meta._key,
        ...input
      };
    }
  }
};


export default resolvers;
