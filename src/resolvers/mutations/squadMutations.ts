/* src/graphql/mutations/squadMutations.ts */
import { AuthenticationError, UserInputError } from "apollo-server";
import { db } from "../../database/arango";

const squadCol = db.collection("squads");
const collabCol = db.collection("collaborators");

interface MemberArgs {
  squadId: string;
  memberId: string;
}

export const squadMutations = {
  /* ---------------- CRIAR ---------------- */
  async createSquad(_: any, { input }: any, context: any) {
    const ownerId = context?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");
    if (!input.name?.trim())
      throw new UserInputError("Squad name is mandatory");

    /* já existe? */
    const dup = await db.query(
      `FOR s IN squads FILTER s.name == @name AND s.ownerId == @owner RETURN 1`,
      { name: input.name.trim(), owner: ownerId },
    );
    if (await dup.next())
      throw new UserInputError("You already have a squad with this name");

    const doc = {
      name: input.name.trim(),
      description: input.description ?? "",
      memberIds: input.memberIds ?? [],
      archived: false,
      createdAt: new Date().toISOString(),
      ownerId,
    };
    const meta = await squadCol.save(doc);

    /* opcional: atualizar colaboradores */
    if (doc.memberIds.length) {
      await Promise.all(
        doc.memberIds.map((id: string) =>
          collabCol.update(id, { squadId: meta._key }, { ignoreRevs: true }),
        ),
      );
    }
    return { id: meta._key, ...doc };
  },

  /* ---------------- NOVO: adicionar membro ---------------- */
  async addMemberToSquad(
    _: any,
    { squadId, memberId }: { squadId: string; memberId: string },
    context: any,
  ) {
    const ownerId = context?.user?.id;
    if (!ownerId) throw new AuthenticationError("Login required");

    /* carrega o squad */
    const squad = await squadCol.document(squadId).catch(() => null);
    if (!squad) throw new UserInputError("Squad not found");

    /* só o owner do squad pode adicionar */
    if (squad.ownerId !== ownerId) throw new AuthenticationError("Not allowed");

    /* evita duplicar */
    const newMemberIds = Array.from(
      new Set([...(squad.memberIds ?? []), memberId]),
    );

    /* grava */
    await squadCol.update(
      squadId,
      { memberIds: newMemberIds },
      { ignoreRevs: true },
    );

    await collabCol.update(memberId, { squadId }, { ignoreRevs: true });

    return { id: squadId, ...squad, memberIds: newMemberIds };
  },
  async removeMemberFromSquad(
    _parent: unknown,
    { squadId, memberId }: MemberArgs,
    _ctx: unknown,
  ) {
    const squad = await squadCol.document(squadId);
    const memberIds = (squad.memberIds ?? []).filter(
      (id: string) => id !== memberId,
    );
    await squadCol.update(squadId, { memberIds }, { ignoreRevs: true });
    await collabCol.update(memberId, { squadId: null }, { ignoreRevs: true });
    return { id: squadId, ...squad, memberIds };
  },
};
