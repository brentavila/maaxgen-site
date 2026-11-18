import type { Industry } from "../types";

const industry: Industry = {
  slug: "used-car-dealerships",
  priority: 4,
  name: "Used car dealerships",
  shortName: "Used car dealers",
  audience: "independent used car dealership owners, general managers, and internet sales managers",
  updated: "2026-11-17",

  seo: {
    title: "Used car dealer marketing for independent lots",
    description:
      "Marketing for independent used car dealers: inventory-fed ads, fast lead replies, confirmed test drives, and reviews, judged by turn and cost per sale.",
    serviceType: "Used car dealership marketing",
    keywords: [
      "used car dealership marketing",
      "independent car dealer marketing agency",
      "how to sell used cars faster",
      "used car inventory ads",
      "google vehicle listing ads",
      "facebook marketplace for car dealers",
      "car dealer lead response time",
      "reduce days on lot",
      "buy here pay here marketing",
    ],
    serviceSummary:
      "MaaxGen plans and runs Google Ads, Meta Ads, local SEO, AI lead replies, and CRM automation for independent used car dealerships and their sales managers.",
  },

  hero: {
    kicker: "Marketing for independent used car lots",
    headline: ["Move the cars you have", "before they age."],
    lead:
      "Every unit costs you money while it sits, and internet leads wait hours for a reply. We advertise your actual inventory, answer leads while the shopper is still looking, and confirm appointments so more become test drives.",
    ctaLabel: "Get a lot growth plan",
    reassurance: "Reported on units sold and cost per sale, not clicks.",
  },

  answer: {
    question: "How do independent used car dealers sell inventory faster?",
    answer:
      "Independent dealers sell faster by advertising the cars actually on the lot from a clean inventory feed, replying to each internet lead about that exact vehicle within minutes, and confirming appointments so shoppers show up. Judge it by days on lot, leads per unit, and cost per sale by source. MaaxGen builds and manages those pieces together.",
    points: [
      "Shoppers pick a specific car online first, so your ads and pages should sell that car, not the dealership.",
      "The dealer who replies first with a real answer about the vehicle usually gets the appointment.",
      "A car sold yesterday should be out of your ads today. The feed is the campaign.",
      "Track cost per sale by source, because the lead and the logged sale often come from different places.",
    ],
  },

  stages: [
    { id: "lot", label: "Merchandise" },
    { id: "lead", label: "Get the lead" },
    { id: "visit", label: "Set the visit" },
    { id: "trust", label: "Earn trust" },
  ],

  plays: [
    {
      id: "reply-first-with-the-car",
      num: "01",
      name: "Reply first, about the car",
      stage: "lead",
      problem: "Internet leads sit for hours and get a generic auto-reply.",
      headline: ["Answer the inquiry", "about that exact car."],
      summary:
        "A shopper who asks about one unit usually asks several dealers at once. We reply in seconds with the vehicle, its price, and a test drive time, then hand the conversation to your sales team the moment a person is needed.",
      whatWeDo: [
        "Reply to each lead by name of the exact vehicle",
        "Offer real test drive slots from your calendar",
        "Cover nights, Sundays, and a busy Saturday floor",
        "Route replies that need a person to your team",
      ],
      outcome:
        "Shoppers hear back about their car while they are still comparing dealers, and your team spends time on people ready to visit.",
      services: ["ai-follow-up", "crm-automation"],
      visual: { kind: "industry", id: "cars-lead" },
    },
    {
      id: "advertise-the-live-lot",
      num: "02",
      name: "Advertise the live lot",
      stage: "lot",
      problem: "Our ads are generic and still show cars that already sold.",
      headline: ["Let the lot", "write the ads."],
      summary:
        "Your inventory changes daily, so the ads should too. We build campaigns from your inventory feed so each unit shows its real photos, price, and mileage, new arrivals go live fast, and sold cars come down the same day.",
      whatWeDo: [
        "Clean the feed: titles, photos, price, mileage",
        "Run vehicle listing ads from Google Merchant Center",
        "Run inventory ads on Meta tied to the same feed",
        "Pull sold units out of every ad the day they sell",
      ],
      outcome:
        "Your ad spend follows what is on the lot today, and shoppers stop clicking on cars you no longer have.",
      services: ["google-ads", "meta-ads", "landing-pages"],
      visual: { kind: "industry", id: "cars-inventory" },
    },
    {
      id: "push-aged-units",
      num: "03",
      name: "Give aged units a push",
      stage: "lot",
      problem: "Aged units eat floor plan interest and nobody sees them.",
      headline: ["Aged cars need", "a different ad."],
      summary:
        "A car that has sat a long time needs a new angle, not the same listing again. We refresh photos and short video, test a new price or payment message you approve, and target the shoppers most likely to want that body style.",
      whatWeDo: [
        "Flag units by days on lot from your export",
        "Reshoot photos and cut a short walkaround video",
        "Run focused Meta campaigns for each aged unit",
        "Send a weekly list of what moved and what did not",
      ],
      outcome:
        "Aged units get attention before the holding cost grows, and fresh arrivals are not crowded out by the cars that stalled.",
      services: ["meta-ads", "images", "video"],
      visual: { kind: "service", id: "meta-ads" },
    },
    {
      id: "confirm-every-visit",
      num: "04",
      name: "Confirm every test drive",
      stage: "visit",
      problem: "We set appointments, then too many never show.",
      headline: ["Book the visit,", "then protect it."],
      summary:
        "An appointment that nobody confirms is a guess. We text a confirmation with the car, the time, and the address, send a reminder, and ask early if the plan changed, so your floor is staffed for people who are really coming.",
      whatWeDo: [
        "Confirm by text with the vehicle, time, and address",
        "Send a same-day reminder with a reschedule link",
        "Follow up no-shows the same day, kindly",
        "Keep finance and trade-in questions with the lead",
      ],
      outcome:
        "More booked visits become real visits, and no-shows get a second chance instead of silence.",
      services: ["ai-follow-up", "crm-automation"],
      visual: { kind: "service", id: "ai-follow-up" },
    },
    {
      id: "earn-trust-before-the-visit",
      num: "05",
      name: "Earn trust before the visit",
      stage: "trust",
      problem: "Shoppers expect a dealer to hide something, and a bad review shows.",
      headline: ["Be the lot people", "trust on sight."],
      summary:
        "Used car shoppers check reviews and read how you answer complaints before they drive over. We keep your Google profile current, ask for reviews after every delivery, and draft replies you approve, good and bad.",
      whatWeDo: [
        "Request a review from each buyer after delivery",
        "Draft calm public replies to complaints for approval",
        "Keep hours, photos, and inventory links current",
        "Build pages for each make and the area you serve",
      ],
      outcome:
        "Your profile shows an open, responsive lot, which lowers the doubt shoppers bring with them.",
      services: ["local-seo", "websites"],
      visual: { kind: "service", id: "local-seo" },
    },
    {
      id: "know-which-source-sells",
      num: "06",
      name: "Know which source sells",
      stage: "visit",
      problem: "I cannot tell which lead source actually sold a car.",
      headline: ["Match every sale", "to where it began."],
      summary:
        "The lead arrives from a listing site or an ad, but the sale is logged in your dealer management system. We tie the two together by source, so you can see cost per sale and move budget to what sells.",
      whatWeDo: [
        "Track calls, forms, and chats by source and unit",
        "Match leads to sold cars from your sales export",
        "Report cost per sale, not cost per lead",
        "Review which sources to keep, cut, or grow monthly",
      ],
      outcome:
        "You stop guessing between listing sites, Meta, and Google, and spend where cars are actually sold.",
      services: ["crm-automation", "google-ads"],
      visual: { kind: "service", id: "crm-automation" },
    },
  ],

  recommendedServices: [
    "google-ads",
    "meta-ads",
    "ai-follow-up",
    "crm-automation",
    "local-seo",
  ],

  blocks: [
    {
      id: "one-car-journey",
      type: "flow",
      eyebrow: "One car, start to sale",
      heading: "How does one used car go from the lot to a booked test drive?",
      intro:
        "Each unit follows the same path, and each handoff is a place to lose the shopper. Here is the path we build and keep running for every car you take in.",
      tone: "dark",
      steps: [
        {
          label: "Arrives",
          title: "Listed with real photos and a real price",
          body: "The car is photographed, priced, and entered with its mileage, options, and history the day it is ready. A thin listing is the first thing a shopper skips.",
        },
        {
          label: "Same day",
          title: "Fed to every channel from one feed",
          body: "The same data goes to your site, your listing sites, Google vehicle listings, and Meta. One source of truth means the price matches everywhere.",
        },
        {
          label: "Shopper looks",
          title: "Lands on that car's detail page",
          body: "The vehicle detail page, or VDP, shows photos, price, mileage, and a clear way to ask a question, call, or book. It does not drop them on a generic homepage.",
        },
        {
          label: "Minutes",
          title: "The inquiry is answered about that car",
          body: "A fast reply names the vehicle, confirms it is available, and offers times. Anything that needs a person, such as financing or a trade-in, goes straight to your team.",
        },
        {
          label: "Before the visit",
          title: "The appointment is confirmed and reminded",
          body: "The shopper gets the car, the time, and the address by text, with a reminder before they leave. A no-show gets a kind follow-up the same day.",
        },
        {
          label: "The day it sells",
          title: "The car comes down from every ad",
          body: "A sold unit leaves the feed, the ads, and the listings right away, and the sale is matched back to the lead source so you learn what worked.",
        },
      ],
    },
    {
      id: "where-leads-leak",
      type: "pains",
      eyebrow: "Where leads leak",
      heading: "Where do used car dealers lose internet leads?",
      intro:
        "Most of the loss happens after the shopper has already raised a hand. The ad did its job and the follow-up did not.",
      tone: "light",
      items: [
        {
          title: "The reply is slow or generic",
          body: "A shopper asks about one car and gets a form letter, or nothing until the next morning. By then another dealer has answered the question and offered a time.",
          cost: "The appointment goes to whoever replied first.",
        },
        {
          title: "Nobody follows up after message one",
          body: "One reply goes out, the shopper goes quiet, and the lead is closed in the system. Many buyers need a second and third touch before they pick a day.",
          cost: "Leads you paid for that never got a real second try.",
        },
        {
          title: "Saturday calls go to voicemail",
          body: "The floor is full, the phone rings out, and the caller dials the next lot. The busiest day is also when the phone is least likely to get answered.",
          cost: "Calls from ready-to-visit shoppers on your best day.",
        },
        {
          title: "Appointments are set but never confirmed",
          body: "A time is agreed in a message and then nothing else happens. The shopper forgets, finds another car, or never feels expected.",
          cost: "Salespeople waiting on visits that were never going to come.",
        },
        {
          title: "Sold cars are still advertised",
          body: "The feed lags the lot, so a unit that sold stays up. The shopper drives over or calls, finds it gone, and trusts you a little less.",
          cost: "Ad spend and goodwill on a car you cannot sell.",
        },
      ],
    },
    {
      id: "lead-sources",
      type: "table",
      eyebrow: "Where shoppers come from",
      heading: "Which lead sources should a used car dealer pay for?",
      intro:
        "Each source has a different cost structure and a different kind of shopper. The right mix is the one that sells your cars, which only your own sales data can show.",
      tone: "surface",
      caption: "Common lead sources for independent used car dealers and what to watch in each",
      columns: ["Source", "How you pay", "What it does well", "What to watch"],
      rows: [
        [
          "Third-party listing sites",
          "Monthly fee or per lead, depending on the site",
          "Puts your cars in front of shoppers already comparing dealers",
          "Many dealers see the same lead, so reply speed decides the result",
        ],
        [
          "Your own site and VDPs",
          "Hosting and upkeep, plus the traffic you send",
          "You own the shopper, the data, and the way the car is shown",
          "Thin pages and slow loading waste traffic from every other source",
        ],
        [
          "Facebook Marketplace and Meta inventory ads",
          "Ad spend for boosted listings and inventory ads; check Meta's current listing terms",
          "Reaches people who were not yet searching, and suits aged units",
          "Feed errors and stale cars; credit offers have ad category limits",
        ],
        [
          "Google vehicle listings and search ads",
          "Pay per click on ads built from your feed and keywords",
          "Catches shoppers searching a make, model, or financing in your area",
          "Needs a clean feed and a match between the ad and the car page",
        ],
        [
          "Google Business Profile and calls",
          "Mostly your time, plus any review and profile upkeep",
          "Turns local searches and reviews into calls and walk-ins",
          "Missed calls and unanswered reviews cost you the visit",
        ],
      ],
    },
    {
      id: "lot-scoreboard",
      type: "metrics",
      eyebrow: "The scoreboard",
      heading: "What numbers should a used car dealer track for marketing?",
      intro:
        "Track turn and cost per sale by source. Impressions and clicks say the ad ran, not that a car left the lot.",
      tone: "light",
      items: [
        {
          term: "Days on lot",
          definition:
            "How long each unit has been in your inventory, from the day it arrived to the day it sold.",
          why: "Floor plan interest and depreciation grow with every day. Marketing should be pointed at the units getting old, not only at new arrivals.",
        },
        {
          term: "Turn",
          definition:
            "How often your inventory sells through and gets replaced over a period.",
          why: "A lot that turns quickly needs less capital tied up for the same gross. Turn tells you whether the whole system is working, not just one ad.",
        },
        {
          term: "Leads per unit",
          definition:
            "The number of inquiries each vehicle gets while listed, by source.",
          why: "A car with plenty of views and few leads has a price, photo, or listing problem. A car with no views has a feed or visibility problem.",
        },
        {
          term: "Lead response time",
          definition:
            "How long it takes from the shopper's inquiry to a real reply about that vehicle.",
          why: "Shoppers contact several dealers at once and the fastest useful answer often gets the visit. This is the cheapest number to improve.",
        },
        {
          term: "Appointment set and show rate",
          definition:
            "The share of leads that book a visit, and the share of booked visits that arrive.",
          why: "Both are leaks you can fix with confirmation and follow-up, and they sit between the lead you paid for and the sale you want.",
        },
        {
          term: "Cost per sale by source",
          definition:
            "What you spent on each source divided by the cars that source actually sold.",
          why: "Cost per lead can look cheap on a source that never sells. Cost per sale shows which source earns its place.",
        },
      ],
    },
    {
      id: "feed-and-system",
      type: "checklist",
      eyebrow: "Getting started",
      heading: "What does MaaxGen need from my inventory system?",
      intro:
        "Usually an inventory feed or export and a way to see sales. What is possible depends on your system, and we confirm it on a call before anything is promised.",
      tone: "surface",
      groups: [
        {
          title: "From your inventory system",
          items: [
            "An inventory feed or regular export of the units on the lot",
            "Photos, price, mileage, trim, and options on every listing",
            "A clear way to mark a unit as sold or pending",
            "Days on lot for each unit, if your system tracks it",
          ],
        },
        {
          title: "From your sales and leads",
          items: [
            "A list of sold cars with the date and, if known, the lead source",
            "Where inquiries arrive today: email, calls, listing sites, forms",
            "Who replies to leads and what hours your team covers",
            "Your usual test drive times and how a visit is booked",
          ],
        },
        {
          title: "From you, the dealer",
          items: [
            "The offers, financing language, and fees you are willing to advertise",
            "Rules for what a reply can say and when a person must take over",
            "Access to your Google, Meta, and listing site accounts",
          ],
        },
      ],
    },
    {
      id: "ad-rules",
      type: "note",
      eyebrow: "Advertising rules",
      heading: "Do vehicle and financing ads have special rules?",
      tone: "dark",
      body: [
        "Yes, vehicle and credit advertising is regulated, and the ad platforms add their own limits. For example, Meta treats credit offers as a restricted ad category with limited targeting. We do not give legal advice and we do not decide what you can claim.",
        "Your own compliance requirements govern. Ad copy and offers are reviewed with you before they go live, and anything about price, fees, or financing terms is written from the wording you approve.",
      ],
    },
  ],

  faqs: [
    {
      q: "Do I still need the third-party listing sites?",
      a: "Probably some of them, but not on faith. Listing sites put your cars in front of shoppers already comparing dealers, so many lots still get real sales there. The question is whether each one earns its fee. Compare cost per sale by source over several months, keep the ones that sell cars, and put the savings into ads you control.",
    },
    {
      q: "How do I know which lead source actually sells my cars?",
      a: "Match your sales to the source of the lead, not just to the lead count. The sale lives in your dealer management system and the lead came from somewhere else, so the two must be joined. We track leads by source and vehicle, compare them to your sold-car list, and report cost per sale so you can move budget with evidence.",
    },
    {
      q: "How fast do internet leads need a reply, and who answers after hours?",
      a: "As fast as you can manage, because shoppers write to several dealers and the first useful answer often wins the visit. Minutes matter more than hours. After hours, a prompt reply can name the car, confirm it is available, and offer times, then pass anything that needs judgment to your team in the morning.",
    },
    {
      q: "How do I stop advertising cars that are already sold?",
      a: "Run your ads from one inventory feed and keep that feed accurate. When a unit is marked sold or pending in your system, it should leave the feed, and the ads built from it, on the next update. We set the feed up that way and check it regularly. How quickly it updates depends on your inventory system.",
    },
    {
      q: "Are vehicle listing ads worth it for a small lot?",
      a: "Often yes, because they are built from the cars you already have and show real photos and prices to people searching for that make and model. Smaller lots can compete on specific vehicles and local searches. They depend on a clean feed, so we confirm yours is usable first. Whether they pay off for you shows up in cost per sale.",
    },
    {
      q: "How do I advertise financing without getting into trouble?",
      a: "Write financing ads from wording you have approved, and treat compliance as your call, not ours. Advertising credit and vehicle terms is regulated, and platforms such as Meta limit how credit offers can be targeted. We do not give legal advice. We draft copy for your review, keep offers consistent with your own requirements, and publish only what you approve.",
    },
    {
      q: "How should I handle a bad review?",
      a: "Reply publicly, calmly, and specifically, then take the details offline. Shoppers read how you answer a complaint as a sign of how you treat buyers after the sale. Do not argue and do not copy the same reply every time. We draft replies for your approval and ask happy buyers for reviews so one bad one does not stand alone.",
    },
    {
      q: "What do you need from my inventory system?",
      a: "Typically an inventory feed or regular export of your units with photos, price, and mileage, plus a way to see which cars sold. Systems differ in what they allow, so the specifics depend on yours. We look at it with you on a call, tell you what is possible, and plan around anything that is not, without assuming a connection exists.",
    },
    {
      q: "What does a used car dealer marketing agency do?",
      a: "A used car dealer marketing agency gets your actual inventory in front of shoppers and makes sure the inquiry gets answered: vehicle ads, listing feeds, lead replies, appointment confirmation, and reporting by source. MaaxGen runs Google Ads, Meta Ads, local SEO, AI lead replies, and CRM automation, and judges the work by cars sold and cost per sale, not clicks.",
    },
    {
      q: "How do I choose a marketing agency for my dealership?",
      a: "Choose an agency that reports on units sold and cost per sale instead of clicks, advertises the cars you actually have in stock, explains who owns the ad accounts and lead data, and has a plan for after-hours replies and appointment confirmation. MaaxGen is built around those points: you keep your accounts and lead history, and follow-up is part of the work.",
    },
  ],

  ctaLines: [
    "Wonder how many internet leads go cold on your lot? We review your reply times and follow-up and tell you plainly.",
    "Want ad copy and financing wording written from what you approve? Tell us about your lot and we plan it with you.",
  ],

  form: {
    heading: "Tell us about your lot",
    intro:
      "Share what you need most and we will come back with a plan for your inventory, your leads, and your appointments. A person reads every request.",
    qualifier: {
      label: "What do you need most right now?",
      options: [
        "Sell inventory faster and cut days on lot",
        "Ads built from my inventory feed",
        "Reply to internet leads faster",
        "Fewer no-shows on appointments",
        "Know which lead source sells cars",
        "Not sure yet",
      ],
    },
    businessType: "local",
    submitLabel: "Request my lot plan",
    notePlaceholder: "Your inventory system, where leads arrive, and who replies after hours",
  },

  hubBlurb:
    "For independent used car lots: inventory-fed ads, fast lead replies, and confirmed test drives, judged by turn and cost per sale.",
};

export default industry;
