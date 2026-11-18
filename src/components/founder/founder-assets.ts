import type { ImageMetadata } from "astro";

/**
 * Founder photo registry. Placements render only when their file exists in
 * src/assets/founder/, so dropping files in (same base names) brings them back.
 */
type FounderName =
  | "founder-portrait"
  | "founder-office"
  | "founder-desk"
  | "founder-client"
  | "founder-phone";

const modules = import.meta.glob<{ default: ImageMetadata }>(
  "../../assets/founder/*.{png,jpg,jpeg,webp}",
  { eager: true }
);

const images: Partial<Record<FounderName, ImageMetadata>> = {};
for (const [path, mod] of Object.entries(modules)) {
  const base = path.split("/").pop()!.replace(/\.[^.]+$/, "") as FounderName;
  images[base] = mod.default;
}

export function getFounderImage(name: FounderName): ImageMetadata | undefined {
  return images[name];
}

export function hasFounderImage(name: FounderName): boolean {
  return Boolean(images[name]);
}

/**
 * The desk video lives in public/video/founder/founder-desk-broll.mp4. Files in
 * public/ cannot be globbed like assets, so set this flag to true when that
 * file is added. The video also needs the poster image (founder-desk), so it
 * is only treated as present when both are available.
 */
export const FOUNDER_DESK_VIDEO_AVAILABLE = false;

export function hasFounderDeskVideo(): boolean {
  return FOUNDER_DESK_VIDEO_AVAILABLE && hasFounderImage("founder-desk");
}
