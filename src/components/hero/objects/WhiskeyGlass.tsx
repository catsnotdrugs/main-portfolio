// A rocks glass with a bourbon pour and a single big ice cube.
export default function WhiskeyGlass() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="Glass of whiskey" style={{ strokeLinejoin: "round", display: "block" }}>
      {/* glass body */}
      <path
        d="M28 30 H72 L67 80 Q66 86 60 86 H40 Q34 86 33 80 Z"
        fill="#fff7e6"
        opacity="0.45"
        stroke="var(--ink)"
        strokeWidth="3.4"
      />
      {/* whiskey */}
      <path d="M31.6 53 H68.4 L65.5 80 Q64.8 84 60 84 H40 Q35.2 84 34.5 80 Z" fill="#d98324" stroke="var(--ink)" strokeWidth="2.2" />
      <path d="M31.6 53 H68.4" stroke="var(--ink)" strokeWidth="2.6" />
      {/* ice cube */}
      <g transform="rotate(-12 50 62)">
        <rect x="40" y="54" width="18" height="18" rx="3" fill="#eaf6ff" opacity="0.85" stroke="var(--ink)" strokeWidth="2.4" />
        <path d="M44 58 L54 58 M44 58 L44 68" stroke="#fff" strokeWidth="2" opacity="0.9" />
      </g>
      {/* rim shine */}
      <path d="M33 32 H67" stroke="#fff" strokeWidth="2.4" opacity="0.7" />
    </svg>
  );
}
