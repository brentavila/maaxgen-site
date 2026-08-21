import { SCORE_THRESHOLDS } from "./config";
import type { FunnelAnswers, QualificationStatus, ScoreResult } from "./types";

/**
 * Lead scoring weights — edit values here; do not bury rules in UI components.
 * Numbers are initial placeholders.
 */
export const SCORE_WEIGHTS = {
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
} as const;

function scoreField(
  map: Record<string, number>,
  value: string | string[] | undefined
): number {
  if (typeof value !== "string" || !value) return 0;
  return map[value] ?? 0;
}

export function statusFromScore(score: number): QualificationStatus {
  if (score >= SCORE_THRESHOLDS.highlyQualifiedMin) return "HIGHLY_QUALIFIED";
  if (score >= SCORE_THRESHOLDS.potentiallyQualifiedMin) return "POTENTIALLY_QUALIFIED";
  return "NOT_QUALIFIED";
}

export function scoreAnswers(answers: FunnelAnswers): ScoreResult {
  const breakdown: Record<string, number> = {
    monthlyRevenue: scoreField(SCORE_WEIGHTS.monthlyRevenue, answers.monthlyRevenue),
    customerValue: scoreField(SCORE_WEIGHTS.customerValue, answers.customerValue),
    monthlyAdSpend: scoreField(SCORE_WEIGHTS.monthlyAdSpend, answers.monthlyAdSpend),
    capacity: scoreField(SCORE_WEIGHTS.capacity, answers.capacity),
    startTimeline: scoreField(SCORE_WEIGHTS.startTimeline, answers.startTimeline),
    willingnessToInvest: scoreField(
      SCORE_WEIGHTS.willingnessToInvest,
      answers.willingnessToInvest
    ),
    leadResponseTime: scoreField(SCORE_WEIGHTS.leadResponseTime, answers.leadResponseTime),
  };

  const score = Object.values(breakdown).reduce((sum, n) => sum + n, 0);

  return {
    score,
    status: statusFromScore(score),
    breakdown,
  };
}

/** Event name for analytics (never show numeric score in UI) */
export function statusEventName(
  status: QualificationStatus
): "lead_highly_qualified" | "lead_potentially_qualified" | "lead_not_qualified" {
  if (status === "HIGHLY_QUALIFIED") return "lead_highly_qualified";
  if (status === "POTENTIALLY_QUALIFIED") return "lead_potentially_qualified";
  return "lead_not_qualified";
}
