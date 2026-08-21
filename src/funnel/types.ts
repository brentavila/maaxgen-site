export type QualificationStatus =
  | "HIGHLY_QUALIFIED"
  | "POTENTIALLY_QUALIFIED"
  | "NOT_QUALIFIED";

export type FunnelVariantId = "a" | "b";

export type VideoProvider = "youtube" | "vimeo" | "loom" | "direct";

export type CalendarProvider = "ghl" | "calendly" | "custom";

export type QuestionOption = {
  value: string;
  label: string;
  /** Optional score contribution when this option is selected */
  score?: number;
};

export type QuestionField =
  | {
      id: string;
      type: "single";
      label: string;
      options: QuestionOption[];
      required?: boolean;
    }
  | {
      id: string;
      type: "multi";
      label: string;
      options: QuestionOption[];
      required?: boolean;
      minSelected?: number;
    }
  | {
      id: string;
      type: "text";
      label: string;
      placeholder?: string;
      required?: boolean;
      showWhen?: { fieldId: string; equals: string };
    }
  | {
      id: string;
      type: "contact";
      label: string;
      fields: Array<{
        id: keyof ContactInfo;
        label: string;
        inputType: "text" | "email" | "tel" | "url";
        required?: boolean;
        autocomplete?: string;
      }>;
    };

export type QuestionStep = {
  id: string;
  title: string;
  description?: string;
  fields: QuestionField[];
};

export type ContactInfo = {
  firstName: string;
  lastName: string;
  businessName: string;
  website: string;
  email: string;
  phone: string;
};

export type AttributionData = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  landingPage: string;
  referrer: string;
  capturedAt: string;
};

export type FunnelAnswers = Record<string, string | string[]>;

export type FunnelState = {
  answers: FunnelAnswers;
  contact: Partial<ContactInfo>;
  currentStepIndex: number;
  attribution: AttributionData | null;
  qualificationScore: number | null;
  qualificationStatus: QualificationStatus | null;
  variant: FunnelVariantId;
  startedAt: string | null;
  completedAt: string | null;
  eventsFired: string[];
};

export type ScoreResult = {
  score: number;
  status: QualificationStatus;
  breakdown: Record<string, number>;
};

export type NormalizedLeadPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  website: string;
  businessType: string;
  businessTypeOther: string;
  monthlyRevenue: string;
  customerValue: string;
  currentAdvertising: string[];
  monthlyAdSpend: string;
  capacity: string;
  marketingChallenges: string[];
  marketingChallengeOther: string;
  leadResponseTime: string;
  crmStatus: string;
  crmName: string;
  startTimeline: string;
  willingnessToInvest: string;
  qualificationScore: number;
  qualificationStatus: QualificationStatus;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  landingPage: string;
  referrer: string;
  timestamp: string;
  funnelVariant: FunnelVariantId;
  source: "growth-system-funnel";
};

export type FunnelEventName =
  | "vsl_page_view"
  | "vsl_started"
  | "vsl_25"
  | "vsl_50"
  | "vsl_75"
  | "vsl_90"
  | "vsl_completed"
  | "qualification_started"
  | "qualification_step_completed"
  | "qualification_completed"
  | "lead_highly_qualified"
  | "lead_potentially_qualified"
  | "lead_not_qualified"
  | "calendar_viewed"
  | "calendar_booking_started"
  | "appointment_booked"
  | "nq_resource_requested";

export type OfferBlock = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
};

export type VariantCopy = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryCtaMicro: string;
  finalCta: string;
  offer: OfferBlock;
};
