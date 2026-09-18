/** Canonical primary site + accepted public hosts. */
export const PRIMARY_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://dallfi.com";

export const SITE_HOSTS = (
  process.env.NEXT_PUBLIC_SITE_HOSTS ||
  "dallfi.com,www.dallfi.com,dallfi.eu.cc,www.dallfi.eu.cc"
)
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedSiteHost(hostname: string) {
  const host = hostname.trim().toLowerCase().replace(/\.$/, "");
  return SITE_HOSTS.includes(host);
}

export function absoluteUrl(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${PRIMARY_SITE_URL}${clean}`;
}
