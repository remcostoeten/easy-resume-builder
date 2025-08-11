// components/flex.tsx
import React, { ElementType, forwardRef, useMemo, Suspense } from "react";

type TProps<T extends ElementType = "div"> = {
  row?: boolean; col?: boolean; rowRev?: boolean; colRev?: boolean;
  start?: boolean; end?: boolean; center?: boolean; between?: boolean; around?: boolean; evenly?: boolean;
  aStart?: boolean; aEnd?: boolean; aCenter?: boolean; aBaseline?: boolean; aStretch?: boolean;
  cStart?: boolean; cEnd?: boolean; cCenter?: boolean; cBetween?: boolean; cAround?: boolean; cStretch?: boolean;
  wrap?: boolean; wrapRev?: boolean;
  as?: T;
  motion?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof {
  row: any; col: any; rowRev: any; colRev: any;
  start: any; end: any; center: any; between: any; around: any; evenly: any;
  aStart: any; aEnd: any; aCenter: any; aBaseline: any; aStretch: any;
  cStart: any; cEnd: any; cCenter: any; cBetween: any; cAround: any; cStretch: any;
  wrap: any; wrapRev: any; as: any; motion: any;
}>;

export const Flex = forwardRef(function Flex<T extends ElementType = "div">(
  props: TProps<T>,
  ref: React.Ref<any>
) {
  const {
    row, col, rowRev, colRev,
    start, end, center, between, around, evenly,
    aStart, aEnd, aCenter, aBaseline, aStretch,
    cStart, cEnd, cCenter, cBetween, cAround, cStretch,
    wrap, wrapRev,
    as,
    motion,
    className,
    role,
    ...rest
  } = props;

  const Tag: ElementType = as || "div";

  function getRole(tag: string, givenRole?: string) {
    if (givenRole) return givenRole;
    if (tag === "nav") return "navigation";
    if (tag === "main") return "main";
    if (tag === "header") return "banner";
    if (tag === "footer") return "contentinfo";
    return undefined;
  }

  const classes = useMemo(() => {
    const c: string[] = ["flex"];
    if (col) c.push("flex-col");
    else if (rowRev) c.push("flex-row-reverse");
    else if (colRev) c.push("flex-col-reverse");
    else if (row) c.push("flex-row");

    if (start) c.push("justify-start");
    else if (end) c.push("justify-end");
    else if (center) c.push("justify-center");
    else if (between) c.push("justify-between");
    else if (around) c.push("justify-around");
    else if (evenly) c.push("justify-evenly");

    if (aStart) c.push("items-start");
    else if (aEnd) c.push("items-end");
    else if (aCenter) c.push("items-center");
    else if (aBaseline) c.push("items-baseline");
    else if (aStretch) c.push("items-stretch");

    if (cStart) c.push("content-start");
    else if (cEnd) c.push("content-end");
    else if (cCenter) c.push("content-center");
    else if (cBetween) c.push("content-between");
    else if (cAround) c.push("content-around");
    else if (cStretch) c.push("content-stretch");

    if (wrap) c.push("flex-wrap");
    else if (wrapRev) c.push("flex-wrap-reverse");

    if (className) c.push(className);

    return c.join(" ");
  }, [
    row, col, rowRev, colRev,
    start, end, center, between, around, evenly,
    aStart, aEnd, aCenter, aBaseline, aStretch,
    cStart, cEnd, cCenter, cBetween, cAround, cStretch,
    wrap, wrapRev, className
  ]);

  if (motion) {
    const LazyMotion = React.lazy(() =>
      import("framer-motion").then(mod => ({
        default: mod.motion[Tag as keyof typeof mod.motion] || mod.motion.div
      }))
    );
    return (
      <Suspense fallback={null}>
        <LazyMotion ref={ref} role={getRole(Tag as string, role)} className={classes} {...rest} />
      </Suspense>
    );
  }

  return <Tag ref={ref} role={getRole(Tag as string, role)} className={classes} {...rest} />;
});

