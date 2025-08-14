export function start(fn: () => unknown | Promise<unknown>): unknown {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return fn();
  }

  const prefersReduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasStart = typeof (document as any).startViewTransition === "function";

  if (!hasStart || prefersReduced) {
    return fn();
  }

  void document.documentElement.dataset.vtStyle;
  return (document as any).startViewTransition(fn);
}

