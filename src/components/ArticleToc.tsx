"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/posts";

type Props = {
  headings: TocHeading[];
  label: string;
  /** Compact control placed beside the post title */
  inline?: boolean;
};

function ArrowUpIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`article-toc-arrow${open ? " is-open" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 15l6-6 6 6" />
    </svg>
  );
}

export default function ArticleToc({ headings, label, inline = false }: Props) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    if (!headings.length) return;
    const targets = headings
      .map(({ id }) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav
      className={`article-toc${inline ? " is-inline" : ""}${open ? " is-open" : ""}`}
      aria-label={label}
    >
      <button
        type="button"
        className="article-toc-toggle"
        aria-expanded={open}
        aria-controls="article-toc-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{label}</span>
        <ArrowUpIcon open={open} />
      </button>

      <div id="article-toc-panel" className="article-toc-panel" hidden={!open}>
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={activeId === heading.id ? "is-active" : undefined}
            data-level={heading.level}
            onClick={() => {
              setActiveId(heading.id);
              setOpen(false);
            }}
          >
            {heading.value}
          </a>
        ))}
      </div>
    </nav>
  );
}
