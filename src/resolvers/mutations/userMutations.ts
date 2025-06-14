// backend/resolvers/userMutations.ts
import { AuthenticationError } from "apollo-server";
import { db } from "../../database/arango";

const userCollection = db.collection("users");

export const userMutations = {
  /* ────────── REGISTRO / LOGIN permanecem iguais ────────── */

  updateUser: async (_: any, { input }: any, ctx: any) => {
    const uid = ctx?.user?.id;
    if (!uid) throw new AuthenticationError("Login required");

    await userCollection.update(uid, {
      ...("name" in input ? { name: input.name } : {}),
      ...("bio" in input ? { bio: input.bio } : {}),
      ...("avatar" in input ? { avatar: input.avatar } : {}), // ← novo
    });

    const updated = await userCollection.document(uid);
    return { id: uid, ...updated };
  },

  uploadAvatar: async (_: any, { url }: any, ctx: any) => {
    const uid = ctx?.user?.id;
    if (!uid) throw new AuthenticationError("Login required");
    await userCollection.update(uid, { avatar: url });
    return url;
  },
};
