import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ", "");
    if (!token) return {};
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      console.log("decoded ⇒", decoded);
      return { user: { id: decoded._key } };
    } catch {
      return {};
    }
  },
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀  GraphQL ready at ${url}`);
});