/**
 * Small browser helpers shared by every lead form. The forms call submitLead() from
 * src/lib/tracking; this file only covers the per-form plumbing around it:
 * name splitting, the "first interaction" timestamp, the honeypot value, and form_error.
 */
import { track, type LeadFormId } from "./tracking";

/** "Ada Lovelace King" -> { firstName: "Ada", lastName: "Lovelace King" }. */
export function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

/** Report a client-side validation failure (GA4 form_error). */
export function reportFormError(formId: LeadFormId, errorField: string): void {
  track("form_error", { form_id: formId, error_field: errorField });
}

export interface LeadFormWatch {
  /** Date.now() at the first focus or input in the form (now, if the user never interacted). */
  startedAt: () => number;
  /** Honeypot value (empty for humans). */
  hp: () => string;
}

/**
 * Records the first interaction time and reports native validation failures
 * (one form_error per submit attempt, for the first invalid field).
 */
export function watchLeadForm(form: HTMLFormElement, formId: LeadFormId): LeadFormWatch {
  let started = 0;
  const mark = () => {
    if (!started) started = Date.now();
  };
  form.addEventListener("focusin", mark);
  form.addEventListener("input", mark);

  let reported = false;
  form.addEventListener(
    "invalid",
    (event) => {
      if (reported) return;
      reported = true;
      setTimeout(() => (reported = false), 0);
      const el = event.target as HTMLInputElement | null;
      reportFormError(formId, el?.name || el?.id || "");
    },
    true
  );

  return {
    startedAt: () => started || Date.now(),
    hp: () => (form.querySelector<HTMLInputElement>('input[name="company_url"]')?.value ?? ""),
  };
}
