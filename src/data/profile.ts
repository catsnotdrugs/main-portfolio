export const profile = {
  name: "Chris Williams",
  handle: "imchriswilliams",
  email: "chris@imchriswilliams.com",
  intro:
    "A personal homepage for the things I am into, the things I make, and the little corners of life I want to remember.",
  about:
    "This page is a soft launch for a more personal internet home. The specifics are placeholders for now: photos, favorites, links, places, and current obsessions can all be swapped in as they become real.",
  footer:
    "Made as a personal homepage. Add real photos, sharper details, and new favorite things whenever the mood hits.",
};

export type HeroFacet = {
  id: string;
  label: string;
  title: string;
  body: string;
  cta?: {
    label: string;
    href: string;
  };
  color: string;
  accent: string;
};

export const heroFacets: HeroFacet[] = [
  {
    id: "now",
    label: "Now",
    title: "What has my attention right now",
    body:
      "A rotating spot for habits, tools, songs, places, ideas, and anything else that feels worth remembering this month.",
    color: "#ff4f9a",
    accent: "#ffe76a",
  },
  {
    id: "likes",
    label: "Likes",
    title: "A shelf for taste",
    body:
      "Games, interfaces, food, design details, weird websites, useful objects, good rooms, and whatever else earns a small permanent spot.",
    color: "#42e8d4",
    accent: "#6c5cff",
  },
  {
    id: "made",
    label: "Made",
    title: "Things I make sometimes",
    body:
      "Software is in the mix, but not the whole story. This section is for experiments, personal tools, unfinished ideas, and small projects.",
    color: "#ffb000",
    accent: "#ff5a3d",
  },
  {
    id: "photos",
    label: "Photos",
    title: "Photos will live here later",
    body:
      "For now, the page leaves room for future snapshots: places, people, desks, meals, trips, and other proof-of-life pixels.",
    color: "#8cff6a",
    accent: "#1027ff",
  },
  {
    id: "contact",
    label: "Contact",
    title: "Say hello",
    body:
      "Email is the simplest door. Send a note, a link, a recommendation, or a half-formed idea.",
    cta: {
      label: "Email Chris",
      href: "mailto:chris@imchriswilliams.com",
    },
    color: "#f7f0ff",
    accent: "#ff4f9a",
  },
];

export type NowItem = {
  label: string;
  title: string;
  body: string;
};

export type LikeItem = {
  category: string;
  items: string[];
};

export type MadeThing = {
  title: string;
  type: string;
  body: string;
};

export type PersonalLink = {
  label: string;
  href: string;
  note: string;
};

export type PhotoSlot = {
  title: string;
  caption: string;
  color: string;
};

export const personalHome = {
  nowItems: [
    {
      label: "Current mood",
      title: "Making the internet feel personal again",
      body:
        "Less polished profile, more lived-in homepage. A place that can change without needing a whole rebrand.",
    },
    {
      label: "Open tab",
      title: "Finding the right shape for this site",
      body:
        "The useful version is probably part scrapbook, part directory, part tiny museum of current taste.",
    },
    {
      label: "Reminder",
      title: "Replace these with real specifics",
      body:
        "Add the actual books, games, restaurants, songs, routines, tools, and photos that make this feel unmistakably yours.",
    },
  ] satisfies NowItem[],
  likes: [
    {
      category: "Digital",
      items: ["weird websites", "small useful tools", "game UI", "personal dashboards"],
    },
    {
      category: "Offline",
      items: ["good coffee", "walkable places", "low-key restaurants", "rooms with character"],
    },
    {
      category: "Media",
      items: ["comfort shows", "strategy games", "albums on repeat", "YouTube rabbit holes"],
    },
    {
      category: "Objects",
      items: ["well-made bags", "desk things", "notebooks", "anything with a satisfying button"],
    },
  ] satisfies LikeItem[],
  madeThings: [
    {
      title: "Personal tools",
      type: "software",
      body:
        "Small things that solve a specific annoyance, organize an idea, or make a repeated task feel less boring.",
    },
    {
      title: "Web experiments",
      type: "play",
      body:
        "Interfaces, layouts, and interaction ideas that are worth trying even if they do not need to become products.",
    },
    {
      title: "Unfinished ideas",
      type: "archive",
      body:
        "A future home for sketches, names, concepts, notes, and the projects that are still looking for their final form.",
    },
  ] satisfies MadeThing[],
  links: [
    {
      label: "Email",
      href: "mailto:chris@imchriswilliams.com",
      note: "Best way to reach me.",
    },
    {
      label: "GitHub",
      href: "https://github.com/catsnotdrugs",
      note: "Code, experiments, and public bits.",
    },
    {
      label: "Handle",
      href: "https://imchriswilliams.com",
      note: "The web home for whatever this becomes.",
    },
  ] satisfies PersonalLink[],
  photoSlots: [
    {
      title: "A photo of me",
      caption: "Replace with a portrait or something more honest than a portrait.",
      color: "#ff4f9a",
    },
    {
      title: "A place I like",
      caption: "A future spot for a favorite table, street, beach, bar, trail, or room.",
      color: "#42e8d4",
    },
    {
      title: "A current object",
      caption: "Something from the desk, bag, kitchen, shelf, or daily routine.",
      color: "#ffb000",
    },
  ] satisfies PhotoSlot[],
};
