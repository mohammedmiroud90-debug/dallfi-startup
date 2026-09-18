import { NextResponse } from "next/server";
import { submitComment } from "@/lib/posts";

function textField(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  const safePostId = typeof postId === "string" ? postId.trim().slice(0, 80) : "";
  if (!safePostId) {
    return NextResponse.json({ error: "Invalid post." }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    author?: unknown;
    email?: unknown;
    content?: unknown;
  };

  const author = textField(body.author, 80);
  const email = textField(body.email, 254).toLowerCase();
  const content =
    typeof body.content === "string"
      ? body.content.replace(/<[^>]*>/g, "").trim().slice(0, 2000)
      : "";

  if (!author || author.length < 2) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (!content) {
    return NextResponse.json({ error: "Comment is required." }, { status: 400 });
  }

  const saved = await submitComment({ postId: safePostId, author, email, content });
  if (!saved) {
    return NextResponse.json({ error: "Comment service unavailable." }, { status: 503 });
  }

  return NextResponse.json(saved, { status: 201 });
}
