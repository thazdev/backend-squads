import { db } from "../../database/arango";
import { AuthenticationError } from "apollo-server";

export const taskQueries = {
  tasks: async (_: any, { squadId }: any, ctx: any) => {
    const ownerId = ctx?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");

    const cursor = await db.query(
      `
        FOR t IN tasks
          FILTER t.squadId == @squad && t.ownerId == @owner
          RETURN MERGE(t, { id: t._key })
      `,
      { squad: squadId, owner: ownerId }
    );
    return await cursor.all();
  },
};
