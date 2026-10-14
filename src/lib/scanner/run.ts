import { detectFromResourceUrls, mergeSignals, signalsFromPsi, type PsiLike } from "./detect";
import { buildReport } from "./score";
import type { Recommendability, ScanInput, ScanReport, ScannerApiResponse, SiteSignals } from "./types";

export interface ScannerConfig {
  /** Optional backend implementing the ScannerApiResponse contract (see scripts/scanner-api.mjs). */
  apiUrl: string;
  /** Google PageSpeed Insights API key. Keyless calls share a tiny public quota and often 429. */
  psiKey: string;
  /** Upper bound on how long we wait for sources before reporting with what we have. */
  timeoutMs: number;
}

export type ScanStage = "api" | "psi";
export type StageStatus = "running" | "done" | "skipped" | "failed";
export type StageListener = (stage: ScanStage, status: StageStatus) => void;

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (!url.hostname.includes(".")) return "";
    return url.toString();
  } catch {
    return "";
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function fetchPsi(url: string, key: string, signal?: AbortSignal): Promise<PsiLike> {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", "mobile");
  endpoint.searchParams.append("category", "PERFORMANCE");
  endpoint.searchParams.append("category", "SEO");
  if (key) endpoint.searchParams.set("key", key);

  const response = await fetch(endpoint.toString(), { signal });
  if (!response.ok) throw new Error(`psi ${response.status}`);
  return (await response.json()) as PsiLike;
}

export async function fetchScannerApi(
  apiUrl: string,
  input: ScanInput,
  signal?: AbortSignal,
): Promise<ScannerApiResponse> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: input.url, businessName: input.businessName, city: input.city }),
    signal,
  });
  if (!response.ok) throw new Error(`scanner api ${response.status}`);
  return (await response.json()) as ScannerApiResponse;
}

export interface ScanOutcome {
  report: ScanReport;
  signals: SiteSignals;
  /** True when no source returned any data at all. */
  empty: boolean;
}

/**
 * Run every configured source in parallel, merge what comes back, and score it.
 * Sources that fail or time out are skipped; the report marks what was not measured.
 */
export async function runScan(
  input: ScanInput,
  config: ScannerConfig,
  onStage: StageListener = () => {},
): Promise<ScanOutcome> {
  const controller = new AbortController();
  const sources: string[] = [];
  const partials: Array<Partial<SiteSignals>> = [];
  let recommendability: Recommendability = { available: false };

  const apiTask = (async () => {
    if (!config.apiUrl) {
      onStage("api", "skipped");
      return;
    }
    onStage("api", "running");
    try {
      const data = await withTimeout(fetchScannerApi(config.apiUrl, input, controller.signal), config.timeoutMs);
      if (!data.ok) throw new Error(data.error || "scanner api error");
      if (data.resourceUrls?.length) partials.push(detectFromResourceUrls(data.resourceUrls));
      if (data.html) {
        partials.push({
          schemaTypes: data.html.schemaTypes ?? null,
          pricingVisible: data.html.pricingVisible ?? null,
          callForQuote: data.html.callForQuote ?? null,
          phoneVisible: data.html.phoneVisible ?? null,
          hoursVisible: data.html.hoursVisible ?? null,
        });
      }
      if (data.recommendability) recommendability = data.recommendability;
      sources.push(recommendability.available ? "site HTML and a live AI recommendation test" : "site HTML");
      // The stage is named for the AI test; without a model key the API only did the HTML pass.
      onStage("api", recommendability.available ? "done" : "skipped");
    } catch {
      onStage("api", "failed");
    }
  })();

  const psiTask = (async () => {
    onStage("psi", "running");
    try {
      const psi = await withTimeout(fetchPsi(input.url, config.psiKey, controller.signal), config.timeoutMs);
      partials.push(signalsFromPsi(psi));
      sources.push("Google PageSpeed Insights (mobile)");
      onStage("psi", "done");
    } catch {
      onStage("psi", "failed");
    }
  })();

  await Promise.all([apiTask, psiTask]);
  controller.abort();

  const signals = mergeSignals(...partials);
  const report = buildReport(input, signals, recommendability, sources);
  return { report, signals, empty: partials.length === 0 && !recommendability.available };
}
