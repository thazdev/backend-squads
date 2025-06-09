import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';
import jwt from 'jsonwebtoken';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return {};
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return { user: decoded };
    } catch {
      return {};
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});