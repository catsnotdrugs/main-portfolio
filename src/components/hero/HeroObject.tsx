import { forwardRef } from "react";
import type { HeroObjectDef } from "../../data/profile";
import Frenchie from "./objects/Frenchie";
import GolfBall from "./objects/GolfBall";
import WhiskeyGlass from "./objects/WhiskeyGlass";
import CodeBlock from "./objects/CodeBlock";

const ICONS = {
  frenchie: Frenchie,
  golf: GolfBall,
  whiskey: WhiskeyGlass,
  code: CodeBlock,
} as const;

type HeroObjectProps = {
  def: HeroObjectDef;
};

// A single draggable toy. Physics writes width/height/transform onto this node;
// it just provides the visual (a soft color halo behind a chunky SVG).
const HeroObject = forwardRef<HTMLDivElement, HeroObjectProps>(({ def }, ref) => {
  const Icon = ICONS[def.id];
  return (
    <div ref={ref} className="hero-object" data-object={def.id}>
      <span className="hero-object-halo" style={{ background: `var(${def.colorVar})` }} aria-hidden="true" />
      <span className="hero-object-art">
        <Icon />
      </span>
    </div>
  );
});

HeroObject.displayName = "HeroObject";

export default HeroObject;
