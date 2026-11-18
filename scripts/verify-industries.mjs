/**
 * Checks industry content files against the Industry contract in
 * src/data/industries/types.ts. Reports every problem in a file, not just the first.
 *
 * Usage:
 *   node scripts/verify-industries.mjs          check every verticals/*.ts
 *   node scripts/verify-industries.mjs <slug>   check verticals/<slug>.ts only
 *
 * Run: node scripts/verify-industries.mjs
 */

import { existsSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VERTICALS_DIR = join(ROOT, "src", "data", "industries", "verticals");
const SERVICES_FILE = join(ROOT, "src", "data", "services.ts");

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TONES = ["light", "surface", "dark"];
const BLOCK_TYPES = ["pains", "lanes", "flow", "table", "metrics", "checklist", "note"];
const BUSINESS_TYPES = ["local", "ecommerce", "both"];
const BRITISH_WORDS = [
  "enquiry",
  "enquiries",
  "enquire",
  "organise",
  "organised",
  "organising",
  "utilise",
  "utilised",
  "utilisation",
  "optimise",
  "optimised",
  "optimisation",
  "colour",
  "favour",
  "behaviour",
  "centre",
  "programme",
  "whilst",
  "prioritise",
  "specialise",
  "specialised",
  "recognise",
  "analyse",
  "judgement",
  "catalogue",
];
const BANNED_PHRASES = [
  "unlock",
  "supercharge",
  "elevate",
  "seamless",
  "leverage",
  "game-changing",
  "next level",
  "guarantee",
];

function typeName(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function fmtGot(v) {
  if (typeof v === "string") {
    return JSON.stringify(v.length > 60 ? `${v.slice(0, 57)}...` : v);
  }
  if (v !== null && typeof v === "object") return typeName(v);
  return String(v);
}

function isIsoDate(v) {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

function walkStrings(value, path, visit) {
  if (typeof value === "string") {
    visit(value, path);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walkStrings(v, `${path}[${i}]`, visit));
  } else if (value !== null && typeof value === "object") {
    for (const [key, v] of Object.entries(value)) {
      walkStrings(v, path ? `${path}.${key}` : key, visit);
    }
  }
}

/** Returns a list of { path, msg, got, limit } problems for one industry file. */
function checkIndustry(slug, data, serviceIds) {
  const problems = [];
  const add = (path, msg, got, limit) => problems.push({ path, msg, got, limit });

  if (typeName(data) !== "object") {
    add("default export", "must default-export an Industry object", typeName(data), "object");
    return problems;
  }
  const ind = data;

  // Helpers. Each one records a problem and keeps going.
  const obj = (path, v) => {
    if (typeName(v) === "object") return v;
    add(path, "must be an object", typeName(v), "object");
    return {};
  };
  const arr = (path, v, min, max) => {
    if (!Array.isArray(v)) {
      add(path, "must be an array", typeName(v), "array");
      return [];
    }
    if (v.length < min || (max !== undefined && v.length > max)) {
      const limit = max === undefined ? `at least ${min}` : min === max ? `${min}` : `${min}-${max}`;
      add(path, "item count out of range", v.length, limit);
    }
    return v;
  };
  const str = (path, v, max) => {
    if (typeof v !== "string") {
      add(path, "must be a string", typeName(v), "string");
      return;
    }
    if (max !== undefined && v.length > max) add(path, "exceeds max length", v.length, max);
  };
  const strLen = (path, v, min, max) => {
    if (typeof v !== "string") {
      add(path, "must be a string", typeName(v), "string");
      return;
    }
    if (v.length < min || v.length > max) add(path, "length out of range", v.length, `${min}-${max}`);
  };
  const words = (path, v, min, max) => {
    if (typeof v !== "string") {
      add(path, "must be a string", typeName(v), "string");
      return;
    }
    const t = v.trim();
    const n = t ? t.split(/\s+/).length : 0;
    if (n < min || n > max) add(path, "word count out of range", n, `${min}-${max}`);
  };
  const lines = (path, v, max) =>
    arr(path, v, 2, 2).forEach((line, i) => str(`${path}[${i}]`, line, max));
  const kebab = (path, v) => {
    if (typeof v !== "string" || !KEBAB.test(v)) {
      add(path, "must be kebab-case", v, "lowercase kebab-case");
    }
  };
  const oneOf = (path, v, allowed) => {
    if (!allowed.includes(v)) add(path, `must be one of ${allowed.join(", ")}`, v, allowed.join(" | "));
  };
  const uniq = (items, label) => {
    const seen = new Set();
    for (const { path, value } of items) {
      if (seen.has(value)) add(path, `duplicate ${label} ${fmtGot(value)}`, "duplicate", "unique");
      seen.add(value);
    }
  };
  const checkServiceIds = (basePath, list) => {
    const items = list.map((id, j) => ({ path: `${basePath}[${j}]`, value: id }));
    for (const { path, value } of items) {
      if (!serviceIds.has(value)) add(path, "not a valid service id", value, "an id from services.ts");
    }
    uniq(items, "service id");
  };

  // Top level
  if (ind.slug !== slug) add("slug", "must equal the file name", ind.slug, slug);
  if (!Number.isInteger(ind.priority) || ind.priority < 1) {
    add("priority", "must be a positive integer", ind.priority, "integer >= 1");
  }
  str("name", ind.name);
  str("audience", ind.audience);
  str("shortName", ind.shortName, 22);
  if (!isIsoDate(ind.updated)) add("updated", "must be a YYYY-MM-DD date", ind.updated, "YYYY-MM-DD");
  str("hubBlurb", ind.hubBlurb, 140);

  // seo
  const seo = obj("seo", ind.seo);
  str("seo.title", seo.title, 55);
  strLen("seo.description", seo.description, 120, 155);
  str("seo.serviceType", seo.serviceType);
  arr("seo.keywords", seo.keywords, 5, 10).forEach((k, i) => str(`seo.keywords[${i}]`, k));
  strLen("seo.serviceSummary", seo.serviceSummary, 90, 200);
  if (typeof seo.serviceSummary === "string" && !seo.serviceSummary.includes("MaaxGen")) {
    add("seo.serviceSummary", 'must contain "MaaxGen"', seo.serviceSummary, 'contains "MaaxGen"');
  }

  // hero
  const hero = obj("hero", ind.hero);
  str("hero.kicker", hero.kicker, 48);
  lines("hero.headline", hero.headline, 30);
  str("hero.lead", hero.lead, 240);
  str("hero.ctaLabel", hero.ctaLabel, 26);
  str("hero.reassurance", hero.reassurance, 80);

  // answer
  const answer = obj("answer", ind.answer);
  str("answer.question", answer.question);
  words("answer.answer", answer.answer, 45, 70);
  arr("answer.points", answer.points, 3, 4).forEach((p, i) => str(`answer.points[${i}]`, p, 110));

  // stages
  const stages = arr("stages", ind.stages, 3, 4);
  const stageIds = [];
  const stageIdItems = [];
  stages.forEach((raw, i) => {
    const p = `stages[${i}]`;
    const stage = obj(p, raw);
    kebab(`${p}.id`, stage.id);
    str(`${p}.label`, stage.label, 14);
    stageIds.push(stage.id);
    stageIdItems.push({ path: `${p}.id`, value: stage.id });
  });
  uniq(stageIdItems, "stage id");

  // plays
  const plays = arr("plays", ind.plays, 6, 6);
  const playIdItems = [];
  const serviceVisualItems = [];
  const industryVisuals = [];
  plays.forEach((raw, i) => {
    const p = `plays[${i}]`;
    const play = obj(p, raw);
    const expectedNum = String(i + 1).padStart(2, "0");
    if (play.num !== expectedNum) {
      add(`${p}.num`, "must match position, in order", play.num, expectedNum);
    }
    kebab(`${p}.id`, play.id);
    playIdItems.push({ path: `${p}.id`, value: play.id });
    str(`${p}.name`, play.name, 28);
    if (!stageIds.includes(play.stage)) {
      add(`${p}.stage`, "must be one of the stage ids", play.stage, stageIds.join(" | ") || "none defined");
    }
    str(`${p}.problem`, play.problem, 70);
    lines(`${p}.headline`, play.headline, 24);
    str(`${p}.summary`, play.summary, 240);
    arr(`${p}.whatWeDo`, play.whatWeDo, 4, 4).forEach((w, j) => str(`${p}.whatWeDo[${j}]`, w, 52));
    str(`${p}.outcome`, play.outcome, 130);
    checkServiceIds(`${p}.services`, arr(`${p}.services`, play.services, 1, 3));

    const visual = obj(`${p}.visual`, play.visual);
    if (visual.kind === "industry") {
      kebab(`${p}.visual.id`, visual.id);
      industryVisuals.push({ path: `${p}.visual.id`, value: visual.id });
    } else if (visual.kind === "service") {
      if (!serviceIds.has(visual.id)) {
        add(`${p}.visual.id`, "not a valid service id", visual.id, "an id from services.ts");
      } else {
        serviceVisualItems.push({ path: `${p}.visual.id`, value: visual.id });
      }
      if (visual.query !== undefined) {
        str(`${p}.visual.query`, visual.query, 24);
        if (visual.id !== "google-ads") {
          add(`${p}.visual.query`, 'only allowed when visual id is "google-ads"', visual.id, "google-ads");
        }
      }
    } else {
      add(`${p}.visual.kind`, 'must be "industry" or "service"', visual.kind, "industry | service");
    }
  });
  uniq(playIdItems, "play id");
  uniq(serviceVisualItems, "service visual id");
  const usedStages = plays.map((p) => (p !== null && typeof p === "object" ? p.stage : undefined));
  stages.forEach((st, i) => {
    const id = st !== null && typeof st === "object" ? st.id : undefined;
    if (!usedStages.includes(id)) {
      add(`stages[${i}].id`, "no play uses this stage", id, "used by at least one play");
    }
  });
  if (industryVisuals.length !== 2) {
    add("plays", 'exactly two plays must use visual kind "industry"', industryVisuals.length, 2);
  } else if (industryVisuals[0].value === industryVisuals[1].value) {
    add(industryVisuals[1].path, "the two industry visuals must use different ids", industryVisuals[1].value, "different ids");
  }

  // recommendedServices
  checkServiceIds("recommendedServices", arr("recommendedServices", ind.recommendedServices, 3, 5));

  // blocks
  const blockBody = (p, block) => {
    switch (block.type) {
      case "pains":
        arr(`${p}.items`, block.items, 3, 5).forEach((raw, j) => {
          const q = `${p}.items[${j}]`;
          const item = obj(q, raw);
          str(`${q}.title`, item.title);
          str(`${q}.body`, item.body);
          str(`${q}.cost`, item.cost);
        });
        break;
      case "lanes": {
        let refLabels = null;
        arr(`${p}.lanes`, block.lanes, 2, 3).forEach((raw, j) => {
          const q = `${p}.lanes[${j}]`;
          const lane = obj(q, raw);
          str(`${q}.label`, lane.label);
          str(`${q}.who`, lane.who);
          const labels = arr(`${q}.rows`, lane.rows, 3, 5).map((rr, k) => {
            const row = obj(`${q}.rows[${k}]`, rr);
            str(`${q}.rows[${k}].label`, row.label);
            str(`${q}.rows[${k}].value`, row.value);
            return row.label;
          });
          if (refLabels === null) {
            refLabels = labels;
          } else if (JSON.stringify(labels) !== JSON.stringify(refLabels)) {
            add(
              `${q}.rows`,
              "row labels must match the first lane, in the same order",
              labels.join(" | "),
              refLabels.join(" | ")
            );
          }
        });
        break;
      }
      case "flow":
        arr(`${p}.steps`, block.steps, 3, 6).forEach((raw, j) => {
          const q = `${p}.steps[${j}]`;
          const step = obj(q, raw);
          str(`${q}.label`, step.label);
          str(`${q}.title`, step.title);
          str(`${q}.body`, step.body);
        });
        break;
      case "table": {
        const columns = arr(`${p}.columns`, block.columns, 2, 4);
        columns.forEach((c, j) => str(`${p}.columns[${j}]`, c));
        arr(`${p}.rows`, block.rows, 3, 7).forEach((row, j) => {
          const q = `${p}.rows[${j}]`;
          if (!Array.isArray(row)) {
            add(q, "must be an array of cells", typeName(row), "array");
            return;
          }
          if (row.length !== columns.length) {
            add(q, "cell count must match column count", row.length, columns.length);
          }
          row.forEach((c, k) => str(`${q}[${k}]`, c));
        });
        str(`${p}.caption`, block.caption);
        break;
      }
      case "metrics":
        arr(`${p}.items`, block.items, 3, 6).forEach((raw, j) => {
          const q = `${p}.items[${j}]`;
          const item = obj(q, raw);
          str(`${q}.term`, item.term);
          str(`${q}.definition`, item.definition);
          str(`${q}.why`, item.why);
        });
        break;
      case "checklist":
        arr(`${p}.groups`, block.groups, 2, 4).forEach((raw, j) => {
          const q = `${p}.groups[${j}]`;
          const group = obj(q, raw);
          str(`${q}.title`, group.title);
          arr(`${q}.items`, group.items, 3, 5).forEach((it, k) => str(`${q}.items[${k}]`, it));
        });
        break;
      case "note":
        arr(`${p}.body`, block.body, 1, 3).forEach((t, j) => str(`${p}.body[${j}]`, t));
        break;
      default:
        oneOf(`${p}.type`, block.type, BLOCK_TYPES);
    }
  };

  const blocks = arr("blocks", ind.blocks, 4, 6);
  const blockIdItems = [];
  const tones = new Set();
  blocks.forEach((raw, i) => {
    const p = `blocks[${i}]`;
    const block = obj(p, raw);
    kebab(`${p}.id`, block.id);
    blockIdItems.push({ path: `${p}.id`, value: block.id });
    str(`${p}.eyebrow`, block.eyebrow, 40);
    str(`${p}.heading`, block.heading, 80);
    if (block.intro !== undefined) str(`${p}.intro`, block.intro, 260);
    if (TONES.includes(block.tone)) tones.add(block.tone);
    else oneOf(`${p}.tone`, block.tone, TONES);
    blockBody(p, block);
  });
  uniq(blockIdItems, "block id");
  if (blocks.length > 0 && tones.size < 2) {
    add("blocks", "not every block may have the same tone", tones.size, "at least 2 distinct tones");
  }

  // faqs
  const faqList = arr("faqs", ind.faqs, 8, 10);
  const faqQs = faqList.map((f) => (f !== null && typeof f === "object" ? f.q : undefined));
  if (!faqQs.some((q) => typeof q === "string" && /marketing agency do\?$/i.test(q.trim()))) {
    add("faqs", 'needs a question ending "marketing agency do?"', "missing", "What does a <industry> marketing agency do?");
  }
  if (!faqQs.some((q) => typeof q === "string" && /choose a marketing agency/i.test(q))) {
    add("faqs", 'needs a question containing "choose a marketing agency"', "missing", "How do I choose a marketing agency for my <business>?");
  }
  faqList.forEach((raw, i) => {
    const p = `faqs[${i}]`;
    const faq = obj(p, raw);
    str(`${p}.q`, faq.q, 110);
    if (typeof faq.q === "string" && !faq.q.trim().endsWith("?")) {
      add(`${p}.q`, 'must end with "?"', faq.q, "ends with ?");
    }
    words(`${p}.a`, faq.a, 40, 90);
  });

  // form
  const form = obj("form", ind.form);
  str("form.heading", form.heading, 60);
  str("form.intro", form.intro, 200);
  const qualifier = obj("form.qualifier", form.qualifier);
  str("form.qualifier.label", qualifier.label);
  arr("form.qualifier.options", qualifier.options, 4, 6).forEach((o, i) =>
    str(`form.qualifier.options[${i}]`, o, 44)
  );
  oneOf("form.businessType", form.businessType, BUSINESS_TYPES);
  str("form.submitLabel", form.submitLabel, 28);
  str("form.notePlaceholder", form.notePlaceholder, 90);
  if (form.noteHint !== undefined) str("form.noteHint", form.noteHint, 110);
  if (form.siteField !== undefined) {
    const sf = obj("form.siteField", form.siteField);
    str("form.siteField.label", sf.label, 32);
    str("form.siteField.placeholder", sf.placeholder, 40);
    if (typeof sf.required !== "boolean") {
      add("form.siteField.required", "must be a boolean", typeName(sf.required), "boolean");
    }
  }
  lines("ctaLines", ind.ctaLines, 140);

  // Honesty and emptiness, applied to every string in the object.
  const scan = (s, path) => {
    if (s.trim() === "") {
      add(path, "must not be empty", s, "non-empty");
      return;
    }
    if (s.includes("$")) add(path, 'contains "$"', s, "no $");
    if (s.includes("%")) add(path, 'contains "%"', s, "no %");
    if (s.includes("—")) add(path, "contains an em dash", s, "no em dash");
    const lower = s.toLowerCase().replace(/google guaranteed/g, "");
    for (const phrase of BANNED_PHRASES) {
      if (lower.includes(phrase)) add(path, `contains banned phrase "${phrase}"`, s, "no banned phrases");
    }
    if (/\d[xX]\b/.test(s)) add(path, "contains a multiplier such as 3x", s, "no Nx multipliers");
    for (const word of BRITISH_WORDS) {
      if (new RegExp(`\\b${word}\\b`, "i").test(s)) {
        add(path, `contains British spelling "${word}"`, s, "US English only");
      }
    }
  };
  walkStrings(ind, "", scan);

  return problems;
}

async function main() {
  if (!existsSync(VERTICALS_DIR)) {
    console.log("No industry files yet.");
    return 0;
  }
  const files = readdirSync(VERTICALS_DIR).filter((f) => f.endsWith(".ts")).sort();
  if (files.length === 0) {
    console.log("No industry files yet.");
    return 0;
  }

  const slugArg = process.argv[2];
  let targets = files;
  if (slugArg) {
    const name = `${slugArg}.ts`;
    if (!files.includes(name)) {
      console.log(`${slugArg}: FAIL (file not found: src/data/industries/verticals/${name})`);
      return 1;
    }
    targets = [name];
  }

  let serviceIds;
  try {
    const servicesMod = await import(pathToFileURL(SERVICES_FILE).href);
    serviceIds = new Set(servicesMod.services.map((s) => s.id));
  } catch (err) {
    console.error(`Could not load services.ts: ${err.message.split("\n")[0]}`);
    return 1;
  }

  let failedFiles = 0;
  for (const file of targets) {
    const slug = basename(file, ".ts");
    let problems;
    try {
      const mod = await import(pathToFileURL(join(VERTICALS_DIR, file)).href);
      problems = checkIndustry(slug, mod.default, serviceIds);
    } catch (err) {
      problems = [
        {
          path: "module",
          msg: `failed to load (${err.message.split("\n")[0]})`,
          got: "error",
          limit: "loadable module",
        },
      ];
    }

    for (const p of problems) {
      console.log(`${slug}: ${p.path}: ${p.msg} (got ${fmtGot(p.got)}, limit ${p.limit})`);
    }
    if (problems.length > 0) {
      failedFiles += 1;
      console.log(`${slug}: FAIL (${problems.length} problems)`);
    } else {
      console.log(`${slug}: PASS`);
    }
  }

  return failedFiles > 0 ? 1 : 0;
}

process.exitCode = await main();
