// src/graphql/resolvers/squadQueries.ts
import { AuthenticationError } from "apollo-server";
import { db } from "../../database/arango";

export const squadQueries = {
  squads: async (_: any, __: any, context: any) => {
    const ownerId = context?.user?.id;
    console.log("ownerId ⇒", ownerId);
    if (!ownerId) {
      throw new AuthenticationError("Login required");
    }
    const cursor = await db.query(
      `
        FOR s IN squads
          FILTER s.ownerId == @owner
          RETURN MERGE(s, { id: s._key })
      `,
      { owner: ownerId },
    );
    return await cursor.all();
  },
};
