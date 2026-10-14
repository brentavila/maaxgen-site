export interface AgentSpec {
  name: string;
  /** The tool the owner would actually run it in. */
  tool: string;
  does: string;
  saves: string;
}

export interface WorkflowSpec {
  title: string;
  detail: string;
}

export interface Playbook {
  id: string;
  /** Chip label shown in the prompt bar. */
  chip: string;
  /** How the agent refers to the business in replies. */
  label: string;
  audience: "local" | "ecommerce";
  keywords: string[];
  /** The one-line reality check the agent opens with. */
  hook: string;
  agents: [AgentSpec, AgentSpec, AgentSpec];
  adWorkflows: WorkflowSpec[];
  visibilityFix: string;
}

export const PLAYBOOKS: Playbook[] = [
  {
    id: "med-spa",
    chip: "I own a Med Spa",
    label: "med spa",
    audience: "local",
    keywords: ["med spa", "medspa", "medical spa", "aesthetic", "botox", "filler", "laser", "injectables", "skin clinic", "dermatology", "cosmetic", "spa"],
    hook: "When someone asks ChatGPT for the best med spa nearby, it answers from reviews, treatment menus, and published pricing. If yours says “consultation required” on every service, you are not in that answer.",
    agents: [
      {
        name: "Treatment content agent",
        tool: "ChatGPT Dot",
        does: "Turns one before-and-after photo set and your notes into a week of Instagram captions, a Google Business post, and an email to lapsed clients, in your voice and within medical advertising rules.",
        saves: "4 to 5 hours a week",
      },
      {
        name: "Rebooking and reviews agent",
        tool: "Meta Muse + your booking system",
        does: "Watches completed appointments, drafts the two-week follow-up text, nudges a review at the right moment, and flags anyone due for a maintenance visit.",
        saves: "the front desk's Friday afternoon",
      },
      {
        name: "Consult concierge",
        tool: "AI voice + SMS line",
        does: "Answers the phone when the room is busy, quotes starting-at pricing, books the consult, and sends a prep text, including when an agent like Instinct is the one calling.",
        saves: "the 30 percent of calls that go to voicemail",
      },
    ],
    adWorkflows: [
      {
        title: "Booked-consult conversion signal",
        detail: "Fire the real conversion when a consult is booked, not when a form is filled, and send show-rate and treatment value back to Meta through the Conversions API so Advantage+ finds people who actually buy.",
      },
      {
        title: "Service-line retargeting",
        detail: "Separate audiences by treatment interest so a laser visitor never sees a Botox offer, and let the platform optimize toward lifetime value instead of cheap leads.",
      },
    ],
    visibilityFix: "Publish a structured treatment menu with starting-at prices and MedicalBusiness schema, so AI engines can quote you instead of skipping you.",
  },
  {
    id: "shopify",
    chip: "I run a Shopify store",
    label: "Shopify store",
    audience: "ecommerce",
    keywords: ["shopify", "ecommerce", "e-commerce", "online store", "store", "shop", "products", "dtc", "d2c", "brand", "woocommerce", "amazon", "etsy", "catalog", "sell online", "merch"],
    hook: "Instinct now searches Shopify merchants and checks out through Shop Pay without a human ever seeing your homepage. It buys from the store whose product data is cleanest, not the one with the best banner.",
    agents: [
      {
        name: "Catalog and launch agent",
        tool: "ChatGPT Dot",
        does: "Writes product descriptions, alt text, and FAQ blocks from your supplier sheet, drafts the launch email and three ad angles per product, and keeps tone consistent across the catalog.",
        saves: "a full day per product drop",
      },
      {
        name: "Customer service agent",
        tool: "Meta Muse + Gorgias or Shopify Inbox",
        does: "Answers where-is-my-order, size, and return questions from your policies and tracking data, drafts replies for anything sensitive, and escalates refunds to you with a one-line summary.",
        saves: "10 hours a week of inbox",
      },
      {
        name: "Merchandising analyst",
        tool: "ChatGPT Dot on your Shopify and ad data",
        does: "Every Monday morning: which SKUs are winning by margin, which ads are buying low-value customers, and which products deserve more spend this week, with reasoning.",
        saves: "the spreadsheet morning",
      },
    ],
    adWorkflows: [
      {
        title: "Margin-aware conversion feed",
        detail: "Send purchase events with real contribution margin and new-versus-returning flags through the Conversions API so Advantage+ and PMax optimize for profit, not blended ROAS.",
      },
      {
        title: "Agent-ready product feed",
        detail: "Clean titles, GTINs, availability, shipping, and return terms in the product feed and Product schema, because shopping agents compare that, not your photography.",
      },
    ],
    visibilityFix: "Make every product page machine-legible with Product and Offer schema, visible pricing and shipping, and no CAPTCHA between an agent and checkout.",
  },
  {
    id: "home-services",
    chip: "I run a Home Services company",
    label: "home services company",
    audience: "local",
    keywords: ["home service", "hvac", "plumb", "roof", "electric", "contractor", "landscap", "cleaning", "pest", "painting", "remodel", "handyman", "garage", "solar", "moving", "pool", "lawn", "tree"],
    hook: "Agents like Instinct now phone local businesses to book appointments and negotiate quotes. A “call for a quote” wall and an unanswered line is how they end up booking the company down the street.",
    agents: [
      {
        name: "Dispatcher agent",
        tool: "AI voice + SMS line",
        does: "Answers every call and text in under a minute, collects the job details and photos, quotes your starting-at ranges, and books the window straight into your schedule, 24 hours a day.",
        saves: "the leads you lose after 5 p.m.",
      },
      {
        name: "Estimate and follow-up agent",
        tool: "ChatGPT Dot + your field software",
        does: "Drafts the written estimate from the tech's notes, sends the follow-up sequence until the customer decides, and asks for the review and the referral the day the job closes.",
        saves: "3 hours of evening admin a day",
      },
      {
        name: "Local content agent",
        tool: "Meta Muse",
        does: "Turns each completed job into a Google Business post, a neighborhood-level service page update, and a short seasonal reminder to past customers.",
        saves: "the marketing you never get to",
      },
    ],
    adWorkflows: [
      {
        title: "Booked-job conversion signal",
        detail: "Track calls, forms, and texts through to booked and completed jobs, then import closed revenue back to Google and Meta so the algorithms stop optimizing for tire-kickers.",
      },
      {
        title: "Service-area intent campaigns",
        detail: "Split search and Local Services campaigns by service and neighborhood, protect branded demand, and let revenue data decide the budget each week.",
      },
    ],
    visibilityFix: "Publish starting-at pricing, service areas, and hours in HomeAndConstructionBusiness schema, and keep review velocity steady so AI engines trust you enough to recommend you.",
  },
  {
    id: "dental-health",
    chip: "I run a dental or health practice",
    label: "practice",
    audience: "local",
    keywords: ["dental", "dentist", "orthodont", "chiro", "physical therapy", "clinic", "doctor", "practice", "optometr", "vet", "veterinar", "therapist", "counsel", "mental health", "pediatric", "urgent care", "medical"],
    hook: "Patients ask AI “who takes my insurance and can see me this week.” If your site cannot answer that in a machine-readable way, the AI answers with a competitor who can.",
    agents: [
      {
        name: "Patient scheduling agent",
        tool: "AI voice + SMS line",
        does: "Answers the phone during the rush, checks insurance questions against your list, books new-patient visits, and runs the reminder and reschedule sequence so chairs stay full.",
        saves: "no-show gaps and hold music",
      },
      {
        name: "Patient education agent",
        tool: "ChatGPT Dot",
        does: "Drafts procedure explainers, post-visit instructions, recall emails, and monthly posts in plain language, reviewed by you before anything is published.",
        saves: "4 hours a week",
      },
      {
        name: "Reputation agent",
        tool: "Meta Muse",
        does: "Requests reviews at the right moment, drafts compliant responses to every review, and flags sentiment changes before they show up in your new-patient numbers.",
        saves: "the awkward review conversations",
      },
    ],
    adWorkflows: [
      {
        title: "New-patient appointment signal",
        detail: "Make booked and kept new-patient appointments the conversion event, with service line attached, and send it server-side so iOS privacy settings stop hiding half your results.",
      },
      {
        title: "Service-line search campaigns",
        detail: "Separate implants, Invisalign, and emergency visits into their own campaigns and budgets, judged on appointments and production, not clicks.",
      },
    ],
    visibilityFix: "Add Dentist or MedicalBusiness schema with accepted insurance, services, and hours, and publish a clear new-patient page so AI engines can answer the two questions patients ask.",
  },
  {
    id: "restaurant",
    chip: "I own a restaurant",
    label: "restaurant",
    audience: "local",
    keywords: ["restaurant", "cafe", "coffee", "bar", "bakery", "catering", "food", "pizza", "taco", "kitchen", "brewery", "diner", "bistro", "hospitality"],
    hook: "Diners now ask AI “where should we eat tonight that takes a party of six.” That answer comes from your menu, hours, reviews, and whether a reservation can be made without a phone call.",
    agents: [
      {
        name: "Reservation and inquiry agent",
        tool: "AI voice + SMS line",
        does: "Answers calls during service, takes reservations and catering inquiries, confirms large parties, and texts directions and parking so the host stand stays on the floor.",
        saves: "every call that rings out at 7 p.m.",
      },
      {
        name: "Menu and social agent",
        tool: "Meta Muse",
        does: "Turns the weekly specials and a few phone photos into posts, Google Business updates, and a short email to regulars, scheduled for the hours people decide where to eat.",
        saves: "3 hours a week",
      },
      {
        name: "Guest feedback agent",
        tool: "ChatGPT Dot",
        does: "Reads every review and feedback form, drafts replies in your voice, and gives you a Monday summary of what guests loved and what to fix.",
        saves: "the Sunday review scroll",
      },
    ],
    adWorkflows: [
      {
        title: "Reservation and order signal",
        detail: "Track reservations, online orders, and catering requests as conversions by campaign, and protect branded local search demand from being bought twice.",
      },
      {
        title: "Occasion-based local campaigns",
        detail: "Date night, groups, and catering each get their own audience and creative, with budget following covers and order value rather than reach.",
      },
    ],
    visibilityFix: "Publish the full menu with prices in Restaurant and Menu schema, keep hours exact, and make reservations bookable online so an agent can finish the job.",
  },
  {
    id: "professional-services",
    chip: "I run a professional services firm",
    label: "firm",
    audience: "local",
    keywords: ["law", "lawyer", "attorney", "legal", "accounting", "accountant", "cpa", "bookkeep", "insurance", "financial", "advisor", "real estate", "realtor", "mortgage", "consult", "agency", "firm", "architect"],
    hook: "Prospects ask AI to shortlist firms before they ever call one. The shortlist is built from case types, published fee structures, and third-party proof, not from the stock photo on your homepage.",
    agents: [
      {
        name: "Intake agent",
        tool: "AI voice + SMS + your CRM",
        does: "Answers every inquiry in under a minute, asks the qualifying questions you would ask, books the consultation, and sends the intake form before the call.",
        saves: "the leads that go to the next firm on the list",
      },
      {
        name: "Thought leadership agent",
        tool: "ChatGPT Dot",
        does: "Turns one recorded conversation a week into an article, a LinkedIn post series, and a client email, with citations and your review before publishing.",
        saves: "the content you keep meaning to write",
      },
      {
        name: "Client follow-up agent",
        tool: "Meta Muse",
        does: "Keeps every open proposal moving with timed, personal follow-ups, and asks for the review and referral when a matter closes.",
        saves: "the pipeline you forget to chase",
      },
    ],
    adWorkflows: [
      {
        title: "Qualified-consultation signal",
        detail: "Separate qualified consultations from raw inquiries in your CRM and send only the qualified ones back to Google and Meta as conversions, so the platforms learn what a real client looks like.",
      },
      {
        title: "Case-type search campaigns",
        detail: "One campaign per practice area with its own landing page, fee clarity, and proof, judged on signed clients rather than form fills.",
      },
    ],
    visibilityFix: "Publish practice areas, fee structures, and credentials in LegalService or ProfessionalService schema, and build citations from authoritative directories AI engines already trust.",
  },
  {
    id: "fitness",
    chip: "I run a gym or studio",
    label: "studio",
    audience: "local",
    keywords: ["gym", "fitness", "studio", "yoga", "pilates", "crossfit", "martial arts", "boxing", "dance", "personal train", "wellness", "salon", "barber", "nail"],
    hook: "People ask AI for “a class I can book tonight near me.” If your schedule and pricing are only in an app or behind a phone call, the AI books them somewhere else.",
    agents: [
      {
        name: "Trial and membership agent",
        tool: "AI voice + SMS line",
        does: "Answers questions about classes, pricing, and schedules, books trial sessions, and runs the first-week follow-up that turns trials into members.",
        saves: "the front desk between classes",
      },
      {
        name: "Member retention agent",
        tool: "Meta Muse + your booking system",
        does: "Spots members whose attendance drops, sends the right nudge, celebrates milestones, and drafts the win-back for anyone who cancels.",
        saves: "the churn you only notice at renewal",
      },
      {
        name: "Class content agent",
        tool: "ChatGPT Dot",
        does: "Turns the weekly schedule and instructor notes into posts, a newsletter, and class descriptions that a search engine or AI assistant can actually read.",
        saves: "3 hours a week",
      },
    ],
    adWorkflows: [
      {
        title: "Trial-to-member signal",
        detail: "Track trial bookings through to paid memberships and send membership value back to the ad platforms so they find people who stay, not people who click.",
      },
      {
        title: "Schedule-aware local campaigns",
        detail: "Promote the classes with open spots to the neighborhoods that attend them, with budget following retained members.",
      },
    ],
    visibilityFix: "Publish class schedules and pricing in structured data with online booking, so an agent can book the trial without a phone call.",
  },
];

export const DEFAULT_LOCAL_ID = "home-services";
export const DEFAULT_ECOMMERCE_ID = "shopify";

const ECOMMERCE_HINTS = /\b(online|ship|shipping|order|orders|cart|checkout|sku|wholesale|subscription|dtc|d2c|marketplace)\b/i;

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

export interface MatchResult {
  playbook: Playbook;
  /** True when the match came from keywords rather than a fallback. */
  confident: boolean;
}

/**
 * Pick the closest playbook for a free-text description. Longer keyword matches win
 * (so "medical spa" beats "medical"), and e-commerce language falls back to the store
 * playbook instead of the local default.
 */
export function matchPlaybook(text: string): MatchResult {
  const haystack = ` ${normalize(text)} `;
  let best: { playbook: Playbook; score: number } | null = null;

  for (const playbook of PLAYBOOKS) {
    let score = 0;
    for (const keyword of playbook.keywords) {
      const needle = normalize(keyword);
      if (!needle) continue;
      if (haystack.includes(` ${needle}`) || haystack.includes(`${needle} `) || haystack.includes(needle)) {
        score += needle.length + (needle.includes(" ") ? 4 : 0);
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { playbook, score };
  }

  if (best) return { playbook: best.playbook, confident: true };

  const fallbackId = ECOMMERCE_HINTS.test(text) ? DEFAULT_ECOMMERCE_ID : DEFAULT_LOCAL_ID;
  return { playbook: PLAYBOOKS.find((item) => item.id === fallbackId)!, confident: false };
}

export function playbookById(id: string): Playbook | undefined {
  return PLAYBOOKS.find((item) => item.id === id);
}
