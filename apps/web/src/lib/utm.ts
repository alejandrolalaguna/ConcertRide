import { SITE_URL } from "./siteUrl";

export type UtmSource = "whatsapp" | "instagram" | "twitter" | "facebook" | "email" | "copy" | "web";
export type UtmMedium = "share" | "referral" | "social" | "organic";
export type UtmCampaign = string;

interface UtmParams {
  source: UtmSource;
  medium: UtmMedium;
  campaign: UtmCampaign;
  content?: string;
}

export function buildShareUrl(path: string, utm: UtmParams): string {
  const base = typeof window !== "undefined" ? window.location.origin : SITE_URL;
  const url = new URL(path, base);
  url.searchParams.set("utm_source", utm.source);
  url.searchParams.set("utm_medium", utm.medium);
  url.searchParams.set("utm_campaign", utm.campaign);
  if (utm.content) url.searchParams.set("utm_content", utm.content);
  return url.toString();
}

export function rideShareUrl(rideId: string, campaign: UtmCampaign, source: UtmSource = "copy"): string {
  return buildShareUrl(`/rides/${rideId}`, { source, medium: "share", campaign });
}

export function concertShareUrl(concertId: string, campaign: UtmCampaign, source: UtmSource = "copy"): string {
  return buildShareUrl(`/concerts/${concertId}`, { source, medium: "share", campaign });
}
