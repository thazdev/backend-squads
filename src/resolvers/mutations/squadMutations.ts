import { db } from "../../database/arango";
import { AuthenticationError, UserInputError } from "apollo-server";

const squadCollection = db.collection("squads");

export const squadMutations = {
  createSquad: async (_: any, { input }: any, context: any) => {
    const ownerId = context?.user?.id;
    if (!ownerId) {
      throw new AuthenticationError("Login required");
    }
    if (!input.name?.trim()) {
      throw new UserInputError("Squad name is mandatory");
    }
    const cursor = await db.query(
      `
        FOR s IN squads
          FILTER s.name == @name AND s.ownerId == @owner
          RETURN 1
      `,
      { name: input.name, owner: ownerId }
    );
    const alreadyExists = await cursor.next(); 
    if (alreadyExists) {
      throw new UserInputError("You already have a squad with this name");
    }
    const doc = {
      name: input.name,
      description: input.description ?? "",
      archived: false,
      createdAt: new Date().toISOString(),
      ownerId,
    };
    const meta = await squadCollection.save(doc);
    return { id: meta._key, ...doc };
  },
};
