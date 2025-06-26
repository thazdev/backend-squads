import { Database } from "arangojs";
import dotenv from "dotenv";
dotenv.config();

export const db = new Database({
  url: process.env.ARANGO_URL,
  databaseName: "_system",
  auth: {                                      
    username: process.env.ARANGO_USER || "root",
    password: process.env.ARANGO_PASSWORD || "root",
  },
});
