import type { Industry } from "../types";

const industry: Industry = {
  slug: "garage-door-companies",
  priority: 1,
  name: "Garage door companies",
  shortName: "Garage door",
  audience: "garage door company owners and managers",
  updated: "2026-11-17",

  seo: {
    title: "Garage door company marketing that books jobs",
    description:
      "Marketing for garage door repair and installation companies: answer emergency calls, keep ads in your service area, and track which ads book jobs.",
    serviceType: "Garage door company marketing",
    keywords: [
      "garage door company marketing",
      "garage door repair marketing",
      "garage door Google Ads",
      "garage door Local Services Ads",
      "garage door leads",
      "garage door company website",
      "garage door SEO",
      "garage door call tracking",
    ],
    serviceSummary:
      "MaaxGen plans and runs Google Ads, landing pages, call tracking, AI follow-up, and review requests for garage door repair and installation companies.",
  },

  hero: {
    kicker: "Marketing for garage door companies",
    headline: ["Answer the broken spring.", "Win the new door."],
    lead:
      "A snapped spring calls at 7pm and you are at dinner. That job goes to whoever answers. We build the ads, call handling, and follow-up so more calls become booked jobs.",
    ctaLabel: "Get a garage door plan",
    reassurance: "One partner for ads, pages, follow-up, and reviews. No long pitch.",
  },

  answer: {
    question: "How do garage door companies get more booked jobs?",
    answer:
      "Garage door companies get more booked jobs by answering every call, including after hours, keeping ads inside the service area, sending emergency searches to a tap-to-call page, and tracking which ads produce booked jobs instead of just calls. New door estimates then need a steady follow-up that does not depend on memory.",
    points: [
      "Emergency repairs are decided on the phone, so a missed call usually goes to the next listing.",
      "Ads should be judged on booked jobs, not clicks or raw call counts.",
      "Keep spend inside the area your trucks actually cover.",
      "New door and opener estimates need follow-up, because the decision takes days.",
    ],
  },

  stages: [
    { id: "get-the-call", label: "Get the call" },
    { id: "book-the-job", label: "Book the job" },
    { id: "sell-the-door", label: "Sell the door" },
    { id: "earn-reviews", label: "Earn reviews" },
  ],

  plays: [
    {
      id: "after-hours-emergency",
      num: "01",
      name: "Answer every emergency call",
      stage: "get-the-call",
      problem: "A snapped spring calls at 7pm and you are at dinner.",
      headline: ["Pick up, or text", "back in seconds."],
      summary:
        "A customer with a car stuck in the garage calls the first company that answers. If your phone rings out, the next listing gets the job. We set up missed-call text back and after-hours handling so no emergency goes cold.",
      whatWeDo: [
        "Missed-call text back that starts the booking",
        "After-hours replies with your own rules",
        "Questions that sort emergency from routine",
        "Handoff to dispatch or the on-call tech",
      ],
      outcome:
        "Fewer emergency calls fall through, and dispatch starts the morning with real jobs waiting.",
      services: ["ai-follow-up", "crm-automation"],
      visual: { kind: "industry", id: "gd-emergency" },
    },
    {
      id: "service-area-ads",
      num: "02",
      name: "Keep ads in your area",
      stage: "get-the-call",
      problem: "You pay for clicks from towns your trucks never reach.",
      headline: ["Spend where", "your trucks go."],
      summary:
        "Clicks from outside your service area cost money and tie up your phone. We tighten locations, add exclusions, and review the search terms so budget stays inside the zones you actually serve.",
      whatWeDo: [
        "Service-area targeting built from your zones",
        "Location exclusions for towns you skip",
        "Search term reviews to cut wasted clicks",
        "Local Services Ads and search ads run together",
      ],
      outcome:
        "More of your ad budget reaches homeowners you can reach the same day.",
      services: ["google-ads"],
      visual: { kind: "industry", id: "gd-service-area" },
    },
    {
      id: "tap-to-call-page",
      num: "03",
      name: "Tap-to-call emergency pages",
      stage: "get-the-call",
      problem: "Emergency searches land on a slow homepage with no phone button.",
      headline: ["One search,", "one tap to call."],
      summary:
        "Someone with a door off its track is on a phone, in a hurry. We build a fast page for each repair search with the phone number up top, your service area, and a simple form for after hours.",
      whatWeDo: [
        "Mobile-first pages for spring and track repairs",
        "Tap-to-call button and call tracking built in",
        "Service area and arrival promise stated plainly",
        "Separate pages for repair and replacement",
      ],
      outcome:
        "An emergency click turns into a call faster, because the page asks for one thing.",
      services: ["landing-pages", "websites"],
      visual: { kind: "service", id: "landing-pages" },
    },
    {
      id: "booked-job-tracking",
      num: "04",
      name: "Tie every ad to a booked job",
      stage: "book-the-job",
      problem: "You see calls, but not which ads booked a truck roll.",
      headline: ["Count booked jobs,", "not just calls."],
      summary:
        "Wrong numbers and price shoppers count as calls too. We track calls by source, record the outcome in a CRM, and send booked jobs back to Google so your budget follows the ads that fill the schedule.",
      whatWeDo: [
        "Call tracking by ad, search, and page",
        "Pipeline from call to booked to completed",
        "Booked jobs sent back to Google Ads",
        "Plain reports that dispatch can also read",
      ],
      outcome:
        "You can see which campaigns book jobs and move budget away from the ones that only ring the phone.",
      services: ["crm-automation", "google-ads"],
      visual: { kind: "service", id: "crm-automation" },
    },
    {
      id: "estimate-follow-up",
      num: "05",
      name: "Follow up door estimates",
      stage: "sell-the-door",
      problem: "You quote a new door and never hear back.",
      headline: ["Quotes that get", "a second look."],
      summary:
        "A new door is a big purchase, and the homeowner is comparing two or three quotes. We set up follow-up texts and emails with photos, financing questions answered, and a reminder for your estimator.",
      whatWeDo: [
        "Text and email follow-up after every estimate",
        "Photo and style options sent with the quote",
        "Estimator reminders for open quotes",
        "Pipeline view of open and lost estimates",
      ],
      outcome:
        "Fewer door and opener quotes go quiet, and your estimator knows who to call next.",
      services: ["ai-follow-up", "crm-automation"],
      visual: { kind: "service", id: "ai-follow-up" },
    },
    {
      id: "reviews-and-map",
      num: "06",
      name: "Ask every job for a review",
      stage: "earn-reviews",
      problem: "The competitor with more reviews shows up first.",
      headline: ["Be the name", "on the map."],
      summary:
        "Reviews and a complete Google Business Profile affect who shows in map results and in Local Services Ads. We build a simple review request after every job and clean up your profile and service area pages.",
      whatWeDo: [
        "Review request sent after each completed job",
        "Replies to reviews drafted for your approval",
        "Business Profile cleanup for a service-area business",
        "Service pages for each town you cover",
      ],
      outcome:
        "Each finished job builds your reputation, so you look like the safer call next time.",
      services: ["local-seo"],
      visual: { kind: "service", id: "local-seo" },
    },
  ],

  recommendedServices: ["google-ads", "landing-pages", "ai-follow-up", "crm-automation", "local-seo"],

  blocks: [
    {
      id: "repair-vs-install",
      type: "lanes",
      eyebrow: "Two businesses, one phone",
      heading: "Why emergency repair and new door sales need different marketing",
      intro:
        "Emergency repair and new door installs sell to different people in different moods. Marketing that treats them as one business wastes money on both.",
      tone: "light",
      lanes: [
        {
          label: "Emergency repair",
          who: "A homeowner with a broken spring, an off-track door, or a car stuck inside.",
          rows: [
            { label: "Who is calling", value: "Someone stuck right now, often at night or on a weekend." },
            { label: "What they search", value: "Garage door repair near me, broken spring, door stuck open." },
            { label: "How fast they decide", value: "Minutes. They call the first credible company that answers." },
            { label: "What reaches them", value: "Local Services Ads, search ads, the map pack, and your reviews." },
            { label: "What the page or call must do", value: "Get answered fast, confirm you cover the address, and book a truck." },
          ],
        },
        {
          label: "New door and opener install",
          who: "A homeowner replacing an old door, chasing curb appeal, or preparing to sell.",
          rows: [
            { label: "Who is calling", value: "Someone planning, comparing two or three companies." },
            { label: "What they search", value: "New garage doors, door styles, opener replacement, cost to replace." },
            { label: "How fast they decide", value: "Days or weeks, and often after talking with a partner." },
            { label: "What reaches them", value: "Search, your website gallery, reviews, retargeting, and follow-up." },
            { label: "What the page or call must do", value: "Show style and photos, answer financing, and book an in-home estimate." },
          ],
        },
      ],
    },
    {
      id: "where-calls-leak",
      type: "pains",
      eyebrow: "Where calls leak",
      heading: "Why are my garage door ads producing calls but not booked jobs?",
      intro:
        "Calls that do not turn into booked jobs usually leak at one of a few places: the ad, the page, the phone, or the follow-up.",
      tone: "surface",
      items: [
        {
          title: "Clicks from outside your service area",
          body: "Your ads reach towns you do not serve, so callers ask and then hang up.",
          cost: "Budget and phone time spent on jobs you cannot take.",
        },
        {
          title: "Emergency searches sent to the homepage",
          body: "A person with a broken door must hunt for the number on a slow page.",
          cost: "Clicks you paid for that never turn into a call.",
        },
        {
          title: "Lead resellers and national brands on your searches",
          body: "Lead-generation brands and resellers bid on the same repair searches, and sometimes on your company name.",
          cost: "Higher click costs and customers who think they called you.",
        },
        {
          title: "No call tracking",
          body: "Without it you cannot tell a booked spring repair from a wrong number.",
          cost: "Budget stays with campaigns that only ring the phone.",
        },
        {
          title: "Door estimates that never get a follow-up",
          body: "The quote goes out, the estimator moves on, and the homeowner signs with the company that called back.",
          cost: "High-ticket jobs lost after you did the work to earn them.",
        },
      ],
    },
    {
      id: "after-hours-call",
      type: "flow",
      eyebrow: "After-hours calls",
      heading: "What happens when a customer calls your garage door company at night?",
      intro:
        "At night, one of two things happens: the call is handled, or the customer dials the next company. This is the sequence we build so it is handled.",
      tone: "dark",
      steps: [
        {
          label: "Step 1",
          title: "The call rings out or goes to voicemail",
          body: "Most people will not leave a message when a car is stuck in the garage.",
        },
        {
          label: "Step 2",
          title: "A text goes out within seconds",
          body: "It uses your wording: you reached the right company, tell us what happened and the address.",
        },
        {
          label: "Step 3",
          title: "The customer answers a few questions",
          body: "Is the door stuck, is a car inside, is the spring snapped, what is the address, and are you in our area.",
        },
        {
          label: "Step 4",
          title: "Emergency goes to the on-call tech",
          body: "Your rules decide who is alerted. Routine requests wait for the morning schedule.",
        },
        {
          label: "Step 5",
          title: "Dispatch sees the job at open",
          body: "The conversation, the address, and the ad source are in the CRM, not on a sticky note.",
        },
      ],
    },
    {
      id: "paid-channels",
      type: "table",
      eyebrow: "Where calls come from",
      heading: "Local Services Ads, search ads, or the map: where should I spend?",
      intro:
        "Most garage door companies need more than one source of calls, because each one catches a different customer. Here is how they differ.",
      tone: "light",
      caption: "How the main call sources for a garage door company differ",
      columns: ["Source", "How you pay", "Best at", "Watch for"],
      rows: [
        [
          "Local Services Ads",
          "Per lead",
          "Emergency repair searches, with the Google Verified badge",
          "Reviews and how fast you answer affect ranking",
        ],
        [
          "Google search ads",
          "Per click",
          "Specific searches such as broken spring and new door cost",
          "Clicks from outside your area, and weak landing pages",
        ],
        [
          "Map pack and Business Profile",
          "No ad cost",
          "Near me searches, trust, and steady calls",
          "Hidden addresses make service area setup and reviews matter more",
        ],
        [
          "Brand search ads",
          "Per click",
          "Protecting your name from resellers and competitors",
          "Check first whether anyone is actually bidding on your name",
        ],
        [
          "Facebook and Instagram ads",
          "Per click or view",
          "Door styles, curb appeal, and retargeting visitors",
          "Slower decision than a repair call, so follow-up matters",
        ],
      ],
    },
    {
      id: "numbers-that-matter",
      type: "metrics",
      eyebrow: "What to measure",
      heading: "Which numbers show whether garage door marketing is working?",
      intro:
        "The numbers that matter are the ones tied to booked work. Clicks and call counts alone can look good while the schedule stays thin.",
      tone: "surface",
      items: [
        {
          term: "Booked jobs",
          definition: "Calls and forms that ended with a scheduled visit or an accepted estimate.",
          why: "It is the number that fills trucks. Raw calls include wrong numbers and shoppers.",
        },
        {
          term: "Cost per booked job",
          definition: "Ad spend divided by booked jobs, not by clicks or calls.",
          why: "It shows which campaigns earn their budget, and which only ring the phone.",
        },
        {
          term: "Answer rate",
          definition: "The share of calls a person or your system answered, including after hours.",
          why: "Every unanswered emergency call is likely to go to a competitor.",
        },
        {
          term: "Average ticket, repair versus install",
          definition: "What a typical repair brings in compared with a new door or opener.",
          why: "The two are different businesses, so judge their ad budgets separately.",
        },
        {
          term: "Estimate close rate",
          definition: "How many in-home door and opener estimates turn into signed jobs.",
          why: "It tells you whether the problem is lead flow or follow-up.",
        },
        {
          term: "Technician capacity by day",
          definition: "How many jobs your trucks can take on a given day.",
          why: "Ads can lean in when trucks are idle and ease off when the schedule is full.",
        },
      ],
    },
  ],

  faqs: [
    {
      q: "Should I use Local Services Ads or regular Google search ads?",
      a: "Most garage door companies benefit from both, because they catch customers differently. Local Services Ads charge per lead and show the Google Verified badge, which suits emergency repair. Search ads give you control over the exact searches, pages, and locations, which suits new door and opener work. We run them together and judge each by booked jobs.",
    },
    {
      q: "Should I bid on my own company name?",
      a: "Sometimes. If a competitor, a national brand, or a lead reseller is bidding on your name and showing above you, a small brand campaign can protect those calls. If nobody is, you may be paying for clicks you would get anyway. We check who is actually appearing for your name first, then decide.",
    },
    {
      q: "How do I stop paying for calls from outside my service area?",
      a: "You tighten location targeting to the zones you actually serve, exclude the towns you skip, and review the search terms regularly. Callers from outside your area also waste phone time, so the address should be qualified early. Local Services Ads let you set service areas too, and those need checking, not just setting once.",
    },
    {
      q: "How can I tell which ads produce booked jobs and not just calls?",
      a: "You need call tracking that records the source of each call, and a CRM where someone marks the outcome: booked, completed, wrong number, or lost. Booked jobs can then be sent back to Google Ads. Without that link, your reports show activity, not whether the schedule is filling.",
    },
    {
      q: "What can I do about after-hours and missed calls?",
      a: "You can set up missed-call text back and after-hours handling with your own rules. The system replies within seconds, asks what happened and the address, and sorts emergencies from routine requests. Emergencies alert your on-call tech. Everything else waits for dispatch in the morning, with the details already logged.",
    },
    {
      q: "Do I need a new website before we start?",
      a: "Not always. Many garage door companies get more from fast repair and replacement landing pages than from a full redesign. We look at your current site, ad pages, and mobile experience first. If the site holds you back, we say so and rebuild it. If it works, we leave it alone.",
    },
    {
      q: "How is this different from buying leads from a lead reseller?",
      a: "With a lead reseller you rent customers that were often sent to several companies. Here, the ads, the pages, and the tracking are set up for your business, and the customer is calling you. You keep your call history, reviews, and data, instead of depending on a list someone else controls.",
    },
    {
      q: "How long before this is working?",
      a: "It depends on your market, budget, and what is broken now. Fixing call handling and tracking can show effects quickly. Map rankings and reviews build more slowly. We cannot honestly promise a date. We set up tracking first so you can see progress in booked jobs as it happens.",
    },
    {
      q: "What does a garage door marketing agency do?",
      a: "A garage door marketing agency handles how repair and door customers find you and what happens when they call: search and Local Services Ads, pages that load fast on a phone, call handling, and follow-up on estimates. MaaxGen runs Google Ads, landing pages, call tracking, AI follow-up, and review requests, and reports on booked jobs instead of clicks.",
    },
    {
      q: "How do I choose a marketing agency for my garage door company?",
      a: "Choose an agency that reports on booked jobs instead of clicks or raw calls, that explains who owns the ad accounts and call records, that names the person you will talk to, and that has a plan for after-hours calls and open estimates. MaaxGen is built around those points: you keep your call history and data, and follow-up is part of the work.",
    },
  ],

  ctaLines: [
    "Want to know where your calls leak? We review your ads, calls, and follow-up and tell you plainly.",
    "Want these numbers tied to your own schedule? Get a garage door plan and we set up tracking first.",
  ],

  form: {
    heading: "Tell us how your calls come in",
    intro:
      "Share your service area and what hurts most. We review your ads, calls, and follow-up, and tell you plainly where jobs are leaking.",
    qualifier: {
      label: "What do you need most right now?",
      options: [
        "More emergency repair calls",
        "More new door and opener sales",
        "Stop paying for out-of-area clicks",
        "Track which ads book jobs",
        "Answer after-hours and missed calls",
        "Not sure yet",
      ],
    },
    businessType: "local",
    submitLabel: "Get my garage door plan",
    notePlaceholder: "Your service area, how calls are answered now, and what hurts most",
  },

  hubBlurb:
    "Answer emergency calls fast, keep ads in your service area, and follow up every new door estimate.",
};

export default industry;
