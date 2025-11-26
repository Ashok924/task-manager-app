"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionContextType {
  start: (duration?: number) => Promise<void>;
  visible: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null);

export const PageTransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = useState(300);

  const start = useCallback((d = 300) => {
    setDuration(d);
    setVisible(true);
    return new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), d);
    });
  }, []);

  const pathname = usePathname();
  // Hide the overlay after route change so new page can fade in
  useEffect(() => {
    // when pathname changes we assume navigation happened — fade overlay out
    if (visible) {
      // allow a short tick then hide so consumers can await start()
      const t = window.setTimeout(() => setVisible(false), 50);
      return () => window.clearTimeout(t);
    }
    return;
  }, [pathname]);

  return (
    <PageTransitionContext.Provider value={{ start, visible }}>
      {children}
      <div
        aria-hidden
        className={
          "fixed inset-0 z-50 flex items-center justify-center transition-opacity " +
          (visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
        style={{
          background: "rgba(255,255,255,0.9)",
          transitionDuration: `${duration}ms`,
        }}
      >
        <div className="flex flex-col items-center gap-3 px-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
          <p className="text-sm text-zinc-700 dark:text-zinc-300">Please wait...</p>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within PageTransitionProvider");
  return ctx;
};

export default PageTransitionProvider;
