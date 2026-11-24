/**
 * Black Friday / Cyber Monday promotion: the single source of truth.
 *
 * TO CHANGE THE DATES: edit `PROMO_START` and `PROMO_END` below, nothing else.
 * Both are ISO 8601 instants with an explicit offset. The end is exclusive, so
 * "2026-12-01T00:00:00-07:00" means the offer runs through the end of Monday,
 * November 30 in US Mountain Time (MST, UTC-7, in November).
 *
 * Everything promotional (bar, homepage band, pricing callout, /black-friday,
 * form notes, lead attribution) reads from this file and switches itself off
 * once the end passes. It is checked at build time and again in the browser
 * (see src/components/promo/promo-client.ts), so no rebuild is needed to expire.
 *
 * COPY RULE: the owner's terms are exactly three, as agreed in the trial terms:
 *   1. 15-day risk-free trial: the first month is paid at kickoff and refunded in
 *      full if the client cancels by day 15. Never call it a free trial.
 *   2. No three-month initial term. The regular plans start with a three-month
 *      initial term (see /pricing); Black Friday clients skip it and go month to
 *      month after the trial.
 *   3. Setup fee waived for anyone who opts in to marketing texts when they claim.
 *      Text consent is optional and never a condition of claiming or buying
 *      (see src/lib/sms-consent.ts).
 *      The owner approved stating the saving as "Up to $1000 off" (Nov 24).
 * Do not add prices, eligibility, scarcity, or other savings here.
 */
export const PROMO_START = "2026-11-16T00:00:00-07:00";
export const PROMO_END = "2026-12-01T00:00:00-07:00";

const TIME_ZONE = "America/Denver";

export interface PromoBenefit {
  id: "trial" | "contract" | "setup";
  /** Short label, used in bars, notes, and as the benefit heading. */
  label: string;
  /** One plain sentence that only restates the benefit. */
  line: string;
}

const benefits: PromoBenefit[] = [
  {
    id: "trial",
    label: "15-day risk-free trial",
    line: "Your first month is paid at kickoff and refunded in full if you cancel by day 15.",
  },
  {
    id: "contract",
    label: "No 3-month term",
    line: "Our usual three-month initial term is waived. After the trial, it's month to month.",
  },
  {
    id: "setup",
    label: "No setup fee. Up to $1000 off with text opt-in",
    line: "Opt in to offer texts when you claim, and we waive our setup fee. That's up to $1000 off.",
  },
];

export const PROMO = {
  id: "bfcm-2026",
  name: "Black Friday and Cyber Monday",
  start: PROMO_START,
  end: PROMO_END,
  timeZone: TIME_ZONE,
  timeZoneLabel: "Mountain Time",
  benefits,
  /** Brent's strategy call calendar (GoHighLevel). Shown right after someone claims. */
  bookingUrl: "https://brand.maaxgen.com/widget/bookings/brent-jadag",
  cta: {
    claim: "Claim the offer",
    see: "See the offer",
    alt: "Grade my ads",
    book: "Pick a time for your call",
  },
  copy: {
    /** Mobile promo bar: must stay one short line at 320px. */
    barShort: "Black Friday: 15-day risk-free trial",
    headline: "Start with a risk-free trial, not a three-month term.",
    pageHeadline: "Start with a 15-day risk-free trial.",
    pageLead:
      "Claim the offer and we will confirm the specifics with you on a strategy call.",
    callNote: "The specifics are confirmed on the call.",
    /** One quiet line near the submit button of other lead forms. */
    note: "Black Friday offer applies: 15-day risk-free trial (full refund if you cancel by day 15), no three-month term, and no setup fee (up to $1000 off) when you opt in to offer texts.",
    metaDescription:
      "MaaxGen Black Friday: a 15-day risk-free trial with a full refund if you cancel by day 15, no three-month term, and no setup fee (up to $1000 off) when you opt in to texts.",
  },
} as const;

/** True when `now` falls inside [start, end). Safe at build time and in the browser. */
export function isPromoActive(now: Date = new Date()): boolean {
  const t = now.getTime();
  const start = Date.parse(PROMO.start);
  const end = Date.parse(PROMO.end);
  if (Number.isNaN(t) || Number.isNaN(start) || Number.isNaN(end)) return false;
  return t >= start && t < end;
}

/** Milliseconds until the promotion ends (can be negative). */
export function msUntilPromoEnd(now: Date = new Date()): number {
  return Date.parse(PROMO.end) - now.getTime();
}

/** The last day the offer is valid, derived from PROMO_END, e.g. "Monday, November 30". */
export function promoEndDateLabel(): string {
  const lastMoment = new Date(Date.parse(PROMO.end) - 1);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(lastMoment);
}

/** Honest deadline line, e.g. "Ends Monday, November 30 at 11:59 pm Mountain Time". */
export function promoDeadlineLine(): string {
  return `Ends ${promoEndDateLabel()} at 11:59 pm ${PROMO.timeZoneLabel}`;
}
