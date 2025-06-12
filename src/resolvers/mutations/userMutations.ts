import bcrypt from "bcrypt";
import { db } from "../../database/arango";
import { generateToken } from "../../utils/auth";

const userCollection = db.collection("users");

export const userMutations = {
  /* ────────── REGISTRO ────────── */
  register: async (_: any, { name, email, password }: any) => {
    /* evita e-mail duplicado */
    const dup = await db.query(
      `FOR u IN users FILTER u.email == @email RETURN 1`,
      { email },
    );
    if (await dup.next()) throw new Error("Email já está em uso.");

    /* salva usuário */
    const hashed = await bcrypt.hash(password, 10);
    const meta = await userCollection.save({ name, email, password: hashed });

    const token = generateToken({ _key: meta._key, email });

    return {
      token,
      user: {
        id: meta._key, // ← campo exigido no schema
        name,
        email,
        _key: meta._key, // opcional: mantém acesso interno se precisar
      },
    };
  },

  /* ────────── LOGIN ────────── */
  login: async (_: any, { email, password }: any) => {
    const cur = await db.query(
      `FOR u IN users FILTER u.email == @email RETURN u`,
      { email },
    );
    const user: any = await cur.next();
    if (!user) throw new Error("Email ou senha inválidos.");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Email ou senha inválidos.");

    const token = generateToken({ _key: user._key, email: user.email });

    return {
      token,
      user: {
        id: user._key, // ← nunca null
        name: user.name,
        email: user.email,
        _key: user._key, // opcional
      },
    };
  },
};
