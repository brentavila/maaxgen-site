/**
 * Browser side of the promotion (see src/data/promo.ts).
 *
 * - Keeps `html[data-promo="on|off"]` correct against the visitor's clock.
 *   promo.css shows/hides every `[data-promo-when="active|ended"]` element from it.
 * - Fills and updates `[data-promo-countdown]` once a minute.
 * - Tracks `promo_cta_click` for `[data-promo-cta]` links.
 * - Exposes attribution + tracking helpers for the lead forms.
 */
import { PROMO, isPromoActive, msUntilPromoEnd } from "../../data/promo";

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export const PROMO_REFRESH_EVENT = "maaxgen:promo-refresh"; // dispatch on document to re-check the clock
export const PROMO_CHANGE_EVENT = "maaxgen:promo-change"; // CustomEvent<{ active: boolean }> on document

export function promoActiveNow(): boolean {
  return isPromoActive(new Date());
}

/** promoId / promoName for lead payloads: empty strings when the promotion is not active. */
export function getPromoAttribution(): { promoId: string; promoName: string } {
  return promoActiveNow() ? { promoId: PROMO.id, promoName: PROMO.name } : { promoId: "", promoName: "" };
}

export function trackPromo(event: string, data: Record<string, unknown> = {}): void {
  try {
    const w = window as DataLayerWindow;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, promo_id: PROMO.id, ...data });
  } catch {
    /* analytics must never break the page */
  }
}

let timer: number | undefined;
let lastActive: boolean | null = null;

function tick(): void {
  const active = promoActiveNow();
  document.documentElement.setAttribute("data-promo", active ? "on" : "off");
  if (lastActive !== null && lastActive !== active) {
    document.dispatchEvent(new CustomEvent(PROMO_CHANGE_EVENT, { detail: { active } }));
  }
  lastActive = active;

  const ms = Math.max(0, msUntilPromoEnd(new Date()));
  const totalMinutes = Math.floor(ms / 60000);
  const parts = {
    days: Math.floor(totalMinutes / 1440),
    hours: Math.floor((totalMinutes % 1440) / 60),
    minutes: totalMinutes % 60,
  };
  document.querySelectorAll<HTMLElement>("[data-promo-countdown]").forEach((box) => {
    (Object.keys(parts) as (keyof typeof parts)[]).forEach((unit) => {
      const value = parts[unit];
      const num = box.querySelector<HTMLElement>(`[data-unit="${unit}"]`);
      const label = box.querySelector<HTMLElement>(`[data-unit-label="${unit}"]`);
      if (num) num.textContent = String(value);
      if (label) label.textContent = value === 1 ? unit.slice(0, -1) : unit;
    });
  });

  window.clearTimeout(timer);
  if (ms > 0 || !active) {
    // Wake just after the minute rolls over so the displayed minutes are never stale.
    const delay = Math.max(1000, (ms % 60000) + 50);
    timer = window.setTimeout(tick, delay);
  }
}

export function initPromo(): void {
  if (typeof document === "undefined") return;
  const doc = document as Document & { __maaxPromoInit?: boolean };
  if (doc.__maaxPromoInit) return;
  doc.__maaxPromoInit = true;

  tick();
  document.addEventListener(PROMO_REFRESH_EVENT, tick);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tick();
  });

  document.addEventListener("click", (event) => {
    const target = event.target as Element | null;
    const el = target && target.closest ? target.closest<HTMLAnchorElement>("[data-promo-cta]") : null;
    if (!el) return;
    trackPromo("promo_cta_click", {
      placement: el.getAttribute("data-promo-placement") || "",
      destination: el.getAttribute("href") || "",
    });
  });
}
