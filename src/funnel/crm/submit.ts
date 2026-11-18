import { submitLead as submitTrackedLead } from "../../lib/tracking";
import type { NormalizedLeadPayload } from "../types";

export type SubmitResult = { ok: true; mode: "sent" | "dry-run" } | { ok: false; error: string };

const join = (v: string[]) => v.join(",");

/**
 * CRM integration layer: leads go through /api/lead (src/lib/tracking). No webhook URL ships to the browser.
 * `startedAt` is when the visitor began the questionnaire (Date.now() ms); `hp` is the honeypot value.
 */
export async function submitLead(
  payload: NormalizedLeadPayload,
  meta: { startedAt: number; hp: string }
): Promise<SubmitResult> {
  try {
    const res = await submitTrackedLead({
      formId: "growth_system",
      contact: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        company: payload.businessName,
        website: payload.website,
      },
      fields: {
        businessType: payload.businessType,
        businessTypeOther: payload.businessTypeOther,
        monthlyRevenue: payload.monthlyRevenue,
        customerValue: payload.customerValue,
        currentAdvertising: join(payload.currentAdvertising),
        monthlyAdSpend: payload.monthlyAdSpend,
        capacity: payload.capacity,
        marketingChallenges: join(payload.marketingChallenges),
        marketingChallengeOther: payload.marketingChallengeOther,
        leadResponseTime: payload.leadResponseTime,
        crmStatus: payload.crmStatus,
        crmName: payload.crmName,
        startTimeline: payload.startTimeline,
        willingnessToInvest: payload.willingnessToInvest,
        qualificationScore: String(payload.qualificationScore),
        qualificationStatus: payload.qualificationStatus,
        qualifier: payload.qualificationStatus,
        funnelVariant: payload.funnelVariant,
        funnelSource: payload.source,
        funnelTimestamp: payload.timestamp,
      },
      hp: meta.hp,
      startedAt: meta.startedAt,
    });
    if (!res.ok) return { ok: false, error: "Unable to submit right now. Please try again." };
    return { ok: true, mode: res.mode };
  } catch {
    return { ok: false, error: "Unable to submit right now. Please try again." };
  }
}

/** Not-qualified visitors asking for the acquisition checklist: a second, email-only lead. */
export async function submitNqResourceRequest(input: {
  email: string;
  firstName?: string;
  payloadExtras?: Record<string, unknown>;
  startedAt: number;
  hp: string;
}): Promise<SubmitResult> {
  try {
    const res = await submitTrackedLead({
      formId: "growth_system",
      leadSource: "growth-system-nq-checklist",
      conversion: false, // CRM only: a not-qualified checklist request is not an ad conversion
      contact: { firstName: input.firstName || "there", email: input.email },
      fields: {
        type: "nq_checklist_request",
        qualificationStatus: String(input.payloadExtras?.qualificationStatus ?? ""),
        funnelSource: "growth-system-funnel",
      },
      hp: input.hp,
      startedAt: input.startedAt,
    });
    if (!res.ok) return { ok: false, error: "Unable to send right now. Please try again." };
    return { ok: true, mode: res.mode };
  } catch {
    return { ok: false, error: "Unable to send right now. Please try again." };
  }
}
