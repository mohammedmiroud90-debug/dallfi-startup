const publicUrl = (
  process.env.R2_PUBLIC_URL ??
  "https://pub-934e29ec90504f5c9f23a9b4f607b77a.r2.dev"
).replace(/\/$/, "");

export function getR2PublicUrl() {
  return publicUrl;
}

/** Resolve Parse / relative / R2 media paths to a public HTTPS URL. */
export function resolveMediaUrl(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "object" && value !== null) {
    const record = value as { url?: unknown; name?: unknown };
    if (typeof record.url === "string" && record.url.trim()) {
      return resolveMediaUrl(record.url);
    }
    if (typeof record.name === "string" && record.name.trim()) {
      return resolveMediaUrl(record.name);
    }
    return null;
  }

  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;

  const path = raw.replace(/^\/+/, "");
  if (!path) return null;

  // Parse file keys often look like "media/uuid-name.jpg" or "avatars/..."
  return `${publicUrl}/${path}`;
}

/** Rewrite img src URLs inside HTML to absolute R2 URLs when needed. */
export function resolveHtmlMedia(html: string) {
  return html.replace(/\bsrc=(["'])([^"']+)\1/gi, (match, quote: string, src: string) => {
    if (/^(https?:|data:|blob:)/i.test(src)) return match;
    const resolved = resolveMediaUrl(src);
    return resolved ? `src=${quote}${resolved}${quote}` : match;
  });
}
