import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, isParseConfigured } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const posts = await getAllPosts(category);

  return NextResponse.json({
    ok: true,
    source: isParseConfigured() ? "parse" : "fallback",
    count: posts.length,
    posts,
  });
}
