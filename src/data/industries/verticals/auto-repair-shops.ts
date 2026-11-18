import type { Industry } from "../types";

const industry: Industry = {
  slug: "auto-repair-shops",
  priority: 2,
  name: "Auto repair shops",
  shortName: "Auto repair",
  audience: "independent auto repair shop owners and service managers",
  updated: "2026-11-17",

  seo: {
    title: "Auto repair shop marketing that fills the bays",
    description:
      "Marketing for independent auto repair shops: map visibility, call and appointment follow-up, and declined-work recovery, judged by car count and ARO.",
    serviceType: "Auto repair shop marketing",
    keywords: [
      "auto repair shop marketing",
      "how to get more customers for an auto repair shop",
      "mechanic shop marketing",
      "auto repair google business profile",
      "auto repair google ads",
      "declined work follow up auto shop",
      "increase average repair order",
      "auto repair shop SEO",
      "independent repair shop marketing agency",
    ],
    serviceSummary:
      "MaaxGen plans and runs local SEO, Google Ads, landing pages, AI follow-up, and CRM automation for independent auto repair shops and their service managers.",
  },

  hero: {
    kicker: "Marketing for independent repair shops",
    headline: ["Fill the bays with work", "worth the lift time."],
    lead:
      "A slow Tuesday cannot be made up on Friday, and the phone rolls to voicemail while advisors are at the counter. We help your shop get found, answer every call, and win back repairs you already quoted.",
    ctaLabel: "Get a shop growth plan",
    reassurance: "Plain reporting on car count and repair orders, not clicks.",
  },

  answer: {
    question: "How do independent auto repair shops get more profitable customers?",
    answer:
      "Independent shops grow by showing up in map results when a driver searches a symptom, answering every call and appointment request, and following up on declined work already sitting in the shop system. Judge it by car count, average repair order, and bay utilization, not clicks. MaaxGen builds and manages those pieces together.",
    points: [
      "Drivers search the problem and the map first, so your profile and service pages decide most first visits.",
      "A missed call is a lost repair order, because the caller dials the next shop.",
      "Declined and deferred work is revenue you already quoted, and text follow-up can bring it back.",
      "Measure car count, ARO, and bay utilization. Calls and clicks do not pay the techs.",
    ],
  },

  stages: [
    { id: "found", label: "Get found" },
    { id: "fill", label: "Fill the bays" },
    { id: "ticket", label: "Raise the ARO" },
    { id: "back", label: "Win them back" },
  ],

  plays: [
    {
      id: "fill-open-bay-time",
      num: "01",
      name: "Fill open bay time",
      stage: "fill",
      problem: "The schedule has holes on slow days and is jammed on others.",
      headline: ["Fill the slow days", "with the right jobs."],
      summary:
        "Technician hours are your inventory, and an empty bay on Tuesday is gone for good. We aim ads and offers at the days and the kinds of work that have room, and ease off when the schedule is full.",
      whatWeDo: [
        "Plan ad budget around your open bay hours",
        "Target diagnostics and repairs, not coupon hunters",
        "Pause or throttle spend when the week is booked",
        "Match each campaign to a page that books the visit",
      ],
      outcome:
        "Ad money goes toward the days and jobs you can use, instead of piling work onto days that are already full.",
      services: ["google-ads", "landing-pages"],
      visual: { kind: "industry", id: "auto-bays" },
    },
    {
      id: "declined-work-follow-up",
      num: "02",
      name: "Recover declined work",
      stage: "back",
      problem: "Customers decline work on the inspection and never hear from us.",
      headline: ["Quote it once,", "follow up properly."],
      summary:
        "Your inspections already list the brakes, tires, and fluids that customers put off. We set up text and email follow-up tied to the vehicle and the finding, so deferred work gets a real second chance.",
      whatWeDo: [
        "Sort declined work by safety and urgency",
        "Send text and email reminders that name the repair",
        "Offer one-tap booking from the message",
        "Hand replies to your advisor when a person is needed",
      ],
      outcome:
        "Work you already quoted gets asked about again without an advisor chasing every customer by phone.",
      services: ["crm-automation", "ai-follow-up"],
      visual: { kind: "industry", id: "auto-followup" },
    },
    {
      id: "win-the-map",
      num: "03",
      name: "Win the map search",
      stage: "found",
      problem: "Great reviews, but a shop with fewer reviews ranks above us.",
      headline: ["Be the first shop", "on the map."],
      summary:
        "Reviews alone do not carry the map. Categories, services, photos, and thin local pages hold shops back. We tune your Google Business Profile, answer reviews, and build pages for your services and areas.",
      whatWeDo: [
        "Fix categories, services, hours, and profile photos",
        "Set up steady review requests after each pickup",
        "Draft review replies for your approval",
        "Build service pages for each area you cover",
      ],
      outcome:
        "Your profile, reviews, and local pages work together, so more nearby drivers find you first.",
      services: ["local-seo", "seo"],
      visual: { kind: "service", id: "local-seo" },
    },
    {
      id: "answer-every-call",
      num: "04",
      name: "Answer every call",
      stage: "fill",
      problem: "Advisors are at the counter and the phone rolls to voicemail.",
      headline: ["Never lose a call", "to the next shop."],
      summary:
        "A driver with a warning light calls three shops and books the first one that answers. We text back missed calls, reply to appointment requests right away, and hand the conversation to your advisor.",
      whatWeDo: [
        "Text back every missed call with a booking link",
        "Reply instantly to web and Google requests",
        "Offer after-hours chat that books appointments",
        "Set clear rules for when your advisor steps in",
      ],
      outcome:
        "Callers hear back while they are still choosing a shop, and your advisors stop living on the phone.",
      services: ["ai-follow-up"],
      visual: { kind: "service", id: "ai-follow-up" },
    },
    {
      id: "specialty-campaigns",
      num: "05",
      name: "Win the higher-ticket jobs",
      stage: "ticket",
      problem: "We want brakes, European, and diesel work, not just oil changes.",
      headline: ["Advertise the jobs", "you want to do."],
      summary:
        "Drivers search the problem and the make, not auto repair. We build campaigns and pages for diagnostics, brakes, suspension, and your specialties, so the customers who arrive come in for larger repair orders.",
      whatWeDo: [
        "Build campaigns around symptoms and makes you fix",
        "Create a page for each specialty and major job",
        "Keep discount-only keywords out of the account",
        "Add fleet and commercial pages and outreach",
      ],
      outcome:
        "More of your new customers arrive with the kind of work that raises your average repair order.",
      services: ["google-ads", "landing-pages", "websites"],
      visual: { kind: "service", id: "google-ads", query: "brake grinding bmw" },
    },
    {
      id: "tie-ads-to-repair-orders",
      num: "06",
      name: "Tie ads to repair orders",
      stage: "ticket",
      problem: "I cannot tell which ads brought in actual repair orders.",
      headline: ["Know which ad", "paid for the lift."],
      summary:
        "Calls and form fills do not tell you which marketing produced paid work. We track calls, requests, and bookings in one place and match them to what your shop reports, so spending follows repair orders.",
      whatWeDo: [
        "Track calls, forms, and bookings by source",
        "Set up one pipeline from lead to completed repair",
        "Review lead outcomes with you each month",
        "Report on car count and ARO in plain terms",
      ],
      outcome:
        "You see which sources bring paying customers and move budget away from the ones that only bring calls.",
      services: ["crm-automation", "google-ads"],
      visual: { kind: "service", id: "crm-automation" },
    },
  ],

  recommendedServices: [
    "local-seo",
    "google-ads",
    "ai-follow-up",
    "crm-automation",
    "landing-pages",
  ],

  blocks: [
    {
      id: "scoreboard",
      type: "metrics",
      eyebrow: "The scoreboard",
      heading: "How should an auto repair shop measure its marketing?",
      intro:
        "Measure it against car count, average repair order, and bay utilization. Calls and clicks are the wrong scoreboard, because a busy phone can still mean an empty, cheap schedule.",
      tone: "dark",
      items: [
        {
          term: "Car count",
          definition:
            "The number of vehicles that come through your bays in a given period, split into new and returning customers.",
          why: "New customers show whether marketing is reaching people. Returning customers show whether the shop is keeping them. Total count hides both.",
        },
        {
          term: "Average repair order (ARO)",
          definition:
            "The average dollar value of a completed repair order, total sales divided by the number of orders.",
          why: "More cars of the wrong kind lower it. Specialty and diagnostic work, and inspection follow-up, raise it. Judge a campaign by the ARO it brings in, not only the volume.",
        },
        {
          term: "Bay utilization",
          definition:
            "The share of your bay and technician hours that are booked with paid work.",
          why: "Hours are fixed and cannot be stored. Marketing should fill the open hours and stay quiet when they are full, which no click report will tell you.",
        },
        {
          term: "Appointment show rate",
          definition:
            "The share of booked appointments where the customer actually arrives.",
          why: "A booking that does not show leaves a bay empty. Reminders and fast confirmation protect the schedule you already filled.",
        },
        {
          term: "Declined-work recovery",
          definition:
            "How much of the work customers declined or deferred is later sold and completed.",
          why: "It is revenue you have already quoted, with no ad cost to win the customer. It is often the cheapest growth in the shop.",
        },
      ],
    },
    {
      id: "kinds-of-work",
      type: "table",
      eyebrow: "How drivers search",
      heading: "How do customers search for each kind of auto repair?",
      intro:
        "Customers look for maintenance by price and convenience, and for hard problems by symptom and make. Each kind of work needs its own page, ad, and follow-up.",
      tone: "light",
      caption: "Kinds of repair work, how customers look for them, and what the shop should show",
      columns: ["Kind of work", "How the customer searches", "What the shop should show"],
      rows: [
        [
          "Maintenance (oil, tires, inspection)",
          "Near me, by price and how fast they can fit it in",
          "Easy online booking and a clear next-open time",
        ],
        [
          "Diagnostics (check engine light, noises)",
          "By symptom, when something feels wrong",
          "A page for each symptom, fast reply, honest process",
        ],
        [
          "Brakes and suspension",
          "By the sound or the feel, often urgent",
          "Same-week availability and a clear explanation of the check",
        ],
        [
          "Specialty (European, diesel, hybrid, transmission)",
          "By make or system plus repair, from farther away",
          "A dedicated page, technician credentials, relevant photos",
        ],
        [
          "Fleet and commercial",
          "By referral, direct outreach, and local business search",
          "A fleet page, priority scheduling, and a contact for accounts",
        ],
      ],
    },
    {
      id: "declined-work-flow",
      type: "flow",
      eyebrow: "Declined work",
      heading: "What happens to declined work after the customer leaves?",
      intro:
        "Today, usually nothing. A better path keeps the finding, the vehicle, and the reason attached to the customer and reminds them without pressure.",
      tone: "surface",
      steps: [
        {
          label: "At the counter",
          title: "Record why it was declined",
          body: "The advisor notes whether the customer said price, timing, or a second opinion, and how urgent the finding is.",
        },
        {
          label: "Same day",
          title: "Send the inspection summary",
          body: "A text with the findings and photos from the inspection, so the customer has it to show a spouse or decide later.",
        },
        {
          label: "Days later",
          title: "A short, plain check-in",
          body: "A message about the specific repair, with a one-tap way to book. Safety items come first and nothing is pushed.",
        },
        {
          label: "Weeks later",
          title: "Remind on timing and mileage",
          body: "Deferred work is raised again when it fits the vehicle, such as before winter or a road trip, not on a fixed script.",
        },
        {
          label: "When it matters",
          title: "Stop when they say stop",
          body: "Customers who book or opt out leave the sequence. Replies that need judgment go to your advisor, never an automatic answer.",
        },
      ],
    },
    {
      id: "marketing-leaks",
      type: "pains",
      eyebrow: "Where shops leak",
      heading: "Where does marketing waste money for an independent repair shop?",
      intro:
        "Most waste comes from filling the wrong hours, missing the call, or not knowing which spend produced a paid repair order.",
      tone: "light",
      items: [
        {
          title: "Coupons attract price shoppers",
          body: "An oil-change special fills bays with customers who compare on price and may never buy a repair. The shop looks busier but earns less per hour.",
          cost: "Lower ARO and technician time spent on the thinnest work.",
        },
        {
          title: "Ads run when the schedule is full",
          body: "Budget keeps spending on a week that is already booked, so new customers wait or go elsewhere and you pay for the click anyway.",
          cost: "Ad spend with no open bay to put it in.",
        },
        {
          title: "Calls and requests go unanswered",
          body: "The advisor is with a customer, the line goes to voicemail, and the web request sits until tomorrow. The driver has already booked another shop.",
          cost: "Repair orders that were won by the ad and lost by the phone.",
        },
        {
          title: "Dealers and chains own your brand searches",
          body: "National names outspend you on searches for your own make and service. Without specific pages and a strong profile, drivers never see your shop.",
          cost: "Higher-ticket customers who never find an independent option.",
        },
      ],
    },
    {
      id: "shop-system",
      type: "note",
      eyebrow: "Your shop system",
      heading: "Does this work with my shop management system?",
      tone: "surface",
      body: [
        "In most cases, yes in part. Shop management systems differ in what they let you export or connect, so what is possible depends on yours. Often it means exporting declined work and customers due for service on a schedule, or using the system's own text and email tools alongside ours.",
        "We confirm what your system supports on a call before anything is promised. If direct links are limited, we can still run follow-up from exported lists and match results to your repair orders by hand. We do not guess about your system and we will tell you when something is not possible.",
      ],
    },
  ],

  faqs: [
    {
      q: "Why does my shop have great reviews but not show up on the map?",
      a: "Reviews are only one part of what Google weighs for map results. The profile itself matters too: the categories chosen, services listed, photos, hours, and how closely your website pages match what people search. A shop with fewer reviews but a stronger profile and local pages can rank above you. Fixing those pieces and answering reviews regularly usually helps more than asking for more reviews alone.",
    },
    {
      q: "Are coupons and oil-change specials worth it for a repair shop?",
      a: "Only if you treat them as a way to meet new customers, not as your marketing. A coupon draws people who shop on price, and many leave after one visit. It makes sense when you have open bay time and a plan to inspect the car and follow up. Without that plan, it fills the schedule with your lowest-margin work.",
    },
    {
      q: "How do I get more profitable work, not just more cars?",
      a: "Aim your marketing at the jobs you want and measure by average repair order, not car count. That means separate pages and campaigns for diagnostics, brakes, suspension, and your specialties, because drivers search the problem and the make. It also means keeping discount keywords out of your ads and following up on inspection findings so each visit is worth more.",
    },
    {
      q: "How do I follow up on declined work without annoying customers?",
      a: "Make each message specific, useful, and easy to stop. Reference the actual finding and the vehicle, put safety items first, offer one-tap booking, and send only a few messages spaced out over weeks. Anyone who books or opts out leaves the sequence. Your advisor handles replies that need judgment, so the customer talks to a person when it matters.",
    },
    {
      q: "Should I advertise when my schedule is already full?",
      a: "Not at full volume. Bay and technician hours are limited, so extra leads on a full week mean waits, lost customers, and wasted spend. A better approach is to watch your open hours, run ads toward the slower days and the work you want, and pause or reduce them when you are booked. Keep your profile and reviews working in the background.",
    },
    {
      q: "How can an independent shop compete with the dealership and the chains?",
      a: "Compete where independents win: trust, specialty skill, and local presence. You will not outspend a national brand on broad searches, so be the obvious choice on the map and for the specific make and problem. Strong reviews with replies, specialty pages, fast answers, and honest explanations of findings give drivers a reason to pick you over a bigger name.",
    },
    {
      q: "Does this connect to my shop management system?",
      a: "It depends on your system. Many shop management platforms allow exports or connections that let us pull in declined work, customers due for service, and completed repair orders, but they differ in what they allow. We do not assume. On a call we look at what yours supports, tell you what is possible, and plan around anything that is not.",
    },
    {
      q: "How will I know the marketing is working?",
      a: "You will see it in your own numbers: new customers in the car count, average repair order, how full the bays are, and how much declined work gets sold. We report on those in plain terms, along with where calls and requests came from. Calls and clicks are shown as supporting detail, because a busy phone is not the same as paid repair orders.",
    },
    {
      q: "What does an auto repair shop marketing agency do?",
      a: "An auto repair shop marketing agency handles how drivers find you and what happens after they reach out: your map listing, search ads, service pages, and follow-up on calls and declined work. MaaxGen runs local SEO, Google Ads, landing pages, AI follow-up, and CRM automation, and reports on car count and repair orders instead of clicks.",
    },
    {
      q: "How do I choose a marketing agency for my auto repair shop?",
      a: "Choose an agency that reports on car count and repair orders instead of clicks, lets you own your Google Business Profile and ad accounts, names the person you will talk to, and has a plan for answering calls and following up on declined work. MaaxGen is built around those points: you keep your accounts and data, and follow-up is part of the work.",
    },
  ],

  ctaLines: [
    "Not sure your shop shows up for the searches that bring good work? We check your map listing, pages, and ads.",
    "Wondering what your shop system can connect to? We confirm it on a call before anything is promised.",
  ],

  form: {
    heading: "Tell us about your shop",
    intro:
      "Share what you need most and we will come back with a plan for your bays, your phones, and your follow-up. A person reads every request.",
    qualifier: {
      label: "What do you need most right now?",
      options: [
        "More new customers from search and the map",
        "Fill slow days with better work",
        "Answer calls and requests faster",
        "Win back declined or overdue work",
        "A website or pages for my specialties",
        "Not sure yet",
      ],
    },
    businessType: "local",
    submitLabel: "Request my shop plan",
    notePlaceholder: "Your shop management system, how calls are answered, and what hurts most",
  },

  hubBlurb:
    "For independent shops: map visibility, faster answers, and follow-up on declined work, judged by car count and repair order value.",
};

export default industry;
