import { resolveWebhookUrl } from "../config";
import type { NormalizedLeadPayload } from "../types";

export type SubmitResult =
  | { ok: true; mode: "webhook" | "stored-local" }
  | { ok: false; error: string };

/**
 * CRM integration layer — UI should only call this.
 * When no webhook is configured, payload is stored for local QA and returns ok.
 */
export async function submitLead(payload: NormalizedLeadPayload): Promise<SubmitResult> {
  const webhookUrl = resolveWebhookUrl();

  if (!webhookUrl) {
    try {
      sessionStorage.setItem(
        "maaxgen_funnel_last_lead_v1",
        JSON.stringify(payload)
      );
    } catch {
      /* ignore quota errors */
    }
    return { ok: true, mode: "stored-local" };
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: true, mode: "webhook" };
  } catch {
    return { ok: false, error: "Unable to submit right now. Please try again." };
  }
}

export async function submitNqResourceRequest(input: {
  email: string;
  firstName?: string;
  payloadExtras?: Record<string, unknown>;
}): Promise<SubmitResult> {
  const base = {
    type: "nq_checklist_request",
    email: input.email,
    firstName: input.firstName ?? "",
    timestamp: new Date().toISOString(),
    source: "growth-system-funnel",
    ...input.payloadExtras,
  };

  const webhookUrl = resolveWebhookUrl();
  if (!webhookUrl) {
    try {
      sessionStorage.setItem("maaxgen_funnel_nq_request_v1", JSON.stringify(base));
    } catch {
      /* ignore */
    }
    return { ok: true, mode: "stored-local" };
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(base),
    });
    return { ok: true, mode: "webhook" };
  } catch {
    return { ok: false, error: "Unable to send right now. Please try again." };
  }
}
