/**
 * Page-level automatic tracking: attribution capture plus delegated listeners for
 * tel:/mailto: links, [data-track-cta] buttons, and the first focus in form[data-lead-form].
 */
import { captureAttribution } from "./attribution";
import type { LeadFormId } from "./contract";
import { track } from "./track";

const FLAG = "__maaxTrackingInit";

function placementOf(el: Element): string {
  const explicit = el.closest<HTMLElement>("[data-track-placement]")?.dataset.trackPlacement;
  if (explicit) return explicit;
  const section = el.closest("section[id]");
  if (section) return section.id;
  const landmark = el.closest("header, footer, nav, aside, dialog, main");
  return landmark ? landmark.tagName.toLowerCase() : "";
}

function textOf(el: Element): string {
  const label = el.getAttribute("aria-label") || (el as HTMLElement).innerText || el.textContent || "";
  return label.replace(/\s+/g, " ").trim().slice(0, 100);
}

function onClick(event: Event): void {
  try {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest<HTMLAnchorElement>('a[href^="tel:"], a[href^="mailto:"]');
    if (link) {
      const href = link.getAttribute("href") || "";
      track(href.startsWith("tel:") ? "click_to_call" : "click_email", {
        link_url: href,
        placement: placementOf(link),
      });
    }

    const cta = target.closest<HTMLElement>("[data-track-cta]");
    if (cta) {
      track("cta_click", {
        cta_id: cta.dataset.trackCta || "",
        cta_text: textOf(cta),
        placement: placementOf(cta),
      });
    }
  } catch {
    /* analytics never breaks the page */
  }
}

const startedForms = new WeakSet<HTMLFormElement>();

function onFocusIn(event: Event): void {
  try {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const form = target.closest<HTMLFormElement>("form[data-lead-form]");
    if (!form || startedForms.has(form)) return;
    startedForms.add(form);
    track("form_start", { form_id: (form.dataset.leadForm || "") as LeadFormId | "" });
  } catch {
    /* analytics never breaks the page */
  }
}

/** Call once per page (BaseLayout does). Safe to call again: later calls are no-ops. */
export function initTracking(): void {
  const w = window as unknown as Record<string, unknown>;
  if (w[FLAG]) return;
  w[FLAG] = true;

  try {
    captureAttribution();
  } catch {
    /* attribution is best effort */
  }
  document.addEventListener("click", onClick, { capture: true });
  document.addEventListener("focusin", onFocusIn, { capture: true });
}
