import { resolveMediaUrl, resolveHtmlMedia as resolveHtmlMediaUrls } from "@/lib/media";

export type PostCategory = "builds" | "releases" | string;

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  contentHtml?: string;
  category: string;
  author: string;
  authorAvatar: string | null;
  publishedAt: string;
  coverImage: string | null;
};

export type PostComment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  parentId?: string;
};

export type TocHeading = {
  id: string;
  value: string;
  level: number;
};

const allowedIframeSrc =
  /^https:\/\/(www\.)?(youtube(-nocookie)?\.com\/embed\/|player\.vimeo\.com\/video\/)/i;

const url = process.env.PARSE_SERVER_URL ?? "";
const appId = process.env.PARSE_APP_ID ?? "";
const key = process.env.PARSE_JAVASCRIPT_KEY ?? "";
const configured = Boolean(url && appId && key);

const headers = {
  "Content-Type": "application/json",
  "X-Parse-Application-Id": appId,
  "X-Parse-Javascript-Key": key,
};

const fallback: Post[] = [
  {
    id: "welcome",
    slug: "welcome-to-dallfi",
    title: "Welcome to Dallfi Softwares",
    excerpt: "Posts will appear here once the Parse connection is available.",
    content:
      "This is a local fallback post. Connect PARSE_SERVER_URL, PARSE_APP_ID, and PARSE_JAVASCRIPT_KEY to load live articles from the shared backend.",
    category: "builds",
    author: "Dallfi Team",
    authorAvatar: null,
    publishedAt: "2026-09-18",
    coverImage: null,
  },
];

const text = (value: unknown) =>
  typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";

const dateText = (value: unknown) =>
  typeof value === "string"
    ? value
    : typeof value === "object" &&
        value !== null &&
        "iso" in value &&
        typeof (value as { iso?: unknown }).iso === "string"
      ? (value as { iso: string }).iso
      : "";

const getHtmlContent = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export function sanitizeHtml(html: string) {
  return html
    .replace(/\scontenteditable\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\sdata-placeholder\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/<(script|style|object|embed|form|base|meta|link|svg|math)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/?(?:script|style|object|embed|form|base|meta|link|svg|math)[^>]*>/gi, "")
    .replace(/<iframe\b([^>]*)>[\s\S]*?<\/iframe>/gi, (_match, attrs: string) => {
      const src =
        (attrs.match(/\bsrc\s*=\s*"([^"]+)"/i) ||
          attrs.match(/\bsrc\s*=\s*'([^']+)'/i) ||
          attrs.match(/\bsrc\s*=\s*([^\s>]+)/i))?.[1] ?? "";
      const clean = src.replace(/&amp;/gi, "&").trim();
      return allowedIframeSrc.test(clean)
        ? `<div class="video-embed"><iframe src="${clean.replace(/"/g, "&quot;")}" title="Embedded video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
        : "";
    })
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["']?)\s*(?:javascript|vbscript|data)\s*:/gi, "$1=$2#");
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function idFrom(value: string, index: number) {
  const base =
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\u0600-\u06ff]+/gi, "-")
      .replace(/^-|-$/g, "") || "section";
  return `${base}-${index}`;
}

/** Convert markdown-style headings into HTML so TOC and body stay in sync. */
export function convertMarkdownHeadings(source: string) {
  return source
    .replace(/\r\n?/g, "\n")
    .replace(/(^|\n)(#{1,6})\s+([^\n]+)/g, (_match, lead: string, hashes: string, title: string) => {
      const level = Math.min(Math.max(hashes.length, 1), 4);
      const tag = level === 1 ? 2 : level;
      return `${lead}<h${tag}>${title.trim()}</h${tag}>`;
    });
}

export function extractHeadings(html: string): TocHeading[] {
  const matches = [...html.matchAll(/<h([2-6])[^>]*>([\s\S]*?)<\/h\1>/gi)];
  return matches
    .map((match, index) => {
      const value = stripTags(match[2]);
      if (!value) return null;
      return {
        id: idFrom(value, index),
        value,
        level: Number(match[1]),
      };
    })
    .filter((item): item is TocHeading => Boolean(item));
}

export function injectHeadingIds(html: string, headings: TocHeading[]) {
  if (!headings.length) return html;
  let index = 0;
  return html.replace(/<h([2-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, content) => {
    if (!stripTags(content)) return match;
    const heading = headings[index++];
    if (!heading) return match;
    const cleanedAttrs = String(attrs).replace(/\s+id\s*=\s*(["'])[^"']*\1/gi, "");
    return `<h${level}${cleanedAttrs} id="${heading.id}">${content}</h${level}>`;
  });
}

/** Build sanitized HTML + TOC headings from a Parse post. */
export function preparePostBody(post: Pick<Post, "content" | "contentHtml">) {
  const rawHtml = (post.contentHtml ?? "").trim();
  const source = rawHtml
    ? convertMarkdownHeadings(rawHtml)
    : convertMarkdownHeadings(enrichPlainContent(post.content || ""));

  // Rich editors often use h1 for sections; demote so TOC + styles apply.
  const normalized = source
    .replace(/<h1(\b[^>]*)>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>");

  const sanitized = resolveHtmlMediaUrls(sanitizeHtml(normalized));
  const headings = extractHeadings(sanitized);
  const html = injectHeadingIds(sanitized, headings);

  if (!html.trim()) {
    return {
      html: (post.content || "")
        .split(/\n\n+/)
        .filter(Boolean)
        .map((paragraph) => `<p>${paragraph.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
        .join(""),
      headings: [] as TocHeading[],
    };
  }

  return { html, headings };
}

/** Turn plain markdown-ish media into HTML so images/videos render. */
export function enrichPlainContent(content: string) {
  return resolveHtmlMediaUrls(
    content
      .replace(
        /!\[([^\]]*)\]\((https?:\/\/[^\s)]+|\/?[^\s)]+)\)/g,
        (_m, alt: string, src: string) => {
          const url = resolveMediaUrl(src) || src;
          return `<figure class="post-media"><img src="${url}" alt="${alt}" loading="lazy" /><figcaption>${alt}</figcaption></figure>`;
        },
      )
      .replace(/\[video\]\((https?:\/\/[^\s)]+)\)/gi, (_m, videoUrl: string) => {
        const youtube = videoUrl.match(
          /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i,
        );
        const vimeo = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
        const embed = youtube
          ? `https://www.youtube.com/embed/${youtube[1]}`
          : vimeo
            ? `https://player.vimeo.com/video/${vimeo[1]}`
            : null;
        return embed
          ? `<div class="video-embed"><iframe src="${embed}" title="Embedded video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
          : "";
      })
      .replace(
        /(^|\n)((?:https?:\/\/|\.?\/)?\S+\.(?:png|jpe?g|gif|webp|avif))(\n|$)/gi,
        (_m, before: string, src: string, after: string) => {
          const url = resolveMediaUrl(src) || src;
          return `${before}<figure class="post-media"><img src="${url}" alt="" loading="lazy" /></figure>${after}`;
        },
      ),
  );
}


export function isRichHtmlContent(value = "") {
  const source = value.replace(/\r\n?/g, "\n").trim();
  if (!source.includes("<")) return false;
  return /<(h[1-6]|p|ul|ol|blockquote|pre|figure|table|img|strong|em|a|br|div)\b/i.test(
    source,
  );
}

const postContent = (value: unknown) =>
  typeof value === "string"
    ? value
        .replace(/\\n/g, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(?:p|div)>/gi, "\n\n")
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\r\n?/g, "\n")
        .trim()
    : "";

function mapPost(item: Record<string, unknown>): Post {
  const rawContent = item.content || item.body || item.details;
  const htmlContent = getHtmlContent(rawContent);
  const cover =
    resolveMediaUrl(item.coverImage) ||
    resolveMediaUrl(item.cover) ||
    resolveMediaUrl(item.image) ||
    resolveMediaUrl(item.thumbnail) ||
    resolveMediaUrl(item.media) ||
    resolveMediaUrl(item.featuredImage) ||
    null;

  const authorAvatar =
    resolveMediaUrl(item.authorAvatar) ||
    resolveMediaUrl(item.avatarUrl) ||
    resolveMediaUrl(item.avatar) ||
    resolveMediaUrl(item.authorImage) ||
    null;

  return {
    id: String(item.objectId),
    slug: text(item.slug) || String(item.objectId),
    title: text(item.title) || "Untitled post",
    excerpt: text(item.excerpt || item.summary || item.description),
    content: postContent(rawContent),
    contentHtml: htmlContent
      ? resolveHtmlMediaUrls(htmlContent)
      : undefined,
    author: text(item.author) || "Dallfi Team",
    authorAvatar,
    publishedAt:
      dateText(item.publishedAt) ||
      dateText(item.createdAt) ||
      new Date().toISOString(),
    category: text(item.category || item.type) || "builds",
    coverImage: cover,
  };
}

async function query(className: string, params: Record<string, string>) {
  if (!configured) return null;
  const endpoint = new URL(`${url}/classes/${className}`);
  Object.entries(params).forEach(([name, value]) => endpoint.searchParams.set(name, value));
  try {
    const response = await fetch(endpoint.toString(), { headers, cache: "no-store" });
    return response.ok
      ? ((await response.json()) as { results?: Record<string, unknown>[] })
      : null;
  } catch (error) {
    console.error(`Parse ${className} query failed`, error);
    return null;
  }
}

function matchesCategory(post: Post, category?: string | null) {
  if (!category) return true;
  const needle = category.toLowerCase();
  const hay = post.category.toLowerCase();
  if (needle === "builds") {
    return hay.includes("build") || hay === "builds" || hay.includes("product");
  }
  if (needle === "releases") {
    return hay.includes("release") || hay.includes("version") || hay === "releases";
  }
  return hay === needle || hay.includes(needle);
}

export async function getAllPosts(
  category?: PostCategory | string | null,
  limit = 48,
): Promise<Post[]> {
  const capped = String(Math.min(Math.max(limit, 1), 1000));
  const results = await Promise.all(
    (["Article", "BlogPost"] as const).map(async (className) =>
      query(className, {
        where: JSON.stringify({ status: "published" }),
        order: "-publishedAt",
        limit: capped,
      }),
    ),
  );

  const posts = results
    .flatMap((result) => (result?.results ?? []).map(mapPost))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  const source = posts.length ? posts : fallback;
  const filtered = source.filter((post) => matchesCategory(post, category));
  return Array.isArray(filtered) ? filtered : fallback;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const safe = slug.trim().slice(0, 180);
  if (!safe) return null;

  const results = await Promise.all(
    (["Article", "BlogPost"] as const).map((className) =>
      query(className, {
        where: JSON.stringify({ slug: safe, status: "published" }),
        limit: "1",
      }),
    ),
  );

  for (const result of results) {
    const item = result?.results?.[0];
    if (item) return mapPost(item);
  }

  return fallback.find((post) => post.slug === safe) ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts(null, 200);
  return posts.map((post) => post.slug);
}

export function formatPostDate(isoDate: string, locale = "en"): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

export function isParseConfigured() {
  return configured;
}

export async function getComments(postId: string): Promise<PostComment[]> {
  const safe = postId.trim().slice(0, 80);
  if (!safe || !configured) return [];

  const results = await Promise.all(
    (["Comment", "BlogComment"] as const).map((className) =>
      query(className, {
        where: JSON.stringify({ postId: safe, isActive: { $ne: false } }),
        order: "createdAt",
        limit: "50",
      }),
    ),
  );

  const comments = results.flatMap((result) =>
    (result?.results ?? []).map((item) => ({
      id: String(item.objectId),
      author: text(item.author || item.name || item.displayName) || "Guest",
      content: text(item.content || item.comment),
      createdAt: dateText(item.createdAt) || new Date().toISOString(),
      parentId: text(item.parentId) || undefined,
    })),
  );

  const byId = new Map<string, PostComment>();
  for (const comment of comments) {
    if (comment.content) byId.set(comment.id, comment);
  }
  return [...byId.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export async function submitComment(input: {
  postId: string;
  author: string;
  email: string;
  content: string;
}): Promise<PostComment | null> {
  if (!configured) return null;
  try {
    const response = await fetch(`${url}/classes/Comment`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        postId: input.postId,
        author: input.author,
        email: input.email,
        content: input.content,
        isActive: true,
        likeCount: 0,
      }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const saved = (await response.json()) as { objectId?: string; createdAt?: string };
    return {
      id: saved.objectId || crypto.randomUUID(),
      author: input.author,
      content: input.content,
      createdAt: saved.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Parse comment create failed", error);
    return null;
  }
}
