/* src/index.ts */
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import { contextBuilder } from "./middleware/authMiddleware"; 
import resolvers from "./resolvers";
import typeDefs from "./schema";
import uploadRoute from "./uploadRoute";

const PORT = 4000;
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
  context: contextBuilder,
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
