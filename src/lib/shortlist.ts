/**
 * Service shortlist: the visitor's "my interested services" list.
 *
 * Browser-only, dependency-free (apart from the service catalogue). Persists to
 * localStorage as a JSON array of ids, with an in-memory fallback so private
 * windows still work for the life of the page. Markup is driven by data
 * attributes; see `initShortlistUI`.
 */
import { serviceById, services } from "../data/services";
import { pageType, track as trackEvent } from "./tracking";

export const SHORTLIST_KEY = "maaxgen-interested-services";
export const SHORTLIST_EVENT = "maaxgen:shortlist-change"; // CustomEvent<{ ids: string[] }> on document

let memory: string[] = [];
let storageOk = true;

function clean(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === "string" && !seen.has(item) && serviceById(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}

function read(): string[] {
  if (typeof window === "undefined") return [];
  if (storageOk) {
    try {
      const raw = window.localStorage.getItem(SHORTLIST_KEY);
      memory = raw ? clean(JSON.parse(raw)) : [];
    } catch {
      storageOk = false;
    }
  }
  return memory.slice();
}

function emit(ids: string[]): void {
  document.dispatchEvent(new CustomEvent(SHORTLIST_EVENT, { detail: { ids } }));
}

function write(ids: string[]): void {
  memory = ids.slice();
  if (storageOk) {
    try {
      window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(memory));
    } catch {
      storageOk = false;
    }
  }
  emit(memory.slice());
}

function trackAdd(ids: string[], count: number): void {
  trackEvent("add_to_shortlist", { service_id: ids.join(","), service_count: count, source: pageType() });
}

export function getShortlist(): string[] {
  return read();
}

export function hasService(id: string): boolean {
  return read().includes(id);
}

export function addService(id: string): void {
  if (!serviceById(id)) return;
  const ids = read();
  if (ids.includes(id)) return;
  ids.push(id);
  write(ids);
  trackAdd([id], ids.length);
}

export function removeService(id: string): void {
  const ids = read();
  if (!ids.includes(id)) return;
  const next = ids.filter((x) => x !== id);
  write(next);
}

export function toggleService(id: string): boolean {
  if (!serviceById(id)) return false;
  if (hasService(id)) {
    removeService(id);
    return false;
  }
  addService(id);
  return true;
}

/**
 * Add several services in one write (for example every service an industry play draws on).
 * Unknown and already-shortlisted ids are skipped. Fires one `add_to_shortlist` for the batch
 * (service_id is the comma-joined ids actually added).
 */
export function addServices(ids: string[]): void {
  const current = read();
  const added: string[] = [];
  for (const id of ids) {
    if (serviceById(id) && !current.includes(id) && !added.includes(id)) added.push(id);
  }
  if (!added.length) return;
  write(current.concat(added));
  trackAdd(added, current.length + added.length);
}

/** Remove several services in one write. */
export function removeServices(ids: string[]): void {
  const current = read();
  const removed = current.filter((id) => ids.includes(id));
  if (!removed.length) return;
  const next = current.filter((id) => !ids.includes(id));
  write(next);
}

/** True when every id (at least one) is on the shortlist. */
export function hasAllServices(ids: string[]): boolean {
  const current = read();
  return ids.length > 0 && ids.every((id) => current.includes(id));
}

export function clearShortlist(): void {
  if (read().length === 0) return;
  write([]);
}

export function onShortlistChange(cb: (ids: string[]) => void): () => void {
  const onLocal = (event: Event) => {
    const detail = (event as CustomEvent<{ ids: string[] }>).detail;
    cb(detail && Array.isArray(detail.ids) ? detail.ids : read());
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === SHORTLIST_KEY || event.key === null) cb(read());
  };
  document.addEventListener(SHORTLIST_EVENT, onLocal);
  window.addEventListener("storage", onStorage);
  return () => {
    document.removeEventListener(SHORTLIST_EVENT, onLocal);
    window.removeEventListener("storage", onStorage);
  };
}

/* ------------------------------------------------------------------ UI */

const HOOKS =
  "[data-shortlist-toggle],[data-shortlist-count],[data-shortlist-empty],[data-shortlist-filled],[data-shortlist-names],[data-shortlist-chips],[data-shortlist-add-many]";

/**
 * `[data-shortlist-add-many="a,b,c"]`: a toggle for a set of services. Pressed (and
 * `.is-shortlisted`) when every id is shortlisted. A click adds the missing ones; when all
 * are already there it removes them, unless the element also has `data-shortlist-add-only`.
 * Supports the same `data-label-add` / `data-label-remove` labels as `[data-shortlist-toggle]`.
 */
const parseIds = (el: Element): string[] =>
  (el.getAttribute("data-shortlist-add-many") || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && serviceById(s));

function renderChips(container: Element, ids: string[]): void {
  container.textContent = "";
  // Display in catalogue order; the stored order is untouched.
  const order = (id: string) => services.findIndex((s) => s.id === id);
  for (const id of ids.slice().sort((a, b) => order(a) - order(b))) {
    const service = serviceById(id);
    if (!service) continue;
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "shortlist-chip";
    chip.setAttribute("data-shortlist-toggle", id);
    chip.setAttribute("data-shortlist-chip", "");
    const sr = document.createElement("span");
    sr.className = "shortlist-sr";
    sr.textContent = "Remove ";
    const num = document.createElement("span");
    num.className = "shortlist-chip__num";
    num.textContent = service.num;
    const name = document.createElement("span");
    name.className = "shortlist-chip__name";
    name.textContent = service.name;
    const x = document.createElement("span");
    x.className = "shortlist-chip__x";
    x.setAttribute("aria-hidden", "true");
    x.textContent = "×";
    chip.append(sr, num, name, x);
    container.append(chip);
  }
}

function sync(root: ParentNode, ids: string[]): void {
  const count = ids.length;
  const names = ids
    .map((id) => serviceById(id)?.name ?? "")
    .filter(Boolean)
    .join(", ");

  root.querySelectorAll<HTMLElement>("[data-shortlist-chips]").forEach((el) => renderChips(el, ids));

  root.querySelectorAll<HTMLElement>("[data-shortlist-toggle]").forEach((el) => {
    const id = el.getAttribute("data-shortlist-toggle") || "";
    const on = ids.includes(id);
    el.classList.toggle("is-shortlisted", on);
    if (!el.hasAttribute("data-shortlist-chip")) el.setAttribute("aria-pressed", on ? "true" : "false");
    const label = el.getAttribute(on ? "data-label-remove" : "data-label-add");
    if (label !== null) {
      const target = el.querySelector("[data-shortlist-label]");
      if (target) target.textContent = label;
      else el.setAttribute("aria-label", label);
    }
  });
  root.querySelectorAll<HTMLElement>("[data-shortlist-add-many]").forEach((el) => {
    const set = parseIds(el);
    const on = set.length > 0 && set.every((id) => ids.includes(id));
    el.classList.toggle("is-shortlisted", on);
    if (!el.hasAttribute("data-shortlist-add-only")) el.setAttribute("aria-pressed", on ? "true" : "false");
    const label = el.getAttribute(on ? "data-label-remove" : "data-label-add");
    if (label !== null) {
      const target = el.querySelector("[data-shortlist-label]");
      if (target) target.textContent = label;
      else el.setAttribute("aria-label", label);
    }
  });
  root.querySelectorAll<HTMLElement>("[data-shortlist-count]").forEach((el) => {
    el.textContent = String(count);
  });
  root.querySelectorAll<HTMLElement>("[data-shortlist-empty]").forEach((el) => {
    el.hidden = count > 0;
  });
  root.querySelectorAll<HTMLElement>("[data-shortlist-filled]").forEach((el) => {
    el.hidden = count === 0;
  });
  root.querySelectorAll<HTMLElement>("[data-shortlist-names]").forEach((el) => {
    el.textContent = names;
  });
}

function restoreFocusAfterChipRemoval(container: Element, index: number): void {
  const chips = container.querySelectorAll<HTMLElement>("[data-shortlist-chip]");
  if (chips.length) {
    chips[Math.min(index, chips.length - 1)].focus();
    return;
  }
  const empty = document.querySelector<HTMLElement>("[data-shortlist-empty]:not([hidden])");
  if (empty && empty.hasAttribute("tabindex")) {
    empty.focus();
    return;
  }
  container.closest("form")?.querySelector<HTMLElement>("input,select,textarea")?.focus();
}

export function initShortlistUI(root: ParentNode = document): void {
  if (typeof document === "undefined") return;
  const doc = document as Document & { __maaxShortlistUI?: boolean };
  if (!doc.__maaxShortlistUI) {
    doc.__maaxShortlistUI = true;

    document.addEventListener("click", (event) => {
      const origin = event.target as Element | null;
      const many = origin && origin.closest ? origin.closest<HTMLElement>("[data-shortlist-add-many]") : null;
      if (many) {
        const set = parseIds(many);
        if (!set.length) return;
        if (many instanceof HTMLAnchorElement) event.preventDefault();
        if (!many.hasAttribute("data-shortlist-add-only") && hasAllServices(set)) removeServices(set);
        else addServices(set);
        return;
      }
      const el = origin && origin.closest ? origin.closest<HTMLElement>("[data-shortlist-toggle]") : null;
      if (!el) return;
      const id = el.getAttribute("data-shortlist-toggle");
      if (!id) return;
      if (el instanceof HTMLAnchorElement) event.preventDefault();

      const container = el.hasAttribute("data-shortlist-chip") ? el.closest("[data-shortlist-chips]") : null;
      const index = container ? Array.from(container.children).indexOf(el) : -1;
      toggleService(id);
      if (container) restoreFocusAfterChipRemoval(container, index);
    });

    onShortlistChange((ids) => sync(document, ids));

    // Elements added after init (cards rendered by script, dialogs) get their state too.
    if ("MutationObserver" in window) {
      new MutationObserver((records) => {
        for (const record of records) {
          for (const node of Array.from(record.addedNodes)) {
            if (node.nodeType !== 1) continue;
            const el = node as Element;
            if (el.hasAttribute("data-shortlist-chip")) continue; // our own render output
            if (el.matches(HOOKS) || el.querySelector(HOOKS)) {
              sync(document, getShortlist());
              return;
            }
          }
        }
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
  }
  sync(root, getShortlist());
}
