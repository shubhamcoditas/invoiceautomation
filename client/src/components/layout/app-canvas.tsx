import { useEffect } from "react";

/**
 * Fixed ambient layers: depth gradient, grid, scan lines, soft particles.
 * Scroll-linked grid drift; disabled when prefers-reduced-motion.
 */
export function AppCanvas() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--app-scroll-y", `${window.scrollY}px`);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="app-canvas-base absolute inset-0" />
      <div className="app-canvas-grid absolute inset-0" />
      <div className="app-canvas-scan absolute inset-0" />
      <div className="app-canvas-particles absolute inset-0" />
    </div>
  );
}
