import { ApolloError } from "apollo-server";
import { db } from "../../database/arango";

const taskCol = db.collection("tasks");

export const taskQueries = {
  async tasks(
    _: unknown,
    { squadId, assigneeId }: { squadId?: string; assigneeId?: string },
  ) {
    const filters = [];
    if (squadId) filters.push("FILTER t.squadId == @squadId");
    if (assigneeId) filters.push("FILTER t.assigneeId == @assigneeId");

    const query = `
      FOR t IN tasks
      ${filters.join("\n")}
      SORT t.createdAt DESC
      RETURN MERGE(t, { id: t._key })
    `;

    const cursor = await db.query(query, { squadId, assigneeId });
    return await cursor.all();
  },

  async task(_: unknown, { id }: { id: string }) {
    try {
      const doc = await taskCol.document(String(id));
      return { ...doc, id: doc._key };
    } catch {
      throw new ApolloError("Task not found", "NOT_FOUND");
    }
  },
};
