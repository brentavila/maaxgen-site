import type { Industry } from "../types";

const industry: Industry = {
  slug: "kitchen-bath-remodelers",
  priority: 6,
  name: "Kitchen and bath remodelers",
  shortName: "Kitchen and bath",
  audience: "kitchen and bathroom remodeling company owners and sales and design leads",
  updated: "2026-11-17",

  seo: {
    title: "Kitchen and bath remodeler marketing",
    description:
      "Marketing for kitchen and bathroom remodelers: qualified consultations, project galleries that sell, and follow-up through the months a homeowner decides.",
    serviceType: "Kitchen and bathroom remodeler marketing",
    keywords: [
      "kitchen remodeler marketing",
      "bathroom remodeling marketing",
      "how to get more kitchen remodeling leads",
      "remodeling company marketing agency",
      "qualified remodeling leads",
      "design build firm marketing",
      "kitchen remodeler google ads",
      "remodeler google business profile",
      "remodeling proposal follow up",
      "kitchen and bath showroom marketing",
    ],
    serviceSummary:
      "MaaxGen plans and runs websites, project galleries, Google Ads, local SEO, CRM automation, and AI follow-up for kitchen and bathroom remodelers and design-build firms.",
  },

  hero: {
    kicker: "Marketing for kitchen and bath remodelers",
    headline: ["Better inquiries,","more signed projects."],
    lead:
      "Your designers drive out for budgets you cannot build to. Whether your crews are booked out or you can see a gap coming, we put the right homeowners in front of your designers and keep in touch while they decide.",
    ctaLabel: "Get a remodeler plan",
    reassurance: "Judged on qualified consults and signed projects, not form fills.",
  },

  answer: {
    question: "How do kitchen and bath remodelers get more signed projects?",
    answer:
      "Remodelers sign more projects by attracting homeowners who fit their scope, budget range, and area, showing finished work that proves it, and following up through the weeks between consultation and contract. Judge marketing by qualified consultations and proposal close rate, not lead count. MaaxGen builds the search, ads, project pages, and follow-up together.",
    points: [
      "A consult costs your designer hours, so qualify scope, budget range, timeline, and area first.",
      "Homeowners buy on finished-project proof and reviews that mention communication and staying on budget.",
      "Most deals are lost in the quiet weeks after the proposal, not at the first call.",
      "When crews are booked out, aim marketing at the right project types and start dates, not more volume.",
    ],
  },

  stages: [
    { id: "inspire", label: "Inspire" },
    { id: "qualify", label: "Qualify" },
    { id: "consult", label: "Consult" },
    { id: "sign", label: "Sign and refer" },
  ],

  plays: [
    {
      id: "qualify-before-the-consult",
      num: "01",
      name: "Qualify before the consult",
      stage: "qualify",
      problem: "Designers drive out for budgets we cannot build to.",
      headline: ["Ask the right things", "before you drive out."],
      summary:
        "Every consultation costs measuring, drawings, and a proposal. We shape your inquiry form and ad targeting around scope, budget range, timeline, and area, so your designers spend time on projects you can actually build.",
      whatWeDo: [
        "Build an inquiry form that asks scope and timeline",
        "Add a budget range question with honest framing",
        "Route out-of-area and repair-only requests politely",
        "Pass the answers to the designer before the visit",
      ],
      outcome:
        "Your designers walk into consultations already knowing the room, the range, and the timeline.",
      services: ["landing-pages", "crm-automation"],
      visual: { kind: "industry", id: "kb-consult" },
    },
    {
      id: "finished-work-as-proof",
      num: "02",
      name: "Turn projects into proof",
      stage: "inspire",
      problem: "Our work is beautiful, but nobody can see it online.",
      headline: ["Every finished room", "becomes a sales page."],
      summary:
        "Homeowners judge a remodeler by finished rooms and before and after photos. Most firms have the work and almost no usable photos or project pages. We turn each completed job into a page that sells the next one.",
      whatWeDo: [
        "Build project pages with scope, story, and photos",
        "Set up before and after galleries by room type",
        "Brief your crew on the shots to take on site",
        "Add pro or AI-assisted images, reviewed by us",
      ],
      outcome:
        "A homeowner comparing three firms can see what you built, for whom, and how the job went.",
      services: ["websites", "images"],
      visual: { kind: "industry", id: "kb-before-after" },
    },
    {
      id: "answer-and-confirm-consults",
      num: "03",
      name: "Reply fast, confirm visits",
      stage: "consult",
      problem: "Inquiries wait a day, and booked consults get missed.",
      headline: ["Answer the inquiry,", "protect the visit."],
      summary:
        "A homeowner asks three firms at once and talks first to whoever replies. Then the booked visit slips. We reply right away, in your voice, and send confirmations and reminders so designers do not drive out to a locked door.",
      whatWeDo: [
        "Reply to new inquiries by text and email at once",
        "Offer booking from the reply, with your rules",
        "Send confirmations and visit reminders",
        "Hand anything unusual to your designer to answer",
      ],
      outcome:
        "Homeowners hear from you while they are still choosing, and booked consultations are more likely to happen.",
      services: ["ai-follow-up"],
      visual: { kind: "service", id: "ai-follow-up" },
    },
    {
      id: "proposal-follow-up",
      num: "04",
      name: "Follow up after the proposal",
      stage: "sign",
      problem: "We send the proposal, then hear nothing for weeks.",
      headline: ["Stay useful", "while they decide."],
      summary:
        "Once the proposal is out, the homeowner is comparing quotes and sorting financing, and you go quiet. We set up reminders and useful touches, such as a finish guide or a timeline note, that follow up without pestering.",
      whatWeDo: [
        "Track every proposal in one pipeline by stage",
        "Remind the designer when a proposal goes quiet",
        "Send useful notes on finishes, timing, financing",
        "Stop messages the moment they sign or say no",
      ],
      outcome:
        "Proposals get an honest second look instead of fading while a competitor stays in touch.",
      services: ["crm-automation", "ai-follow-up"],
      visual: { kind: "service", id: "crm-automation" },
    },
    {
      id: "win-the-local-search",
      num: "05",
      name: "Be the firm they find first",
      stage: "inspire",
      problem: "Referrals check us online and find a thin profile.",
      headline: ["Look as good online", "as you do in person."],
      summary:
        "Even a referral looks you up before calling. Homeowners search remodelers near them and read reviews. We tune your Google Business Profile, ask past clients for reviews, and build pages for your rooms and service areas.",
      whatWeDo: [
        "Fix categories, services, and photos on Google",
        "Request reviews after handover, with a nudge",
        "Draft review replies for your approval",
        "Build pages for each room type and town you serve",
      ],
      outcome:
        "When a neighbor's recommendation gets checked, what the homeowner finds backs it up.",
      services: ["local-seo", "seo"],
      visual: { kind: "service", id: "local-seo" },
    },
    {
      id: "aim-ads-at-the-right-projects",
      num: "06",
      name: "Advertise projects you want",
      stage: "qualify",
      problem: "Lead sellers send the same inquiry to five firms.",
      headline: ["Own your leads,", "pick the projects."],
      summary:
        "Shared leads reach you and four competitors at once, and many have no budget. We run search ads for the project types and areas you want, and ease off when crews are booked, so spend follows your backlog.",
      whatWeDo: [
        "Build campaigns around kitchen and bath projects",
        "Keep repair, DIY, and free design searches out",
        "Send each campaign to a page for that project type",
        "Change budget and focus as your backlog changes",
      ],
      outcome:
        "Leads come to you alone, for the projects and start dates you can take.",
      services: ["google-ads", "landing-pages"],
      visual: { kind: "service", id: "google-ads", query: "kitchen remodel near me" },
    },
  ],

  recommendedServices: [
    "websites",
    "local-seo",
    "google-ads",
    "crm-automation",
    "ai-follow-up",
  ],

  blocks: [
    {
      id: "inspiration-to-signature",
      type: "flow",
      eyebrow: "The long decision",
      heading: "How does a homeowner go from first search to a signed remodel?",
      intro:
        "A homeowner goes through six phases over weeks or months, and your marketing has a different job in each one. Most firms only show up in one or two.",
      tone: "dark",
      steps: [
        {
          label: "Dreaming",
          title: "They search for ideas, not for you",
          body: "They browse photos on Instagram, Pinterest, and Houzz and save kitchens they like. Your job is to be in those photos, with finished work that looks like a real house, not a catalog.",
        },
        {
          label: "Researching",
          title: "They look for firms near them",
          body: "They search for a remodeler nearby, open the map results, and read reviews. Your profile, project photos, and review replies are doing the selling before anyone calls.",
        },
        {
          label: "Shortlisting",
          title: "They check your site and ask a few firms",
          body: "They look for work like theirs, how you run a job, and whether you take projects their size. A clear page for each room type, with a way to say budget range and timeline, helps the right ones raise a hand.",
        },
        {
          label: "Consulting",
          title: "A designer visits and measures",
          body: "Speed and confirmation matter here. A fast reply wins the visit, a reminder protects it, and the designer should arrive knowing the scope, range, and timeline from the inquiry.",
        },
        {
          label: "Comparing",
          title: "Proposals arrive, financing gets sorted",
          body: "This is the quiet middle, and it can run for weeks or months. Stay useful: send finish guidance and timeline notes, answer questions quickly, and remind your designer when a proposal has gone silent.",
        },
        {
          label: "Signing",
          title: "They choose, and later send others",
          body: "Once they sign, the job continues in a different way. Ask for the review at handover, photograph the finished room, and stay in touch for the neighbor, the bathroom, or the next room.",
        },
      ],
    },
    {
      id: "kitchen-vs-bath",
      type: "lanes",
      eyebrow: "Two different sales",
      heading: "How is selling a kitchen different from selling a bathroom?",
      intro:
        "A kitchen is usually the bigger, slower, more emotional project, and a bathroom is often quicker and sometimes urgent. Treating them as one funnel wastes both.",
      tone: "light",
      lanes: [
        {
          label: "Kitchen remodel",
          who: "A household making a large decision, often with a partner, and often planning for years.",
          rows: [
            { label: "Pace", value: "Slow. Weeks or months of comparing, often with a long wait before they commit." },
            { label: "Who decides", value: "Several people, so proposals get passed around and need to be easy to share." },
            { label: "What sells", value: "Whole-room finished galleries, layout thinking, and a clear process and timeline." },
            { label: "What loses it", value: "A vague scope, a quiet stretch after the proposal, and no proof of similar jobs." },
          ],
        },
        {
          label: "Bathroom remodel",
          who: "A homeowner with a clearer, smaller project, sometimes forced by a leak or an accessibility need.",
          rows: [
            { label: "Pace", value: "Faster, and sometimes urgent, so a slow reply loses it in days." },
            { label: "Who decides", value: "Often one person, who can say yes sooner." },
            { label: "What sells", value: "Quick availability, tight before and after shots, and a plain explanation of how long the room is out of use." },
            { label: "What loses it", value: "No reply the same day, and unclear scope on moisture or accessibility work." },
          ],
        },
      ],
    },
    {
      id: "project-page",
      type: "checklist",
      eyebrow: "Proof that sells",
      heading: "What should a kitchen or bath project page include?",
      intro:
        "A project page should show the finished room and answer what a cautious homeowner is wondering: was it like mine, was it on budget, and was the crew easy to live with.",
      tone: "surface",
      groups: [
        {
          title: "Show the work",
          items: [
            "A before and after pair from the same angle",
            "Wide, detail, and in-use photos of the finished room",
            "The room type and size, and what changed in the layout",
            "Natural light and real homes, not staged catalog shots",
          ],
        },
        {
          title: "Tell the story",
          items: [
            "What the homeowner wanted and what stood in the way",
            "The scope in plain words, and the surprises that came up",
            "How long the work took and how you kept the house livable",
            "A quote from the client, with their permission",
          ],
        },
        {
          title: "Help the next homeowner act",
          items: [
            "Who the project suits, and what it can cost in general terms",
            "A short inquiry form that asks scope, timeline, and range",
            "A link to similar projects by room and style",
            "A clear note on your service area",
          ],
        },
      ],
    },
    {
      id: "scoreboard",
      type: "metrics",
      eyebrow: "The scoreboard",
      heading: "What should a remodeler measure instead of lead count?",
      intro:
        "Measure qualified consultations, how many of them happen, and how many proposals become contracts. Lead count rewards volume, and volume is what you are trying to avoid.",
      tone: "light",
      items: [
        {
          term: "Qualified consultation",
          definition:
            "A visit or showroom meeting with a homeowner whose scope, budget range, timeline, and address fit your firm.",
          why: "It is the unit your designers spend time on. Marketing that fills it with poor fits costs more than it appears.",
        },
        {
          term: "Consult show rate",
          definition:
            "The share of booked consultations that actually take place.",
          why: "A missed visit costs a designer the drive and the hour. Fast confirmation and reminders are cheaper than finding a new homeowner.",
        },
        {
          term: "Proposal-to-contract close rate",
          definition:
            "The share of proposals that become signed contracts.",
          why: "It tells you whether the problem is lead fit, your proposal, or silence after it. Each needs a different fix.",
        },
        {
          term: "Average project value",
          definition:
            "The average contract size of the projects you sign, total contract value divided by projects.",
          why: "Marketing that raises volume but pulls the average toward small jobs can leave the schedule busy and the margin thin.",
        },
        {
          term: "Cost per signed project",
          definition:
            "Marketing spend divided by the number of projects signed from it.",
          why: "Cost per lead hides the long middle. Cost per signed project shows what a project truly cost to win.",
        },
        {
          term: "Backlog in weeks",
          definition:
            "How many weeks of signed work sit ahead of your crews before a new project could start.",
          why: "It tells you how hard to push. A long backlog means aim for the right projects, not more of them.",
        },
      ],
    },
    {
      id: "booked-out",
      type: "note",
      eyebrow: "When crews are full",
      heading: "What should a remodeler's marketing do when crews are booked out?",
      tone: "surface",
      body: [
        "It should narrow, not stop. When the backlog is long, point ads and pages at the project types, sizes, and start dates you want, and let the profile, reviews, and project pages keep working. The aim is the right next project, not more inquiries for work you cannot start.",
        "Lean seasons are the other side of the same idea. Pipeline built from search, past clients, and proposals takes months to turn into signed work, so the quiet quarter you are afraid of is often decided by what you did several months before. Marketing spend should follow the backlog, and we adjust it with you as the backlog moves.",
      ],
    },
  ],

  faqs: [
    {
      q: "How do I get fewer tire-kickers and more real projects?",
      a: "Ask for scope, timeline, and budget range before booking the consultation, and aim your ads and pages at the projects you want. Tire-kickers are usually people with no budget, a single repair, a project a year away, or an address outside your area. A short qualifying form, plus ads that keep out repair and free-design searches, sends your designers to the right homes.",
    },
    {
      q: "Should I show a starting price or budget range on my website?",
      a: "There are real arguments both ways, and it is your call. Showing a range filters out homeowners far below your minimum, and it builds trust. The cost is that a number can be taken out of context and scare off people who would have fit. A middle path is to explain what drives cost and ask for the homeowner's range in the form. We will help you choose.",
    },
    {
      q: "Are paid leads from lead sellers worth it for a remodeler?",
      a: "Often not as the main source. Shared leads usually go to several firms at once, so you are racing to call first, and many have no real budget. They can fill a gap if you reply instantly and qualify hard. Owned channels such as your search ads, map listing, and past clients cost more effort to build, but the inquiries are yours alone.",
    },
    {
      q: "How long before marketing turns into signed projects?",
      a: "It takes longer than in most trades, and we will not promise a timeline. A homeowner may search months before asking for a consultation, then compare proposals for weeks. Some inquiries from paid search can arrive quickly, while map visibility, project pages, and reviews build over time. Expect to judge the first months by qualified consultations, and later ones by signed projects.",
    },
    {
      q: "What should I do when my crews are already booked out?",
      a: "Narrow your marketing instead of switching it off. Aim it at the project types and start dates you want, keep your profile, reviews, and project pages working, and ease ad spend down while the backlog is long. Then rebuild volume ahead of a lean season, because pipeline in this trade takes months to turn into signed work.",
    },
    {
      q: "Do Houzz, Instagram, and Pinterest matter for a remodeler?",
      a: "They matter most early, when homeowners are collecting ideas and have not picked a firm. Strong project photos help you get noticed there, and a good Houzz profile can support your reputation. But few homeowners sign from a post alone, so the real job is sending them back to your site and your Google profile. We treat them as places to be seen, not as the whole plan.",
    },
    {
      q: "How do I follow up on proposals without being pushy?",
      a: "Be useful, not persistent. Send something the homeowner can use, such as finish guidance, a timeline outline, or answers to financing questions, and keep messages few and spaced out. Make it easy to reply to your designer, and stop the moment they sign or decline. A homeowner who feels informed rather than chased is more likely to come back to you.",
    },
    {
      q: "Do I need professional photos of my projects, and what if I have none?",
      a: "Professional photos help, but you can start without them. Many remodelers have good work and almost no usable images. We can give your crew a short guide for taking clear before and after shots on site, and where a shoot makes sense we can plan it. We can also use AI-assisted images for ads, reviewed by a person, but your real finished work should lead.",
    },
    {
      q: "What does a kitchen and bath remodeler marketing agency do?",
      a: "A remodeler marketing agency brings in homeowners who suit your projects and keeps in touch while they decide: ads and local search, project pages, and follow-up on consultations and proposals. MaaxGen runs websites, Google Ads, local SEO, CRM automation, and AI follow-up, and judges the work by qualified consultations and signed projects, not form fills.",
    },
    {
      q: "How do I choose a marketing agency for my remodeling firm?",
      a: "Look for an agency that reports qualified consultations and signed projects instead of lead counts, shows how it follows up on proposals, explains who owns the ad and profile accounts, and gives you one person to talk to. Be careful with anyone who sells the same inquiry to several firms. MaaxGen is set up around those points, and you keep your accounts and history.",
    },
  ],

  ctaLines: [
    "Selling a kitchen and a bath takes different pages. Tell us which projects you want and we plan around them.",
    "Crews full, or a gap coming? Tell us your backlog and we aim the marketing at the projects you want next.",
  ],

  form: {
    heading: "Tell us about your remodeling firm",
    intro:
      "Tell us what you need most and we will reply with a plan for your leads, your project proof, and your follow-up. A person reads every request.",
    qualifier: {
      label: "What do you need most right now?",
      options: [
        "More qualified consultations",
        "Fewer unqualified inquiries",
        "Project pages and a better website",
        "Follow-up on proposals",
        "Better map and review visibility",
        "Not sure yet",
      ],
    },
    businessType: "local",
    submitLabel: "Request my remodeler plan",
    notePlaceholder: "Project types you want, your area, and how soon you can start",
  },

  hubBlurb:
    "For kitchen and bath firms: qualified consultations, project pages that sell, and follow-up through the long decision.",
};

export default industry;
