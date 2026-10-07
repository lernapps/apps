// Writes schemas/entry.v1.schema.json from schemas/entry.js (Zod). With --check, fails if it is out of date.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { z } from "zod";
import { Entry, SCHEMA_ID } from "../schemas/entry.js";

const FILE = "schemas/entry.v1.schema.json";
const schema = {
  $id: SCHEMA_ID,
  title: "lernapps.net app entry",
  description: "One app on https://lernapps.net/apps/. File: entries/<id>.yaml in https://github.com/lernapps/apps",
  ...z.toJSONSchema(Entry, { target: "draft-2020-12" }),
};
const text = JSON.stringify(schema, null, 2) + "\n";

if (process.argv.includes("--check")) {
  if (!existsSync(FILE) || readFileSync(FILE, "utf8") !== text) {
    console.error(`${FILE} is out of date: run npm run schema`);
    process.exit(1);
  }
  console.log(`${FILE} up to date`);
} else {
  writeFileSync(FILE, text);
  console.log(`wrote ${FILE}`);
}
