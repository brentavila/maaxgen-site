/**
 * Shared browser-side pieces of a lead submit: the webhook POST, the Meta Pixel
 * Lead event, and a dataLayer push. Used by the industry lead form. The contact
 * form, plan dialog, and Black Friday claim form keep their own inline copies.
 */

/** POST a JSON payload to the lead webhook. `no-cors`: the response is opaque, so only network failure throws. */
export async function postLead(url: string, payload: Record<string, unknown>): Promise<void> {
  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** Meta Pixel Lead event, same shape as the other forms. */
export function trackLeadPixel(contentName: string, businessType: string): void {
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (typeof w.fbq !== "function") return;
  try {
    w.fbq("track", "Lead", {
      content_name: contentName,
      content_category: businessType || "unspecified",
      value: 1,
      currency: "USD",
    });
  } catch {
    /* analytics must never break the form */
  }
}

export function pushDataLayer(event: string, data: Record<string, unknown>): void {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  } catch {
    /* analytics must never break the form */
  }
}
