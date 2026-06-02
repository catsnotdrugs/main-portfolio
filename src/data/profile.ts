// ---------------------------------------------------------------------------
// Content for imchriswilliams.com
// Voice: bold and punchy. Short, confident, declarative.
// COPY RULE: no em-dashes anywhere in user-facing strings.
// Swap real specifics where marked TODO(real).
// ---------------------------------------------------------------------------

import handicap from "./handicap.json";

export const golf = {
  handicap: handicap.index,
  handicapUpdated: handicap.updated,
};

export const profile = {
  name: "Chris Williams",
  handle: "imchriswilliams",
  email: "chris@imchriswilliams.com",
  // Big bold one-liner under the name.
  tagline: "Frenchie dad. Golf addict. Whiskey nerd. Builds things on the side.",
  jobTitle: "Designer and developer",
  city: "Charleston, SC",
  intro:
    "Not a resume. Just a homepage for the dog, the rounds, the pours, and the small things I make.",
  footer: "Built for fun. Drag the toys. Open the windows. Stay a while.",
};

// ---------------------------------------------------------------------------
// Hero: draggable physics objects. Positions are percentages of the viewport
// (deterministic, SSR safe). Radius is in px. colorVar drives the accent halo.
// ---------------------------------------------------------------------------

export type HeroObjectId = "frenchie" | "golf" | "whiskey" | "code";

export type HeroObjectDef = {
  id: HeroObjectId;
  label: string;
  start: { x: number; y: number };
  radius: number;
  colorVar: string;
};

export const heroObjects: HeroObjectDef[] = [
  { id: "frenchie", label: "My French bulldog", start: { x: 36, y: 30 }, radius: 70, colorVar: "--pink" },
  { id: "golf", label: "Golf ball", start: { x: 74, y: 18 }, radius: 40, colorVar: "--lime" },
  { id: "whiskey", label: "Glass of whiskey", start: { x: 86, y: 36 }, radius: 56, colorVar: "--orange" },
  { id: "code", label: "Block of code", start: { x: 58, y: 28 }, radius: 58, colorVar: "--aqua" },
];

// ---------------------------------------------------------------------------
// Desktop OS: each zone is an app window. Positions and sizes are px and
// deterministic so server and client render identically. They are used as the
// desktop layout; mobile ignores them and stacks the windows as cards.
// ---------------------------------------------------------------------------

export type AppId = "about" | "into" | "made" | "now" | "photos" | "contact";

export type DesktopApp = {
  id: AppId;
  name: string;
  icon: string;
  defaultOpen?: boolean;
  pos: { x: number; y: number };
  size: { w: number; h: number };
};

export const desktopApps: DesktopApp[] = [
  { id: "about", name: "About Me", icon: "🪪", defaultOpen: true, pos: { x: 40, y: 36 }, size: { w: 440, h: 460 } },
  { id: "into", name: "Into", icon: "🎯", pos: { x: 360, y: 70 }, size: { w: 460, h: 440 } },
  { id: "made", name: "Made", icon: "🛠️", pos: { x: 150, y: 150 }, size: { w: 460, h: 430 } },
  { id: "now", name: "Now", icon: "📡", pos: { x: 520, y: 200 }, size: { w: 420, h: 420 } },
  { id: "photos", name: "Photos", icon: "📷", pos: { x: 230, y: 250 }, size: { w: 480, h: 440 } },
  { id: "contact", name: "Contact", icon: "✉️", pos: { x: 600, y: 120 }, size: { w: 400, h: 400 } },
];

// ---------------------------------------------------------------------------
// App content
// ---------------------------------------------------------------------------

export type Vital = { label: string; value: string };

export type IntoCategory = {
  category: string;
  blurb: string;
  items: string[];
};

export type MadeThing = {
  type: string;
  title: string;
  body: string;
  href?: string;
};

export type NowItem = {
  label: string;
  title: string;
  body: string;
};

export type PhotoSlot = {
  title: string;
  caption: string;
  color: string;
  src?: string; // TODO(real): drop in a real image path to replace the placeholder
};

export type ContactLink = {
  label: string;
  href: string;
  note: string;
};

export const content = {
  about: {
    greeting: "Hey, I'm Chris.",
    lead: "This is my corner of the internet. No pitch, no funnel, no resume.",
    body: [
      "I share a couch with a French bulldog named Lulu who snores louder than I do. I chase a better golf swing I will probably never find. I drink bourbon slowly and read the label like it owes me money.",
      "I design and build for a living. The rest of the time I build small things, break a few of them, and keep a list of stuff I love.",
      "This page is that list.",
    ],
    vitals: [
      { label: "Lives in", value: "Charleston, SC" },
      { label: "Companion", value: "Lulu the Frenchie" },
      { label: "Handicap", value: golf.handicap },
      { label: "Pour of choice", value: "Michter's 10 Rye" },
    ] satisfies Vital[],
  },

  into: {
    intro: "The short list of things I will not shut up about.",
    categories: [
      {
        category: "Frenchies",
        blurb: "Small dog, enormous personality.",
        items: ["bat ears", "the 6pm zoomies", "snoring like a chainsaw", "lap dog energy", "zero chill, total love"],
      },
      {
        category: "Golf",
        blurb: "A great walk, occasionally ruined.",
        items: ["early tee times", "a pured 7 iron", "the smell of the range", "match play", "chasing single digits"],
      },
      {
        category: "Whiskey",
        blurb: "Michter's 10 Rye and the hunt for the next one.",
        items: ["a great rye", "cask strength", "the allocated bottle hunt", "an old fashioned done right", "Kentucky over Scotland"],
      },
      {
        category: "Dev",
        blurb: "I build for the fun of building.",
        items: ["tiny side projects", "clean diffs", "shipping over polishing", "a great keyboard", "dark mode everything"],
      },
    ] satisfies IntoCategory[],
  },

  made: {
    intro: "Side projects and experiments. Some shipped. Some still cooking.",
    things: [
      {
        type: "this site",
        title: "imchriswilliams.com",
        body: "Built as a playground. Astro, React, and a hero full of toys you can fling around. The whole thing is the demo.",
      },
      {
        type: "software", // TODO(real): replace with a real project
        title: "Your next project",
        body: "Drop in the real thing here. A name, one punchy line, and a link. Done.",
        href: "#", // TODO(real): real URL
      },
      {
        type: "in progress", // TODO(real): replace with a real project
        title: "The one still cooking",
        body: "Half built, fully overthought. The kind of idea that lives in a notes app until it does not.",
      },
    ] satisfies MadeThing[],
  },

  now: {
    updated: "Updated whenever the mood hits", // TODO(real): a real date if you want one
    items: [
      {
        label: "On the course",
        title: "Grinding on the short game",
        body: "Putting and wedges. The boring half of golf that actually drops the score.",
      },
      {
        label: "In the glass",
        title: "Michter's 10 Rye on repeat",
        body: "A pour that earns the slow sip every time. The shelf hunt continues.",
      },
      {
        label: "On the screen",
        title: "Building this very website",
        body: "Tuning the physics, fighting the layout, and adding way too many windows.",
      },
    ] satisfies NowItem[],
  },

  photos: {
    intro: "Proof of life. Real photos go here.", // TODO(real): drop in images via PhotoSlot.src
    slots: [
      { title: "The dog", caption: "A portrait of the boss. Bat ears required.", color: "#ff4f9a" },
      { title: "A good round", caption: "A course, a sunrise tee time, or the one good shot.", color: "#8cff6a" },
      { title: "The pour", caption: "A bottle worth remembering. Or the bar that served it.", color: "#ffb000" },
    ] as PhotoSlot[],
  },

  contact: {
    intro: "Say hi. Send a bottle recommendation. Tell me my swing is wrong.",
    email: "chris@imchriswilliams.com",
    links: [
      { label: "Email", href: "mailto:chris@imchriswilliams.com", note: "Fastest way to reach me." },
      { label: "GitHub", href: "https://github.com/catsnotdrugs", note: "Code, experiments, public bits." },
    ] satisfies ContactLink[],
  },
};

export type SiteContent = typeof content;
