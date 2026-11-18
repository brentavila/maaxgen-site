import type { Industry } from "../types";

const industry: Industry = {
  slug: "law-firms",
  priority: 5,
  name: "Law firms",
  shortName: "Law firms",
  audience: "managing partners, owners, and administrators of solo, small, and mid-sized consumer-facing law firms",
  updated: "2026-11-17",

  seo: {
    title: "Law firm marketing for signed matters, not leads",
    description:
      "Marketing for small and mid-sized law firms: intake that responds first, search spend aimed at the right matters, and reporting on cost per signed matter.",
    serviceType: "Law firm marketing",
    keywords: [
      "law firm marketing",
      "how to get more signed cases for a law firm",
      "law firm intake automation",
      "law firm google ads",
      "local services ads for lawyers",
      "personal injury law firm marketing",
      "cost per signed case",
      "law firm after hours intake",
      "attorney marketing agency",
      "law firm seo",
    ],
    serviceSummary:
      "MaaxGen plans and runs Google Ads, local search, practice-area pages, AI intake follow-up, and CRM reporting for small and mid-sized law firms, with attorney review of all advertising.",
  },

  hero: {
    kicker: "Marketing for law firms",
    headline: ["Spend on matters you sign,","not on inquiries."],
    lead:
      "Calls hit voicemail and web forms wait until morning, and the person in trouble has already called the next firm. We help your firm answer first, reach the right matters, and show which marketing produced a signed engagement.",
    ctaLabel: "Get a firm growth plan",
    reassurance: "Your responsible attorney reviews and approves all advertising.",
  },

  answer: {
    question: "How do small law firms get more signed clients from marketing?",
    answer:
      "Small firms sign more matters by aiming search spend at the practice areas and locations they actually take, responding to every inquiry within minutes including evenings, and measuring cost per signed matter instead of leads. The firm's responsible attorney approves all advertising and intake wording. MaaxGen builds and manages those pieces together.",
    points: [
      "A lead is not a case. Judge marketing by signed matters of the right type.",
      "People in a legal problem contact several firms and tend to retain the one that responds first.",
      "Broad matches burn expensive clicks on the wrong practice area, county, or free-advice seekers.",
      "Intake tools collect firm-approved details and hand off to a person. They never give legal advice.",
    ],
  },

  stages: [
    { id: "found", label: "Be found" },
    { id: "screen", label: "Screen inquiry" },
    { id: "consult", label: "Book consults" },
    { id: "sign", label: "Sign matters" },
  ],

  plays: [
    {
      id: "intake-first-response",
      num: "01",
      name: "Respond to inquiries first",
      stage: "screen",
      problem: "Calls hit voicemail and web forms wait until the next morning.",
      headline: ["Be the firm that", "answers first."],
      summary:
        "A person in a legal problem often reaches out at night or on a weekend, and contacts several firms. We reply at once with your approved wording, ask your screening questions, and hand the person to your team.",
      whatWeDo: [
        "Text back missed calls and web inquiries at once",
        "Ask the screening questions your firm sets",
        "Cover evenings and weekends, then hand off to staff",
        "Keep replies free of legal advice, as you approve",
      ],
      outcome:
        "People hear back while they are still choosing a firm, and your intake staff start the day with sorted files.",
      services: ["ai-follow-up", "crm-automation"],
      visual: { kind: "industry", id: "law-intake" },
    },
    {
      id: "signed-matter-reporting",
      num: "02",
      name: "Count signed matters",
      stage: "sign",
      problem: "My vendor reports leads, but I cannot tell how many signed.",
      headline: ["Report on matters", "signed, not leads."],
      summary:
        "Inquiries, qualified inquiries, and signed matters are three different numbers. We track each inquiry by source and practice area through to the engagement, so budget follows the matters that actually sign.",
      whatWeDo: [
        "Track calls and forms by source and practice area",
        "Build one matter pipeline from inquiry to signed",
        "Mark outcomes with your staff, not guesses",
        "Report cost per signed matter by practice area",
      ],
      outcome:
        "You can see which channels bring signed matters and move money away from the ones that only bring phone calls.",
      services: ["crm-automation", "google-ads"],
      visual: { kind: "industry", id: "law-pipeline" },
    },
    {
      id: "stop-wasted-clicks",
      num: "03",
      name: "Stop paying for wrong clicks",
      stage: "screen",
      problem: "We pay for calls from other states and cases we do not take.",
      headline: ["Spend only on matters", "you can take."],
      summary:
        "Legal search is expensive per click, so a broad match to the wrong practice area, county, or free-advice searcher burns real money. We narrow the account to what you take and send each campaign to a matching page.",
      whatWeDo: [
        "Build campaigns per practice area and location",
        "Block searches for matters and places you decline",
        "Send each ad to a page for that practice area",
        "Review search terms with you for waste each month",
      ],
      outcome:
        "More of the budget lands on people in your area with the kind of matter you take.",
      services: ["google-ads", "landing-pages"],
      visual: { kind: "service", id: "google-ads", query: "dui lawyer near me" },
    },
    {
      id: "local-search-and-lsa",
      num: "04",
      name: "Show up on the map and LSA",
      stage: "found",
      problem: "Competitors show above us on the map and in Local Services Ads.",
      headline: ["Be the firm people", "see nearby."],
      summary:
        "Google Local Services Ads, the map pack, and your Business Profile all lean on reviews and responsiveness. We tidy your profile, build a steady review habit, and manage the ad side so you are seen when someone searches nearby.",
      whatWeDo: [
        "Fix profile categories, services, hours, and photos",
        "Set up review requests your attorneys approve",
        "Draft review replies that protect client privacy",
        "Manage Local Services Ads alongside search ads",
      ],
      outcome:
        "Your profile, reviews, and response speed work together, so more nearby people see your firm first.",
      services: ["local-seo", "google-ads"],
      visual: { kind: "service", id: "local-seo" },
    },
    {
      id: "practice-area-content",
      num: "05",
      name: "Publish pages that explain",
      stage: "found",
      problem: "Our site reads like a brochure and the practice pages are thin.",
      headline: ["Explain the matter", "before they call."],
      summary:
        "People search a situation, then ask an AI assistant. We plan practice-area and location pages with clear, accurate explanations and one clear next step. Drafts go to your attorneys for review and approval before anything is published.",
      whatWeDo: [
        "Plan pages per practice area and location",
        "Draft plain explanations for attorney review",
        "Add attorney profiles and clear contact steps",
        "Structure pages so AI answers can quote them",
      ],
      outcome:
        "The right people find accurate pages from your firm, and they reach out already knowing what you handle.",
      services: ["seo", "websites"],
      visual: { kind: "service", id: "seo" },
    },
    {
      id: "consult-show-rate",
      num: "06",
      name: "Keep booked consults",
      stage: "consult",
      problem: "We book consultations and then half the time nobody shows.",
      headline: ["Turn bookings", "into consultations."],
      summary:
        "A booked consultation that does not happen is intake time already spent. We confirm each booking, remind by text and email, make rescheduling easy, and follow up with people who go quiet before they sign.",
      whatWeDo: [
        "Confirm every booking by text and email",
        "Send reminders with what to bring, as you set it",
        "Offer one-tap rescheduling for missed consults",
        "Follow up with people who have not yet signed",
      ],
      outcome:
        "More booked consultations actually happen, and fewer good matters drift away after the first conversation.",
      services: ["crm-automation", "ai-follow-up"],
      visual: { kind: "service", id: "crm-automation" },
    },
  ],

  recommendedServices: [
    "google-ads",
    "ai-follow-up",
    "crm-automation",
    "local-seo",
    "landing-pages",
  ],

  blocks: [
    {
      id: "where-firms-lose-matters",
      type: "pains",
      eyebrow: "Where firms leak",
      heading: "Where do law firms lose matters they already paid to attract?",
      intro:
        "Most losses happen after the click: in the first response, in screening, and in reporting that counts inquiries instead of signed engagements.",
      tone: "light",
      items: [
        {
          title: "The first response comes too late",
          body: "The call rolls to voicemail at 7pm and the form is answered the next morning. By then the person has spoken to two other firms and may already have retained one.",
          cost: "Matters you paid to attract, won by whoever picked up.",
        },
        {
          title: "Clicks come from the wrong place or matter",
          body: "A broad match sends calls from another state, another practice area, or people who want free advice. Each one still costs a legal-sized click and staff time.",
          cost: "Ad spend and screening hours on inquiries you cannot take.",
        },
        {
          title: "Your vendor reports leads, not signed matters",
          body: "A monthly report with a lead count says nothing about how many were viable, how many consulted, or how many signed. You cannot fix a number you never see.",
          cost: "Budget that stays on channels that do not sign.",
        },
        {
          title: "Intake staff are overwhelmed",
          body: "Paralegals and receptionists answer calls, screen out-of-scope inquiries, and chase no-shows between other work. Quality drops when volume rises.",
          cost: "Attorney and staff time spent on files that were never viable.",
        },
        {
          title: "The site is a brochure",
          body: "Thin practice-area pages, no clear next step, and few recent reviews give a worried visitor little reason to pick up the phone before trying the next firm.",
          cost: "Visitors who read your name and leave.",
        },
      ],
    },
    {
      id: "inquiry-journey",
      type: "flow",
      eyebrow: "What happens to an inquiry",
      heading: "What happens to a legal inquiry from first contact to a signed engagement?",
      intro:
        "A well-run inquiry gets an immediate, careful reply, a short screen set by your firm, a handoff to a person, and a booked consultation with reminders. No step gives legal advice.",
      tone: "dark",
      steps: [
        {
          label: "First contact",
          title: "Reply right away, at any hour",
          body: "A call, form, chat, or Google lead gets an immediate acknowledgment in your approved wording. After hours, it says when a person will follow up and what to do in an emergency, as your firm decides.",
        },
        {
          label: "Screen",
          title: "Ask only the questions your firm sets",
          body: "The tool asks your approved screening questions: practice area, location, and timing. It collects details and nothing more. It does not assess the matter, predict outcomes, or imply that an attorney-client relationship exists.",
        },
        {
          label: "Sort",
          title: "Separate viable from out of scope",
          body: "Inquiries outside your practice area or jurisdiction are routed to a polite reply you approve, which can point the person to a referral resource if your firm wants that. Likely matches go to your intake team with the details attached.",
        },
        {
          label: "Handoff",
          title: "A person takes over",
          body: "Urgent or sensitive inquiries alert your intake staff or attorney by text or call. Conflict checks and any decision to take the matter stay with your firm. Nothing is automatic past this point.",
        },
        {
          label: "Consultation",
          title: "Book it and protect it",
          body: "The person picks a time from your calendar. Confirmations and reminders go out by text and email, with what to bring as you set it, and a missed consultation gets a prompt chance to reschedule.",
        },
        {
          label: "Engagement",
          title: "Record what happened",
          body: "Your staff mark the outcome: consulted, signed, declined, or referred out. That outcome returns to the report, so the next dollar goes where signed matters come from.",
        },
      ],
    },
    {
      id: "urgent-vs-planned",
      type: "lanes",
      eyebrow: "Practice areas differ",
      heading: "Should marketing for urgent and planned practice areas be the same?",
      intro:
        "No. An arrest, an injury, or a custody emergency is searched under pressure and decided fast. Estate planning or business formation is planned and compared. Budget, pages, and intake should differ.",
      tone: "surface",
      lanes: [
        {
          label: "Urgent matters",
          who: "Arrests, injuries, custody emergencies, immigration deadlines",
          rows: [
            { label: "How they search", value: "A situation and a place, often at night, on a phone" },
            { label: "What decides it", value: "Who answers first and sounds steady" },
            { label: "Page they need", value: "A clear call and text option above the fold" },
            { label: "Intake focus", value: "Immediate reply, fast handoff, after-hours coverage" },
          ],
        },
        {
          label: "Planned matters",
          who: "Estate planning, business formation, uncontested filings",
          rows: [
            { label: "How they search", value: "A service by name, compared across several firms" },
            { label: "What decides it", value: "Clear explanation, reviews, and a low-pressure first step" },
            { label: "Page they need", value: "A plain guide with a booking option, not only a phone number" },
            { label: "Intake focus", value: "Scheduled consultations, reminders, steady follow-up" },
          ],
        },
        {
          label: "Contingent-fee matters",
          who: "Injury, employment, and similar matters with few high-value files",
          rows: [
            { label: "How they search", value: "A situation, sometimes weeks after the event" },
            { label: "What decides it", value: "Responsiveness and how the person felt heard" },
            { label: "Page they need", value: "A page per matter type with a clear next step" },
            { label: "Intake focus", value: "Careful screening, since each file carries real cost" },
          ],
        },
      ],
    },
    {
      id: "cost-per-signed-matter",
      type: "metrics",
      eyebrow: "The scoreboard",
      heading: "What numbers should a law firm track to judge its marketing?",
      intro:
        "Track cost per signed matter by practice area, with the steps before it. Lead counts and click costs are inputs, not results.",
      tone: "light",
      items: [
        {
          term: "Cost per signed matter",
          definition:
            "Marketing spend for a practice area divided by the number of matters signed from it in the same period.",
          why: "It is the figure that matters. Compare it to what a matter of that type is worth to the firm, by practice area, not as one blended number.",
        },
        {
          term: "Qualified-inquiry rate",
          definition:
            "The share of inquiries that are in your practice area, your jurisdiction, and in time to act on.",
          why: "A low rate points to targeting waste, such as broad keywords or unclear pages, before it points to an intake problem.",
        },
        {
          term: "Speed to first response",
          definition:
            "How long it takes from a person's first contact to a real reply, measured separately for business hours and after hours.",
          why: "People contact several firms at once. Slow replies lose matters that the ad already paid for.",
        },
        {
          term: "Consultation show rate",
          definition:
            "The share of booked consultations where the person actually attends.",
          why: "A no-show wastes intake time and a slot on the calendar. Reminders and easy rescheduling protect it.",
        },
        {
          term: "Signed rate",
          definition:
            "The share of consultations that end in a signed engagement.",
          why: "It shows whether the right people are reaching you and whether the consult itself is working. It reflects attorney judgment, so read it with the team.",
        },
        {
          term: "Referral sources",
          definition:
            "Where signed matters came from, including past clients, other attorneys, and professionals.",
          why: "Referrals often sign well. Seeing them next to paid sources stops the firm from crediting ads for work word of mouth won.",
        },
      ],
    },
    {
      id: "advertising-rules",
      type: "note",
      eyebrow: "Advertising and professional rules",
      heading: "Who approves law firm advertising, and does it follow advertising rules?",
      intro:
        "Your firm's responsible attorney approves all advertising and intake wording. MaaxGen is a marketing agency, not a law firm, and does not give legal or ethics advice.",
      tone: "dark",
      body: [
        "Lawyer advertising is governed by rules of professional conduct that differ by state, and sometimes by bar or court. We do not tell you what your jurisdiction requires. Common themes include that communications must be truthful and not misleading, that results cannot be promised, and that care is needed with testimonials and statements about past results. Some places restrict words such as specialist or expert, or require particular disclaimers. Your attorney knows what applies to your firm. We build the process around that decision rather than around our own reading of the rules.",
        "In practice: we draft ads, pages, review replies, and intake wording, and send them to your designated attorney for review before they go live. We do not publish claims about results, and we flag testimonials, comparisons, and credential language for your attorney to decide. We keep a written record of what was approved and when, so changes are traceable. Any wording your attorney changes or removes stays that way.",
        "Intake tools are limited on purpose. They do not give legal advice, assess a case, or suggest that an attorney-client relationship has formed. They collect only firm-approved details, tell people when a person will follow up, and hand off to your staff. Conflict checks and every decision to take a matter stay with your firm. Responsibility for your firm's compliance remains with the firm, and we will always say so plainly.",
      ],
    },
  ],

  faqs: [
    {
      q: "Is your marketing compliant with my state bar's advertising rules?",
      a: "We cannot tell you that, because MaaxGen is a marketing agency and does not give legal or ethics advice. Your firm's responsible attorney decides what complies. We send every ad, page, review reply, and intake script to that attorney for approval before it goes live, keep a record of what was approved, and flag testimonials and credential language for a decision. Compliance stays with your firm.",
    },
    {
      q: "Should we use Local Services Ads or Google search ads?",
      a: "Many firms use both, because they work differently. Local Services Ads are pay-per-lead listings that can carry the Google Verified badge and lean on reviews and responsiveness. Search ads let you choose practice areas, locations, and wording. We look at the matters you want, how each performs against signed cases, and shift budget accordingly. Neither is better for every firm or every practice area.",
    },
    {
      q: "How do we stop paying for inquiries we cannot take?",
      a: "You narrow what the ads can match and review what they actually matched. That means campaigns per practice area and location, blocked searches for matters and places you decline, a page that states what you handle, and a monthly review of the search terms that triggered clicks. Screening questions also keep staff from spending time on out-of-scope inquiries that still get through.",
    },
    {
      q: "Is an AI assistant on our website safe for a law firm?",
      a: "It can be if it is limited by design. Ours does not give legal advice, assess a matter, or suggest that an attorney-client relationship exists. It collects the screening details your firm approves, tells the person when someone will follow up, and hands off to your staff. Your attorney reviews its wording before launch, and urgent or sensitive inquiries go to a person right away.",
    },
    {
      q: "How are inquiries handled after hours and on weekends?",
      a: "Every inquiry gets an immediate reply in your approved wording, even at night. It acknowledges the person, asks the screening questions you set, says when your team will follow up, and shows what to do in an emergency if your firm wants that. Urgent matters can alert your on-call person by text or call. A person handles everything beyond the screen.",
    },
    {
      q: "How will we know which marketing produces signed matters?",
      a: "We track each inquiry by source and practice area through to its outcome, with your staff marking whether it consulted, signed, declined, or referred out. That lets us report cost per signed matter, not leads. It depends on that outcome data being entered, so we agree early on who records it and how, and we review the numbers with you monthly.",
    },
    {
      q: "Do we need new practice-area content, and who writes and approves it?",
      a: "Probably, if your practice pages are thin or read like a brochure. We plan the pages, draft plain explanations, and add clear next steps. Your attorneys review and approve every page before it is published, and they own the legal accuracy. Clear, accurate pages written by your firm are also more likely to be quoted by search and AI assistants.",
    },
    {
      q: "How is confidential information in inquiries handled?",
      a: "Carefully, and with limits. We design intake to collect only the details your firm decides it needs, and not to ask for sensitive facts early. Where possible, information is handled inside the firm's own systems instead of scattered across tools. The specifics depend on your setup, so we confirm exactly what is collected, where it goes, and who can see it on a call before launch.",
    },
    {
      q: "What does a law firm marketing agency do?",
      a: "A law firm marketing agency handles how people with a legal problem find your firm and what happens when they reach out: search ads, local listings, practice-area pages, intake follow-up, and reporting. MaaxGen runs Google Ads, local search, landing pages, AI intake follow-up, and CRM reporting, with your attorney approving all advertising. We are not a law firm and do not give legal advice.",
    },
    {
      q: "How do I choose a marketing agency for my law firm?",
      a: "Choose an agency that reports on signed matters instead of clicks or inquiries, sends all ads and intake wording to your attorney before they go live, explains who owns the ad accounts and records, and has a plan for fast, after-hours intake. MaaxGen is built around those points, and compliance with your jurisdiction's rules stays with your firm.",
    },
  ],

  ctaLines: [
    "Want to see where inquiries stall in your firm's intake? We walk through it with you and tell you plainly.",
    "Your attorney approves every ad and intake script. Ask us how that review would work for your firm.",
  ],

  form: {
    heading: "Tell us about your firm",
    intro:
      "Share what you need most and we will come back with a plan for your intake, your search spend, and your reporting. A person reads every request.",
    qualifier: {
      label: "What do you need most right now?",
      options: [
        "More signed matters of the right type",
        "Stop paying for inquiries we cannot take",
        "Faster response, including after hours",
        "Know which marketing signs matters",
        "Better practice-area pages and reviews",
        "Not sure yet",
      ],
    },
    businessType: "local",
    submitLabel: "Request my firm plan",
    notePlaceholder: "Practice areas, where inquiries come from, and how intake works today",
    noteHint: "Please do not include client names or confidential matter details.",
  },

  hubBlurb:
    "For small and mid-sized firms: fast intake, search spend aimed at matters you take, and reporting on signed matters, with attorney review.",
};

export default industry;
