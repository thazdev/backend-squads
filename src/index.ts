/* src/index.ts – sem ensureDatabase */
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import { contextBuilder } from "./middleware/authMiddleware";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import uploadRoute from "./uploadRoute";

const PORT = 4000;
console.log("[DBG]", process.env.ARANGO_USER, process.env.ARANGO_DATABASE);

const app: Application = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/upload-avatar", uploadRoute);
app.use("/avatars", express.static("public/avatars"));

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextBuilder,
});

async function start() {
  /*  ── nada de ensureDatabase aqui ── */
  await apollo.start();
  apollo.applyMiddleware({ app, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL → http://localhost:${PORT}/graphql`);
    console.log(`🖼  Upload  → POST http://localhost:${PORT}/upload-avatar`);
  });
}

start().catch((err) => console.error("❌  Failed to start server\n", err));
