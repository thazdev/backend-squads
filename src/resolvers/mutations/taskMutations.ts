import { AuthenticationError, UserInputError } from "apollo-server";
import { db } from "../../database/arango";

const taskCol = db.collection("tasks");
const squadCol = db.collection("squads");

export const taskMutations = {
  createTask: async (_: any, { input }: any, ctx: any) => {
    const ownerId = ctx?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");

    const squad = await squadCol.document(input.squadId).catch(() => null);
    if (!squad || squad.ownerId !== ownerId) {
      throw new UserInputError("Squad not found");
    }

    const doc = {
      title: input.title,
      description: input.description || "",
      status: "TODO",
      priority: input.priority || "MEDIUM",
      squadId: input.squadId,
      assigneeId: input.assigneeId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId,
    };

    const meta = await taskCol.save(doc);
    return { id: meta._key, ...doc };
  },

  async updateTask(_: unknown, { input }: { input: any }, ctx: any) {
    const { id, ...fields } = input;
    const payload = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined),
    );
    if (Object.keys(payload).length === 0) {
      throw new Error("Nothing to update");
    }
    await taskCol.update(id, {
      ...payload,
      updatedAt: new Date().toISOString(),
    });
    const doc = await taskCol.document(id);
    return { ...doc, id: doc._key };
  },

  deleteTask: async (_: any, { id }: any, ctx: any) => {
    const ownerId = ctx?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");
    const task = await taskCol.document(id);
    if (task.ownerId !== ownerId) return false;
    await taskCol.remove(id);
    return true;
  },
};
