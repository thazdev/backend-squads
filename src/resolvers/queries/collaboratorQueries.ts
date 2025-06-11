import { db } from "../../database/arango";
import { AuthenticationError } from "apollo-server";

export const collaboratorQueries = {
  collaborators: async (_: any, { filter }: any, ctx: any) => {
    const ownerId = ctx?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");

    const squadCond = filter?.squadId
      ? " && c.squadId == @squad"
      : "";

    const cursor = await db.query(
      `
        FOR c IN collaborators
          FILTER c.ownerId == @owner${squadCond}
          RETURN MERGE(c, { id: c._key })
      `,
      { owner: ownerId, squad: filter?.squadId }
    );

    return await cursor.all();
  },
};
