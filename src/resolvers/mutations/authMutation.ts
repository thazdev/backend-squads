import { db } from "../../database/arango";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userCollection = db.collection("users");

export const authMutations = {
  register: async (_: any, { name, email, password }: any) => {
    // Verifica se já existe
    const cursor = await db.query(`
        FOR u IN users
          FILTER u.email == @email
          RETURN u
      `, { email });
      
      const existing = await cursor.next();
    if (existing) {
      throw new Error("Email já cadastrado");
    }

    // Criptografa senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salva no banco
    const result = await userCollection.save({
      name,
      email,
      password: hashedPassword,
    });

    // Busca o user salvo para retorno
    const user = await userCollection.document(result._key);

    // Cria token JWT
    const token = jwt.sign(
      { id: result._key, email },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: result._key,
        name: user.name,
        email: user.email,
        bio: user.bio || null,
        avatar: user.avatar || null,
      },
    };
  },
};
