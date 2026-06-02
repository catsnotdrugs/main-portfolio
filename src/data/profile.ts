export const profile = {
  name: "Chris Williams",
  handle: "imchriswilliams",
  email: "chris@imchriswilliams.com",
  intro:
    "I build odd little interfaces, useful tools, and digital objects that feel like they were found behind a hidden door.",
  about:
    "Chris is a product-minded engineer in St. Petersburg, Florida who likes turning fuzzy ideas into polished, tactile software. This site is less a resume and more a pocket universe: a place for experiments, strange UI, and the occasional useful machine.",
  footer:
    "Made as a personal playground for experiments, toys, and well-behaved weirdness.",
};

export type OperatingNote = {
  label: string;
  title: string;
  body: string;
};

export type Frequency = {
  id: string;
  label: string;
  title: string;
  body: string;
  readout: string;
};

export type Belief = {
  title: string;
  body: string;
};

export type Artifact = {
  id: string;
  title: string;
  type: string;
  body: string;
  color: string;
};

export const dashboard = {
  operatingNotes: [
    {
      label: "01",
      title: "Make the interface answer back",
      body:
        "A good screen should feel like it noticed you. Small reactions, clear states, and a little delight do more than decoration ever can.",
    },
    {
      label: "02",
      title: "Prototype until the idea has posture",
      body:
        "The first version is allowed to wobble. The important part is getting something real enough to argue with.",
    },
    {
      label: "03",
      title: "Polish is a form of respect",
      body:
        "Spacing, motion, copy, and empty states are not afterthoughts. They are where the product tells people it was made with care.",
    },
  ] satisfies OperatingNote[],
  frequencies: [
    {
      id: "interfaces",
      label: "Interfaces",
      title: "Tactile little machines",
      body:
        "Buttons with weight, panels with memory, controls that make the browser feel less like a document and more like an object.",
      readout: "Signal strength: deliciously pressable",
    },
    {
      id: "tools",
      label: "Tools",
      title: "Useful things with a wink",
      body:
        "Tiny utilities, personal workflows, and software that removes friction without sanding off all the personality.",
      readout: "Current mode: practical mischief",
    },
    {
      id: "systems",
      label: "Systems",
      title: "The satisfying click of structure",
      body:
        "Naming things, connecting pieces, and finding the smallest system that lets an idea keep growing.",
      readout: "Internal weather: organized lightning",
    },
    {
      id: "curiosity",
      label: "Curiosity",
      title: "Open every unlabeled drawer",
      body:
        "The internet is better when it has hidden rooms, strange artifacts, and pages that reward poking around.",
      readout: "Map status: incomplete on purpose",
    },
  ] satisfies Frequency[],
  beliefs: [
    {
      title: "Useful can still be weird",
      body:
        "Software does not become serious by becoming sterile. A useful thing can have a pulse.",
    },
    {
      title: "The hover state matters",
      body:
        "It is the handshake before the click. Ignore it and the whole interface feels slightly asleep.",
    },
    {
      title: "Constraints are ingredients",
      body:
        "A small screen, a boring API, a tight deadline. Fine. Give the problem edges and it starts to become a toy.",
    },
    {
      title: "Copy is interface",
      body:
        "The words are not labels taped onto the product. They are part of how the product behaves.",
    },
  ] satisfies Belief[],
  artifacts: [
    {
      id: "button-lab",
      title: "Button Lab",
      type: "micro experiment",
      body:
        "A place to test how much personality can fit inside a rectangle before it becomes annoying.",
      color: "#ff4f9a",
    },
    {
      id: "pocket-console",
      title: "Pocket Console",
      type: "personal tool",
      body:
        "A pretend control surface for sorting thoughts, prompts, ideas, and tiny unfinished machines.",
      color: "#42e8d4",
    },
    {
      id: "idea-drawer",
      title: "Idea Drawer",
      type: "archive",
      body:
        "Half-formed concepts, sketches, and names waiting for the right rainy afternoon.",
      color: "#ffb000",
    },
    {
      id: "texture-radio",
      title: "Texture Radio",
      type: "signal",
      body:
        "A reminder to make digital work feel less flat: more tactility, more rhythm, more feedback.",
      color: "#8cff6a",
    },
  ] satisfies Artifact[],
  contactPrompts: [
    "Send a strange idea",
    "Ask about a build",
    "Trade interface opinions",
    "Open a tiny portal",
  ],
};

export type ToyObject = {
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

export const toyObjects: ToyObject[] = [
  {
    id: "signal",
    label: "Signal Shell",
    title: "Chris Williams",
    body:
      "A product-minded engineer who likes playful systems, crisp interfaces, and the moment an idea starts to behave like a real thing.",
    color: "#ff4f9a",
    accent: "#ffe76a",
  },
  {
    id: "about",
    label: "About Meteor",
    title: "About the Maker",
    body:
      "I care about details, momentum, and software with a little spark in it. The best projects feel practical and alive at the same time.",
    color: "#42e8d4",
    accent: "#6c5cff",
  },
  {
    id: "contact",
    label: "Contact Transmitter",
    title: "Open a Channel",
    body:
      "Send a note, a weird idea, a project seed, or just proof that you found this corner of the internet.",
    cta: {
      label: "Email Chris",
      href: "mailto:chris@imchriswilliams.com",
    },
    color: "#ffb000",
    accent: "#ff5a3d",
  },
  {
    id: "curio",
    label: "Pocket Curio",
    title: "Tiny Rule",
    body:
      "If a button can feel like a candy machine, a spaceship panel, or a magic trick, it should at least consider the opportunity.",
    color: "#8cff6a",
    accent: "#1027ff",
  },
  {
    id: "hidden",
    label: "Hidden Button",
    title: "You Found the Spare Switch",
    body:
      "Not everything needs to explain itself immediately. Some of the best interface moments are discovered by poking around.",
    color: "#f7f0ff",
    accent: "#ff4f9a",
  },
];
