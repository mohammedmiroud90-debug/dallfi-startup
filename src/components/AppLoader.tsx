"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function AppLoaderInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(true);

  // Initial page load
  useEffect(() => {
    const minMs = 500;
    const start = performance.now();

    const hide = () => {
      const wait = Math.max(0, minMs - (performance.now() - start));
      window.setTimeout(() => setVisible(false), wait);
    };

    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });

    return () => window.removeEventListener("load", hide);
  }, []);

  // Client navigations — flash bar briefly on route change
  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 420);
    return () => window.clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="app-loader" aria-busy="true" aria-live="polite">
      <div className="app-loader__bar" role="status" aria-label="Loading">
        <span className="app-loader__indeterminate" />
      </div>
    </div>
  );
}

export default function AppLoader() {
  return (
    <Suspense fallback={null}>
      <AppLoaderInner />
    </Suspense>
  );
}
