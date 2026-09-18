"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let frame = 0;
    const readProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      const max = docHeight - window.innerHeight;
      return max > 1 ? Math.min(100, Math.max(0, (scrollTop / max) * 100)) : 0;
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = readProgress();
        setProgress((current) => (Math.abs(current - next) < 0.25 ? current : next));
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="reading-progress-track" aria-hidden={progress < 0.5}>
      <div
        className="reading-progress"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        style={{ width: `${progress}%` }}
      />
    </div>,
    document.body,
  );
}
