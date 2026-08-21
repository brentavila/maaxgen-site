import { ACTIVE_VARIANT } from "./config";
import { readAttribution } from "./attribution";
import type {
  ContactInfo,
  FunnelAnswers,
  FunnelState,
  FunnelVariantId,
  QualificationStatus,
} from "./types";

export const FUNNEL_STATE_KEY = "maaxgen_funnel_state_v1";

export function createEmptyState(variant: FunnelVariantId = ACTIVE_VARIANT): FunnelState {
  return {
    answers: {},
    contact: {},
    currentStepIndex: 0,
    attribution: readAttribution(),
    qualificationScore: null,
    qualificationStatus: null,
    variant,
    startedAt: null,
    completedAt: null,
    eventsFired: [],
  };
}

export function readFunnelState(): FunnelState {
  if (typeof sessionStorage === "undefined") return createEmptyState();
  try {
    const raw = sessionStorage.getItem(FUNNEL_STATE_KEY);
    if (!raw) return createEmptyState();
    const parsed = JSON.parse(raw) as FunnelState;
    return {
      ...createEmptyState(parsed.variant),
      ...parsed,
      answers: parsed.answers ?? {},
      contact: parsed.contact ?? {},
      eventsFired: parsed.eventsFired ?? [],
      attribution: parsed.attribution ?? readAttribution(),
    };
  } catch {
    return createEmptyState();
  }
}

export function writeFunnelState(state: FunnelState): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(FUNNEL_STATE_KEY, JSON.stringify(state));
}

export function updateFunnelState(patch: Partial<FunnelState>): FunnelState {
  const next = { ...readFunnelState(), ...patch };
  writeFunnelState(next);
  return next;
}

export function saveAnswers(answers: FunnelAnswers): FunnelState {
  const state = readFunnelState();
  return updateFunnelState({ answers: { ...state.answers, ...answers } });
}

export function saveContact(contact: Partial<ContactInfo>): FunnelState {
  const state = readFunnelState();
  return updateFunnelState({ contact: { ...state.contact, ...contact } });
}

export function markEventFired(eventKey: string): boolean {
  const state = readFunnelState();
  if (state.eventsFired.includes(eventKey)) return false;
  updateFunnelState({ eventsFired: [...state.eventsFired, eventKey] });
  return true;
}

export function hasEventFired(eventKey: string): boolean {
  return readFunnelState().eventsFired.includes(eventKey);
}

export function saveQualification(
  score: number,
  status: QualificationStatus
): FunnelState {
  return updateFunnelState({
    qualificationScore: score,
    qualificationStatus: status,
    completedAt: new Date().toISOString(),
  });
}

export function clearFunnelState(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(FUNNEL_STATE_KEY);
}
