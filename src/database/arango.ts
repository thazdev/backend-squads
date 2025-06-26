import { Database } from "arangojs";

export const db = new Database({
  url: process.env.ARANGO_URL,
  databaseName: process.env.ARANGO_DATABASE || "_system",
});
if (process.env.ARANGO_USER) {
  db.useBasicAuth(process.env.ARANGO_USER, process.env.ARANGO_PASSWORD || "");
}
