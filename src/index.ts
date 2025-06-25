/* src/index.ts */
import { AuthenticationError } from "apollo-server-errors";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import jwt from "jsonwebtoken";

import resolvers from "./resolvers";
import typeDefs from "./schema";
import uploadRoute from "./uploadRoute"; // <── rota REST já criada

const PORT = 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
console.log('[DBG]', process.env.ARANGO_USER, process.env.ARANGO_DATABASE);
/* ───── Express app ───── */
const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* rota REST de upload */
app.use("/upload-avatar", uploadRoute);

/* arquivos estáticos: /avatars/<arquivo>.png */
app.use("/avatars", express.static("public/avatars"));

/* ───── Apollo ───── */
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: ExpressContext) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return {};
    try {
      const { id } = jwt.verify(token, JWT_SECRET) as any;
      return { user: { id } };
    } catch {
      throw new AuthenticationError("Invalid or expired token");
    }
  },
  csrfPrevention: true,
});

async function start() {
  await apollo.start();
  apollo.applyMiddleware({ app, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL → http://localhost:${PORT}/graphql`);
    console.log(`🖼  Upload  → POST   http://localhost:${PORT}/upload-avatar`);
    console.log(`📂  Avatars → GET    http://localhost:${PORT}/avatars/<file>`);
  });
}

start().catch((err) => console.error("❌  Failed to start server\n", err));
