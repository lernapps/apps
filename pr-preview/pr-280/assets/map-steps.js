// The map of a subject by steps of the chain (src/map-steps.njk, feat/map-steps). Without this script every
// competency is a link to its page, which shows its chain. This script only
// - chooses a competency on a click (or from the address, #<id>) instead of leaving the page,
// - shows its ancestors and descendants, and dims the others,
// - draws the arrows of "builds on" inside that chain over the grid,
// - lists the chain step by step beside the map, each entry a button that chooses it, with a link to its page.
// Escape or the button "Clear the choice" ends the choice. Nothing is stored in the browser, nothing is sent anywhere;
// the address only carries the chosen competency, so it can be passed on.

const root = document.querySelector("[data-map-steps]");
const dataNode = document.getElementById("map-steps-data");
const textNode = document.getElementById("map-steps-text");

if (root && dataNode && textNode) {
  const data = JSON.parse(dataNode.textContent);
  const text = JSON.parse(textNode.textContent);
  const byId = new Map(data.competencies.map((c) => [c.id, c]));
  const children = new Map(data.competencies.map((c) => [c.id, []]));
  for (const c of data.competencies) for (const r of c.requires) children.get(r)?.push(c.id);

  const closure = (id, next) => {
    const seen = new Set();
    const stack = [...next(id)];
    while (stack.length) {
      const x = stack.pop();
      if (seen.has(x)) continue;
      seen.add(x);
      stack.push(...next(x));
    }
    return seen;
  };
  const ancestors = (id) => closure(id, (x) => byId.get(x)?.requires ?? []);
  const descendants = (id) => closure(id, (x) => children.get(x) ?? []);

  const scroll = root.querySelector(".map-scroll");
  const table = root.querySelector(".map-grid");
  const panel = root.querySelector("[data-map-chain]");
  const body = panel.querySelector("[data-chain-body]");
  const items = new Map([...root.querySelectorAll("li[data-competency]")].map((li) => [li.dataset.competency, li]));
  const empty = body.innerHTML;
  panel.hidden = false;
  root.classList.add("map-bystep-js");

  // The arrows: one SVG over the table, in the coordinates of the table.
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "map-arrows");
  svg.setAttribute("aria-hidden", "true");
  scroll.append(svg);

  let chosen = null;
  let before = new Set();
  let after = new Set();

  function draw() {
    svg.replaceChildren();
    if (!chosen) return;
    const box = table.getBoundingClientRect();
    svg.setAttribute("width", String(table.offsetWidth));
    svg.setAttribute("height", String(table.offsetHeight));
    svg.style.left = `${table.offsetLeft}px`;
    svg.style.top = `${table.offsetTop}px`;
    const at = (id) => {
      const chip = items.get(id)?.querySelector(".map-chip");
      if (!chip || chip.offsetParent === null) return null; // hidden by the filter
      const r = chip.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, top: r.top - box.top, bottom: r.bottom - box.top };
    };
    const up = new Set([...before, chosen]);
    const down = new Set([...after, chosen]);
    for (const c of data.competencies) {
      for (const r of c.requires) {
        const inChain = (up.has(c.id) && up.has(r)) || (down.has(c.id) && down.has(r));
        if (!inChain) continue;
        const from = at(r);
        const to = at(c.id);
        if (!from || !to) continue;
        const mid = (from.bottom + to.top) / 2;
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", `M${from.x},${from.bottom} C${from.x},${mid} ${to.x},${mid} ${to.x},${to.top - 4}`);
        path.setAttribute("class", up.has(c.id) ? "map-arrow-before" : "map-arrow-after");
        path.setAttribute("marker-end", "url(#map-arrow-head)");
        svg.append(path);
      }
    }
    const defs = document.createElementNS(svgNS, "defs");
    defs.innerHTML = '<marker id="map-arrow-head" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" class="map-arrow-tip"/></marker>';
    svg.prepend(defs);
  }

  // One list of the chain: a heading with the count, then per step a row of buttons.
  function list(title, ids) {
    const section = document.createElement("section");
    section.className = "map-chain-part";
    const h = document.createElement("h3");
    h.textContent = `${title} · ${ids.size}`;
    section.append(h);
    if (!ids.size) {
      const p = document.createElement("p");
      p.className = "m-0 text-slate-600";
      p.textContent = text.nothing;
      section.append(p);
      return section;
    }
    const steps = new Map();
    for (const c of data.competencies) {
      if (!ids.has(c.id)) continue;
      if (!steps.has(c.step)) steps.set(c.step, []);
      steps.get(c.step).push(c);
    }
    const dl = document.createElement("dl");
    for (const [, list] of [...steps].sort((a, b) => a[0] - b[0])) {
      const dt = document.createElement("dt");
      dt.textContent = place(list[0]);
      const dd = document.createElement("dd");
      for (const c of list) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "map-chain-item";
        b.dataset.choose = c.id;
        b.textContent = c.name;
        b.title = c.iCan;
        dd.append(b);
      }
      dl.append(dt, dd);
    }
    section.append(dl);
    return section;
  }

  // Where a competency stands: its grade band and its step in it (feat/map-chains, KD-17).
  function place(c) {
    return text.place.replace("{band}", c.band).replace("{step}", c.bandStep);
  }

  function render() {
    if (!chosen) {
      body.innerHTML = empty;
      return;
    }
    const c = byId.get(chosen);
    const head = document.createElement("div");
    head.className = "flex flex-col gap-1";
    const kind = document.createElement("p");
    kind.className = "map-badge m-0 self-start";
    kind.textContent = text.kind.replace("{strand}", data.strands[c.strand]).replace("{place}", place(c));
    const name = document.createElement("p");
    name.className = "m-0 text-lg font-bold text-slate-900";
    name.textContent = c.name;
    const ican = document.createElement("p");
    ican.className = "m-0 text-slate-700";
    ican.textContent = c.iCan;
    head.append(kind, name, ican);
    const actions = document.createElement("p");
    actions.className = "m-0 flex flex-wrap gap-2";
    const link = document.createElement("a");
    link.className = "btn btn-primary";
    link.href = text.pageUrl.replace("{id}", c.id);
    link.textContent = text.page;
    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "btn btn-secondary";
    clear.dataset.clear = "";
    clear.textContent = text.clear;
    actions.append(link, clear);
    body.replaceChildren(head, list(text.before, before), list(text.after, after), actions);
  }

  function choose(id, { scroll: scrollTo = false } = {}) {
    chosen = id && byId.has(id) ? id : null;
    before = chosen ? ancestors(chosen) : new Set();
    after = chosen ? descendants(chosen) : new Set();
    root.classList.toggle("map-focus", Boolean(chosen));
    for (const [cid, li] of items) {
      li.toggleAttribute("data-chosen", cid === chosen);
      li.toggleAttribute("data-before", before.has(cid));
      li.toggleAttribute("data-after", after.has(cid));
      li.querySelector(".map-chip")?.setAttribute("aria-current", cid === chosen ? "true" : "false");
    }
    history.replaceState(null, "", chosen ? `#${chosen}` : location.pathname + location.search);
    render();
    draw();
    if (chosen && scrollTo) items.get(chosen)?.scrollIntoView({ block: "center", inline: "center" });
  }

  root.addEventListener("click", (event) => {
    const chip = event.target.closest("li[data-competency] > a");
    if (chip && !(event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
      event.preventDefault();
      const id = chip.parentElement.dataset.competency;
      choose(id === chosen ? null : id);
      return;
    }
    const item = event.target.closest("[data-choose]");
    if (item) {
      choose(item.dataset.choose, { scroll: true });
      items.get(chosen)?.querySelector(".map-chip")?.focus({ preventScroll: true });
      return;
    }
    if (event.target.closest("[data-clear]")) {
      const was = chosen;
      choose(null);
      items.get(was)?.querySelector(".map-chip")?.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chosen && !document.querySelector("dialog[open]")) choose(null);
  });

  // The filter of assets/map.js hides chips: the arrows follow.
  document.querySelector("[data-map-filter]")?.addEventListener("click", () => requestAnimationFrame(draw));
  addEventListener("resize", () => requestAnimationFrame(draw));
  document.fonts?.ready.then(() => draw());

  const start = decodeURIComponent(location.hash.slice(1));
  if (byId.has(start)) choose(start, { scroll: true });
}
