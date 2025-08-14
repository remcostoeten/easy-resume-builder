"use client";

import { useViewTransitionStyle } from "../../shared/contexts/view-transition-style";

type TProps = {};

export function VtStyleToggle({}: TProps) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const [style, dispatch] = useViewTransitionStyle();

  function onClick() {
    dispatch({ type: "next" });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle view transition style"
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        padding: "6px 10px",
        fontSize: 12,
        lineHeight: 1,
        zIndex: 50,
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.2)",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {style}
    </button>
  );
}

