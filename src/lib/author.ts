import { resolveMediaUrl } from "@/lib/media";

export type AuthorProfile = {
  name: string;
  bio: string;
  avatarUrl: string;
};

const url = process.env.PARSE_SERVER_URL ?? "";
const appId = process.env.PARSE_APP_ID ?? "";
const key = process.env.PARSE_JAVASCRIPT_KEY ?? "";
const configured = Boolean(url && appId && key);

const headers = {
  "Content-Type": "application/json",
  "X-Parse-Application-Id": appId,
  "X-Parse-Javascript-Key": key,
};

export const defaultAuthorProfile: AuthorProfile = {
  name: "Dallfi Team",
  bio: "Builds, releases, and product notes from Dallfi Softwares.",
  avatarUrl: "/Dallfi.png",
};

export async function getAuthorProfile(): Promise<AuthorProfile> {
  if (!configured) return defaultAuthorProfile;

  try {
    const endpoint = new URL(`${url}/classes/SiteProfile`);
    endpoint.searchParams.set("where", JSON.stringify({ key: "primary" }));
    endpoint.searchParams.set("limit", "1");

    const response = await fetch(endpoint.toString(), {
      headers,
      cache: "no-store",
    });
    if (!response.ok) return defaultAuthorProfile;

    const result = (await response.json()) as {
      results?: Record<string, unknown>[];
    };
    const item = result.results?.[0];
    if (!item) return defaultAuthorProfile;

    const name =
      typeof item.name === "string" && item.name.trim()
        ? item.name.trim()
        : defaultAuthorProfile.name;
    const bio =
      typeof item.bio === "string" && item.bio.trim()
        ? item.bio.trim()
        : defaultAuthorProfile.bio;
    const avatar =
      resolveMediaUrl(item.avatarUrl) ||
      resolveMediaUrl(item.avatar) ||
      resolveMediaUrl(item.photo) ||
      defaultAuthorProfile.avatarUrl;

    return { name, bio, avatarUrl: avatar };
  } catch (error) {
    console.error("Parse author profile lookup failed", error);
    return defaultAuthorProfile;
  }
}
