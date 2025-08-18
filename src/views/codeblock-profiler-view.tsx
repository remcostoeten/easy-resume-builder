"use client";

import { Badge } from "ui";
import { cn } from "utilities";
import { useEffect, useMemo, useRef, useState } from "react";
import { CodeBlock, CodeBlockBody, CodeBlockContent, CodeBlockItem, CodeBlockFilename } from "@/components/ui/shadcn-io/code-block";

type TProps = {
  small: { code: string; html: string; htmlNo: string };
  medium: { code: string; html: string; htmlNo: string };
  large: { code: string; html: string; htmlNo: string };
};

type TMetric = {
  label: string;
  value: string;
};

type TRunResult = {
  ttiMs: number | null;
  blockingTimeMs: number;
  hadHighlightJumpIn: boolean;
  avgFpsDuringScroll: number | null;
  droppedFrames: number | null;
};

function generateCodeLines(count: number): string[] {
  const lines: string[] = [];
  for (let i = 1; i <= count; i++) {
    const mod = i % 6;
    if (mod === 0) lines.push(`export function f${i}(a: number, b: number) { return a + b }`);
    else if (mod === 1) lines.push(`type TItem${i} = { id: number; name: string; active: boolean }`);
    else if (mod === 2) lines.push(`function map${i}(xs: number[]) { return xs.map((x) => x * ${i % 10}) }`);
    else if (mod === 3) lines.push(`const v${i} = [${i}, ${i + 1}, ${i + 2}].reduce((a, b) => a + b, 0)`);
    else if (mod === 4) lines.push(`function sort${i}(xs: number[]) { return [...xs].sort((a,b)=>a-b) }`);
    else lines.push(`function r${i}(s: number, a: { type: string; v?: number }) { return a.type === 'inc' ? s + (a.v||1) : a.type==='dec' ? s - (a.v||1) : s }`);
  }
  return lines;
}

function makeCode(size: number): string {
  return generateCodeLines(size).join("\n");
}

function useLongTaskObserver(active: boolean): { totalBlockingTime: number; disconnect: () => void } {
  let total = 0;
  const observer = typeof window !== "undefined" && (window as any).PerformanceObserver
    ? new PerformanceObserver((list) => {
        list.getEntries().forEach((e) => {
          const dur = (e as PerformanceEntry & { duration: number }).duration;
          const over = dur - 50;
          if (over > 0) total += over;
        });
      })
    : null;
  if (observer && active) observer.observe({ entryTypes: ["longtask" as any] });
  function disconnect() {
    if (observer) observer.disconnect();
  }
  return { totalBlockingTime: total, disconnect };
}

function measureTTI(timeoutMs: number): Promise<number> {
  return new Promise((resolve) => {
    const start = performance.now();
    let idleTimeout: ReturnType<typeof setTimeout> | undefined;
    function done() {
      if (idleTimeout !== undefined) clearTimeout(idleTimeout);
      resolve(performance.now() - start);
    }
    function onIdle() {
      done();
    }
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(onIdle, { timeout: timeoutMs });
    } else {
      idleTimeout = setTimeout(onIdle, timeoutMs);
    }
  });
}

function useHighlightMutationProbe(rootRef: React.RefObject<HTMLElement | null>): { hadJumpIn: boolean } {
  const [hadJumpIn, setHadJumpIn] = useState(false);
  useEffect(function init() {
    const root = rootRef.current;
    if (!root) return;
    const start = performance.now();
    const observer = new MutationObserver(() => {
      const t = performance.now() - start;
      if (t < 1500) setHadJumpIn(true);
    });
    observer.observe(root, { subtree: true, attributes: true, childList: true });
    const stop = window.setTimeout(() => observer.disconnect(), 2000);
    return function cleanup() {
      window.clearTimeout(stop);
      observer.disconnect();
    };
  }, [rootRef]);
  return { hadJumpIn };
}

function runScrollFpsTest(scroller: HTMLElement): Promise<{ fps: number; dropped: number }> {
  return new Promise((resolve) => {
    const frames: number[] = [];
    let last = performance.now();
    let running = true;
    let tickId = 0 as any;
    function tick(t: number) {
      if (!running) return;
      const dt = t - last;
      last = t;
      if (frames.length > 5) frames.push(1000 / dt);
      tickId = requestAnimationFrame(tick);
    }
    function onScrollEnd() {
      running = false;
      cancelAnimationFrame(tickId);
      const values = frames.slice(0);
      const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      const dropped = values.filter((v) => v < 55).length;
      resolve({ fps: Math.round(avg * 10) / 10, dropped });
    }
    tickId = requestAnimationFrame(tick);
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    const stop = window.setTimeout(onScrollEnd, 2000);
    return;
  });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-zinc-400">{title}</div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">{children}</div>
    </div>
  );
}

export default function CodeblockProfilerView({ small, medium, large }: TProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const smallRef = useRef<HTMLDivElement>(null);
  const mediumRef = useRef<HTMLDivElement>(null);
  const largeRef = useRef<HTMLDivElement>(null);

  const smallProbe = useHighlightMutationProbe(smallRef);
  const mediumProbe = useHighlightMutationProbe(mediumRef);
  const largeProbe = useHighlightMutationProbe(largeRef);

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TRunResult | null>(null);

  async function run() {
    if (running) return;
    setRunning(true);
    const longTasks = useLongTaskObserver(true);
    const tti = await measureTTI(3000);
    const blocking = longTasks.totalBlockingTime;
    longTasks.disconnect();

    let fps: number | null = null;
    let dropped: number | null = null;
    const scroller = largeRef.current?.querySelector("[data-scroller]") as HTMLElement | null;
    if (scroller) {
      const s = await runScrollFpsTest(scroller);
      fps = s.fps;
      dropped = s.dropped;
    }

    const hadJump = smallProbe.hadJumpIn || mediumProbe.hadJumpIn || largeProbe.hadJumpIn;
    setResult({ ttiMs: Math.round(tti), blockingTimeMs: Math.round(blocking), hadHighlightJumpIn: hadJump, avgFpsDuringScroll: fps, droppedFrames: dropped });
    setRunning(false);
  }

  const metrics: TMetric[] = useMemo(function buildMetrics() {
    return [
      { label: "First paint highlighted", value: result ? (result.hadHighlightJumpIn ? "Jump detected" : "No jump") : "—" },
      { label: "Time to interactive", value: result?.ttiMs != null ? `${result.ttiMs} ms` : "—" },
      { label: "Main-thread blocking", value: result ? `${result.blockingTimeMs} ms` : "—" },
      { label: "Scroll FPS (large)", value: result?.avgFpsDuringScroll != null ? `${result.avgFpsDuringScroll} FPS` : "—" },
      { label: "Dropped frames (<55 FPS)", value: result?.droppedFrames != null ? `${result.droppedFrames}` : "—" },
    ];
  }, [result]);

  function Badges() {
    return (
      <div className="flex items-center gap-2">
        <Badge>default</Badge>
        <Badge variant="default">primary</Badge>
        <Badge variant="secondary">secondary</Badge>
        <Badge variant="destructive">danger</Badge>
        <Badge variant="outline">outline</Badge>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mx-auto max-w-[1400px] p-6 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-xl font-semibold text-zinc-200">CodeBlock Profiler</div>
          <div className="text-sm text-zinc-500">Small ≤100, Medium 300–600, Large 1000–3000</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={run} disabled={running} className={cn("px-3 py-2 rounded-md border", running ? "opacity-60 cursor-not-allowed" : "hover:bg-white/5 border-[#333]")}>Run measurements</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map(function m(x) {
          return (
            <div key={x.label} className="rounded-lg border border-[#333] bg-[#0A0A0A] p-3">
              <div className="text-xs text-zinc-500">{x.label}</div>
              <div className="mt-1 text-sm text-zinc-200">{x.value}</div>
            </div>
          );
        })}
      </div>

      <Section title="Small variants (≤100)">
        <div ref={smallRef} className="space-y-6">
          <div className="rounded-lg border border-[#333] bg-[#0A0A0A]">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="text-sm text-zinc-400">With line numbers, highlight enabled</div>
              <Badges />
            </div>
            <div data-scroller className="px-2">
              <CodeBlock
                data={[{ language: "typescript", filename: "small.ts", code: small.code }]}
                defaultValue="typescript"
              >
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem value={item.language} lineNumbers>
                      <CodeBlockFilename value={item.language}>{item.filename}</CodeBlockFilename>
                      <CodeBlockContent language={item.language}>{item.code}</CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
            </div>
          </div>

          <div className="rounded-lg border border-[#333] bg-[#0A0A0A]">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="text-sm text-zinc-400">No line numbers</div>
            </div>
            <div data-scroller className="px-2">
              <CodeBlock
                data={[{ language: "typescript", filename: "small.ts", code: small.code }]}
                defaultValue="typescript"
              >
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem value={item.language} lineNumbers={false}>
                      <CodeBlockFilename value={item.language}>{item.filename}</CodeBlockFilename>
                      <CodeBlockContent language={item.language}>{item.code}</CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Medium variants (300–600)">
        <div ref={mediumRef} className="space-y-6">
          <div className="rounded-lg border border-[#333] bg-[#0A0A0A]">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="text-sm text-zinc-400">With line numbers, highlight enabled</div>
              <Badges />
            </div>
            <div data-scroller className="px-2">
              <CodeBlock
                data={[{ language: "typescript", filename: "medium.ts", code: medium.code }]}
                defaultValue="typescript"
              >
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem value={item.language} lineNumbers>
                      <CodeBlockFilename value={item.language}>{item.filename}</CodeBlockFilename>
                      <CodeBlockContent language={item.language}>{item.code}</CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
            </div>
          </div>

          <div className="rounded-lg border border-[#333] bg-[#0A0A0A]">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="text-sm text-zinc-400">No line numbers</div>
            </div>
            <div data-scroller className="px-2">
              <CodeBlock
                data={[{ language: "typescript", filename: "medium.ts", code: medium.code }]}
                defaultValue="typescript"
              >
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem value={item.language} lineNumbers={false}>
                      <CodeBlockFilename value={item.language}>{item.filename}</CodeBlockFilename>
                      <CodeBlockContent language={item.language}>{item.code}</CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Large variants (1000–3000)">
        <div ref={largeRef} className="space-y-6">
          <div className="rounded-lg border border-[#333] bg-[#0A0A0A]">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="text-sm text-zinc-400">With line numbers, highlight enabled</div>
              <Badges />
            </div>
            <div data-scroller className="px-2">
              <CodeBlock
                data={[{ language: "typescript", filename: "large.ts", code: large.code }]}
                defaultValue="typescript"
              >
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem value={item.language} lineNumbers>
                      <CodeBlockFilename value={item.language}>{item.filename}</CodeBlockFilename>
                      <CodeBlockContent language={item.language}>{item.code}</CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
            </div>
          </div>

          <div className="rounded-lg border border-[#333] bg-[#0A0A0A]">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="text-sm text-zinc-400">No line numbers</div>
            </div>
            <div data-scroller className="px-2">
              <CodeBlock
                data={[{ language: "typescript", filename: "large.ts", code: large.code }]}
                defaultValue="typescript"
              >
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem value={item.language} lineNumbers={false}>
                      <CodeBlockFilename value={item.language}>{item.filename}</CodeBlockFilename>
                      <CodeBlockContent language={item.language}>{item.code}</CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
            </div>
          </div>
        </div>
      </Section>

      <div className="rounded-lg border border-[#333] bg-[#0A0A0A] p-4">
        <div className="text-sm text-zinc-400">Targets</div>
        <ul className="mt-2 list-disc pl-6 text-sm text-zinc-300 space-y-1">
          <li>No highlight jump-in on first paint</li>
          <li>≤16ms additional render time for up to 300 LOC, ≤50ms for 2000 LOC</li>
          <li>Smooth scroll ≥55 FPS for large blocks</li>
        </ul>
      </div>
    </div>
  );
}

