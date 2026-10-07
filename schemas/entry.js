// The format of an app entry (entries/<id>.yaml): the single source for the build's check
// (src/_data/catalog.js) and for the published JSON Schema (schemas/entry.v1.schema.json, served at
// https://lernapps.net/apps/schemas/entry.v1.schema.json; regenerate with `npm run schema`).
// The conditions for listing an app (src/_data/de.js, list.criteria) are enforced here where they can be.
import { z } from "zod";

const https = z.url({ protocol: /^https$/ });

export const Entry = z
  .object({
    title: z.string().min(1).describe("Name of the app"),
    subject: z.string().min(1).describe("Subject, in German, e.g. Mathematik"),
    grades: z.array(z.int().min(1).max(13)).min(1).describe("Grades the app fits, e.g. [5, 6]"),
    summary: z.string().min(1).describe("2–3 sentences in plain German: what do learners do?"),
    url: https.describe("Link to the app"),
    topics: z
      .array(
        z.strictObject({
          title: z.string().min(1).describe("Topic, in German"),
          path: z.string().min(1).describe("Path of the topic, relative to url"),
        }),
      )
      .optional()
      .describe("Single topics with a deep link into the app"),
    keywords: z.array(z.string().min(1)).optional().describe("More words people search for"),
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
        thirdPartyNote: z.string().optional().describe("For on-click: which servers, and when"),
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
