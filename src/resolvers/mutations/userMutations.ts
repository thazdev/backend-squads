import bcrypt from 'bcrypt';
import { db } from '../../database/arango';
import { generateToken } from '../../utils/auth';

const userCollection = db.collection('users');

export const userMutations = {
  register: async (_: any, { name, email, password }: any) => {
    const cursor = await db.query(`
      FOR u IN users
      FILTER u.email == @email
      RETURN u
    `, { email });

    const existing = await cursor.next();
    if (existing) throw new Error('Email já está em uso.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };
    const meta = await userCollection.save(newUser);

    const token = generateToken({ _key: meta._key, email });

    return {
      token,
      user: {
        _key: meta._key,
        name,
        email,
      },
    };
  },

  login: async (_: any, { email, password }: any) => {
    const cursor = await db.query(`
      FOR u IN users
      FILTER u.email == @email
      RETURN u
    `, { email });

    const user = await cursor.next();
    if (!user) throw new Error('Email ou senha inválidos.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Email ou senha inválidos.');

    const token = generateToken({ _key: user._key, email: user.email });

    return {
      token,
      user: {
        _key: user._key,
        name: user.name,
        email: user.email,
      },
    };
  }
};
