// Series of apps (lib/series.js): the check across the entries of a series and the order of the catalog.
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkSeries, compareApps } from "../lib/series.js";

const app = (id, title, series) => ({ id, title, series });
const sorted = (apps) => [...apps].sort(compareApps).map((a) => a.id);

test("the apps of a series stand together, by part, where the series' title belongs", () => {
  const apps = [
    app("zeiten", "Zeiten", { title: "Millbrook", part: 2 }),
    app("anfang", "Hello", { title: "Millbrook", part: 1 }),
    app("buch", "Buch", undefined),
    app("zebra", "Zebra", undefined),
    app("alltag", "Alltag", { title: "Millbrook", part: 4 }),
  ];
  assert.deepEqual(sorted(apps), ["buch", "anfang", "zeiten", "alltag", "zebra"]);
});

test("apps with the same part (in parallel) are sorted by title", () => {
  const apps = [
    app("b", "Beschreiben", { title: "Millbrook", part: 3 }),
    app("a", "Alltag", { title: "Millbrook", part: 3 }),
    app("c", "Anfang", { title: "Millbrook", part: 1 }),
  ];
  assert.deepEqual(sorted(apps), ["c", "a", "b"]);
});

test("the title of a series is read by its German text", () => {
  const apps = [
    app("x", "X", { title: { de: "Millbrook", en: "Millbrook School" }, part: 2 }),
    app("y", "Y", { title: "Millbrook", part: 1 }),
  ];
  assert.deepEqual(sorted(apps), ["y", "x"]);
});

test("a shared part number is no error", () => {
  const apps = [app("a", "A", { title: "S", part: 2, of: 5 }), app("b", "B", { title: "S", part: 2, of: 5 })];
  assert.deepEqual(checkSeries(apps), []);
});

test("entries of one series that name different totals fail, naming the entries", () => {
  const apps = [app("a", "A", { title: "S", part: 1, of: 5 }), app("b", "B", { title: "S", part: 2, of: 6 }), app("c", "C", undefined)];
  const errors = checkSeries(apps);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /series S: of must be the same in every entry \(a: 5, b: 6\)/);
});

test("a total in some entries only is no error", () => {
  const apps = [app("a", "A", { title: "S", part: 1, of: 5 }), app("b", "B", { title: "S", part: 2 })];
  assert.deepEqual(checkSeries(apps), []);
});
