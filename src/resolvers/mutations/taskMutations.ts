import { db } from "../../database/arango";
import { AuthenticationError, UserInputError } from "apollo-server";

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

  updateTask: async (_: any, { input }: any, ctx: any) => {
    const { id, status } = input;
    const task = await taskCol.document(id);
    await taskCol.update(id, { status, updatedAt: new Date().toISOString() });
    return { ...task, status };
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
