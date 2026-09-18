import { NextResponse } from "next/server";
import { getPostBySlug, isParseConfigured } from "@/lib/posts";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    source: isParseConfigured() ? "parse" : "fallback",
    post,
  });
}
