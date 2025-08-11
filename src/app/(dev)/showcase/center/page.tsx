'use client';

import React from 'react';
import { Center } from '@/shared/primitives/core/center';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/shared/components/ui/card';
import { DemoBox } from '@/app/(dev)/showcase/_components';

export default function CenterPage() {
  const [showFixed, setShowFixed] = React.useState(false);
  const [axis, setAxis] = React.useState<'both' | 'x' | 'y'>('both');
  const [strategy, setStrategy] = React.useState<'grid' | 'flex'>('grid');

  function onToggleFixed(checked: boolean) {
    setShowFixed(checked);
  }

  function onAxisChange(value: string | undefined) {
    if (!value) return;
    if (value === 'both' || value === 'x' || value === 'y') {
      setAxis(value);
    }
  }

  function onStrategyChange(value: string | undefined) {
    if (!value) return;
    if (value === 'grid' || value === 'flex') {
      setStrategy(value);
    }
  }

  function buildLiveCode(ax: 'both' | 'x' | 'y', strat: 'grid' | 'flex') {
    return `
<Center strategy="${strat}" axis="${ax}" className="h-full">
  <DemoBox label="${ax === 'both' ? 'Centered' : ax.toUpperCase() + ' Center'}" />
</Center>`;
  }

  const basicUsageCode = `import { Center } from '@/shared/primitives/core/center';

function Example() {
  return (
    <Center mode="parent" strategy="grid" axis="both" className="h-64">
      <div className="h-24 w-40 rounded-md bg-muted text-muted-foreground flex items-center justify-center border">
        Centered
      </div>
    </Center>
  );
}`;


  const screenModeCode = `<Center mode="screen">
  <DemoBox label="Screen Center" />
</Center>`;

  const absoluteModeCode = `<Center mode="absolute">
  <DemoBox label="Absolute Center" />
</Center>`;

  const fixedModeCode = `<Center mode="fixed">
  <DemoBox label="Fixed Center" />
</Center>`;

  const parentModeCode = `<Center mode="parent">
  <DemoBox label="Parent Center" />
</Center>`;

  return (
    <div className="container mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold">Center Primitive Demo</h1>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Basic Usage</h2>
        <div className="rounded-lg bg-muted p-4">
          <pre className="text-sm overflow-x-auto">
            <code>{basicUsageCode}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Interactive</h2>
        <Card className="bg-[#0A0A0A] border-[#333333]">
          <CardHeader>
            <CardTitle>Center preview</CardTitle>
            <CardAction>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Axis</span>
                  <ToggleGroup type="single" value={axis} onValueChange={onAxisChange} variant="outline" size="sm">
                    <ToggleGroupItem value="both">both</ToggleGroupItem>
                    <ToggleGroupItem value="x">x</ToggleGroupItem>
                    <ToggleGroupItem value="y">y</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Strategy</span>
                  <ToggleGroup type="single" value={strategy} onValueChange={onStrategyChange} variant="outline" size="sm">
                    <ToggleGroupItem value="grid">grid</ToggleGroupItem>
                    <ToggleGroupItem value="flex">flex</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-56 rounded-xl border border-[#333333] bg-[#0A0A0A] relative overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <Center strategy={strategy} axis={axis} className="h-full">
                <DemoBox
                  label={axis === 'both' ? 'Centered' : axis.toUpperCase() + ' Center'}
                  className="bg-[#1A1A1A] text-zinc-300 border-[#444444]"
                />
              </Center>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{buildLiveCode(axis, strategy)}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Positioning Modes</h2>
        <div className="flex items-center gap-3">
          <Label htmlFor="toggle-fixed">Show fixed mode example</Label>
          <Switch id="toggle-fixed" checked={showFixed} onCheckedChange={onToggleFixed} />
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2 text-lg font-medium"><span>Mode</span><Badge variant="outline">screen</Badge></div>
              <div className="relative h-64 rounded-xl bg-[#0A0A0A] border border-[#333333] overflow-hidden">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <Center mode="screen">
                  <DemoBox label="Screen Center" className="bg-[#1A1A1A] text-zinc-300 border-[#444444]" />
                </Center>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{screenModeCode}</code>
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2 text-lg font-medium"><span>Mode</span><Badge variant="outline">absolute</Badge></div>
              <div className="relative h-64 rounded-xl bg-[#0A0A0A] border border-[#333333] overflow-hidden">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <Center mode="absolute">
                  <DemoBox label="Absolute Center" className="bg-[#1A1A1A] text-zinc-300 border-[#444444]" />
                </Center>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{absoluteModeCode}</code>
              </pre>
            </div>
          </div>

          {showFixed && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2 text-lg font-medium"><span>Mode</span><Badge variant="outline">fixed</Badge></div>
                <div className="relative h-64 rounded-xl bg-[#0A0A0A] border border-[#333333] overflow-hidden">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                  <Center mode="fixed">
                    <DemoBox label="Fixed Center" className="bg-[#1A1A1A] text-zinc-300 border-[#444444]" />
                  </Center>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{fixedModeCode}</code>
                </pre>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center gap-2 text-lg font-medium"><span>Mode</span><Badge variant="outline">parent</Badge></div>
              <div className="relative h-64 rounded-xl bg-[#0A0A0A] border border-[#333333] overflow-hidden">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <Center mode="parent">
                  <DemoBox label="Parent Center" className="bg-[#1A1A1A] text-zinc-300 border-[#444444]" />
                </Center>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                <code>{parentModeCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Props Reference</h2>
        <div className="bg-slate-50 p-6 rounded-lg">
          <div className="space-y-4">
            <div>
              <strong className="text-lg">mode</strong> <span className="text-slate-600">('parent' | 'screen' | 'absolute' | 'fixed')</span>
              <p className="text-sm text-slate-600 mt-1">Controls the positioning strategy of the center container.</p>
            </div>
            <div>
              <strong className="text-lg">axis</strong> <span className="text-slate-600">('both' | 'x' | 'y')</span>
              <p className="text-sm text-slate-600 mt-1">Determines which axes to center content on.</p>
            </div>
            <div>
              <strong className="text-lg">strategy</strong> <span className="text-slate-600">('grid' | 'flex')</span>
              <p className="text-sm text-slate-600 mt-1">Chooses between CSS Grid or Flexbox for centering implementation.</p>
            </div>
            <div>
              <strong className="text-lg">className</strong> <span className="text-slate-600">(string)</span>
              <p className="text-sm text-slate-600 mt-1">Additional CSS classes to apply to the center container.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
