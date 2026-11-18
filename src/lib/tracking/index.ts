/** Browser entry point for the tracking layer. Never import ./server from browser code. */
export { initTracking } from "./auto";
export { captureAttribution, getAttribution } from "./attribution";
export { getBrowserIds } from "./ids";
export { getConsent, type TrackingConsent } from "./consent";
export { track, pageType, newEventId, type PageType, type TrackParams, type TrackOptions } from "./track";
export { submitLead, LEAD_ENDPOINT, type SubmitLeadInput } from "./lead";
export { normalizePhoneE164 } from "./phone";
export * from "./contract";
