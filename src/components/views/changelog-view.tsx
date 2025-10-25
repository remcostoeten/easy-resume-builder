"use client";

import { Copy, ExternalLink, GitPullRequest, Maximize2 } from "lucide-react";
import { MeshGradient, Dithering } from "@paper-design/shaders-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const releases = [
  {
    title: "v3.0.0: Major UI Refresh & New Integrations",
    date: "May 15, 2025",
    image: "https://placehold.co/1200x700/141414/ffffff/png?text=UI+Refresh+%26+Integrations",
    excerpt:
      "This major release introduces a redesigned interface for a more intuitive experience, plus integrations with leading third-party platforms.",
    contributors: [
      "https://placehold.co/96x96/ff8844/fff?text=A5",
      "https://placehold.co/96x96/3399ff/fff?text=B6",
      "https://placehold.co/96x96/33cc99/fff?text=C1",
      "https://placehold.co/96x96/cc00ff/fff?text=D2",
    ],
    content: (
      <div className="prose dark:prose-invert">
        <h3>Refreshed User Interface</h3>
        <p>
          A lighter, faster UI with improved accessibility and responsiveness.
        </p>
        <ul>
          <li>New typography and icon system</li>
          <li>Reorganized navigation and controls</li>
          <li>Configurable dashboard panels</li>
        </ul>
        <h4>Enhanced Integrations</h4>
        <p>
          Seamless connections for Slack, Drive, and Trello to boost workflow
          efficiency.
        </p>
      </div>
    ),
  },
  {
    title: "v2: rebuild",
    date: "17 October 2025",
    image: "https://placehold.co/1200x700/0f0f0f/ffffff/png?text=Performance+%26+API",
    excerpt:
    "I've tried creaeting this project in the past but got bored and quit after finding a job. The core idea was to create a resume builder that would be easy to use and customizable. I had that working but AI was lacking and allround bad UI. So I'm rebuilding it from scratch with a new approach where I prioritize core functionality and user experience before doing styling.",
    contributors: [],
    content: (
      <div className="prose dark:prose-invert">
        <p>
The core has been build as well as the AI integration. I'm still working on the UI and the overall user experience. Currently on the masterh branch:      </p>
<ul>
  <li>Dynamic layer system like Photosohp </li>
  <li>AI integration with Google Generative AI</li>
  <li>PDF import parser with AI</li>
  <li>Customizable resume templates</li>
  <li>Export to PDF</li>
  <li>Export to JSON</li>
  <li>Import from JSON</li>
</ul>
      </div>
    ),
  },
];

export function ChangelogView() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full overflow-hidden">
        <MeshGradient
          colors={[
            "hsl(var(--primary))",
            "hsl(var(--chart-1))",
            "hsl(var(--chart-2))",
            "hsl(var(--chart-3))"
          ]}
          swirl={0.55}
          distortion={0.85}
          speed={0.1}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        <Dithering
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/30" />

        <div className="relative container mx-auto px-4 py-12 text-left">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <GitPullRequest className="size-4" />
              <p>Changelog</p>
            </div>
            <h1 className="text-4xl font-semibold text-white leading-snug">
              Latest Enhancements
              <br /> & Platform News
            </h1>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="grid justify-center container mx-auto px-4  border-x border-border">
        {releases.map((item, idx) => (
          <Dialog key={idx}>
            <div className="relative flex flex-col lg:flex-row w-full py-16 gap-6 lg:gap-0">
              <div className="lg:sticky top-2 h-fit">
                <time className="text-muted-foreground w-36 text-sm font-medium lg:absolute">
                  {item.date}
                </time>
              </div>

              <div className="flex max-w-prose flex-col gap-4 lg:mx-auto">
                <h3 className="text-3xl font-medium lg:pt-10 lg:text-3xl">{item.title}</h3>
                <DialogTrigger asChild>
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="border-border max-h-96 w-full rounded-lg border object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-lg" />
                  </div>
                </DialogTrigger>
                <p className="text-muted-foreground text-sm font-medium">
                  {item.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center -space-x-2">
                      {item.contributors.slice(0, 3).map((src, id) => (
                        <img
                          key={id}
                          src={src}
                          alt="Contributor"
                          className="border-border size-6 rounded-full border"
                        />
                      ))}
                    </div>
                    {item.contributors.length > 3 && (
                      <span className="text-muted-foreground text-sm font-medium">
                        +{item.contributors.length - 3} contributors
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Maximize2 className="size-4" />
                            </Button>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Show full release</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Copy className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy link</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open in new tab</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              <div className="bg-border absolute bottom-0 left-0 right-0 h-px w-[200vw] -translate-x-1/2" />
            </div>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-prose">
              <DialogHeader>
                <DialogTitle className="text-left">{item.title}</DialogTitle>
                <DialogDescription className="text-left">
                  {item.excerpt}
                </DialogDescription>
              </DialogHeader>
              <img
                src={item.image}
                alt={item.title}
                className="border-border max-h-96 w-full rounded-lg border object-cover"
              />
              {item.content}
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
};
