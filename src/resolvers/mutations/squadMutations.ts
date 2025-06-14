// src/graphql/resolvers/squadMutations.ts
import { AuthenticationError, UserInputError } from "apollo-server";
import { aql } from "arangojs";
import { db } from "../../database/arango";

const squadCol = db.collection("squads");
const collabCol = db.collection("collaborators");

export const squadMutations = {
  /* ─────────── CREATE ─────────── */
  createSquad: async (_: any, { input }: any, ctx: any) => {
    const ownerId = ctx?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");
    if (!input.name?.trim()) throw new UserInputError("Name required");

    const memberIds: string[] = input.memberIds ?? [];

    const doc = {
      name: input.name,
      description: input.description ?? null,
      goal: input.goal ?? null,
      memberIds,
      archived: false,
      createdAt: new Date().toISOString(),
      ownerId,
    };

    /* salva o squad */
    const { _key: sid } = await squadCol.save(doc);

    /* vincula colaboradores (mantém dados consistentes) */
    if (memberIds.length) {
      await db.query(aql`
        FOR c IN ${collabCol}
          FILTER c._key IN ${memberIds}
          UPDATE c WITH { squadId: ${sid} } IN ${collabCol}
      `);
    }

    return { id: sid, ...doc };
  },

  /* ─────────── ADD MEMBER ─────────── */
  addMemberToSquad: async (_: any, { squadId, memberId }: any, ctx: any) => {
    const ownerId = ctx?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");

    const squad = await squadCol.document(squadId);
    if (!squad) throw new UserInputError("Squad not found");

    /* adiciona ao array, se ainda não estiver */
    if (!squad.memberIds?.includes(memberId)) {
      await squadCol.update(squadId, {
        memberIds: [...(squad.memberIds || []), memberId],
      });
    }

    /* vincula colaborador */
    await collabCol.update(memberId, { squadId });

    const updated = await squadCol.document(squadId);
    return { id: squadId, ...updated };
  },

  /* ─────────── REMOVE MEMBER ─────────── */
  removeMemberFromSquad: async (
    _: any,
    { squadId, memberId }: any,
    ctx: any,
  ) => {
    const ownerId = ctx?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");

    const squad = await squadCol.document(squadId);
    if (!squad) throw new UserInputError("Squad not found");

    /* retira do array */
    await squadCol.update(squadId, {
      memberIds: (squad.memberIds || []).filter(
        (id: string) => id !== memberId,
      ),
    });

    /* limpa vínculo no colaborador */
    await collabCol.update(memberId, { squadId: null });

    const updated = await squadCol.document(squadId);
    return { id: squadId, ...updated };
  },

  /* ─────────── DELETE ─────────── */
  deleteSquad: async (_: any, { id }: any, ctx: any) => {
    const ownerId = ctx?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");

    const exists = await squadCol.documentExists(id);
    if (!exists) throw new UserInputError("Squad not found");

    await squadCol.remove(id);

    /* desvincula todos os colaboradores desse squad */
    await db.query(aql`
      FOR c IN ${collabCol}
        FILTER c.squadId == ${id}
        UPDATE c WITH { squadId: null } IN ${collabCol}
    `);

    return true;
  },
};
