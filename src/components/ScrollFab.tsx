"use client";

import { useEffect, useState } from "react";

export default function ScrollFab() {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      const view = window.innerHeight;
      const max = docHeight - view;
      setAtTop(scrollTop < 48);
      setAtBottom(max <= 1 || scrollTop >= max - 48);
      setReady(max > 160);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!ready) return null;

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const goBottom = () =>
    window.scrollTo({
      top: Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      ),
      behavior: "smooth",
    });

  return (
    <div className="scroll-fab" aria-label="Page scroll">
      {!atTop ? (
        <button type="button" className="scroll-fab__btn" onClick={goTop} aria-label="Scroll to top">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M6 14l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}
      {!atBottom ? (
        <button
          type="button"
          className="scroll-fab__btn"
          onClick={goBottom}
          aria-label="Scroll to bottom"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M6 10l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
