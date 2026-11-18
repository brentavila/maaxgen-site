/**
 * Service catalogue for the homepage Service Studio hero.
 *
 * CONTRACT: the ids, nums, names, and categories below are fixed. Other code
 * (ServiceVisual, the studio shell, the shortlist, the plan form) keys off `id`.
 * Copy rules: plain language for SMB owners, no fees, no invented numbers,
 * results, client names, or testimonials.
 */

export type ServiceCategory = "ads" | "search" | "build" | "creative" | "ai";

export interface ServiceCategoryMeta {
  id: ServiceCategory;
  /** Short label for the filter bar. */
  label: string;
}

export interface Service {
  /** Stable kebab-case key. Used in URLs, localStorage, and visual lookup. */
  id: string;
  /** Two-digit display number, "01".."12". */
  num: string;
  /** Card title. */
  name: string;
  category: ServiceCategory;
  /** One line under the card title. Max 60 characters. */
  tagline: string;
  /** Detail headline in two lines. Line two renders in muted italic. Max 22 characters per line. */
  headline: [string, string];
  /** One or two sentences. Max 220 characters. */
  summary: string;
  /** "What you get". Exactly 4 items, max 48 characters each. */
  deliverables: string[];
  /** One sentence on what changes for the business. No numbers. Max 120 characters. */
  outcome: string;
  bestFor: ("local" | "ecommerce")[];
  /** 2 or 3 other service ids that this works best alongside. */
  pairsWith: string[];
  /** The first 30 days in three short steps. Max 40 characters each. */
  firstSteps: [string, string, string];
  /** Lowercase search synonyms a business owner might type. 4 to 8 entries. */
  keywords: string[];
}

export const categories: ServiceCategoryMeta[] = [
  { id: "ads", label: "Ads" },
  { id: "search", label: "Search" },
  { id: "build", label: "Build" },
  { id: "creative", label: "Creative" },
  { id: "ai", label: "AI" },
];

export const services: Service[] = [
  {
    id: "google-ads",
    num: "01",
    name: "Google Ads",
    category: "ads",
    tagline: "Be the business people find when they are ready to buy.",
    headline: ["Spend on the searches", "ready to buy."],
    summary:
      "You are paying for clicks but not sure which ones turn into calls or orders. We run search, Shopping, and Performance Max campaigns and manage them against leads and sales, not traffic.",
    deliverables: [
      "Search, Shopping, or Performance Max setup",
      "Conversion tracking you can trust",
      "Ongoing keyword and budget management",
      "Plain-language reporting on leads and sales",
    ],
    outcome:
      "Your ad budget goes toward searches that bring real customers, and you can see what it produces.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["landing-pages", "ai-follow-up", "crm-automation"],
    firstSteps: [
      "Audit account and tracking",
      "Rebuild campaigns around your goals",
      "Launch, then trim wasted spend",
    ],
    keywords: ["ppc", "adwords", "google", "search ads", "shopping", "performance max", "pmax", "paid search"],
  },
  {
    id: "meta-ads",
    num: "02",
    name: "Meta Ads",
    category: "ads",
    tagline: "Reach people on Facebook and Instagram before they search.",
    headline: ["Get in front of", "people who would buy."],
    summary:
      "Your customers spend time on Facebook and Instagram, but boosting posts has not paid off. We build ads, test creative, and retarget visitors so the right people see your offer more than once.",
    deliverables: [
      "Facebook and Instagram campaign build",
      "Creative testing across hooks and formats",
      "Retargeting for visitors and past customers",
      "Clear monthly reporting and next tests",
    ],
    outcome:
      "You stop guessing which ads work and keep putting budget behind the ones that do.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["video", "images", "landing-pages"],
    firstSteps: [
      "Set up pixel and audiences",
      "Produce first creative round",
      "Launch tests and review early signals",
    ],
    keywords: ["facebook", "instagram", "social ads", "paid social", "retargeting", "meta", "fb ads", "reels"],
  },
  {
    id: "seo",
    num: "03",
    name: "SEO",
    category: "search",
    tagline: "Get found without paying for every click.",
    headline: ["Show up", "when they search."],
    summary:
      "You rely on paid clicks or word of mouth, and people searching for what you sell are not finding you. We fix technical problems, build useful content, and work to get you found in Google and AI answers.",
    deliverables: [
      "Technical SEO audit and fixes",
      "Keyword plan built around buying intent",
      "New and improved pages and articles",
      "Structure that AI answer tools can read",
    ],
    outcome:
      "You become easier to find for the searches that matter to your business, with steady work behind it.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["websites", "local-seo", "google-ads"],
    firstSteps: [
      "Audit site and current rankings",
      "Fix the biggest technical issues",
      "Publish first priority pages",
    ],
    keywords: ["search engine optimization", "organic", "rankings", "google ranking", "blog", "content", "ai search", "aeo"],
  },
  {
    id: "local-seo",
    num: "04",
    name: "Local SEO",
    category: "search",
    tagline: "Win the map results in your own neighborhood.",
    headline: ["The first name", "people see nearby."],
    summary:
      "When someone searches near me, the map decides who gets the call. We tune your Google Business Profile, build reviews, and create service pages for each area you cover.",
    deliverables: [
      "Google Business Profile cleanup and upkeep",
      "Review request and reply system",
      "Service pages for each area you serve",
      "Consistent listings across key directories",
    ],
    outcome:
      "Your profile, reviews, and local pages work together to make you easier to find in map results.",
    bestFor: ["local"],
    pairsWith: ["websites", "ai-follow-up", "seo"],
    firstSteps: [
      "Audit profile, listings, and reviews",
      "Fix profile and start review requests",
      "Launch first local service pages",
    ],
    keywords: ["google business profile", "gbp", "map pack", "google maps", "near me", "reviews", "citations", "google my business"],
  },
  {
    id: "websites",
    num: "05",
    name: "Websites",
    category: "build",
    tagline: "A fast site that turns visitors into inquiries or orders.",
    headline: ["A site that", "works as hard as you."],
    summary:
      "An old or slow site quietly costs you customers. We design and build a clear, fast website with one job: help the right visitor call, book, or buy.",
    deliverables: [
      "Custom design on desktop and mobile",
      "Fast build with clean, editable pages",
      "Forms, calls, and checkout set up to convert",
      "Basic SEO and tracking built in",
    ],
    outcome:
      "Your website stops being a brochure and becomes the place most of your new customers start.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["seo", "landing-pages", "crm-automation"],
    firstSteps: [
      "Plan pages, goals, and message",
      "Design and review key pages",
      "Build, test, and launch",
    ],
    keywords: ["web design", "website design", "web development", "shopify", "wordpress", "redesign", "new site", "ecommerce store"],
  },
  {
    id: "apps",
    num: "06",
    name: "Apps",
    category: "build",
    tagline: "Custom tools built around how your business runs.",
    headline: ["Software", "shaped around you."],
    summary:
      "Off the shelf tools never quite fit, so your team works around them. We build custom web and mobile apps and internal tools that match the way you actually operate.",
    deliverables: [
      "Scoping session and simple prototype",
      "Custom web or mobile app build",
      "Internal dashboards and staff tools",
      "Launch support and handover training",
    ],
    outcome:
      "Work that lived in spreadsheets and group texts moves into one tool your team actually uses.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["crm-automation", "websites", "ai-follow-up"],
    firstSteps: [
      "Map the process you want to fix",
      "Prototype the core screens",
      "Build and test with your team",
    ],
    keywords: ["mobile app", "web app", "custom software", "internal tool", "dashboard", "portal", "ios", "android"],
  },
  {
    id: "landing-pages",
    num: "07",
    name: "Landing pages",
    category: "build",
    tagline: "Pages that match your ad and ask for one thing.",
    headline: ["One ad, one page,", "one clear next step."],
    summary:
      "Sending ad traffic to your homepage wastes the click. We build a focused page for each campaign, match it to the ad, and test changes so more visitors take action.",
    deliverables: [
      "Campaign pages matched to each ad",
      "Clear offer, proof, and call to action",
      "Form or booking setup with tracking",
      "Conversion tests on headline and layout",
    ],
    outcome:
      "More of the people your ads pay to reach actually call, book, or buy.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["google-ads", "meta-ads", "ai-follow-up"],
    firstSteps: [
      "Review ads and current page",
      "Build and launch the first page",
      "Start the first test",
    ],
    keywords: ["lp", "funnel", "conversion", "cro", "a/b test", "lead page", "squeeze page", "sales page"],
  },
  {
    id: "video",
    num: "08",
    name: "Video",
    category: "creative",
    tagline: "Short video that earns attention and explains your offer.",
    headline: ["Stop the scroll,", "then tell the story."],
    summary:
      "Video gets noticed, but filming it can feel like a project of its own. We produce ad and social video, using AI-assisted tools where they save time, with a person reviewing every cut.",
    deliverables: [
      "Scripts and storyboards for each video",
      "Ad and social cuts in several formats",
      "Editing, captions, and motion graphics",
      "AI-assisted footage, reviewed by our team",
    ],
    outcome:
      "You have a steady supply of fresh video for ads and social without running a production yourself.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["meta-ads", "music-audio", "landing-pages"],
    firstSteps: [
      "Agree on message and formats",
      "Script and storyboard first videos",
      "Produce, review, and deliver",
    ],
    keywords: ["video ads", "reels", "tiktok", "youtube", "commercial", "ugc", "editing", "ai video"],
  },
  {
    id: "images",
    num: "09",
    name: "Images",
    category: "creative",
    tagline: "Ad and product images that look like a real brand.",
    headline: ["Pictures that", "do the selling."],
    summary:
      "Weak photos make good products look ordinary. We create ad creative, product and brand imagery, and use AI-generated images where they fit, always reviewed and edited by a person.",
    deliverables: [
      "Ad creative sets in every needed size",
      "Product and lifestyle imagery",
      "AI-generated images, checked for quality",
      "Brand-consistent templates you can reuse",
    ],
    outcome:
      "Your ads, site, and listings look consistent and credible, and you always have fresh creative to test.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["meta-ads", "google-ads", "websites"],
    firstSteps: [
      "Review brand and product needs",
      "Draft first creative round",
      "Refine and deliver the full set",
    ],
    keywords: ["photos", "graphics", "design", "product photos", "ad creative", "ai images", "banners", "photography"],
  },
  {
    id: "music-audio",
    num: "10",
    name: "Music and audio",
    category: "creative",
    tagline: "A sound that makes your ads and videos feel finished.",
    headline: ["Give your brand", "a sound people recall."],
    summary:
      "Video without good audio feels cheap. We make original music, jingles, voiceover, and sound for your ads and videos, including AI-generated music, with a person shaping the final result.",
    deliverables: [
      "Original music or jingle for your brand",
      "Voiceover for ads and videos",
      "Sound mixing and cleanup",
      "Short and long cuts for each platform",
    ],
    outcome:
      "Your ads sound like one brand, with music and voice made for you and reusable across campaigns.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["video", "meta-ads", "google-ads"],
    firstSteps: [
      "Define brand tone and references",
      "Draft music and voiceover options",
      "Revise, mix, and deliver",
    ],
    keywords: ["jingle", "voiceover", "voice over", "radio", "podcast", "ai music", "sound", "soundtrack"],
  },
  {
    id: "ai-follow-up",
    num: "11",
    name: "AI follow-up",
    category: "ai",
    tagline: "Reply to every new lead right away, even after hours.",
    headline: ["Answer every lead", "before they move on."],
    summary:
      "Most leads go to whoever replies first, and you cannot always pick up. We set up instant replies, missed-call text back, and AI chat and booking, with your rules and a handoff to your team.",
    deliverables: [
      "Instant text and email replies to new leads",
      "Missed-call text back",
      "AI chat and booking on your site",
      "Handoff rules so a person steps in",
    ],
    outcome:
      "Leads hear back right away and more of them end up booked instead of lost.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["crm-automation", "google-ads", "local-seo"],
    firstSteps: [
      "Map how leads arrive today",
      "Write replies and set the rules",
      "Test with your team, then go live",
    ],
    keywords: ["chatbot", "chat bot", "text back", "missed call", "auto reply", "sms", "answering", "booking"],
  },
  {
    id: "crm-automation",
    num: "12",
    name: "CRM and automation",
    category: "ai",
    tagline: "One home for every lead, with reminders that run themselves.",
    headline: ["Nothing slips", "through the cracks."],
    summary:
      "Leads live in inboxes, notes, and memory, so follow-up gets missed. We set up a CRM with pipelines, reminders, and workflows that connect your tools and keep every lead moving.",
    deliverables: [
      "CRM setup with a clear sales pipeline",
      "Automatic reminders and task assignment",
      "Workflows linking forms, ads, and calendars",
      "Simple reports on where leads stand",
    ],
    outcome:
      "You always know who needs a reply next, and follow-up happens without anyone remembering to do it.",
    bestFor: ["local", "ecommerce"],
    pairsWith: ["ai-follow-up", "google-ads", "websites"],
    firstSteps: [
      "Map your lead and sales process",
      "Build pipeline and core workflows",
      "Connect tools and train your team",
    ],
    keywords: ["crm", "gohighlevel", "ghl", "pipeline", "workflow", "zapier", "email automation", "follow up"],
  },
];

export const serviceById = (id: string): Service | undefined =>
  services.find((service) => service.id === id);
