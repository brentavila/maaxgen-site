/**
 * Walk hypothetical visitors A–D through scoring thresholds.
 * Keep weights in sync with src/funnel/scoring.ts + config.ts
 * Run: node scripts/verify-funnel-scoring.mjs
 */

const SCORE_THRESHOLDS = {
  highlyQualifiedMin: 50,
  potentiallyQualifiedMin: 25,
};

const SCORE_WEIGHTS = {
  monthlyRevenue: {
    "pre-revenue": -20,
    "under-10k": 0,
    "10k-25k": 5,
    "25k-50k": 10,
    "50k-100k": 15,
    "100k-250k": 20,
    "250k-plus": 20,
  },
  customerValue: {
    "under-250": 0,
    "250-500": 3,
    "500-1000": 7,
    "1000-2500": 10,
    "2500-5000": 15,
    "5000-plus": 15,
  },
  monthlyAdSpend: {
    "0": 0,
    "under-1000": 3,
    "1000-2500": 7,
    "2500-5000": 10,
    "5000-10000": 15,
    "10000-plus": 15,
  },
  capacity: {
    "1-5": 2,
    "6-10": 5,
    "11-25": 10,
    "26-50": 15,
    "50-plus": 15,
  },
  startTimeline: {
    immediately: 10,
    "within-2-weeks": 8,
    "within-30-days": 5,
    "1-3-months": 2,
    researching: 0,
  },
  willingnessToInvest: {
    yes: 15,
    possibly: 5,
    no: -25,
  },
  leadResponseTime: {
    "under-5-min": 10,
    "5-15-min": 8,
    "15-60-min": 5,
    "few-hours": 2,
    "within-24h": 0,
    "longer-24h": -5,
    "no-process": 0,
  },
};

function scoreAnswers(answers) {
  const breakdown = {};
  let score = 0;
  for (const [field, map] of Object.entries(SCORE_WEIGHTS)) {
    const points = map[answers[field]] ?? 0;
    breakdown[field] = points;
    score += points;
  }
  let status = "NOT_QUALIFIED";
  if (score >= SCORE_THRESHOLDS.highlyQualifiedMin) status = "HIGHLY_QUALIFIED";
  else if (score >= SCORE_THRESHOLDS.potentiallyQualifiedMin) status = "POTENTIALLY_QUALIFIED";
  return { score, status, breakdown };
}

const people = [
  {
    id: "A",
    label: "Established service business, strong economics, fast response",
    answers: {
      monthlyRevenue: "50k-100k",
      customerValue: "2500-5000",
      monthlyAdSpend: "2500-5000",
      capacity: "11-25",
      startTimeline: "immediately",
      willingnessToInvest: "yes",
      leadResponseTime: "5-15-min",
    },
    expect: "HIGHLY_QUALIFIED",
  },
  {
    id: "B",
    label: "$20k revenue, $1k ads, $800 customer value, 30-day timeline",
    answers: {
      monthlyRevenue: "10k-25k",
      customerValue: "500-1000",
      monthlyAdSpend: "1000-2500",
      capacity: "6-10",
      startTimeline: "within-30-days",
      willingnessToInvest: "yes",
      leadResponseTime: "few-hours",
    },
    expect: "POTENTIALLY_QUALIFIED",
  },
  {
    id: "C",
    label: "Pre-revenue, no budget, researching",
    answers: {
      monthlyRevenue: "pre-revenue",
      customerValue: "under-250",
      monthlyAdSpend: "0",
      capacity: "1-5",
      startTimeline: "researching",
      willingnessToInvest: "no",
      leadResponseTime: "no-process",
    },
    expect: "NOT_QUALIFIED",
  },
  {
    id: "D",
    label: "Strong business, advertising, slow lead response",
    answers: {
      monthlyRevenue: "100k-250k",
      customerValue: "5000-plus",
      monthlyAdSpend: "2500-5000",
      capacity: "11-25",
      startTimeline: "within-2-weeks",
      willingnessToInvest: "yes",
      leadResponseTime: "within-24h",
    },
    expect: "HIGHLY_QUALIFIED",
  },
];

let failed = 0;
for (const person of people) {
  const result = scoreAnswers(person.answers);
  const ok = result.status === person.expect;
  if (!ok) failed += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"} Person ${person.id}: score=${result.score} status=${result.status} (expected ${person.expect}) — ${person.label}`
  );
}

if (failed) {
  console.error(`\n${failed} persona(s) failed.`);
  process.exit(1);
}
console.log("\nAll persona scoring checks passed.");
