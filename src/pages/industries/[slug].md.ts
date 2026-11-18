/**
 * /industries/<slug>.md — the whole industry page as clean markdown, for AI agents
 * and LLM crawlers. Linked from the page head (<link rel="alternate">) and llms.txt.
 * Generated from the same data file as the HTML page; no HTML in the output.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { industries, type Industry, type IndustryBlock } from "../../data/industries";
import { serviceById } from "../../data/services";
import { SITE_URL } from "../../data/site";
import { inSentence } from "../../components/industry/industry-utils";

export const getStaticPaths: GetStaticPaths = () =>
  industries.map((industry) => ({ params: { slug: industry.slug }, props: { industry } }));

const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const row = (cells: string[]) => `| ${cells.map(cell).join(" | ")} |`;
const table = (head: string[], rows: string[][]) =>
  [row(head), row(head.map(() => "---")), ...rows.map(row)].join("\n");

const serviceLink = (id: string) => {
  const s = serviceById(id);
  return s ? `[${s.name}](${SITE_URL}/services/)` : id;
};

function renderBlock(block: IndustryBlock): string {
  const out: string[] = [`## ${block.heading}`, ""];
  if (block.intro) out.push(block.intro, "");
  switch (block.type) {
    case "pains":
      block.items.forEach((item) => {
        out.push(`### ${item.title}`, "", item.body, "", `What it costs: ${item.cost}`, "");
      });
      break;
    case "lanes": {
      const labels = block.lanes[0]?.rows.map((r) => r.label) ?? [];
      const rows = [
        ["Who", ...block.lanes.map((l) => l.who)],
        ...labels.map((label, i) => [label, ...block.lanes.map((l) => l.rows[i]?.value ?? "")]),
      ];
      out.push(table(["", ...block.lanes.map((l) => l.label)], rows), "");
      break;
    }
    case "flow":
      block.steps.forEach((step, i) => {
        out.push(`${i + 1}. **${step.title}** (${step.label}). ${step.body}`);
      });
      out.push("");
      break;
    case "table":
      out.push(`Table: ${block.caption}`, "", table(block.columns, block.rows), "");
      break;
    case "metrics":
      block.items.forEach((m) => {
        out.push(`**${m.term}**`, `: ${m.definition}`, `: Why it matters: ${m.why}`, "");
      });
      break;
    case "checklist":
      block.groups.forEach((g) => {
        out.push(`### ${g.title}`, "", ...g.items.map((item) => `- [ ] ${item}`), "");
      });
      break;
    case "note":
      block.body.forEach((p) => out.push(p, ""));
      break;
  }
  return out.join("\n");
}

function render(industry: Industry): string {
  const url = `${SITE_URL}/industries/${industry.slug}/`;
  const stage = (id: string) => industry.stages.find((s) => s.id === id)?.label ?? id;
  const lines: string[] = [
    `# ${industry.seo.title}`,
    "",
    `- Page: ${url}`,
    `- Updated: ${industry.updated}`,
    `- For: ${industry.audience}`,
    `- Service: ${industry.seo.serviceType}, provided by MaaxGen (${SITE_URL}/)`,
    "",
    `**${industry.hero.headline[0]} ${industry.hero.headline[1]}**`,
    "",
    industry.seo.serviceSummary,
    "",
    industry.hero.lead,
    "",
    `## ${industry.answer.question}`,
    "",
    industry.answer.answer,
    "",
    ...industry.answer.points.map((p) => `- ${p}`),
    "",
    "## The plays",
    "",
    `${industry.plays.length} problems, each with the fix MaaxGen runs for it. Stages: ${industry.stages
      .map((s) => s.label)
      .join(", ")}.`,
    "",
  ];

  industry.plays.forEach((play) => {
    lines.push(
      `### ${play.num}. ${play.name}`,
      "",
      `- Stage: ${stage(play.stage)}`,
      `- Problem: "${play.problem}"`,
      `- Fix: ${play.headline[0]} ${play.headline[1]}`,
      "",
      play.summary,
      "",
      "What we do:",
      "",
      ...play.whatWeDo.map((w) => `- ${w}`),
      "",
      `Outcome: ${play.outcome}`,
      "",
      `Services: ${play.services.map(serviceLink).join(", ")}`,
      ""
    );
  });

  lines.push(
    `## The ${inSentence(industry.shortName)} stack`,
    "",
    `The services these plays draw on, bundled and run by one partner: ${industry.recommendedServices
      .map(serviceLink)
      .join(", ")}.`,
    ""
  );

  industry.blocks.forEach((block) => lines.push(renderBlock(block)));

  lines.push("## Frequently asked questions", "");
  industry.faqs.forEach((faq) => lines.push(`### ${faq.q}`, "", faq.a, ""));

  lines.push(
    "## How to get a plan",
    "",
    `- Request a plan on the page: ${url}#plan`,
    `  - ${industry.form.heading}. ${industry.form.intro}`,
    `  - The form asks: ${industry.form.qualifier.label} Options: ${industry.form.qualifier.options.join("; ")}.`,
    `- Or contact MaaxGen directly: ${SITE_URL}/contact/`,
    `- Free ad account grader: ${SITE_URL}/ad-account-grader/`,
    "- Typical response: within one business day.",
    "",
    "## Other industries",
    "",
    ...industries
      .filter((i) => i.slug !== industry.slug)
      .map((i) => `- [${i.name}](${SITE_URL}/industries/${i.slug}/): ${i.hubBlurb}`),
    ""
  );

  return lines.join("\n");
}

export const GET: APIRoute = ({ props }) => {
  const { industry } = props as { industry: Industry };
  return new Response(render(industry), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
