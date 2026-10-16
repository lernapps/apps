// The format of an app entry (entries/<id>.yaml): the single source for the build's check
// (src/_data/catalog.js) and for the published JSON Schema (schemas/entry.v1.schema.json, served at
// https://lernapps.net/apps/schemas/entry.v1.schema.json; regenerate with `npm run schema`).
// The conditions for listing an app (src/_data/de.js, list.criteria) are enforced here where they can be.
import { z } from "zod";

const https = z.url({ protocol: /^https$/ });

// A text for readers: a plain string (German, the language of the catalog) or a map of texts by language,
// { de: …, en: … }, as in the app templates (runtime/shared/languages.ts). German is required, other languages are
// optional: a page in a language without a translation shows the German text.
const Text = z.union([
  z.string().min(1),
  z.strictObject({
    de: z.string().min(1).describe("German"),
    en: z.string().min(1).optional().describe("English"),
  }),
]);

export const Entry = z
  .object({
    title: Text.describe("Name of the app, or a map by language { de, en }"),
    subject: Text.describe("Subject, in German (or a map by language), e.g. Mathematik"),
    grades: z.array(z.int().min(1).max(13)).min(1).describe("Grades the app fits, e.g. [5, 6]"),
    summary: Text.describe("2–3 sentences in plain German (or a map by language): what do learners do?"),
    url: https.describe("Link to the app"),
    topics: z
      .array(
        z.strictObject({
          title: Text.describe("Topic, in German (or a map by language)"),
          path: z.string().min(1).describe("Path of the topic, relative to url"),
        }),
      )
      .optional()
      .describe("Single topics with a deep link into the app"),
    keywords: z.array(Text).optional().describe("More words people search for"),
    creator: z
      .strictObject({
        name: z.string().min(1).describe("Name thanks are addressed to"),
        url: https.optional(),
      })
      .describe("Who built the app"),
    source: https.optional().describe("Source code"),
    fitness: z
      .strictObject({
        account: z.literal(false).describe("Nobody needs an account (required)"),
        install: z.literal(false).describe("Runs in the browser, no installation (required)"),
        storage: z
          .enum(["none", "device"])
          .describe("What the app stores: none, or only on the device (apps storing on a server are not listed)"),
        thirdParty: z
          .enum(["none", "on-click"])
          .describe("Requests to third-party servers: none, or only after a click (others are not listed)"),
        thirdPartyNote: Text.optional().describe("For on-click: which servers, and when"),
        checked: z.boolean().describe("Set by lernapps.net once the fitness was checked automatically"),
      })
      .describe("Signal of fitness for use (platform design D5 ch-fitness-signal)"),
  })
  .strict()
  .refine((e) => e.fitness.thirdParty === "none" || e.fitness.thirdPartyNote, {
    message: "fitness.thirdPartyNote: say which servers, and when",
    path: ["fitness", "thirdPartyNote"],
  });

export const SCHEMA_ID = "https://lernapps.net/apps/schemas/entry.v1.schema.json";
