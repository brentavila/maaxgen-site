import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { industries } from "../data/industries";
import { services } from "../data/services";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../data/site";

const link = (title: string, path: string, note?: string) =>
  `- [${title}](${SITE_URL}${path})${note ? `: ${note}` : ""}`;

export const GET: APIRoute = async () => {
  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} is a marketing, advertising, and AI agency for small local and e-commerce businesses. It bundles strategy, creative, paid media, websites, follow-up, and practical AI under one accountable partner.`,
    "",
    "## Core pages",
    link("Home", "/", "Overview of the service studio and how the bundled system works."),
    link("Services", "/services/", "One connected growth system spanning strategy, creative, paid media, websites, follow-up, and practical AI."),
    link("About", "/about/", "About MaaxGen, a bundled marketing, advertising, and AI agency for local and e-commerce SMBs."),
    link("Engagements", "/pricing/", "Compare MaaxGen engagement levels for connected strategy, creative, advertising, follow-up, and AI services."),
    link("Contact", "/contact/", "Start a focused strategy conversation."),
    "",
    "## Services",
    ...services.map((s) => link(s.name, "/services/", s.tagline)),
  ];

  if (industries.length > 0) {
    lines.push(
      "",
      "## Industries",
      link("All industries", "/industries/", "Marketing for the industries MaaxGen serves."),
      ...industries.flatMap((i) => [
        link(i.name, `/industries/${i.slug}/`, `${i.hubBlurb} (Markdown version: ${SITE_URL}/industries/${i.slug}.md)`),
        `  ${i.seo.serviceSummary}`,
      ]),
    );
  }

  const posts = (await getCollection("blog")).filter((p) => !p.data.draft);
  const studies = await getCollection("caseStudies");
  lines.push(
    "",
    "## Resources",
    link("Ad account grader", "/ad-account-grader/", "Five plain-language questions that return a practical grade for ad account measurement, ownership, and optimization readiness."),
    link("Blog", "/blog/", "Practical field notes on growth strategy, advertising, conversion, and useful AI."),
    ...posts.map((p) => link(p.data.title, `/blog/${p.id}/`, p.data.description)),
    link("Case studies", "/case-studies/", "Illustrative examples, not client results, showing how strategy, creative, paid media, and practical AI work together."),
    ...studies.map((s) =>
      link(s.data.title, `/case-studies/${s.id}/`, `${s.data.summary} (illustrative example, not a client result)`),
    ),
    "",
    "## Contact",
    link("Contact MaaxGen", "/contact/", "Start a focused strategy conversation."),
    "",
  );

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
