import { useRef } from "react";
import type { HeroObjectDef } from "../../data/profile";
import { usePalette } from "../shared/PaletteContext";
import HeroObject from "./HeroObject";
import { usePhysics } from "./usePhysics";

type HeroToyProps = {
  defs: HeroObjectDef[];
};

// The hero stage. Fills the scene layer; only the toys themselves are grabbable.
export default function HeroToy({ defs }: HeroToyProps) {
  const { reducedMotion } = usePalette();
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { ready } = usePhysics({ defs, stageRef, itemRefs, reducedMotion });

  return (
    <div ref={stageRef} className={`hero-stage${ready ? " is-ready" : ""}`}>
      {defs.map((def, index) => (
        <HeroObject
          key={def.id}
          def={def}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
}
