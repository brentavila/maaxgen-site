import type { QuestionStep } from "./types";

/**
 * Qualification schema — add, remove, reorder, or reweight via scoring.ts.
 * UI reads this; scoring reads answer values, not DOM.
 */
export const QUALIFICATION_STEPS: QuestionStep[] = [
  {
    id: "business-type",
    title: "What type of business do you operate?",
    fields: [
      {
        id: "businessType",
        type: "single",
        label: "Business type",
        required: true,
        options: [
          { value: "home-services", label: "Home Services" },
          { value: "automotive", label: "Automotive" },
          { value: "professional-services", label: "Professional Services" },
          { value: "health-wellness", label: "Health / Wellness" },
          { value: "local-retail", label: "Local Retail" },
          { value: "ecommerce", label: "E-commerce" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "businessTypeOther",
        type: "text",
        label: "Tell us a bit more",
        placeholder: "Business category",
        required: true,
        showWhen: { fieldId: "businessType", equals: "other" },
      },
    ],
  },
  {
    id: "monthly-revenue",
    title: "What is your approximate monthly revenue?",
    fields: [
      {
        id: "monthlyRevenue",
        type: "single",
        label: "Monthly revenue",
        required: true,
        options: [
          { value: "pre-revenue", label: "Pre-Revenue" },
          { value: "under-10k", label: "Under $10,000" },
          { value: "10k-25k", label: "$10,000–$25,000" },
          { value: "25k-50k", label: "$25,000–$50,000" },
          { value: "50k-100k", label: "$50,000–$100,000" },
          { value: "100k-250k", label: "$100,000–$250,000" },
          { value: "250k-plus", label: "$250,000+" },
        ],
      },
    ],
  },
  {
    id: "customer-value",
    title: "Approximately how much is a new customer worth to your business?",
    fields: [
      {
        id: "customerValue",
        type: "single",
        label: "Customer value",
        required: true,
        options: [
          { value: "under-250", label: "Under $250" },
          { value: "250-500", label: "$250–$500" },
          { value: "500-1000", label: "$500–$1,000" },
          { value: "1000-2500", label: "$1,000–$2,500" },
          { value: "2500-5000", label: "$2,500–$5,000" },
          { value: "5000-plus", label: "$5,000+" },
        ],
      },
    ],
  },
  {
    id: "current-advertising",
    title: "Are you currently advertising?",
    description: "Select all that apply.",
    fields: [
      {
        id: "currentAdvertising",
        type: "multi",
        label: "Current advertising",
        required: true,
        minSelected: 1,
        options: [
          { value: "google", label: "Yes — Google Ads" },
          { value: "meta", label: "Yes — Meta Ads" },
          { value: "other-ads", label: "Yes — Other Advertising" },
          { value: "none", label: "No" },
        ],
      },
    ],
  },
  {
    id: "ad-spend",
    title: "Approximately how much are you currently spending on advertising each month?",
    fields: [
      {
        id: "monthlyAdSpend",
        type: "single",
        label: "Monthly ad spend",
        required: true,
        options: [
          { value: "0", label: "$0" },
          { value: "under-1000", label: "Under $1,000" },
          { value: "1000-2500", label: "$1,000–$2,500" },
          { value: "2500-5000", label: "$2,500–$5,000" },
          { value: "5000-10000", label: "$5,000–$10,000" },
          { value: "10000-plus", label: "$10,000+" },
        ],
      },
    ],
  },
  {
    id: "capacity",
    title: "How many additional customers could your business realistically handle each month?",
    fields: [
      {
        id: "capacity",
        type: "single",
        label: "Additional capacity",
        required: true,
        options: [
          { value: "1-5", label: "1–5" },
          { value: "6-10", label: "6–10" },
          { value: "11-25", label: "11–25" },
          { value: "26-50", label: "26–50" },
          { value: "50-plus", label: "50+" },
        ],
      },
    ],
  },
  {
    id: "challenges",
    title: "What is the biggest challenge with your current marketing?",
    description: "Select all that apply.",
    fields: [
      {
        id: "marketingChallenges",
        type: "multi",
        label: "Marketing challenges",
        required: true,
        minSelected: 1,
        options: [
          { value: "not-enough-leads", label: "Not enough leads" },
          { value: "lead-quality", label: "Lead quality" },
          { value: "cost-per-lead", label: "Cost per lead" },
          { value: "poor-follow-up", label: "Poor follow-up" },
          { value: "leads-not-booking", label: "Leads not booking" },
          { value: "leads-not-closing", label: "Leads not closing" },
          { value: "cant-track-revenue", label: "Can't track revenue" },
          { value: "dont-know-whats-working", label: "Don't know what's working" },
          { value: "need-setup-help", label: "Need help setting everything up" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "marketingChallengeOther",
        type: "text",
        label: "What else should we know?",
        placeholder: "Briefly describe the challenge",
        showWhen: { fieldId: "marketingChallenges", equals: "other" },
      },
    ],
  },
  {
    id: "lead-response",
    title: "How quickly do you typically respond to a new lead?",
    fields: [
      {
        id: "leadResponseTime",
        type: "single",
        label: "Lead response time",
        required: true,
        options: [
          { value: "under-5-min", label: "Under 5 minutes" },
          { value: "5-15-min", label: "5–15 minutes" },
          { value: "15-60-min", label: "15–60 minutes" },
          { value: "few-hours", label: "Within a few hours" },
          { value: "within-24h", label: "Within 24 hours" },
          { value: "longer-24h", label: "Longer than 24 hours" },
          { value: "no-process", label: "We don't have a consistent process" },
        ],
      },
    ],
  },
  {
    id: "crm",
    title: "Do you currently use a CRM?",
    fields: [
      {
        id: "crmStatus",
        type: "single",
        label: "CRM status",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "not-sure", label: "Not Sure" },
        ],
      },
      {
        id: "crmName",
        type: "text",
        label: "Which CRM? (optional)",
        placeholder: "e.g. GoHighLevel, HubSpot, Jobber",
        required: false,
        showWhen: { fieldId: "crmStatus", equals: "yes" },
      },
    ],
  },
  {
    id: "timeline",
    title: "If the strategy makes sense, when would you want to begin?",
    fields: [
      {
        id: "startTimeline",
        type: "single",
        label: "Start timeline",
        required: true,
        options: [
          { value: "immediately", label: "Immediately" },
          { value: "within-2-weeks", label: "Within 2 Weeks" },
          { value: "within-30-days", label: "Within 30 Days" },
          { value: "1-3-months", label: "1–3 Months" },
          { value: "researching", label: "Just Researching" },
        ],
      },
    ],
  },
  {
    id: "willingness",
    title: "Are you willing to invest in paid advertising if the economics make sense?",
    fields: [
      {
        id: "willingnessToInvest",
        type: "single",
        label: "Willingness to invest",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "possibly", label: "Possibly" },
          { value: "no", label: "No" },
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Where should we send your results?",
    description: "We’ll use this to follow up with the right next step for your business.",
    fields: [
      {
        id: "contact",
        type: "contact",
        label: "Contact information",
        fields: [
          { id: "firstName", label: "First Name", inputType: "text", required: true, autocomplete: "given-name" },
          { id: "lastName", label: "Last Name", inputType: "text", required: true, autocomplete: "family-name" },
          { id: "businessName", label: "Business Name", inputType: "text", required: true, autocomplete: "organization" },
          { id: "website", label: "Website", inputType: "url", required: false, autocomplete: "url" },
          { id: "email", label: "Email", inputType: "email", required: true, autocomplete: "email" },
          { id: "phone", label: "Phone", inputType: "tel", required: true, autocomplete: "tel" },
        ],
      },
    ],
  },
];
