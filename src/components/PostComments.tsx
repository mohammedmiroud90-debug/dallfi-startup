"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import type { PostComment } from "@/lib/posts";

type Props = {
  postId: string;
  initialComments: PostComment[];
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function PostComments({ postId, initialComments }: Props) {
  const t = useTranslations("Blog");
  const [comments, setComments] = useState(initialComments);
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const name = author.replace(/\s+/g, " ").trim();
    const mail = email.replace(/\s+/g, " ").trim().toLowerCase();
    const body = content.replace(/<[^>]*>/g, "").trim();

    if (name.length < 2 || !mail.includes("@") || !body) {
      setStatus(t("commentInvalid"));
      return;
    }

    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(`/api/comments/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: name, email: mail, content: body }),
      });
      const payload = (await response.json().catch(() => ({}))) as
        | PostComment
        | { error?: string };

      if (!response.ok) {
        setStatus(
          "error" in payload && payload.error ? payload.error : t("commentError"),
        );
        setSubmitting(false);
        return;
      }

      const saved = payload as PostComment;
      setComments((current) => [...current, saved]);
      setContent("");
      setStatus(t("commentSaved"));
    } catch {
      setStatus(t("commentError"));
    }

    setSubmitting(false);
  }

  return (
    <section className="post-comments" aria-label={t("comments")}>
      <div className="post-comments-head">
        <h2>{t("comments")}</h2>
        <span>{comments.length}</span>
      </div>

      {comments.length === 0 ? (
        <p className="post-comments-empty">{t("commentsEmpty")}</p>
      ) : (
        <ul className="post-comments-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <div>
                <strong>{comment.author}</strong>
                <time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
              </div>
              <p>{comment.content}</p>
            </li>
          ))}
        </ul>
      )}

      <form className="post-comments-form" onSubmit={submit}>
        <label>
          <span>{t("commentName")}</span>
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            maxLength={80}
            required
            autoComplete="name"
          />
        </label>
        <label>
          <span>{t("commentEmail")}</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            required
            autoComplete="email"
          />
        </label>
        <label className="is-full">
          <span>{t("commentBody")}</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={3}
            maxLength={2000}
            required
          />
        </label>
        <div className="post-comments-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? t("commentSending") : t("commentSubmit")}
          </button>
          {status ? <p>{status}</p> : null}
        </div>
      </form>
    </section>
  );
}
