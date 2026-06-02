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
