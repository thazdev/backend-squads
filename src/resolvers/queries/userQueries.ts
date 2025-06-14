/* src/graphql/resolvers/userQueries.ts */
import { aql } from "arangojs";
import { db } from "../../database/arango";

const userCol = db.collection("users");
const squadCol = db.collection("squads");
const taskCol = db.collection("tasks");

export const userQueries = {
  me: async (_: any, __: any, ctx: any) => {
    const uid = ctx.user?.id;
    if (!uid) return null; // front cairá no login se não logado

    /* ---------- usuário ---------- */
    const userDoc = await userCol.document(uid);
    const user = { id: uid, ...userDoc };

    /* ---------- squads (onde ele é membro) ---------- */
    const squads = await db
      .query(
        aql`
      FOR s IN ${squadCol}
        FILTER ${uid} IN s.memberIds
        RETURN MERGE(s, { id: s._key })
    `,
      )
      .then((c) => c.all());

    /* ---------- contagem de tasks ---------- */
    const stats = await db
      .query(
        aql`
      RETURN {
        total: LENGTH(FOR t IN ${taskCol} FILTER t.ownerId == ${uid} RETURN 1),
        pending: LENGTH(FOR t IN ${taskCol}
                        FILTER t.ownerId == ${uid} AND t.status != "DONE"
                        RETURN 1),
        done: LENGTH(FOR t IN ${taskCol}
                     FILTER t.ownerId == ${uid} AND t.status == "DONE"
                     RETURN 1)
      }
    `,
      )
      .then((c) => c.next());

    return { user, squads, tasksOverall: stats };
  },
};
