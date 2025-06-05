import { Database } from 'arangojs';
import dotenv from 'dotenv';
dotenv.config();

export const db = new Database({
  url: process.env.ARANGO_URL,
});

db.useDatabase(process.env.ARANGO_DATABASE!);
db.useBasicAuth(process.env.ARANGO_USER!, process.env.ARANGO_PASS!);