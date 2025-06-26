/* src/index.ts */
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import { contextBuilder } from "./middleware/authMiddleware";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import uploadRoute from "./uploadRoute";

/* ───── ArangoDB bootstrap ───── */
import { db } from "./database/arango";

async function ensureDatabase() {
  const dbName = process.env.ARANGO_DATABASE ?? "squads";

  // cria o banco se ainda não existir
  if (!(await db.listDatabases()).includes(dbName)) {
    await db.createDatabase(dbName);
  }

  // usa o banco (agora sabemos que existe)
  db.useDatabase(dbName);

  // coleções essenciais: users, squads, tasks
  for (const col of ["users", "squads", "tasks"]) {
    if (!(await db.collection(col).exists())) {
      await db.collection(col).create();
    }
  }
}
/* ─────────────────────────────── */

const PORT = 4000;
console.log("[DBG]", process.env.ARANGO_USER, process.env.ARANGO_DATABASE);

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
  await ensureDatabase();             // garante DB e coleções antes de tudo
  await apollo.start();
  apollo.applyMiddleware({ app, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`🚀 GraphQL → http://localhost:${PORT}/graphql`);
    console.log(`🖼  Upload  → POST http://localhost:${PORT}/upload-avatar`);
    console.log(`📂  Avatars → GET  http://localhost:${PORT}/avatars/<file>`);
  });
}

start().catch((err) => console.error("❌  Failed to start server\n", err));
