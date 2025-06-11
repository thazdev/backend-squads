import { db } from "../../database/arango";
import { AuthenticationError, UserInputError } from "apollo-server";

const collabCol = db.collection("collaborators");
const squadCol  = db.collection("squads");

export const collaboratorMutations = {
  createCollaborator: async (_: any, { input }: any, ctx: any) => {
    const ownerId = ctx?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");
    if (!input.name?.trim())  throw new UserInputError("Name required");
    if (!input.email?.trim()) throw new UserInputError("Email required");

    const emailExists = await db.query(
      `FOR c IN collaborators FILTER c.email == @e RETURN 1`,
      { e: input.email }
    );
    if (await emailExists.next()) {
      throw new UserInputError("Email already in use");
    }
    if (input.squadId) {
      const squad = await squadCol.documentExists(input.squadId);
      if (!squad) throw new UserInputError("Squad not found");
    }

    const doc = {
      name: input.name,
      email: input.email,
      role: input.role || "DEV",
      squadId: input.squadId || null,
      createdAt: new Date().toISOString(),
      ownerId,
    };

    const meta = await collabCol.save(doc);
    return { id: meta._key, ...doc };
  },
};
