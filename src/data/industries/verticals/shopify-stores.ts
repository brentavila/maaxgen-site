import type { Industry } from "../types";

const industry: Industry = {
  slug: "shopify-stores",
  priority: 3,
  name: "Shopify stores",
  shortName: "Shopify",
  audience: "founders, owners, and marketing leads of e-commerce stores built on Shopify",
  updated: "2026-11-17",

  seo: {
    title: "Shopify marketing agency for profit, not ROAS",
    description:
      "Ads, product feed, site, and follow-up for Shopify stores, run against blended profit instead of platform ROAS. One accountable partner, not three vendors.",
    serviceType: "Shopify store marketing",
    keywords: [
      "shopify marketing agency",
      "shopify ads management",
      "shopify google shopping feed",
      "performance max for shopify",
      "why is my roas good but no profit",
      "shopify meta ads agency",
      "shopify conversion rate optimization",
      "shopify email and sms automation",
      "marketing efficiency ratio ecommerce",
    ],
    serviceSummary:
      "MaaxGen plans and runs Google Ads, Meta Ads, product feeds, landing pages, creative, and email and text follow-up for Shopify stores.",
  },

  hero: {
    kicker: "Marketing for Shopify stores",
    headline: ["Revenue is up.", "Where did the profit go?"],
    lead:
      "ROAS looks fine in every dashboard and the bank balance does not agree. We run ads, the product feed, the site, and follow-up as one system, and judge it on what the store actually keeps.",
    ctaLabel: "Get my store reviewed",
    reassurance: "A plain-language review of your ads, feed, and tracking. No pitch deck.",
  },

  answer: {
    question: "How do Shopify stores grow profit, not just revenue?",
    answer:
      "Shopify stores grow profit by judging marketing on blended numbers instead of platform ROAS: total revenue against total ad spend, new-customer acquisition cost, and contribution margin after product cost, shipping, discounts, and fees. Then they fix the product feed, the product pages, and email and text follow-up, so each paid customer is worth more.",
    points: [
      "Platform ROAS counts the same order more than once; blended numbers do not.",
      "The product feed is the campaign for Google Shopping and Performance Max.",
      "Paying for traffic to a page that does not convert is the most common waste.",
      "Repeat buyers are where profit comes from, so flows matter as much as ads.",
    ],
  },

  stages: [
    { id: "know", label: "Know profit" },
    { id: "win", label: "Win the click" },
    { id: "convert", label: "Convert" },
    { id: "return", label: "Bring back" },
  ],

  plays: [
    {
      id: "profit-scoreboard",
      num: "01",
      name: "Judge ads on profit",
      stage: "know",
      problem: "ROAS looks fine in the platform, but the bank balance does not.",
      headline: ["Run on what the", "store actually keeps."],
      summary:
        "Google and Meta each claim the same order, so in-platform ROAS flatters both. You scale spend that is not profitable. We rebuild the scoreboard around blended numbers, contribution margin, and clean purchase tracking.",
      whatWeDo: [
        "Audit purchase events, values, and duplicates",
        "Build a blended scoreboard from your own orders",
        "Work out contribution margin by product",
        "Set spend decisions against profit, not ROAS",
      ],
      outcome:
        "You know which spend earns money and which only looks good in a platform report.",
      services: ["google-ads", "meta-ads"],
      visual: { kind: "industry", id: "shop-profit" },
    },
    {
      id: "product-feed",
      num: "02",
      name: "Fix the product feed",
      stage: "win",
      problem: "Nobody owns the feed, and products quietly stop showing.",
      headline: ["Treat the feed", "like the campaign."],
      summary:
        "Google Shopping and Performance Max run on your Merchant Center feed. Thin titles, missing identifiers, and price or stock mismatches cap reach without any alarm. We clean the feed and keep someone watching it.",
      whatWeDo: [
        "Rewrite titles and descriptions for search",
        "Fix identifiers, product types, and images",
        "Clear disapprovals and price or stock mismatches",
        "Check the feed on a schedule, not once",
      ],
      outcome:
        "Your best products show up for the searches they should, and problems get caught before they cost sales.",
      services: ["google-ads"],
      visual: { kind: "industry", id: "shop-feed" },
    },
    {
      id: "performance-max",
      num: "03",
      name: "Open up Performance Max",
      stage: "win",
      problem: "Performance Max may just be buying your own brand searches.",
      headline: ["See where the", "spend really goes."],
      summary:
        "Performance Max can hide where money lands, including on searches for your own name that would have converted anyway. We structure campaigns, check what they spend on, and separate brand from new customers.",
      whatWeDo: [
        "Split brand from non-brand demand",
        "Group products by margin, not by catalog order",
        "Review search terms and placement reports",
        "Feed new-customer signals back to bidding",
      ],
      outcome:
        "Spend goes toward customers you did not already have, and you can see the difference.",
      services: ["google-ads", "images"],
      visual: { kind: "service", id: "google-ads", query: "mens leather wallet" },
    },
    {
      id: "product-pages",
      num: "04",
      name: "Fix the page that loses",
      stage: "convert",
      problem: "You pay for more traffic to product pages that do not convert.",
      headline: ["Convert the visit", "you already paid for."],
      summary:
        "More traffic into a weak product page just raises the bill. We tighten page clarity, speed, offer, bundles, shipping thresholds, and checkout friction, then build focused pages for the ads that matter.",
      whatWeDo: [
        "Match product pages to the ads sending traffic",
        "Test offers, bundles, and shipping thresholds",
        "Cut checkout friction and slow-loading sections",
        "Build campaign landing pages for key products",
      ],
      outcome:
        "More of the visitors you pay for buy, and each order carries more value.",
      services: ["landing-pages", "websites"],
      visual: { kind: "service", id: "landing-pages" },
    },
    {
      id: "creative-supply",
      num: "05",
      name: "Keep creative fresh",
      stage: "win",
      problem: "Your winning ads fatigue and you run out of new angles.",
      headline: ["Never run short", "of something new."],
      summary:
        "Meta runs on creative volume. Winners fatigue, and most stores cannot produce new angles, formats, and product imagery fast enough. We supply a steady flow, using AI-assisted tools where they help, with a person reviewing everything.",
      whatWeDo: [
        "Plan angles from reviews and returns data",
        "Produce static, video, and product imagery sets",
        "Retire fatigued ads and test replacements",
        "Retarget visitors and past buyers separately",
      ],
      outcome:
        "You stop depending on one winning ad, and new tests are always ready to launch.",
      services: ["meta-ads", "video", "images"],
      visual: { kind: "service", id: "meta-ads" },
    },
    {
      id: "retention-flows",
      num: "06",
      name: "Bring buyers back",
      stage: "return",
      problem: "Every sale depends on paid ads because flows were set once.",
      headline: ["Make the first order", "the start."],
      summary:
        "If every sale needs a new ad click, profit stays thin. Welcome, abandoned cart and checkout, post-purchase, replenishment, and win-back flows were often set once and never revisited. We rebuild and connect them.",
      whatWeDo: [
        "Map every flow from first visit to win-back",
        "Rebuild abandoned cart and checkout messages",
        "Set post-purchase and replenishment timing",
        "Connect customer data to your CRM",
      ],
      outcome:
        "More of your customers buy a second time without another ad click.",
      services: ["crm-automation", "ai-follow-up"],
      visual: { kind: "service", id: "crm-automation" },
    },
  ],

  recommendedServices: ["google-ads", "meta-ads", "landing-pages", "images", "crm-automation"],

  blocks: [
    {
      id: "numbers-to-run-on",
      type: "metrics",
      eyebrow: "The scoreboard",
      heading: "Which numbers should a Shopify store run on instead of ROAS?",
      intro:
        "Run on blended numbers that your bank account can confirm. Platform ROAS is useful inside one channel, but it is a poor guide to whether the store is making money.",
      tone: "dark",
      items: [
        {
          term: "Marketing efficiency ratio (MER)",
          definition:
            "Total store revenue divided by total ad spend across every platform, for the same period.",
          why: "Each platform claims the same order, so their ROAS figures overlap. MER counts every order once.",
        },
        {
          term: "New-customer acquisition cost (nCAC)",
          definition:
            "Ad spend divided by the number of first-time customers it brought in, not total orders.",
          why: "Spend that reaches people already about to buy looks efficient but adds no growth. nCAC shows what real growth costs.",
        },
        {
          term: "Contribution margin",
          definition:
            "What is left of an order after product cost, shipping, discounts, payment fees, and returns, before ad spend.",
          why: "Revenue is not profit. Margin tells you how much you can afford to pay for a customer, product by product.",
        },
        {
          term: "Payback period",
          definition:
            "How long it takes for a new customer's margin to repay what it cost to acquire them.",
          why: "It sets how fast you can safely spend. A short payback funds growth; a long one ties up cash.",
        },
        {
          term: "Repeat purchase rate",
          definition:
            "The share of customers who buy again, and how soon after the first order.",
          why: "Repeat buyers need no new ad click, so this number decides how much you can pay for the first order.",
        },
      ],
    },
    {
      id: "platform-vs-bank",
      type: "table",
      eyebrow: "Reported vs kept",
      heading: "Why does the ad platform say one thing and my bank say another?",
      intro:
        "Because the platform reports what it can claim, while you keep what is left after every cost. The gap is where unprofitable spend hides.",
      tone: "light",
      caption: "What an ad platform reports compared with what a store actually keeps",
      columns: ["Question", "What the platform shows", "What the store keeps"],
      rows: [
        [
          "Whose order is it?",
          "Every platform can claim the same order.",
          "One order, counted once, in your own revenue.",
        ],
        [
          "Which customer?",
          "Buyers who were already on their way count as wins.",
          "New customers separated from returning ones.",
        ],
        [
          "What did it cost?",
          "Ad spend only.",
          "Product cost, shipping, discounts, fees, returns, and ad spend.",
        ],
        [
          "Which product?",
          "Revenue by campaign or ad set.",
          "Margin by product and by region.",
        ],
        [
          "How long to recover it?",
          "Usually a short click or view window.",
          "Payback on the customer, including repeat orders.",
        ],
      ],
    },
    {
      id: "leaks",
      type: "pains",
      eyebrow: "Where profit leaks",
      heading: "Where do Shopify stores lose money while revenue grows?",
      intro:
        "Most leaks are not in the ads. They sit between the vendors that run the ads, the email, and the site.",
      tone: "surface",
      items: [
        {
          title: "Reports say ROAS, the bank says otherwise",
          body: "Your agency reports in-platform ROAS. Orders are counted by more than one platform, and discounts and returns never appear.",
          cost: "You scale spend that looks profitable and is not.",
        },
        {
          title: "Discounting to hit a number",
          body: "A sale lifts revenue and the ROAS figure, then margin collapses and you train buyers to wait.",
          cost: "Contribution margin shrinks as volume rises.",
        },
        {
          title: "Spend drifts to people who would have bought anyway",
          body: "Brand search and retargeting get credit for orders already on their way, and Performance Max can lean into them.",
          cost: "Budget goes to reporting wins, not new customers.",
        },
        {
          title: "Ads, email, and the site blame each other",
          body: "Three vendors each report their own win. Nobody owns the gap between a click, a page, and a second order.",
          cost: "Problems between the three sit untouched for months.",
        },
        {
          title: "A feed nobody owns",
          body: "Titles are thin, identifiers are missing, and a price change on the site does not reach Merchant Center.",
          cost: "Shopping and Performance Max reach is quietly capped.",
        },
      ],
    },
    {
      id: "feed-health",
      type: "checklist",
      eyebrow: "Feed health",
      heading: "What should a healthy Shopify product feed look like?",
      intro:
        "A healthy feed is complete, accurate, and matches the site. Merchant Center is Google's tool for uploading the product data your Shopping ads use.",
      tone: "light",
      groups: [
        {
          title: "Product data",
          items: [
            "Titles carry the words buyers actually search, not internal names.",
            "Descriptions are specific and not copied from the supplier.",
            "Product types follow how you would group the catalog.",
            "Identifiers such as GTIN and brand are filled in where they exist.",
          ],
        },
        {
          title: "Match with the site",
          items: [
            "Price and availability on the site match the feed.",
            "Shipping and tax settings match what checkout shows.",
            "Variants are separate items with their own images.",
            "Sale prices appear in the feed when they appear on the site.",
          ],
        },
        {
          title: "Upkeep",
          items: [
            "Someone owns the feed and has a name next to it.",
            "Disapprovals and warnings are reviewed on a schedule.",
            "Low-margin and high-return products are labelled so ads treat them differently.",
          ],
        },
      ],
    },
    {
      id: "first-ninety-days",
      type: "flow",
      eyebrow: "How we start",
      heading: "What happens when a Shopify store brings in MaaxGen?",
      intro:
        "We start with measurement, because fixing ads on bad data only moves the problem. Scope for your store is confirmed on a call.",
      tone: "surface",
      steps: [
        {
          label: "Step 1",
          title: "Audit tracking and the feed",
          body: "We check purchase events, values, consent settings, duplicates, and Merchant Center health.",
        },
        {
          label: "Step 2",
          title: "Build your scoreboard",
          body: "We rebuild reporting from your own orders: blended efficiency, nCAC, and margin by product.",
        },
        {
          label: "Step 3",
          title: "Restructure the campaigns",
          body: "We separate brand from new customers and group products by margin, then refresh creative.",
        },
        {
          label: "Step 4",
          title: "Fix the page and the follow-up",
          body: "We improve the pages that carry the spend, then rebuild the flows that bring buyers back.",
        },
      ],
    },
  ],

  faqs: [
    {
      q: "Why does my ROAS look fine but my store is not making money?",
      a: "Platform ROAS counts what an ad platform can claim, not what you keep. Google and Meta can both claim the same order, buyers already on their way get credited, and the figure ignores product cost, shipping, discounts, fees, and returns. Judge spend against blended efficiency, new-customer acquisition cost, and contribution margin, which your own order data can confirm.",
    },
    {
      q: "Is Performance Max just spending on my own brand searches?",
      a: "It can be. Performance Max reports many channels together, and a share of spend may land on searches for your own store name that would have converted anyway. We check search terms and placements, separate brand from non-brand, and group products by margin, so you can see whether it finds new customers. Results vary by account.",
    },
    {
      q: "How do I scale ad spend without wrecking efficiency?",
      a: "Scale against profit and payback, not platform ROAS. Raise budget on spend that brings new customers at a cost your margin supports, and hold back where returning buyers get the credit. Fresh creative, a healthy feed, and pages that convert let more spend work. Efficiency usually softens as spend rises, so we watch blended numbers and adjust.",
    },
    {
      q: "Should I fix my site or my ads first?",
      a: "Check tracking first, then the page that carries the most spend. Ads cannot fix a product page that confuses buyers, and a strong page cannot help if purchase events feed bad signals to bidding. We review both together, because it is usually clear within the first audit which one is losing more.",
    },
    {
      q: "How much ad creative does a Shopify store actually need?",
      a: "Enough that you can retire a fatigued ad without a gap. Meta rewards variety in angle, format, and product imagery, and winners wear out. There is no fixed number, since it depends on spend and catalog. We plan angles, produce static, video, and image sets, and review them before they go live.",
    },
    {
      q: "Do you handle email and text as well as ads?",
      a: "We cover the follow-up side through two services: AI follow-up for instant replies and text, and CRM and automation for workflows that connect your tools and customer data. How that maps to welcome, cart, post-purchase, and win-back flows on your store is confirmed on a call, based on what you use now.",
    },
    {
      q: "Do I need to be on a particular Shopify plan to work with you?",
      a: "No particular plan is required to start. We work with stores built on Shopify, and what we can set up depends on your tools and how you track orders. If a plan or app limits something we would recommend, we say so in the audit, before you commit to anything.",
    },
    {
      q: "What access do you need to my store and ad accounts?",
      a: "We ask for the access each job needs, usually your ad accounts, Merchant Center, analytics, and a staff or collaborator login for Shopify. You stay the owner of every account, and you can remove access at any time. We confirm the exact list on the first call, and we never need your bank details.",
    },
    {
      q: "What does a Shopify marketing agency do?",
      a: "A Shopify marketing agency runs the ads, product feed, product pages, and follow-up that bring in customers, and should show whether the store keeps money after ad spend. MaaxGen runs Google Ads, Meta Ads, the feed, landing pages, creative, and email and text follow-up as one system, and judges it on blended profit, not platform-reported ROAS.",
    },
    {
      q: "How do I choose a marketing agency for my Shopify store?",
      a: "Choose an agency that reports blended profit instead of only platform ROAS, explains who owns the ad accounts, feed, and data, names the person you will talk to, and treats ads, site, and follow-up as one system. MaaxGen is built around those points: you keep your accounts and data, and we start with tracking and the feed.",
    },
  ],

  ctaLines: [
    "Want to see which number is right for your store? We review your ads, feed, and tracking and show where they disagree.",
    "Curious what the first steps look like for your store? Send your store URL and we start with tracking and the feed.",
  ],

  form: {
    heading: "Get your Shopify store reviewed",
    intro:
      "Tell us about the store and where profit feels stuck. We reply with what we would check first, in plain language.",
    qualifier: {
      label: "What do you need most right now?",
      options: [
        "Profit that matches the ad reports",
        "A cleaner product feed and Shopping",
        "More new customers from Meta",
        "A product page that converts better",
        "Email and text follow-up",
        "I am not sure yet",
      ],
    },
    businessType: "ecommerce",
    submitLabel: "Request my review",
    notePlaceholder: "Monthly ad spend, platforms you run, and where profit feels stuck",
    siteField: { label: "Store URL", placeholder: "yourstore.com", required: true },
  },

  hubBlurb:
    "For Shopify stores where revenue is growing and profit is not: blended numbers, a clean feed, steady creative, and follow-up.",
};

export default industry;
