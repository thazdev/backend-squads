// src/uploadRoute.ts
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { db } from "./database/arango";

const upload = multer({ dest: "./public/avatars" });
const router = express.Router();
const SECRET = process.env.JWT_SECRET || "dev-secret";

router.post("/", upload.single("file"), async (req, res) => {
  /* ─── autenticação ─── */
  const token = (req.headers.authorization || "").replace("Bearer ", "");
let uid = "";
try {
  const payload = jwt.verify(token, SECRET) as any;
  console.log("🔍 JWT payload recebido:", payload);
  uid = payload.id; // ✅ aqui estava o erro
  if (!uid) throw new Error("uid indefinido");
} catch (err) {
  console.error("❌ Erro ao decodificar token:", err);
  return res.status(401).json({ error: "invalid token" });
}



  /* ─── valida arquivo ─── */
  const file = req.file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: "no file" });

  /* ─── move p/ ./public/avatars ─── */
  const ext = file.originalname.split(".").pop();
  const name = `${uid}-${Date.now()}.${ext}`;
  await import("fs/promises").then((fs) =>
    fs.rename(file.path, `./public/avatars/${name}`),
  );

  /* ─── grava URL no usuário ─── */
  const url = `http://localhost:4000/avatars/${name}`; // absoluto
  const userId = `users/${uid}`;
  await db.collection("users").update(userId, { avatar: url });


  res.json({ url });
});

export default router;
