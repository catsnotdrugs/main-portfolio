// A stylized fawn French bulldog face. Flat sticker art with a chunky ink
// outline so it sits in the same tactile language as the rest of the site.
export default function Frenchie() {
  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      role="img"
      aria-label="French bulldog"
      style={{ strokeLinejoin: "round", strokeLinecap: "round", display: "block" }}
    >
      {/* ears */}
      <path d="M26 44 L17 9 Q16 5 21 7 L47 26 Z" fill="#e7b486" stroke="var(--ink)" strokeWidth="3.2" />
      <path d="M74 44 L83 9 Q84 5 79 7 L53 26 Z" fill="#e7b486" stroke="var(--ink)" strokeWidth="3.2" />
      <path d="M28 38 L22 16 L41 28 Z" fill="#f6d2b0" />
      <path d="M72 38 L78 16 L59 28 Z" fill="#f6d2b0" />
      {/* head */}
      <path
        d="M50 24 Q82 24 82 56 Q82 86 50 86 Q18 86 18 56 Q18 24 50 24 Z"
        fill="#e7b486"
        stroke="var(--ink)"
        strokeWidth="3.4"
      />
      {/* forehead wrinkle */}
      <path d="M50 32 Q44 40 50 47 Q56 40 50 32 Z" fill="#d9a472" />
      {/* eyes */}
      <circle cx="36" cy="51" r="5.4" fill="var(--ink)" />
      <circle cx="64" cy="51" r="5.4" fill="var(--ink)" />
      <circle cx="37.6" cy="49.2" r="1.7" fill="#fff" />
      <circle cx="65.6" cy="49.2" r="1.7" fill="#fff" />
      {/* muzzle */}
      <ellipse cx="50" cy="69" rx="19" ry="15" fill="#fbe7cf" stroke="var(--ink)" strokeWidth="3" />
      <ellipse cx="50" cy="62" rx="6.4" ry="4.8" fill="var(--ink)" />
      <path d="M50 66 V73" stroke="var(--ink)" strokeWidth="3" fill="none" />
      <path d="M50 73 Q41 80 35 74" stroke="var(--ink)" strokeWidth="3" fill="none" />
      <path d="M50 73 Q59 80 65 74" stroke="var(--ink)" strokeWidth="3" fill="none" />
      {/* tongue */}
      <path d="M46 75 Q50 84 54 75 Z" fill="#ff6f9d" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  );
}
