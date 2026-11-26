// source: f961eccc4e7b13e3
import { readFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";
// node_modules/@lernapps/tooling/dist/i18n.mjs
/** The text of `key`, with its placeholders filled; a placeholder without a value stays as it is. */
function translator(messages, locale = "de-DE") {
  const numbers = new Intl.NumberFormat(locale);
  return (key, params = {}) =>
    (messages[key] ?? key).replace(/\{(\w+)\}/g, (placeholder, name) => {
      const value = params[name];
      if (value === void 0) return placeholder;
      return typeof value === "number" ? numbers.format(value) : value;
    });
}
// src/core/fits.ts
/** The range of the number in "wiederhole … mal". */
var REPEAT_RANGE = [1, 99];
function fitProblems(program, world, path) {
  const problems = [];
  const bad = (at, name) => {
    problems.push(
      name === void 0
        ? {
            path: at,
            key: "problem-program",
          }
        : {
            path: at,
            key: "problem-block",
            params: { name },
          },
    );
  };
  const literal = (e, [min, max], at) => {
    if (e.e !== "num" || !Number.isFinite(e.value) || e.value < min || e.value > max)
      problems.push({
        path: at,
        key: "problem-number",
        params: {
          min,
          max,
        },
      });
  };
  const expr = (e, at) => {
    if (e.e === "empty") return;
    if (e.e === "not") return expr(e.a, `${at}.a`);
    if (e.e === "sense" && e.name in world.sensors && e.args.length === 0) return;
    bad(at, e.e === "sense" ? e.name : void 0);
  };
  const block = (stmts, at) =>
    stmts.forEach((s, i) => {
      const here = `${at}[${i}]`;
      switch (s.s) {
        case "cmd": {
          if (!(s.name in world.commands) || s.args.length !== world.commands[s.name]) return bad(here, s.name);
          const ranges = world.ranges?.[s.name] ?? [];
          s.args.forEach((a, j) => literal(a, ranges[j] ?? [-1e6, 1e6], `${here}.args[${j}]`));
          return;
        }
        case "repeat":
          literal(s.times, REPEAT_RANGE, `${here}.times`);
          return block(s.body, `${here}.body`);
        case "while":
          expr(s.cond, `${here}.cond`);
          return block(s.body, `${here}.body`);
        case "if":
          expr(s.cond, `${here}.cond`);
          block(s.then, `${here}.then`);
          if (s.else !== void 0) block(s.else, `${here}.else`);
          return;
        default:
          return bad(here);
      }
    });
  block(program.main, `${path}.main`);
  if ((program.procs ?? []).length > 0) bad(`${path}.procs`);
  return problems.slice(0, 5);
}
// src/core/json.ts
var isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var isInt = (value, min, max) => typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
// src/core/ir.ts
/** At most this many nodes and this depth: a program from a link stays small. */
var MAX_NODES = 500;
var MAX_DEPTH = 24;
var NAME = /^[a-z][a-z0-9-]{0,31}$/;
var CMP = ["<", "<=", "=", "!=", ">=", ">"];
var ARITH = ["+", "-", "*", "/", "%"];
/** Checks a program as it comes from outside; the problems, empty when it is a valid IR v1. */
function programProblems(value, path = "program") {
  const problems = [];
  let nodes = 0;
  const bad = (at) => {
    problems.push({
      path: at,
      key: "problem-program",
    });
  };
  const name = (v) => typeof v === "string" && NAME.test(v);
  const expr = (v, at, depth) => {
    if (++nodes > MAX_NODES || depth > MAX_DEPTH || !isObject(v)) return bad(at);
    switch (v["e"]) {
      case "num":
        if (typeof v["value"] !== "number" || !Number.isFinite(v["value"])) bad(at);
        return;
      case "empty":
        return;
      case "var":
        if (!name(v["name"])) bad(at);
        return;
      case "sense":
        if (!name(v["name"]) || !Array.isArray(v["args"])) return bad(at);
        v["args"].forEach((a, i) => expr(a, `${at}.args[${i}]`, depth + 1));
        return;
      case "not":
        return expr(v["a"], `${at}.a`, depth + 1);
      case "and":
      case "or":
        expr(v["a"], `${at}.a`, depth + 1);
        return expr(v["b"], `${at}.b`, depth + 1);
      case "cmp":
      case "arith":
        if (!(v["e"] === "cmp" ? CMP : ARITH).includes(v["op"])) bad(at);
        expr(v["a"], `${at}.a`, depth + 1);
        return expr(v["b"], `${at}.b`, depth + 1);
      default:
        return bad(at);
    }
  };
  const block = (v, at, depth) => {
    if (!Array.isArray(v)) return bad(at);
    v.forEach((s, i) => stmt(s, `${at}[${i}]`, depth));
  };
  const stmt = (v, at, depth) => {
    if (++nodes > MAX_NODES || depth > MAX_DEPTH || !isObject(v)) return bad(at);
    switch (v["s"]) {
      case "cmd":
      case "call":
        if (!name(v["name"]) || !Array.isArray(v["args"])) return bad(at);
        v["args"].forEach((a, i) => expr(a, `${at}.args[${i}]`, depth + 1));
        return;
      case "repeat":
        expr(v["times"], `${at}.times`, depth + 1);
        return block(v["body"], `${at}.body`, depth + 1);
      case "while":
        expr(v["cond"], `${at}.cond`, depth + 1);
        return block(v["body"], `${at}.body`, depth + 1);
      case "if":
        expr(v["cond"], `${at}.cond`, depth + 1);
        block(v["then"], `${at}.then`, depth + 1);
        if (v["else"] !== void 0) block(v["else"], `${at}.else`, depth + 1);
        return;
      case "set":
        if (!name(v["name"])) bad(at);
        return expr(v["value"], `${at}.value`, depth + 1);
      default:
        return bad(at);
    }
  };
  if (!isObject(value))
    return [
      {
        path,
        key: "problem-program",
      },
    ];
  block(value["main"], `${path}.main`, 0);
  if (value["procs"] !== void 0) {
    if (!Array.isArray(value["procs"])) bad(`${path}.procs`);
    else
      value["procs"].forEach((p, i) => {
        const at = `${path}.procs[${i}]`;
        if (!isObject(p) || !name(p["name"]) || !Array.isArray(p["params"]) || !p["params"].every(name)) return bad(at);
        block(p["body"], `${at}.body`, 1);
      });
  }
  return problems.slice(0, 5);
}
/** The block type of a statement or expression, as the toolbox names it (number literals are fields, not blocks). */
function blockOf(node) {
  if ("s" in node)
    switch (node.s) {
      case "cmd":
        return node.name;
      case "repeat":
        return "wiederhole";
      case "while":
        return "solange";
      case "if":
        return node.else === void 0 ? "wenn" : "wenn-sonst";
      case "set":
        return "setze";
      case "call":
        return "aufruf";
    }
  switch (node.e) {
    case "num":
    case "empty":
      return null;
    case "sense":
      return node.name;
    case "not":
      return "nicht";
    case "var":
      return "variable";
    case "and":
    case "or":
      return node.e === "and" ? "und" : "oder";
    case "cmp":
      return "vergleich";
    case "arith":
      return "rechne";
  }
}
function children(node) {
  if ("s" in node)
    switch (node.s) {
      case "cmd":
      case "call":
        return node.args;
      case "repeat":
        return [node.times, ...node.body];
      case "while":
        return [node.cond, ...node.body];
      case "if":
        return [node.cond, ...node.then, ...(node.else ?? [])];
      case "set":
        return [node.value];
    }
  switch (node.e) {
    case "sense":
      return node.args;
    case "not":
      return [node.a];
    case "and":
    case "or":
    case "cmp":
    case "arith":
      return [node.a, node.b];
    default:
      return [];
  }
}
/** The blocks a program uses, one entry per block (for `hoechstens-bloecke` and `benutzt-block`). */
function blocksOf(program) {
  const out = [];
  const walk = (node) => {
    const type = blockOf(node);
    if (type !== null) out.push(type);
    children(node).forEach(walk);
  };
  program.main.forEach(walk);
  for (const p of program.procs ?? []) p.body.forEach(walk);
  return out;
}
/** The block with an empty slot, if any (its toolbox id). */
function emptySlot(program) {
  let found = null;
  const walk = (node, owner) => {
    if (found !== null) return;
    if ("e" in node && node.e === "empty") {
      found = owner;
      return;
    }
    const type = blockOf(node);
    children(node).forEach((child) => walk(child, type ?? owner));
  };
  program.main.forEach((s) => walk(s, null));
  return found;
}
// src/core/worlds/types.ts
var isFailure = (value) => typeof value === "object" && value !== null && "fail" in value;
// src/core/interpreter.ts
/** The most commands of any run. */
var MAX_COMMANDS = 1e4;
/** The hard limit of all steps of a run, control steps included. */
var MAX_STEPS = 5e4;
function begin(program, world, config) {
  return {
    world: world.start(config),
    frames: [
      {
        body: program.main,
        at: 0,
      },
    ],
    vars: {},
    steps: 0,
    commands: 0,
    status: "running",
  };
}
var RunError = class extends Error {
  why;
  constructor(why) {
    super(why.key);
    this.why = why;
  }
};
function evaluate(e, run, world, config) {
  const num = (x) => {
    const v = evaluate(x, run, world, config);
    return typeof v === "number" ? v : v ? 1 : 0;
  };
  const bool = (x) => {
    const v = evaluate(x, run, world, config);
    return typeof v === "boolean" ? v : v !== 0;
  };
  switch (e.e) {
    case "num":
      return e.value;
    case "empty":
      throw new RunError({
        key: "fail-empty-slot",
        params: { block: "?" },
      });
    case "var": {
      const v = lookup(run, e.name);
      if (v === void 0)
        throw new RunError({
          key: "fail-unknown-variable",
          params: { name: e.name },
        });
      return v;
    }
    case "sense":
      if (!(e.name in world.sensors))
        throw new RunError({
          key: "fail-unknown-block",
          params: { name: e.name },
        });
      return world.sense(run.world, config, e.name, e.args.map(num));
    case "not":
      return !bool(e.a);
    case "and":
      return bool(e.a) && bool(e.b);
    case "or":
      return bool(e.a) || bool(e.b);
    case "cmp": {
      const a = num(e.a);
      const b = num(e.b);
      return {
        "<": a < b,
        "<=": a <= b,
        "=": a === b,
        "!=": a !== b,
        ">=": a >= b,
        ">": a > b,
      }[e.op];
    }
    case "arith": {
      const a = num(e.a);
      const b = num(e.b);
      if ((e.op === "/" || e.op === "%") && b === 0) throw new RunError({ key: "fail-divide-by-zero" });
      return {
        "+": a + b,
        "-": a - b,
        "*": a * b,
        "/": a / b,
        "%": a % b,
      }[e.op];
    }
  }
}
function lookup(run, name) {
  for (let i = run.frames.length - 1; i >= 0; i--) {
    const loop = run.frames[i]?.loop;
    if (loop?.k === "proc" && name in loop.vars) return loop.vars[name];
  }
  return run.vars[name];
}
var truthy = (v) => (typeof v === "boolean" ? v : v !== 0);
/** Runs control steps up to and including the next world command; the run as it is then. */
function advance(start, program, world, config, limit) {
  if (start.status !== "running") return start;
  const run = {
    ...start,
    frames: start.frames.map((f) => ({ ...f })),
    vars: { ...start.vars },
  };
  const max = Math.min(limit, MAX_COMMANDS);
  try {
    while (run.frames.length > 0) {
      if (run.commands >= max)
        return {
          ...run,
          status: "limit",
          why: {
            key: "fail-limit",
            params: { steps: max },
          },
        };
      if (run.steps >= 5e4)
        return {
          ...run,
          status: "limit",
          why: { key: "fail-endless" },
        };
      const top = run.frames[run.frames.length - 1];
      if (top === void 0) break;
      if (top.at >= top.body.length) {
        run.steps++;
        const loop = top.loop;
        if (loop?.k === "repeat" && loop.left > 1) {
          top.loop = {
            k: "repeat",
            left: loop.left - 1,
          };
          top.at = 0;
        } else if (loop?.k === "while" && truthy(evaluate(loop.cond, run, world, config))) top.at = 0;
        else run.frames.pop();
        continue;
      }
      const s = top.body[top.at++];
      if (s === void 0) continue;
      run.steps++;
      switch (s.s) {
        case "repeat": {
          const n = Number(evaluate(s.times, run, world, config));
          if (n >= 1 && s.body.length > 0)
            run.frames.push({
              body: s.body,
              at: 0,
              loop: {
                k: "repeat",
                left: Math.floor(n),
              },
            });
          else if (n >= 1) run.steps += Math.min(Math.floor(n), MAX_STEPS);
          continue;
        }
        case "while":
          if (truthy(evaluate(s.cond, run, world, config)))
            run.frames.push({
              body: s.body,
              at: 0,
              loop: {
                k: "while",
                cond: s.cond,
              },
            });
          continue;
        case "if": {
          const branch = truthy(evaluate(s.cond, run, world, config)) ? s.then : (s.else ?? []);
          if (branch.length > 0)
            run.frames.push({
              body: branch,
              at: 0,
            });
          continue;
        }
        case "set": {
          const value = Number(evaluate(s.value, run, world, config));
          const frame = [...run.frames].reverse().find((f) => f.loop?.k === "proc" && s.name in f.loop.vars);
          if (frame?.loop?.k === "proc")
            frame.loop = {
              k: "proc",
              vars: {
                ...frame.loop.vars,
                [s.name]: value,
              },
            };
          else run.vars[s.name] = value;
          continue;
        }
        case "call": {
          const proc = program.procs?.find((p) => p.name === s.name);
          if (proc === void 0)
            throw new RunError({
              key: "fail-unknown-block",
              params: { name: s.name },
            });
          const vars = {};
          proc.params.forEach((p, i) => {
            const arg = s.args[i];
            vars[p] = arg === void 0 ? 0 : Number(evaluate(arg, run, world, config));
          });
          run.frames.push({
            body: proc.body,
            at: 0,
            loop: {
              k: "proc",
              vars,
            },
          });
          continue;
        }
        case "cmd": {
          if (!(s.name in world.commands))
            throw new RunError({
              key: "fail-unknown-block",
              params: { name: s.name },
            });
          const args = s.args.map((a) => Number(evaluate(a, run, world, config)));
          const next = world.command(run.world, config, s.name, args);
          run.commands++;
          if (isFailure(next))
            return {
              ...run,
              status: "crashed",
              why: next.fail,
            };
          run.world = next;
          if (world.finished?.(next, config) === true)
            return {
              ...run,
              frames: [],
              status: "done",
            };
          return run;
        }
      }
    }
  } catch (error) {
    if (error instanceof RunError)
      return {
        ...run,
        status: "error",
        why: error.why,
      };
    throw error;
  }
  return {
    ...run,
    status: "done",
  };
}
/** Runs a program to its end, without pictures (checks, the check script, playthroughs). */
function runToEnd(program, world, config, limit) {
  let run = begin(program, world, config);
  while (run.status === "running") run = advance(run, program, world, config, limit);
  return run;
}
// src/core/worlds/labyrinth.ts
var FACINGS = ["north", "east", "south", "west"];
var DELTA = {
  north: [0, -1],
  east: [1, 0],
  south: [0, 1],
  west: [-1, 0],
};
var at = (c, x, y) => c.map[y]?.[x] ?? "#";
var turn = (f, by) => FACINGS[(FACINGS.indexOf(f) + by + 4) % 4] ?? f;
var wall = (s, c, by) => {
  const [dx, dy] = DELTA[turn(s.facing, by)];
  return at(c, s.x + dx, s.y + dy) === "#";
};
var field = (s) => ({
  x: s.x + 1,
  y: s.y + 1,
});
function find(c, ch) {
  for (let y = 0; y < c.map.length; y++) {
    const x = c.map[y]?.indexOf(ch) ?? -1;
    if (x >= 0)
      return {
        x,
        y,
      };
  }
  return {
    x: 0,
    y: 0,
  };
}
var labyrinth = {
  id: "labyrinth",
  version: 1,
  configProblems(config, path) {
    if (!isObject(config))
      return [
        {
          path,
          key: "problem-config",
        },
      ];
    const map = config["map"];
    const problems = [];
    for (const key of Object.keys(config))
      if (key !== "map" && key !== "facing")
        problems.push({
          path: `${path}.${key}`,
          key: "problem-unknown-field",
        });
    if (!FACINGS.includes(config["facing"]))
      problems.push({
        path: `${path}.facing`,
        key: "problem-facing",
      });
    if (!Array.isArray(map) || map.length < 1 || map.length > 12 || !map.every((r) => typeof r === "string"))
      return [
        ...problems,
        {
          path: `${path}.map`,
          key: "problem-map-size",
          params: { max: 12 },
        },
      ];
    const rows = map;
    const width = rows[0]?.length ?? 0;
    if (width < 1 || width > 12 || rows.some((r) => r.length !== width))
      problems.push({
        path: `${path}.map`,
        key: "problem-map-size",
        params: { max: 12 },
      });
    if (rows.some((r) => /[^#.SZ]/.test(r)))
      problems.push({
        path: `${path}.map`,
        key: "problem-map-chars",
      });
    const count = (ch) => rows.join("").split(ch).length - 1;
    if (count("S") !== 1)
      problems.push({
        path: `${path}.map`,
        key: "problem-map-start",
      });
    if (count("Z") < 1)
      problems.push({
        path: `${path}.map`,
        key: "problem-map-goal",
      });
    return problems;
  },
  commands: {
    vorwaerts: 0,
    links: 0,
    rechts: 0,
  },
  sensors: {
    "wand-voraus": 0,
    "wand-links": 0,
    "wand-rechts": 0,
    "am-ziel": 0,
  },
  checks: {
    "ziel-erreicht": (s, c) =>
      at(c, s.x, s.y) === "Z"
        ? { ok: true }
        : {
            ok: false,
            why: {
              key: "fail-not-at-goal",
              params: field(s),
            },
          },
  },
  start(c) {
    const s = find(c, "S");
    return {
      ...s,
      facing: c.facing,
      trail: [`${s.x},${s.y}`],
    };
  },
  command(s, c, name) {
    if (name === "links")
      return {
        ...s,
        facing: turn(s.facing, -1),
      };
    if (name === "rechts")
      return {
        ...s,
        facing: turn(s.facing, 1),
      };
    if (wall(s, c, 0))
      return {
        fail: {
          key: "fail-wall",
          params: field(s),
        },
      };
    const [dx, dy] = DELTA[s.facing];
    const x = s.x + dx;
    const y = s.y + dy;
    return {
      x,
      y,
      facing: s.facing,
      trail: [...s.trail, `${x},${y}`],
    };
  },
  sense(s, c, name) {
    if (name === "am-ziel") return at(c, s.x, s.y) === "Z";
    return wall(s, c, name === "wand-links" ? -1 : name === "wand-rechts" ? 1 : 0);
  },
  describe: (s, c) => ({
    key: "describe-labyrinth",
    params: {
      ...field(s),
      facing: s.facing,
      goal: at(c, s.x, s.y) === "Z" ? "yes" : "no",
    },
  }),
};
var TOLERANCE = 2;
var MAX_LINES = 1e3;
/** The grid of the comparison: one cell per unit, a margin of 50 around the sheet. */
var MARGIN = 50;
var GRID = 300;
var round = (v) => Math.round(v * 100) / 100;
function startOf(c) {
  const s = c.start ?? {
    x: 100,
    y: 100,
    winkel: 0,
  };
  return {
    x: s.x,
    y: s.y,
    winkel: s.winkel,
    pen: true,
    colour: 1,
    lines: [],
  };
}
/** The cells a picture covers: every line sampled twice per unit (at most 2000 samples a line), off the grid clamped. */
function cover(lines) {
  const grid = new Uint8Array(GRID * GRID);
  const cell = (v) => Math.min(299, Math.max(0, Math.floor(v + MARGIN)));
  for (const [x1, y1, x2, y2] of lines) {
    const n = Math.min(2e3, Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2)));
    for (let i = 0; i <= n; i++) grid[cell(y1 + ((y2 - y1) * i) / n) * GRID + cell(x1 + ((x2 - x1) * i) / n)] = 1;
  }
  return grid;
}
/** The cells within TOLERANCE of a covered cell. */
function widen(grid) {
  const out = new Uint8Array(grid.length);
  for (let y = 0; y < GRID; y++)
    for (let x = 0; x < GRID; x++) {
      if (grid[y * GRID + x] !== 1) continue;
      for (let dy = -2; dy <= TOLERANCE; dy++)
        for (let dx = -2; dx <= TOLERANCE; dx++) {
          const yy = y + dy;
          const xx = x + dx;
          if (yy >= 0 && yy < GRID && xx >= 0 && xx < GRID) out[yy * GRID + xx] = 1;
        }
    }
  return out;
}
/** The first cell of `a` that `near` does not cover, as a point of the sheet; null when there is none. */
function firstOutside(a, near) {
  for (let i = 0; i < a.length; i++)
    if (a[i] === 1 && near[i] !== 1)
      return {
        x: (i % GRID) - MARGIN,
        y: Math.floor(i / GRID) - MARGIN,
      };
  return null;
}
/** The lines of the target picture. */
function targetLines(c) {
  return runToEnd(c.ziel, turtle, c, 1e4).world.lines;
}
var turtle = {
  id: "turtle",
  version: 1,
  configProblems(config, path) {
    if (!isObject(config))
      return [
        {
          path,
          key: "problem-config",
        },
      ];
    const problems = [];
    for (const key of Object.keys(config))
      if (key !== "ziel" && key !== "start")
        problems.push({
          path: `${path}.${key}`,
          key: "problem-unknown-field",
        });
    const ziel = config["ziel"];
    const syntax = programProblems(ziel, `${path}.ziel`);
    const fit = syntax.length > 0 ? syntax : fitProblems(ziel, turtle, `${path}.ziel`);
    problems.push(...fit);
    const start = config["start"];
    if (
      start !== void 0 &&
      !(isObject(start) && isInt(start["x"], 0, 200) && isInt(start["y"], 0, 200) && isInt(start["winkel"], 0, 359))
    )
      problems.push({
        path: `${path}.start`,
        key: "problem-turtle-start",
        params: { size: 200 },
      });
    if (fit.length === 0 && problems.length === 0) {
      const run = runToEnd(ziel, turtle, config, 1e4);
      const lines = run.world.lines.length;
      if (run.status !== "done" || lines > 200)
        problems.push({
          path: `${path}.ziel`,
          key: "problem-target-lines",
          params: { max: 200 },
        });
    }
    return problems;
  },
  commands: {
    gehe: 1,
    "drehe-links-um": 1,
    "drehe-rechts-um": 1,
    "stift-hoch": 0,
    "stift-runter": 0,
    farbe: 1,
  },
  ranges: {
    gehe: [[1, 200]],
    "drehe-links-um": [[1, 360]],
    "drehe-rechts-um": [[1, 360]],
    farbe: [[1, 4]],
  },
  sensors: {},
  checks: {
    "bild-gleich": (s, c) => {
      const target = cover(targetLines(c).filter((l) => l[0] !== l[2] || l[1] !== l[3]));
      const drawn = cover(s.lines.filter((l) => l[0] !== l[2] || l[1] !== l[3]));
      const missing = firstOutside(target, widen(drawn));
      if (missing !== null)
        return {
          ok: false,
          why: {
            key: "fail-picture-missing",
            params: missing,
          },
        };
      const extra = firstOutside(drawn, widen(target));
      if (extra !== null)
        return {
          ok: false,
          why: {
            key: "fail-picture-extra",
            params: extra,
          },
        };
      return { ok: true };
    },
  },
  start: startOf,
  command(s, _c, name, args) {
    const a = args[0] ?? 0;
    switch (name) {
      case "gehe": {
        const rad = (s.winkel * Math.PI) / 180;
        const x = round(s.x + a * Math.sin(rad));
        const y = round(s.y - a * Math.cos(rad));
        if (s.pen && s.lines.length >= MAX_LINES)
          return {
            fail: {
              key: "fail-too-many-lines",
              params: { max: MAX_LINES },
            },
          };
        const lines = s.pen ? [...s.lines, [s.x, s.y, x, y, s.colour]] : s.lines;
        return {
          ...s,
          x,
          y,
          lines,
        };
      }
      case "drehe-links-um":
        return {
          ...s,
          winkel: (((s.winkel - a) % 360) + 360) % 360,
        };
      case "drehe-rechts-um":
        return {
          ...s,
          winkel: (((s.winkel + a) % 360) + 360) % 360,
        };
      case "stift-hoch":
        return {
          ...s,
          pen: false,
        };
      case "stift-runter":
        return {
          ...s,
          pen: true,
        };
      case "farbe":
        return {
          ...s,
          colour: Math.min(4, Math.max(1, Math.round(a))),
        };
      default:
        return s;
    }
  },
  sense: () => false,
  describe: (s) => ({
    key: "describe-turtle",
    params: {
      x: Math.round(s.x),
      y: Math.round(s.y),
      winkel: Math.round(s.winkel),
      lines: s.lines.length,
    },
  }),
};
// src/core/worlds/index.ts
var as = (world) => world;
var WORLDS = {
  labyrinth: { 1: as(labyrinth) },
  turtle: { 1: as(turtle) },
};
function worldOf(type, version) {
  return WORLDS[type]?.[version];
}
var newestVersion = (type) => Math.max(0, ...Object.keys(WORLDS[type] ?? {}).map(Number));
// src/core/challenge.ts
var LANGUAGES = ["de", "en"];
var MAX_LINK = 2e3;
/** Blocks of the workshop, in every world. */
var CONTROL_BLOCKS = ["wiederhole", "solange", "wenn", "wenn-sonst", "nicht"];
var ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/** A path on lernapps.net, with an optional query; no fragment (the workshop adds #werkstatt=…). */
var BACK_URL = /^\/[a-z0-9/-]*\/(\?[a-z0-9=&-]*)?$/;
var KEYS = [
  "format",
  "id",
  "title",
  "task",
  "world",
  "toolbox",
  "start",
  "limits",
  "tests",
  "checks",
  "hints",
  "view",
  "back",
];
var WORKSHOP_CHECKS = ["hoechstens-bloecke"];
function textProblems(value, path, max) {
  if (!isObject(value))
    return [
      {
        path,
        key: "problem-text",
      },
    ];
  const problems = [];
  if (typeof value["de"] !== "string")
    problems.push({
      path: `${path}.de`,
      key: "problem-text-german",
    });
  for (const [lang, text] of Object.entries(value))
    if (!LANGUAGES.includes(lang))
      problems.push({
        path: `${path}.${lang}`,
        key: "problem-language",
      });
    else if (typeof text !== "string" || text.trim() === "" || text.length > max)
      problems.push({
        path: `${path}.${lang}`,
        key: "problem-text-length",
        params: { max },
      });
  return problems;
}
/** The config of test case `i` (or of the world itself with -1): the test's fields laid over the world's. */
function configOf(c, i) {
  const base = isObject(c.world.config) ? c.world.config : {};
  const test = i < 0 ? void 0 : c.tests[i]?.config;
  return {
    ...base,
    ...(isObject(test) ? test : {}),
  };
}
/** The test cases: the world's own config first, then each test case. */
var testCount = (c) => 1 + c.tests.length;
var configAt = (c, n) => configOf(c, n - 2);
/** Problems of a challenge from outside; empty when it is valid. */
function challengeProblems(value) {
  if (!isObject(value))
    return [
      {
        path: "",
        key: "problem-not-object",
      },
    ];
  const p = [];
  for (const key of Object.keys(value))
    if (!KEYS.includes(key))
      p.push({
        path: key,
        key: "problem-unknown-field",
      });
  if (value["format"] !== 1)
    p.push({
      path: "format",
      key: "problem-format",
    });
  if (typeof value["id"] !== "string" || !ID.test(value["id"]) || value["id"].length > 64)
    p.push({
      path: "id",
      key: "problem-id",
    });
  p.push(...textProblems(value["title"], "title", 80), ...textProblems(value["task"], "task", 400));
  const w = value["world"];
  let world;
  if (!isObject(w) || typeof w["type"] !== "string" || !(w["type"] in WORLDS))
    p.push({
      path: "world.type",
      key: "problem-world-type",
    });
  else if (!isInt(w["version"], 1, 1e3) || worldOf(w["type"], w["version"]) === void 0)
    p.push({
      path: "world.version",
      key: "problem-world-version",
      params: { newest: newestVersion(w["type"]) },
    });
  else {
    world = worldOf(w["type"], w["version"]);
    p.push(...(world?.configProblems(w["config"], "world.config") ?? []));
  }
  const known =
    world === void 0 ? [] : [...CONTROL_BLOCKS, ...Object.keys(world.commands), ...Object.keys(world.sensors)];
  const toolbox = value["toolbox"];
  if (!Array.isArray(toolbox) || toolbox.length < 1 || toolbox.length > 30)
    p.push({
      path: "toolbox",
      key: "problem-toolbox",
    });
  else
    toolbox.forEach((b, i) => {
      if (world !== void 0 && (typeof b !== "string" || !known.includes(b)))
        p.push({
          path: `toolbox[${i}]`,
          key: "problem-block",
          params: { name: String(b) },
        });
    });
  if (value["start"] !== null && value["start"] !== void 0) {
    const syntax = programProblems(value["start"], "start");
    p.push(...syntax);
    if (syntax.length === 0 && world !== void 0) p.push(...fitProblems(value["start"], world, "start"));
  }
  const limits = value["limits"];
  if (!isObject(limits))
    p.push({
      path: "limits",
      key: "problem-limits",
    });
  else {
    for (const key of Object.keys(limits))
      if (key !== "blocks" && key !== "steps")
        p.push({
          path: `limits.${key}`,
          key: "problem-unknown-field",
        });
    if (limits["blocks"] !== void 0 && !isInt(limits["blocks"], 1, 200))
      p.push({
        path: "limits.blocks",
        key: "problem-limits",
      });
    if (limits["steps"] !== void 0 && !isInt(limits["steps"], 1, 1e4))
      p.push({
        path: "limits.steps",
        key: "problem-limits",
      });
  }
  const tests = value["tests"];
  if (!Array.isArray(tests) || tests.length > 9)
    p.push({
      path: "tests",
      key: "problem-tests",
    });
  else if (world !== void 0 && isObject(w))
    tests.forEach((t, i) => {
      if (!isObject(t) || !isObject(t["config"]) || Object.keys(t).length !== 1) {
        p.push({
          path: `tests[${i}]`,
          key: "problem-tests",
        });
        return;
      }
      const merged = {
        ...(isObject(w["config"]) ? w["config"] : {}),
        ...t["config"],
      };
      p.push(...(world?.configProblems(merged, `tests[${i}].config`) ?? []));
    });
  const checks = value["checks"];
  if (!Array.isArray(checks) || checks.length < 1)
    p.push({
      path: "checks",
      key: "problem-checks",
    });
  else
    checks.forEach((c, i) => {
      const ok =
        typeof c === "string" &&
        (WORKSHOP_CHECKS.includes(c) ||
          (world !== void 0 && c in world.checks) ||
          (c.startsWith("benutzt-block:") && known.includes(c.slice(14))));
      if (world !== void 0 && !ok)
        p.push({
          path: `checks[${i}]`,
          key: "problem-check",
          params: { name: String(c) },
        });
    });
  const hints = value["hints"];
  if (!Array.isArray(hints) || hints.length > 3)
    p.push({
      path: "hints",
      key: "problem-hints",
    });
  else hints.forEach((h, i) => p.push(...textProblems(h, `hints[${i}]`, 200)));
  if (value["view"] !== "bloecke")
    p.push({
      path: "view",
      key: "problem-view",
    });
  const back = value["back"];
  if (back !== void 0) {
    const url = isObject(back) ? back["url"] : void 0;
    const urls = typeof url === "string" ? [url] : isObject(url) ? Object.values(url) : [];
    const langs = isObject(url) ? Object.keys(url) : ["de"];
    if (
      !isObject(back) ||
      urls.length === 0 ||
      !urls.every((u) => typeof u === "string" && BACK_URL.test(u)) ||
      !langs.includes("de") ||
      !langs.every((l) => LANGUAGES.includes(l))
    )
      p.push({
        path: "back.url",
        key: "problem-back-url",
      });
    else p.push(...textProblems(back["label"], "back.label", 60));
  }
  return p;
}
/** Checks a finished run of test case `n` against the challenge's world checks. */
function judgeRun(c, world, n, run) {
  if (run.status !== "done")
    return {
      ok: false,
      why: run.why ?? {
        key: "fail-limit",
        params: { steps: run.steps },
      },
    };
  const config = configAt(c, n);
  for (const name of c.checks) {
    const check = world.checks[name];
    if (check === void 0) continue;
    const verdict = check(run.world, config);
    if (!verdict.ok)
      return {
        ok: false,
        why: verdict.why,
      };
  }
  return { ok: true };
}
/** The checks of the program itself (before any run): at most so many blocks, uses a block. */
function programVerdict(c, program) {
  const blocks = blocksOf(program);
  if (blocks.length === 0) return { key: "fail-empty" };
  const slot = emptySlot(program);
  if (slot !== null)
    return {
      key: "fail-empty-slot",
      params: { block: slot },
    };
  const max = c.limits.blocks;
  if (max !== void 0 && blocks.length > max)
    return {
      key: "fail-too-many-blocks",
      params: {
        used: blocks.length,
        max,
      },
    };
  for (const check of c.checks)
    if (check.startsWith("benutzt-block:") && !blocks.includes(check.slice(14)))
      return {
        key: "fail-missing-block",
        params: { block: check.slice(14) },
      };
  return null;
}
/** Runs the program on every test case; the first that fails, or null when all pass. */
function firstFailure(c, program) {
  const world = worldOf(c.world.type, c.world.version);
  if (world === void 0)
    return {
      test: 1,
      why: {
        key: "problem-world-version",
        params: { newest: 0 },
      },
    };
  const pre = programVerdict(c, program);
  if (pre !== null)
    return {
      test: 0,
      why: pre,
    };
  for (let n = 1; n <= testCount(c); n++) {
    const run = runToEnd(program, world, configAt(c, n), c.limits.steps ?? 1e3);
    const result = judgeRun(c, world, n, run);
    if (!result.ok)
      return {
        test: n,
        why: result.why ?? { key: "fail-limit" },
        run,
      };
  }
  return null;
}
var de_default = {
  app: "Programmierwerkstatt",
  "robot-name": "Kiko",
  "loading-editor": "Die Blöcke werden geladen …",
  "rotate-hint": "Dreh dein Gerät quer, dann hast du mehr Platz.",
  task: "Aufgabe",
  "blocks-count": "Blöcke: {used} von höchstens {max}",
  "blocks-count-free": "Blöcke: {used}",
  "tests-label": "Rätsel dieser Aufgabe",
  "test-n": "Rätsel {n}",
  "test-shown": "{count} Rätsel",
  run: "Start",
  continue: "Weiter",
  step: "Ein Schritt",
  stop: "Stopp",
  reset: "Zurücksetzen",
  tempo: "Tempo",
  "tempo-slow": "langsam",
  "tempo-fast": "schnell",
  "phase-edit": "Bau dein Programm. Dann drück „Start“.",
  "phase-running": "Kiko führt dein Programm aus.",
  "phase-paused": "Angehalten. Ausgeführte Blöcke: {commands}",
  "solved-attempts": "Du hast {attempts} Versuche gebraucht.",
  "solved-first": "Gleich im ersten Versuch!",
  "failed-test": "Rätsel {n}: {why}",
  "hint-show": "Hinweis zeigen ({n} von {count})",
  hints: "Hinweise",
  "back-result": "Für deine Lehrkraft (oder einen KI-Tutor, wenn ihr einen benutzt)",
  "result-solved": "Aufgabe „{title}“ ({id}): gelöst im {attempts}. Versuch",
  "result-open": "Aufgabe „{title}“ ({id}): noch nicht gelöst, Versuche: {attempts}",
  copy: "Kopieren",
  copied: "Kopiert.",
  "problems-title": "Diese Aufgabe kann die Werkstatt nicht öffnen.",
  "problems-more": "Frag die Person, die dir den Link gegeben hat. Oder wähl eine Aufgabe aus der Liste oben.",
  "problem-at": "{path}: {what}",
  "fail-wall": "Vor Kiko ist eine Wand. Er steht in Feld ({x}|{y}) und kann nicht vorwärts gehen.",
  "fail-not-at-goal": "Das Programm ist zu Ende, aber Kiko steht in Feld ({x}|{y}), nicht im Ziel.",
  "fail-limit":
    "Das Programm hört nicht auf: Nach {steps} Befehlen ist es noch nicht fertig. Läuft Kiko hin und her oder im Kreis?",
  "fail-empty": "Dein Programm hat noch keine Blöcke. Häng Blöcke unter „Programm“.",
  "fail-too-many-blocks": "Du hast {used} Blöcke benutzt. Erlaubt sind höchstens {max}.",
  "fail-missing-block": "Benutz den Block „{block}“.",
  "fail-unknown-block": "Den Block „{name}“ kennt diese Welt nicht.",
  "fail-unknown-variable": "Die Variable „{name}“ hat noch keinen Wert.",
  "fail-divide-by-zero": "Durch 0 kann man nicht teilen.",
  "describe-labyrinth": "Labyrinth. Kiko steht in Feld ({x}|{y}) und schaut nach {facing}.",
  "describe-labyrinth-goal": "Kiko ist im Ziel.",
  "word-north": "Norden (oben)",
  "word-east": "Osten (rechts)",
  "word-south": "Süden (unten)",
  "word-west": "Westen (links)",
  "problem-not-object": "Das ist keine Aufgabe im Format der Werkstatt.",
  "problem-unreadable": "Der Link ist beschädigt. Die Aufgabe lässt sich nicht lesen.",
  "problem-too-long": "Der Link ist zu lang (höchstens {max} Zeichen).",
  "problem-unknown-field": "Dieses Feld gibt es nicht.",
  "problem-format": "„format“ muss 1 sein.",
  "problem-id": "Die id besteht aus Kleinbuchstaben, Ziffern und Bindestrichen.",
  "problem-text": 'Hier gehört ein Text je Sprache hin: { "de": …, "en": … }.',
  "problem-text-german": "Der deutsche Text fehlt.",
  "problem-language": "Diese Sprache kennt die Werkstatt nicht (de, en).",
  "problem-text-length": "Der Text ist leer oder länger als {max} Zeichen.",
  "problem-world-type": "Diese Welt kennt die Werkstatt nicht.",
  "problem-world-version": "Diese Version der Welt gibt es nicht. Die neueste ist {newest}.",
  "problem-config": "Die Welt braucht ihre Einstellungen als Objekt.",
  "problem-facing": "Die Richtung ist north, east, south oder west.",
  "problem-map-size": "Die Karte hat gleich lange Zeilen und höchstens {max} × {max} Felder.",
  "problem-map-chars": "Die Karte enthält nur #, ., S und Z.",
  "problem-map-start": "Die Karte braucht genau einen Start S.",
  "problem-map-goal": "Die Karte braucht ein Ziel Z.",
  "problem-toolbox": "Die Werkzeugkiste ist eine Liste von 1 bis 30 Blöcken.",
  "problem-block": "Den Block „{name}“ gibt es in dieser Welt nicht.",
  "problem-program": "Das ist kein gültiges Programm.",
  "problem-limits": "Grenzen: blocks 1 bis 200, steps 1 bis 10 000.",
  "problem-tests": "Testfälle: höchstens 9, jeder nur mit „config“.",
  "problem-checks": "Es braucht mindestens eine Prüfung.",
  "problem-check": "Die Prüfung „{name}“ gibt es nicht.",
  "problem-hints": "Höchstens 3 Hinweise.",
  "problem-view": "Die Ansicht ist „bloecke“.",
  "problem-back-url": "Der Rückweg ist ein Pfad auf lernapps.net, z. B. /informatik/schleifen/.",
  world: "Welt",
  editor: "Programm",
  "block-programm": "Programm",
  "block-vorwaerts": "gehe vorwärts",
  "block-links": "drehe dich nach links",
  "block-rechts": "drehe dich nach rechts",
  "block-wiederhole": "wiederhole %1 mal",
  "block-solange": "solange %1 tue",
  "block-wenn": "wenn %1 dann",
  "block-wenn-sonst": "wenn %1 dann",
  "block-sonst": "sonst",
  "block-nicht": "nicht %1",
  "block-wand-voraus": "Wand voraus?",
  "block-wand-links": "Wand links?",
  "block-wand-rechts": "Wand rechts?",
  "block-am-ziel": "am Ziel?",
  "category-move": "Bewegen",
  "category-control": "Steuerung",
  "category-sense": "Fragen",
  "fail-empty-slot": "Im Block „{block}“ fehlt noch eine Frage. Setz eine Frage in die Lücke.",
  "solved-all": "Geschafft! Dein Programm löst alle {count} Rätsel.",
  "tests-explain":
    "Diese Aufgabe hat {count} Rätsel: Varianten des Labyrinths oder Bildes. Dein Programm muss alle lösen. „Start“ probiert es in allen nacheinander aus. Mit den Reitern über dem Bild schaust du dir jedes Rätsel an.",
  help: "So funktioniert die Werkstatt",
  "help-blocks":
    "Zieh Blöcke aus der Liste und häng sie unter den braunen Block „Programm“. Nur Blöcke, die dort hängen, laufen. Lose Blöcke sind blass (ein Screenreader sagt „ausgeschaltet“).",
  "help-robot":
    "Kiko ist ein Roboter. Das Dreieck an seinem Kreis zeigt, wohin er schaut. „links“ und „rechts“ gelten aus seiner Sicht, also vom Dreieck aus.",
  "help-run":
    "„Start“ führt dein Programm aus. „Ein Schritt“ führt nur einen Block aus. In der Arbeitsfläche ist der Block markiert, der gerade dran war.",
  "help-keys":
    "Mit der Tastatur: Drück Tab, bis du in der Liste der Blöcke bist. Mit den Pfeiltasten gehst du durch die Liste (in einer Reihe mit Pfeil nach rechts). Enter nimmt einen Block. Mit den Pfeiltasten wählst du seinen Platz; ein Screenreader sagt dir, wohin er kommt. Enter legt ihn ab. Mit T kommst du zurück zur Liste. Eine Zahl in einem Block änderst du so: Pfeil nach rechts bis zur Zahl, Enter, Zahl tippen, Enter.",
  "new-blocks": "Blöcke in dieser Aufgabe",
  "explain-wiederhole":
    "„wiederhole … mal“: Die Blöcke darin laufen so oft, wie die Zahl sagt. Ein Block, der andere Blöcke wiederholt, heißt Schleife. Die Zahl änderst du mit einem Klick darauf oder mit der Tastatur.",
  "explain-solange":
    "„solange … tue“: Die Blöcke darin laufen immer wieder, solange die Antwort auf die Frage „ja“ ist.",
  "explain-wenn": "„wenn … dann“: Die Blöcke darin laufen nur, wenn die Antwort auf die Frage „ja“ ist.",
  "explain-wenn-sonst":
    "„wenn … dann … sonst“: Ist die Antwort „ja“, laufen die Blöcke bei „dann“. Ist sie „nein“, laufen die Blöcke bei „sonst“.",
  "explain-nicht": "„nicht“ dreht die Antwort einer Frage um: aus „ja“ wird „nein“.",
  "explain-wand-voraus": "„Wand voraus?“ fragt: Ist direkt vor Kiko eine Wand?",
  "explain-wand-links": "„Wand links?“ fragt: Ist links neben Kiko eine Wand?",
  "explain-wand-rechts": "„Wand rechts?“ fragt: Ist rechts neben Kiko eine Wand?",
  "explain-am-ziel": "„am Ziel?“ fragt: Steht Kiko auf dem Ziel?",
  "word-wiederhole": "wiederhole … mal",
  "word-solange": "solange … tue",
  "word-wenn": "wenn … dann",
  "word-wenn-sonst": "wenn … dann … sonst",
  "word-nicht": "nicht",
  "word-vorwaerts": "gehe vorwärts",
  "word-links": "drehe dich nach links",
  "word-rechts": "drehe dich nach rechts",
  next: "Weiter zur nächsten Aufgabe: {title}",
  "help-map-labyrinth":
    "Dunkle Felder sind Wände, helle Felder sind Weg, das grüne Feld mit der Fahne ist das Ziel. Die Punkte zeigen, wo Kiko schon war. Oben stehen die Spalten, links die Zeilen: Feld (4|2) heißt Spalte 4, Zeile 2.",
  "block-gehe": "gehe %1 Pixel",
  "block-drehe-links-um": "drehe dich um %1 Grad nach links",
  "block-drehe-rechts-um": "drehe dich um %1 Grad nach rechts",
  "block-stift-hoch": "Stift hoch",
  "block-stift-runter": "Stift runter",
  "block-farbe": "nimm die Farbe %1",
  "colour-1": "Blau",
  "colour-2": "Orange",
  "colour-3": "Grün",
  "colour-4": "Lila",
  "explain-gehe":
    "„gehe … Pixel“: Kiko geht so viele Pixel nach vorn und zeichnet dabei eine Linie. Die Zahl änderst du mit einem Klick darauf.",
  "explain-drehe-rechts-um":
    "„drehe dich um … Grad nach links/rechts“: Kiko dreht sich auf der Stelle. 90 Grad sind eine Vierteldrehung, 360 Grad einmal ganz herum.",
  "explain-farbe":
    "„nimm die Farbe …“: Ab jetzt zeichnet Kiko in dieser Farbe. Ob dein Bild zum grauen passt, hängt nicht von der Farbe ab.",
  "explain-stift-hoch": "„Stift hoch“: Kiko geht, ohne zu zeichnen. „Stift runter“: Er zeichnet wieder.",
  "describe-turtle":
    "Zeichenfläche. Kiko steht bei ({x}|{y}) und schaut in Richtung {winkel} Grad (0 Grad ist oben). Er hat {lines} Linien gezeichnet.",
  "describe-turtle-target": "Das graue Bild zeigt, was Kiko zeichnen soll.",
  "fail-picture-missing": "Dein Bild ist noch nicht gleich: Bei ({x}|{y}) fehlt ein Stück der grauen Linie.",
  "fail-picture-extra": "Bei ({x}|{y}) hast du eine Linie gezeichnet, die im grauen Bild nicht vorkommt.",
  "fail-too-many-lines": "Kiko hat mehr als {max} Linien gezeichnet. Hört dein Programm auf?",
  "problem-turtle-start": "Der Start hat x und y von 0 bis {size} und einen Winkel von 0 bis 359.",
  "help-map-turtle":
    "Beim Zeichnen geht Kiko nicht über Felder: Er zeichnet auf einer Fläche von 200 × 200 Pixeln. Das graue Bild soll er nachzeichnen. Die Zahlen am Rand helfen dir, Stellen zu finden: (50|100) heißt 50 nach rechts, 100 nach unten. Zu Beginn schaut Kiko nach oben.",
  authoring: "Eigene Aufgabe bauen",
  "authoring-intro":
    "Für Lehrkräfte und Apps: Füg eine Aufgabe als JSON ein. Die Werkstatt prüft sie sofort. Dann probierst du sie aus und kopierst den Link.",
  "authoring-schema": "Das Format steht im Schema:",
  "authoring-language":
    'Die Werkstatt zeigt die Sprache der Seite: Ein deutscher Explainer verlinkt den deutschen Link (/coding/app/), ein englischer den englischen (/coding/en/app/). Texte der Aufgabe gibst du als { "de": …, "en": … } an; Deutsch ist Pflicht.',
  "authoring-script": "Zur Build-Zeit prüft eine App Aufgabe und Musterlösung mit dem Prüfskript:",
  "authoring-examples": "Beispiel laden:",
  "authoring-draft": "Aufgabe (JSON)",
  "authoring-problems": "{count} Probleme gefunden:",
  "authoring-valid": "Die Aufgabe ist gültig.",
  "authoring-try": "Ausprobieren",
  "authoring-back": "Zurück zum Bearbeiten",
  "authoring-length": "Länge nach c=: {length} von höchstens {max} Zeichen",
  "authoring-link-de": "Link für deutsche Seiten:",
  "authoring-link-en": "Link für englische Seiten:",
  "problem-json": "Das ist kein gültiges JSON. Fehlt ein Komma oder eine Klammer?",
  "solved-before": "schon gelöst",
  "authoring-visit":
    "Ein Link mit Aufgabe gilt für den ganzen Besuch. Wer in der Liste eine andere Aufgabe wählt, verlässt ihn; der Zurück-Knopf des Browsers führt wieder hin. Hängt an den Link also keine Route (#…).",
  "problem-number": "Hier ist eine Zahl von {min} bis {max} erlaubt.",
  "problem-target-lines": "Das Zielbild hat zu viele Linien (höchstens {max}) oder hört nicht auf.",
  "fail-endless": "Dein Programm läuft im Kreis, ohne dass Kiko etwas tut. Sieh dir die Schleifen an.",
  "solved-labyrinth": "Geschafft! Kiko ist im Ziel.",
  "solved-turtle": "Geschafft! Dein Bild stimmt.",
  "word-gehe": "gehe … Pixel",
  "word-drehe-links-um": "drehe dich um … Grad nach links",
  "word-drehe-rechts-um": "drehe dich um … Grad nach rechts",
  "word-farbe": "nimm die Farbe …",
  "word-stift-hoch": "Stift hoch",
  "word-stift-runter": "Stift runter",
  "word-wand-voraus": "Wand voraus?",
  "word-am-ziel": "am Ziel?",
  "word-wand-rechts": "Wand rechts?",
  "word-wand-links": "Wand links?",
  "describe-labyrinth-around": "Frei: {free}. Das Ziel ist in Feld ({gx}|{gy}).",
  "word-dir-ahead": "vorne",
  "word-dir-left": "links",
  "word-dir-right": "rechts",
  "word-dir-none": "nirgends",
  "copy-for": "{what} kopieren",
  "copy-missing": "Kopieren geht hier nicht. Markier den Text und kopier ihn selbst.",
  "problem-solution-block": "Die Musterlösung benutzt den Block „{name}“, der nicht in der Werkzeugkiste ist.",
  "solved-both": "Geschafft! Dein Programm löst beide Rätsel.",
  "all-done": "Das war die letzte Aufgabe. Du hast alle Aufgaben der Werkstatt geschafft!",
  "scroll-hint": "Wisch die Reihe der Blöcke zur Seite, dann siehst du alle.",
  "test-ok": "gelöst",
  "test-fail": "nicht gelöst",
  "running-test": "Kiko löst Rätsel {n} von {count}.",
};
var en_default = {
  app: "Coding workshop",
  "robot-name": "Kiko",
  "loading-editor": "Loading the blocks …",
  "rotate-hint": "Turn your device sideways to get more space.",
  task: "Task",
  "blocks-count": "Blocks: {used} (at most {max})",
  "blocks-count-free": "Blocks: {used}",
  "tests-label": "Puzzles of this task",
  "test-n": "Puzzle {n}",
  "test-shown": "{count} puzzles",
  run: "Run",
  continue: "Continue",
  step: "One step",
  stop: "Stop",
  reset: "Reset",
  tempo: "Speed",
  "tempo-slow": "slow",
  "tempo-fast": "fast",
  "phase-edit": "Build your program. Then press “Run”.",
  "phase-running": "Kiko is running your program.",
  "phase-paused": "Paused. Blocks run so far: {commands}",
  "solved-attempts": "You needed {attempts} attempts.",
  "solved-first": "On your first attempt!",
  "failed-test": "Puzzle {n}: {why}",
  "hint-show": "Show a hint ({n} of {count})",
  hints: "Hints",
  "back-result": "For your teacher (or an AI tutor, if you use one)",
  "result-solved": "Task “{title}” ({id}): solved on attempt {attempts}",
  "result-open": "Task “{title}” ({id}): not solved yet, attempts: {attempts}",
  copy: "Copy",
  copied: "Copied.",
  "problems-title": "The workshop cannot open this task.",
  "problems-more": "Ask the person who gave you the link. Or choose a task from the list above.",
  "problem-at": "{path}: {what}",
  "fail-wall": "There is a wall in front of Kiko. It stands at square ({x}, {y}) and cannot move forward.",
  "fail-not-at-goal": "The program has ended, but Kiko is at square ({x}, {y}), not at the goal.",
  "fail-limit":
    "The program does not stop: after {steps} commands it is still not done. Is Kiko going back and forth or round in circles?",
  "fail-empty": "Your program has no blocks yet. Attach blocks below “Program”.",
  "fail-too-many-blocks": "You used {used} blocks. At most {max} are allowed.",
  "fail-missing-block": "Use the block “{block}”.",
  "fail-unknown-block": "This world does not know the block “{name}”.",
  "fail-unknown-variable": "The variable “{name}” has no value yet.",
  "fail-divide-by-zero": "You cannot divide by 0.",
  "describe-labyrinth": "Maze. Kiko is at square ({x}, {y}) and faces {facing}.",
  "describe-labyrinth-goal": "Kiko is at the goal.",
  "word-north": "north (up)",
  "word-east": "east (right)",
  "word-south": "south (down)",
  "word-west": "west (left)",
  "problem-not-object": "This is not a task in the workshop's format.",
  "problem-unreadable": "The link is damaged. The task cannot be read.",
  "problem-too-long": "The link is too long (at most {max} characters).",
  "problem-unknown-field": "This field does not exist.",
  "problem-format": "“format” must be 1.",
  "problem-id": "The id is made of lower-case letters, digits and hyphens.",
  "problem-text": 'A text per language belongs here: { "de": …, "en": … }.',
  "problem-text-german": "The German text is missing.",
  "problem-language": "The workshop does not know this language (de, en).",
  "problem-text-length": "The text is empty or longer than {max} characters.",
  "problem-world-type": "The workshop does not know this world.",
  "problem-world-version": "This version of the world does not exist. The newest is {newest}.",
  "problem-config": "The world needs its settings as an object.",
  "problem-facing": "The direction is north, east, south or west.",
  "problem-map-size": "The map has rows of the same length and at most {max} × {max} squares.",
  "problem-map-chars": "The map only contains #, ., S and Z.",
  "problem-map-start": "The map needs exactly one start S.",
  "problem-map-goal": "The map needs a goal Z.",
  "problem-toolbox": "The toolbox is a list of 1 to 30 blocks.",
  "problem-block": "There is no block “{name}” in this world.",
  "problem-program": "This is not a valid program.",
  "problem-limits": "Limits: blocks 1 to 200, steps 1 to 10,000.",
  "problem-tests": "Test cases: at most 9, each with “config” only.",
  "problem-checks": "At least one check is needed.",
  "problem-check": "There is no check “{name}”.",
  "problem-hints": "At most 3 hints.",
  "problem-view": "The view is “bloecke”.",
  "problem-back-url": "The way back is a path on lernapps.net, e.g. /informatik/schleifen/.",
  world: "World",
  editor: "Program",
  "block-programm": "Program",
  "block-vorwaerts": "move forward",
  "block-links": "turn left",
  "block-rechts": "turn right",
  "block-wiederhole": "repeat %1 times",
  "block-solange": "while %1 do",
  "block-wenn": "if %1 then",
  "block-wenn-sonst": "if %1 then",
  "block-sonst": "else",
  "block-nicht": "not %1",
  "block-wand-voraus": "wall ahead?",
  "block-wand-links": "wall on the left?",
  "block-wand-rechts": "wall on the right?",
  "block-am-ziel": "at the goal?",
  "category-move": "Move",
  "category-control": "Control",
  "category-sense": "Questions",
  "fail-empty-slot": "The block “{block}” still needs a question. Put a question into the gap.",
  "solved-all": "Done! Your program solves all {count} puzzles.",
  "tests-explain":
    "This task has {count} puzzles: variants of the maze or picture. Your program has to solve them all. “Run” tries it in each one in turn. Use the tabs above the picture to look at each puzzle.",
  help: "How the workshop works",
  "help-blocks":
    "Drag blocks from the list and hang them under the brown block “Program”. Only blocks that hang there will run. Loose blocks are pale (a screen reader says “disabled”).",
  "help-robot":
    "Kiko is a robot. The triangle on its circle shows where it is looking. “left” and “right” are from Kiko's point of view, so from the triangle.",
  "help-run":
    "“Run” runs your program. “One step” runs just one block. The block that just ran is marked in the work area.",
  "help-keys":
    "With the keyboard: press Tab until you are in the list of blocks. Use the arrow keys to go through the list (in a row, the right arrow). Enter picks a block. Use the arrow keys to choose its place; a screen reader tells you where it goes. Enter puts it down. Press T to go back to the list. To change a number in a block: arrow right to the number, Enter, type the number, Enter.",
  "new-blocks": "Blocks in this task",
  "explain-wiederhole":
    "“repeat … times”: the blocks inside run as many times as the number says. A block that repeats other blocks is called a loop. Change the number by clicking it or with the keyboard.",
  "explain-solange":
    "“while … do”: the blocks inside run again and again as long as the answer to the question is “yes”.",
  "explain-wenn": "“if … then”: the blocks inside only run if the answer to the question is “yes”.",
  "explain-wenn-sonst":
    "“if … then … else”: if the answer is “yes”, the blocks at “then” run. If it is “no”, the blocks at “else” run.",
  "explain-nicht": "“not” turns the answer to a question around: “yes” becomes “no”.",
  "explain-wand-voraus": "“wall ahead?” asks: is there a wall right in front of Kiko?",
  "explain-wand-links": "“wall on the left?” asks: is there a wall on Kiko's left?",
  "explain-wand-rechts": "“wall on the right?” asks: is there a wall on Kiko's right?",
  "explain-am-ziel": "“at the goal?” asks: is Kiko standing on the goal?",
  "word-wiederhole": "repeat … times",
  "word-solange": "while … do",
  "word-wenn": "if … then",
  "word-wenn-sonst": "if … then … else",
  "word-nicht": "not",
  "word-vorwaerts": "move forward",
  "word-links": "turn left",
  "word-rechts": "turn right",
  next: "On to the next task: {title}",
  "help-map-labyrinth":
    "Dark squares are walls, light squares are the path, the green square with the flag is the goal. The dots show where Kiko has been. The numbers at the top are columns, the numbers on the left are rows: square (4, 2) means column 4, row 2.",
  "block-gehe": "move %1 pixels",
  "block-drehe-links-um": "turn left by %1 degrees",
  "block-drehe-rechts-um": "turn right by %1 degrees",
  "block-stift-hoch": "pen up",
  "block-stift-runter": "pen down",
  "block-farbe": "use the colour %1",
  "colour-1": "blue",
  "colour-2": "orange",
  "colour-3": "green",
  "colour-4": "purple",
  "explain-gehe":
    "“move … pixels”: Kiko moves forward that many pixels and draws a line. Click the number to change it.",
  "explain-drehe-rechts-um":
    "“turn left/right by … degrees”: Kiko turns on the spot. 90 degrees is a quarter turn, 360 degrees is once all the way round.",
  "explain-farbe":
    "“use the colour …”: from now on Kiko draws in this colour. Whether your picture matches the grey one does not depend on the colour.",
  "explain-stift-hoch": "“pen up”: Kiko moves without drawing. “pen down”: it draws again.",
  "describe-turtle":
    "Drawing area. Kiko is at ({x}, {y}) and faces {winkel} degrees (0 degrees is up). It has drawn {lines} lines.",
  "describe-turtle-target": "The grey picture shows what Kiko should draw.",
  "fail-picture-missing": "Your picture is not the same yet: at ({x}, {y}) a piece of the grey line is missing.",
  "fail-picture-extra": "At ({x}, {y}) you drew a line that is not in the grey picture.",
  "fail-too-many-lines": "Kiko has drawn more than {max} lines. Does your program stop?",
  "problem-turtle-start": "The start has x and y from 0 to {size} and an angle from 0 to 359.",
  "help-map-turtle":
    "When drawing, Kiko does not walk over squares: it draws on an area of 200 × 200 pixels. It should copy the grey picture. The numbers on the edge help you find places: (50, 100) means 50 to the right, 100 down. At the start Kiko looks up.",
  authoring: "Build your own task",
  "authoring-intro":
    "For teachers and apps: paste a task as JSON. The workshop checks it at once. Then try it out and copy the link.",
  "authoring-schema": "The format is in the schema:",
  "authoring-language":
    'The workshop shows the language of the page: a German explainer links the German link (/coding/app/), an English one the English link (/coding/en/app/). Give the texts of the task as { "de": …, "en": … }; German is required.',
  "authoring-script": "At build time an app checks its task and model solution with the check script:",
  "authoring-examples": "Load an example:",
  "authoring-draft": "Task (JSON)",
  "authoring-problems": "{count} problems found:",
  "authoring-valid": "The task is valid.",
  "authoring-try": "Try it out",
  "authoring-back": "Back to editing",
  "authoring-length": "Length after c=: {length} of at most {max} characters",
  "authoring-link-de": "Link for German pages:",
  "authoring-link-en": "Link for English pages:",
  "problem-json": "This is not valid JSON. Is a comma or a bracket missing?",
  "solved-before": "solved before",
  "authoring-visit":
    "A link with a task holds for the whole visit. Choosing another task in the list leaves it; the browser’s back button returns to it. So do not add a route (#…) to the link.",
  "problem-number": "A number from {min} to {max} is allowed here.",
  "problem-target-lines": "The target picture has too many lines (at most {max}) or does not end.",
  "fail-endless": "Your program goes round in circles without Kiko doing anything. Look at your loops.",
  "solved-labyrinth": "Done! Kiko is at the goal.",
  "solved-turtle": "Done! Your picture is right.",
  "word-gehe": "move … pixels",
  "word-drehe-links-um": "turn left by … degrees",
  "word-drehe-rechts-um": "turn right by … degrees",
  "word-farbe": "use the colour …",
  "word-stift-hoch": "pen up",
  "word-stift-runter": "pen down",
  "word-wand-voraus": "wall ahead?",
  "word-am-ziel": "at the goal?",
  "word-wand-rechts": "wall on the right?",
  "word-wand-links": "wall on the left?",
  "describe-labyrinth-around": "Free: {free}. The goal is at square ({gx}, {gy}).",
  "word-dir-ahead": "ahead",
  "word-dir-left": "left",
  "word-dir-right": "right",
  "word-dir-none": "nowhere",
  "copy-for": "Copy {what}",
  "copy-missing": "Copying does not work here. Select the text and copy it yourself.",
  "problem-solution-block": "The model solution uses the block “{name}”, which is not in the toolbox.",
  "solved-both": "Done! Your program solves both puzzles.",
  "all-done": "That was the last task. You have done all the tasks of the workshop!",
  "scroll-hint": "Swipe the row of blocks sideways to see them all.",
  "test-ok": "solved",
  "test-fail": "not solved",
  "running-test": "Kiko is solving puzzle {n} of {count}.",
};
// src/tools/challenge-check.ts
var BASE = "https://lernapps.net/coding/";
function main(argv) {
  const lang = argv.includes("--lang") && argv[argv.indexOf("--lang") + 1] === "en" ? "en" : "de";
  const files = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--lang");
  const t = translator(lang === "en" ? en_default : de_default, lang === "en" ? "en-GB" : "de-DE");
  const say = (m) => t(m.key, m.params ?? {});
  const [challengeFile, solutionFile] = files;
  if (challengeFile === void 0) {
    process.stderr.write("node challenge-check.v1.mjs <challenge.json> [<solution.json>] [--lang en]\n");
    return 2;
  }
  const read = (file) => JSON.parse(readFileSync(file, "utf8"));
  let ok = true;
  const fail = (line) => {
    ok = false;
    process.stdout.write(`✗ ${line}\n`);
  };
  let challenge;
  try {
    challenge = read(challengeFile);
  } catch {
    fail(`${challengeFile}: ${t("problem-json")}`);
    return 1;
  }
  const problems = challengeProblems(challenge);
  for (const p of problems)
    fail(
      `${challengeFile}: ${
        p.path === ""
          ? say(p)
          : t("problem-at", {
              path: p.path,
              what: say(p),
            })
      }`,
    );
  if (problems.length > 0) return 1;
  const packed = deflateRawSync(Buffer.from(JSON.stringify(challenge)), { level: 9 }).toString("base64url");
  if (packed.length > 2e3) fail(t("problem-too-long", { max: MAX_LINK }));
  if (solutionFile !== void 0) {
    let solution;
    try {
      solution = read(solutionFile);
    } catch {
      fail(`${solutionFile}: ${t("problem-json")}`);
      return 1;
    }
    const wrong = programProblems(solution);
    for (const p of wrong)
      fail(
        `${solutionFile}: ${t("problem-at", {
          path: p.path,
          what: say(p),
        })}`,
      );
    const outside = wrong.length > 0 ? [] : blocksOf(solution).filter((b) => !challenge.toolbox.includes(b));
    for (const b of new Set(outside)) fail(`${solutionFile}: ${t("problem-solution-block", { name: b })}`);
    if (wrong.length === 0) {
      const failure = firstFailure(challenge, solution);
      if (failure !== null)
        fail(
          `${solutionFile}: ${
            failure.test === 0
              ? say(failure.why)
              : t("failed-test", {
                  n: failure.test,
                  why: say(failure.why),
                })
          }`,
        );
    }
  }
  if (ok) {
    process.stdout.write(
      `✓ ${t("authoring-valid")} ${t("authoring-length", {
        length: packed.length,
        max: MAX_LINK,
      })}\n`,
    );
    process.stdout.write(`${t("authoring-link-de")} ${BASE}app/?c=${packed}\n`);
    process.stdout.write(`${t("authoring-link-en")} ${BASE}en/app/?c=${packed}\n`);
  }
  return ok ? 0 : 1;
}
process.exitCode = main(process.argv.slice(2));
