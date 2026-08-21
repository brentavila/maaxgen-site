import type {
  AttributionData,
  ContactInfo,
  FunnelAnswers,
  FunnelVariantId,
  NormalizedLeadPayload,
  QualificationStatus,
} from "../types";

function asString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value.join(", ");
  return value ?? "";
}

function asStringArray(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value) return [value];
  return [];
}

export function buildLeadPayload(input: {
  answers: FunnelAnswers;
  contact: Partial<ContactInfo>;
  attribution: AttributionData | null;
  qualificationScore: number;
  qualificationStatus: QualificationStatus;
  variant: FunnelVariantId;
}): NormalizedLeadPayload {
  const { answers, contact, attribution, qualificationScore, qualificationStatus, variant } =
    input;

  return {
    firstName: contact.firstName ?? "",
    lastName: contact.lastName ?? "",
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    businessName: contact.businessName ?? "",
    website: contact.website ?? "",
    businessType: asString(answers.businessType),
    businessTypeOther: asString(answers.businessTypeOther),
    monthlyRevenue: asString(answers.monthlyRevenue),
    customerValue: asString(answers.customerValue),
    currentAdvertising: asStringArray(answers.currentAdvertising),
    monthlyAdSpend: asString(answers.monthlyAdSpend),
    capacity: asString(answers.capacity),
    marketingChallenges: asStringArray(answers.marketingChallenges),
    marketingChallengeOther: asString(answers.marketingChallengeOther),
    leadResponseTime: asString(answers.leadResponseTime),
    crmStatus: asString(answers.crmStatus),
    crmName: asString(answers.crmName),
    startTimeline: asString(answers.startTimeline),
    willingnessToInvest: asString(answers.willingnessToInvest),
    qualificationScore,
    qualificationStatus,
    utmSource: attribution?.utmSource ?? "",
    utmMedium: attribution?.utmMedium ?? "",
    utmCampaign: attribution?.utmCampaign ?? "",
    utmContent: attribution?.utmContent ?? "",
    utmTerm: attribution?.utmTerm ?? "",
    gclid: attribution?.gclid ?? "",
    gbraid: attribution?.gbraid ?? "",
    wbraid: attribution?.wbraid ?? "",
    fbclid: attribution?.fbclid ?? "",
    landingPage: attribution?.landingPage ?? "",
    referrer: attribution?.referrer ?? "",
    timestamp: new Date().toISOString(),
    funnelVariant: variant,
    source: "growth-system-funnel",
  };
}
