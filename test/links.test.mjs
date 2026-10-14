// The link classification of test/links.mjs, against a local server that answers what a test asks for.
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { fetchLink, outside } from "./links.mjs";

let base = "";
const requests = new Map();
const server = createServer((request, response) => {
  requests.set(request.url, (requests.get(request.url) ?? 0) + 1);
  const status = Number(request.url.split("/")[1]);
  response.writeHead(status).end();
});
before(() => new Promise((done) => server.listen(0, "127.0.0.1", () => done((base = `http://127.0.0.1:${server.address().port}`)))));
after(() => server.close());

const noWait = { sleep: async () => {} };

test("lernapps.net and its subdomains are our own hosts, anything else is outside", () => {
  assert.equal(outside("https://lernapps.net/apps/"), false);
  assert.equal(outside("https://www.lernapps.net/"), false);
  assert.equal(outside("https://github.com/lernapps/.github/blob/main/CONTRIBUTING.md"), true);
  assert.equal(outside("https://notlernapps.net/"), true);
});

test("an outside host that keeps answering 503 is asked three times, then is a note", async () => {
  const result = await fetchLink(`${base}/503/outside`, noWait);
  assert.equal(result.result, "note", result.why);
  assert.match(result.why, /answers 503, 3 times/);
  assert.equal(requests.get("/503/outside"), 3);
});

test("an outside host that answers 429 is retried too; a 404 is broken at once", async () => {
  assert.equal((await fetchLink(`${base}/429/x`, noWait)).result, "note");
  assert.deepEqual(await fetchLink(`${base}/404/x`, noWait), { result: "broken", why: "answers 404" });
  assert.equal(requests.get("/404/x"), 1);
});

test("our own host is strict: a 503 is broken at once, never retried", async () => {
  const result = await fetchLink(`${base}/503/own`, { ...noWait, own: ["127.0.0.1"] });
  assert.deepEqual(result, { result: "broken", why: "answers 503" });
  assert.equal(requests.get("/503/own"), 1);
});

test("the retries wait the bounded waits, 2 s and then 5 s", async () => {
  const waited = [];
  await fetchLink(`${base}/502/waits`, { sleep: async (ms) => waited.push(ms) });
  assert.deepEqual(waited, [2_000, 5_000]);
});
