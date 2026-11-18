/**
 * Studio state machine, shared by the homepage Service Studio (ServiceStudio.astro)
 * and the industry heroes (IndustryStudio.astro). Moves attributes and classes
 * only; all copy is server-rendered.
 *
 * State: view (stack | focus | grid), active card id, filter, query.
 * URL: <hash prefix><id> opens focus view. Opening from a card pushes one history
 * entry (Back closes it); prev/next and "works best with" jumps replace it.
 *
 * Everything page-specific is read from the [data-studio] root, with defaults that
 * are the homepage's values:
 *   data-studio-hash        hash prefix for deep links        "#studio/"
 *   data-studio-noun        singular noun for announcements   "service"
 *   data-studio-nouns       plural noun                       "services"
 *   data-studio-source      dataLayer `source`                "service-studio"
 *   data-studio-open-event  dataLayer event on open           "studio_service_open"
 *   data-studio-id-param    dataLayer key for the opened id   "service_id"
 *   data-studio-clone-visuals  (flag, industry pages) detail visuals are empty
 *                              [data-studio-visual-slot]s filled with a copy of the
 *                              card's illustration on first open, so each one is in
 *                              the HTML once. Absent on the homepage.
 * A detail's [data-studio-heading] (else .studio-detail__title) receives focus on open.
 * Cards: [data-studio-card=<id>] with data-cat (filter value) and data-search (lowercase text).
 */
import { onShortlistChange, getShortlist } from "../lib/shortlist";

type View = "stack" | "focus" | "grid";

const AUTO_MS = 6000;
const DEPTHS = 4;

function makeTrack(source: string) {
  return function track(event: string, params: Record<string, string | number>): void {
    // Same convention as src/funnel/track.ts: consent-aware dataLayer push.
    try {
      const consent = (window as unknown as { MaaxConsent?: { get?: () => { analytics?: boolean } | null } })
        .MaaxConsent;
      if (consent && typeof consent.get === "function" && !consent.get()?.analytics) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event, ...params, source });
    } catch {
      /* analytics must never break the page */
    }
  };
}

/** Initialise every studio on the page (normally one). */
export function initStudio(): void {
  document.querySelectorAll<HTMLElement>("[data-studio]").forEach(initStudioRoot);
}

export function initStudioRoot(root: HTMLElement): void {
  if (!root || root.dataset.studioReady) return;
  root.dataset.studioReady = "1";

  const HASH_PREFIX = root.dataset.studioHash || "#studio/";
  const NOUN = root.dataset.studioNoun || "service";
  const NOUNS = root.dataset.studioNouns || "services";
  const OPEN_EVENT = root.dataset.studioOpenEvent || "studio_service_open";
  const ID_PARAM = root.dataset.studioIdParam || "service_id";
  const track = makeTrack(root.dataset.studioSource || "service-studio");
  const CLONE_VISUALS = root.hasAttribute("data-studio-clone-visuals");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));

  const cards = $$<HTMLLIElement>("[data-studio-card]");
  const ids = cards.map((c) => c.dataset.studioCard as string);
  const cardById = new Map(cards.map((c) => [c.dataset.studioCard as string, c]));
  const peekById = new Map($$("[data-studio-peek]").map((p) => [p.dataset.studioPeek as string, p]));
  const detailById = new Map($$("[data-studio-detail]").map((d) => [d.dataset.studioDetail as string, d]));
  const viewBtns = $$<HTMLButtonElement>("[data-studio-view-btn]");
  const filterBtns = $$<HTMLButtonElement>("[data-studio-filter]");
  const search = $<HTMLInputElement>("[data-studio-search]")!;
  const deck = $("[data-studio-deck]")!;
  const live = $("[data-studio-live]")!;
  const empty = $("[data-studio-empty]")!;
  const emptyQuery = $("[data-studio-empty-query]")!;
  const position = $("[data-studio-position]")!;
  const counter = $("[data-studio-counter-text]")!;
  const plural = $("[data-studio-plural]");

  let view: View = "stack";
  let returnView: Exclude<View, "focus"> = "stack";
  let active = ids[0];
  let filter = "all";
  let query = "";
  let visible = ids.slice();
  let opener: HTMLElement | null = null;
  let pushedFocus = false;

  /* ---------------------------------------------------------- rendering */

  const pad = (n: number) => String(n).padStart(2, "0");
  const nameOf = (id: string) =>
    cardById.get(id)?.querySelector(".studio-card__name")?.textContent?.trim() ?? id;

  function computeVisible(): void {
    const q = query.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    visible = ids.filter((id) => {
      const card = cardById.get(id)!;
      if (filter !== "all" && card.dataset.cat !== filter) return false;
      if (!terms.length) return true;
      const hay = card.dataset.search || "";
      return terms.every((t) => hay.includes(t));
    });
    if (visible.length && !visible.includes(active)) active = visible[0];
  }

  /**
   * Copy a card's illustration into its detail's empty visual slot (industry pages).
   * SVG ids get a suffix, and every #reference inside the copy is pointed at the new
   * ids, so the page keeps unique ids and the copy's gradients/filters resolve to itself.
   */
  function fillDetailVisual(id: string): void {
    if (!CLONE_VISUALS) return;
    const slot = detailById.get(id)?.querySelector<HTMLElement>("[data-studio-visual-slot]");
    if (!slot || slot.childElementCount) return;
    const source = cardById.get(id)?.querySelector(".studio-card__visual > *");
    if (!source) return;
    const copy = source.cloneNode(true) as Element;
    const renamed = new Map<string, string>();
    [copy, ...Array.from(copy.querySelectorAll("[id]"))].forEach((el) => {
      if (!el.id) return;
      const next = `${el.id}-detail`;
      renamed.set(el.id, next);
      el.id = next;
    });
    if (renamed.size) {
      [copy, ...Array.from(copy.querySelectorAll("*"))].forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
          if (!attr.value.includes("#")) return;
          const value = attr.value.replace(/#([A-Za-z0-9_.:-]+)/g, (m, ref: string) =>
            renamed.has(ref) ? `#${renamed.get(ref)}` : m
          );
          if (value !== attr.value) attr.value = value;
        });
      });
    }
    slot.append(copy);
  }

  function render(): void {
    root.dataset.view = view;
    if (view === "focus") fillDetailVisual(active);
    root.classList.toggle("is-empty", visible.length === 0);
    const pos = visible.indexOf(active);

    cards.forEach((card) => {
      const id = card.dataset.studioCard as string;
      const vi = visible.indexOf(id);
      const isVisible = vi !== -1;
      card.classList.toggle("is-filtered", !isVisible);
      let depth = "out";
      if (isVisible && pos !== -1) {
        const d = (vi - pos + visible.length) % visible.length;
        if (d < DEPTHS) depth = String(d);
      }
      card.dataset.depth = depth;
      const isFront = view === "stack" && depth === "0";
      const interactive = view === "grid" ? isVisible : isFront;
      card.toggleAttribute("data-sv-play", isFront);
      // Back cards are mouse/touch targets only; keyboard users move with arrows or prev/next.
      card.setAttribute("aria-hidden", view === "stack" && !isFront ? "true" : "false");
      card.querySelectorAll<HTMLElement>("a, button").forEach((el) => {
        el.tabIndex = interactive ? 0 : -1;
      });
    });

    peekById.forEach((peek, id) => {
      const on = id === active;
      peek.classList.toggle("is-current", on);
      peek.toggleAttribute("inert", !on);
    });

    detailById.forEach((detail, id) => {
      const on = view === "focus" && id === active;
      detail.classList.toggle("is-current", id === active);
      detail.querySelector(".studio-detail__visual")?.toggleAttribute("data-sv-play", on);
    });

    viewBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.studioViewBtn === view)));
    filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.studioFilter === filter)));

    const label = visible.length ? `${pad(pos + 1)} / ${pad(visible.length)}` : `00 / 00`;
    position.textContent = label;
    counter.textContent = label;

    rewindPlaying();
    empty.hidden = visible.length > 0;
    emptyQuery.textContent = query.trim() ? `“${query.trim()}”` : "that filter";
  }

  function announce(): void {
    const pos = visible.indexOf(active);
    if (pos === -1) {
      live.textContent = `No ${NOUNS} match.`;
      return;
    }
    live.textContent = `${nameOf(active)}, ${pos + 1} of ${visible.length}`;
  }

  function animateStage(): void {
    if (reduced.matches) return;
    root.classList.remove("is-switching");
    void root.offsetWidth;
    root.classList.add("is-switching");
  }
  root.querySelector("[data-studio-stage]")?.addEventListener("animationend", (e) => {
    if (e.target === e.currentTarget) root.classList.remove("is-switching");
  });

  /* -------------------------------------------------------------- views */

  function setView(next: View, opts: { silent?: boolean } = {}): void {
    if (next === view) return;
    if (next === "focus" && !visible.length) return;
    if (view !== "focus") returnView = view as Exclude<View, "focus">;
    view = next;
    animateStage();
    render();
    if (!opts.silent) track("studio_view_change", { view });
    if (view === "stack") {
      ensureClear(peekById.get(active)?.querySelector(".studio-peek__actions"));
    }
  }

  function headerOffset(): number {
    const header = document.querySelector<HTMLElement>(".site-header");
    return header && getComputedStyle(header).position === "sticky" ? header.offsetHeight : 0;
  }

  function bringStudioIntoView(force = false): void {
    const top = root.getBoundingClientRect().top;
    const off = headerOffset();
    if (force || top < off - 4 || top > window.innerHeight * 0.4) {
      window.scrollTo({
        top: Math.max(0, top + window.scrollY - off),
        behavior: reduced.matches ? "auto" : "smooth",
      });
    }
  }

  /** On phones and tablets the dock sticks to the bottom; lift a partly covered control above it. */
  function ensureClear(el: Element | null | undefined): void {
    const dockEl = root.querySelector<HTMLElement>(".studio-dock");
    if (!el || !dockEl || getComputedStyle(dockEl).position !== "sticky") return;
    const r = el.getBoundingClientRect();
    const dockTop = dockEl.getBoundingClientRect().top;
    if (r.bottom > dockTop - 12 && r.top < dockTop) {
      window.scrollBy({ top: r.bottom - dockTop + 16, behavior: reduced.matches ? "auto" : "smooth" });
    }
  }

  function focusDetailHeading(): void {
    const detail = detailById.get(active);
    const h =
      detail?.querySelector<HTMLElement>("[data-studio-heading]") ??
      detail?.querySelector<HTMLElement>(".studio-detail__title");
    h?.focus({ preventScroll: true });
  }

  function openFocus(id: string, how: "push" | "replace" | "none", from?: HTMLElement | null): void {
    if (!cardById.has(id)) return;
    stopAuto();
    if (!visible.includes(id)) {
      // Opening something hidden by the current filter or search: show everything.
      filter = "all";
      query = "";
      search.value = "";
      computeVisible();
    }
    const wasFocus = view === "focus";
    if (from !== undefined && !wasFocus) opener = from;
    active = id;
    if (how === "push") {
      history.pushState({ studio: id }, "", HASH_PREFIX + id);
      pushedFocus = true;
    } else if (how === "replace") {
      history.replaceState(history.state, "", HASH_PREFIX + id);
    }
    if (wasFocus) {
      animateStage();
      render();
    } else {
      setView("focus");
    }
    track(OPEN_EVENT, { [ID_PARAM]: id });
    bringStudioIntoView(!wasFocus);
    // A hash change also triggers the browser's fragment scroll; re-align after it.
    if (how === "none" && !wasFocus) requestAnimationFrame(() => bringStudioIntoView(true));
    focusDetailHeading();
    announce();
  }

  function closeFocus(fromHistory = false, restoreFocus = true): void {
    if (view !== "focus") return;
    if (!fromHistory) {
      if (pushedFocus) {
        pushedFocus = false;
        history.back(); // popstate will call closeFocus(true)
        return;
      }
      history.replaceState(history.state, "", location.pathname + location.search);
    }
    pushedFocus = false;
    setView(returnView);
    if (!restoreFocus) {
      opener = null;
      return;
    }
    const target =
      cardById.get(active)?.querySelector<HTMLElement>("[data-studio-open]") ??
      (opener && opener.isConnected ? opener : null);
    // Prefer the card for the service we were on; it is now the front/active card.
    (target ?? search).focus({ preventScroll: false });
    opener = null;
  }

  function step(dir: 1 | -1, user = true): void {
    if (!visible.length) return;
    const pos = Math.max(0, visible.indexOf(active));
    active = visible[(pos + dir + visible.length) % visible.length];
    if (view === "focus") {
      history.replaceState(history.state, "", HASH_PREFIX + active);
      animateStage();
    }
    render();
    if (user) {
      announce();
      if (view === "stack") ensureClear(peekById.get(active)?.querySelector(".studio-peek__actions"));
    }
  }

  function syncFromHash(): void {
    const h = location.hash;
    if (h.startsWith(HASH_PREFIX)) {
      const id = decodeURIComponent(h.slice(HASH_PREFIX.length));
      if (cardById.has(id)) {
        if (view !== "focus" || active !== id) openFocus(id, "none", null);
        return;
      }
    }
    if (view !== "focus") return;
    // A link to another anchor on the page (for example a form below the hero) was followed
    // while a detail was open: close it without pulling focus back into the hero, then land
    // on that anchor again, since closing changes the hero's height above it.
    const anchorId = h.length > 1 ? decodeURIComponent(h.slice(1)) : "";
    const anchor = anchorId ? document.getElementById(anchorId) : null;
    if (anchor && !root.contains(anchor)) {
      closeFocus(true, false);
      requestAnimationFrame(() => anchor.scrollIntoView({ block: "start", behavior: "auto" }));
      return;
    }
    closeFocus(true);
  }

  /* ----------------------------------------------------- illustration restarts */
  // At rest a visual holds its first keyframe through a long animation-delay (ServiceVisual).
  // When it starts playing (hover, or its card comes to the front), rewind it so the loop
  // starts from the top instead of wherever the clock happens to be.
  const rewind = (el: Element | null | undefined) => {
    if (!el || reduced.matches || typeof (el as Element).getAnimations !== "function") return;
    try {
      el.getAnimations({ subtree: true }).forEach((a) => {
        a.currentTime = 0;
      });
    } catch {
      /* purely cosmetic */
    }
  };
  root.addEventListener("pointerover", (e) => {
    const sv = (e.target as Element).closest?.(".sv");
    if (!sv || (e.relatedTarget instanceof Node && sv.contains(e.relatedTarget))) return;
    if (sv.closest("[data-sv-play]")) return; // already running
    rewind(sv);
  });
  let lastPlaying = "";
  const rewindPlaying = () => {
    const playing = root.querySelector("[data-sv-play]");
    const key = playing ? (playing.closest("[data-studio-card]") as HTMLElement | null)?.dataset.studioCard ?? playing.closest("[data-studio-detail]")?.getAttribute("data-studio-detail") ?? "" : "";
    if (playing && key + view !== lastPlaying) rewind(playing);
    lastPlaying = key + view;
  };

  /* ---------------------------------------------------------- auto-advance */

  let timer = 0;
  let stopped = reduced.matches;
  let onScreen = false;
  let hovering = false;

  function tick(): void {
    if (view === "stack" && !hovering && document.visibilityState === "visible" && onScreen) step(1, false);
  }
  function startAuto(): void {
    if (stopped || timer) return;
    timer = window.setInterval(tick, AUTO_MS);
  }
  function stopAuto(): void {
    stopped = true;
    if (timer) window.clearInterval(timer);
    timer = 0;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
        if (onScreen) startAuto();
      },
      { threshold: 0.35 }
    ).observe(deck);
  }
  // The dock carries its own shortlist summary; hide the floating pill while the dock is on screen.
  const dock = root.querySelector(".studio-dock");
  if (dock && "IntersectionObserver" in window) {
    // Only once the dock is mostly visible, so a sliver of dock never leaves the visitor without either.
    new IntersectionObserver(
      (entries) => {
        document.documentElement.classList.toggle(
          "studio-dock-in-view",
          entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.6)
        );
      },
      { threshold: [0, 0.6, 1] }
    ).observe(dock);
  }
    reduced.addEventListener?.("change", () => reduced.matches && stopAuto());
  ["pointerdown", "keydown", "wheel"].forEach((t) =>
    root.addEventListener(t, () => stopAuto(), { passive: true, capture: true })
  );
  deck.addEventListener("pointerenter", () => (hovering = true));
  deck.addEventListener("pointerleave", () => (hovering = false));

  /* -------------------------------------------------------------- events */

  root.addEventListener("click", (event) => {
    const t = event.target as Element;

    const openEl = t.closest<HTMLAnchorElement>("[data-studio-open]");
    if (openEl) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
      event.preventDefault();
      const id = openEl.dataset.studioOpen as string;
      const card = openEl.closest<HTMLElement>("[data-studio-card]");
      if (card && view === "stack" && card.dataset.depth !== "0") {
        active = id; // a card behind: bring it forward
        render();
        announce();
        ensureClear(peekById.get(active)?.querySelector(".studio-peek__actions"));
        return;
      }
      openFocus(id, "push", openEl);
      return;
    }

    const jump = t.closest<HTMLAnchorElement>("[data-studio-jump]");
    if (jump) {
      event.preventDefault();
      openFocus(jump.dataset.studioJump as string, view === "focus" ? "replace" : "push", jump);
      return;
    }

    if (t.closest("[data-studio-prev]")) return step(-1);
    if (t.closest("[data-studio-next]")) return step(1);
    if (t.closest("[data-studio-close]")) return closeFocus();

    const vb = t.closest<HTMLButtonElement>("[data-studio-view-btn]");
    if (vb) {
      const next = vb.dataset.studioViewBtn as View;
      if (next === "focus") {
        if (view !== "focus") openFocus(active, "push", vb);
      } else if (view === "focus") {
        returnView = next;
        closeFocus();
      } else {
        setView(next);
      }
      return;
    }

    const fb = t.closest<HTMLButtonElement>("[data-studio-filter]");
    if (fb) {
      filter = fb.dataset.studioFilter as string;
      computeVisible();
      if (view === "focus" && visible.length) history.replaceState(history.state, "", HASH_PREFIX + active);
      if (view === "focus" && !visible.length) closeFocus();
      animateStage();
      render();
      announce();
      return;
    }

    if (t.closest("[data-studio-show-grid]")) {
      event.preventDefault();
      if (view === "focus") {
        returnView = "grid";
        closeFocus();
      } else setView("grid");
      bringStudioIntoView();
      $<HTMLElement>(".studio-card:not(.is-filtered) [data-studio-open]")?.focus({ preventScroll: true });
    }
  });

  search.addEventListener("input", () => {
    query = search.value;
    computeVisible();
    if (query.trim() && view !== "grid") {
      if (view === "focus") {
        returnView = "grid";
        closeFocus();
        search.focus();
      } else setView("grid");
    }
    render();
    live.textContent = visible.length
      ? `${visible.length} ${visible.length === 1 ? NOUN : NOUNS} found`
      : `No ${NOUNS} match. Contact us and we will help.`;
  });
  search.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && search.value) {
      e.stopPropagation();
      search.value = "";
      search.dispatchEvent(new Event("input"));
    }
  });

  // Arrow keys move the deck (stack) or the service (focus) when focus is inside them.
  root.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest("input, textarea, select")) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const inDeck = view === "stack" && target.closest("[data-studio-deck]");
      const inFocus = view === "focus" && target.closest("[data-studio-focus]");
      if (!inDeck && !inFocus) return;
      e.preventDefault();
      step(e.key === "ArrowRight" ? 1 : -1);
      if (inDeck && target.closest("[data-studio-card]")) {
        cardById.get(active)?.querySelector<HTMLElement>("[data-studio-open]")?.focus();
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (document.querySelector("dialog[open]")) return;
    const el = e.target as HTMLElement;
    const typing = el.closest("input, textarea, select, [contenteditable='true']");
    if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      search.focus({ preventScroll: true });
      bringStudioIntoView();
      return;
    }
    if (e.key === "Escape" && view === "focus" && !typing) {
      e.preventDefault();
      closeFocus();
    }
  });

  // Swipe on touch to move the deck.
  let sx = 0;
  let sy = 0;
  let swiped = false;
  deck.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse") return;
    sx = e.clientX;
    sy = e.clientY;
    swiped = false;
  });
  deck.addEventListener("pointerup", (e) => {
    if (e.pointerType === "mouse" || view !== "stack") return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      swiped = true;
      step(dx < 0 ? 1 : -1);
    }
  });
  deck.addEventListener(
    "click",
    (e) => {
      if (swiped) {
        e.preventDefault();
        e.stopPropagation();
        swiped = false;
      }
    },
    true
  );

  window.addEventListener("popstate", syncFromHash);
  window.addEventListener("hashchange", syncFromHash);

  const setPlural = (list: string[]) => {
    if (plural) plural.textContent = list.length === 1 ? "service" : "services";
  };
  setPlural(getShortlist());
  onShortlistChange(setPlural);

  /* --------------------------------------------------------------- start */

  computeVisible();
  render();
  if (location.hash.startsWith(HASH_PREFIX)) {
    syncFromHash();
    // The browser's own fragment scroll lands on the article; line the studio up instead.
    const align = () => window.setTimeout(() => view === "focus" && bringStudioIntoView(true), 0);
    if (document.readyState === "complete") align();
    else window.addEventListener("load", align, { once: true });
  } else if (!reduced.matches) {
    root.classList.add("is-intro");
    window.setTimeout(() => root.classList.remove("is-intro"), 1600);
  }
}
