// A little editor window with traffic-light dots and syntax-colored lines.
export default function CodeBlock() {
  const lines = [
    { y: 44, x: 18, w: 26, c: "var(--pink)" },
    { y: 44, x: 48, w: 30, c: "var(--aqua)" },
    { y: 54, x: 24, w: 40, c: "var(--lime)" },
    { y: 54, x: 68, w: 14, c: "#fff" },
    { y: 64, x: 18, w: 18, c: "var(--orange)" },
    { y: 64, x: 40, w: 34, c: "var(--aqua)" },
    { y: 74, x: 24, w: 28, c: "var(--pink)" },
  ];
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="Block of code" style={{ display: "block" }}>
      <rect x="12" y="24" width="76" height="58" rx="9" fill="#1f1638" stroke="var(--ink)" strokeWidth="3.4" />
      {/* title bar */}
      <path d="M12 33 Q12 24 21 24 H79 Q88 24 88 33 V36 H12 Z" fill="#2c2150" />
      <circle cx="22" cy="30" r="2.6" fill="#ff5f7a" />
      <circle cx="31" cy="30" r="2.6" fill="#ffd24f" />
      <circle cx="40" cy="30" r="2.6" fill="#7cf08a" />
      {lines.map((l, i) => (
        <rect key={i} x={l.x} y={l.y} width={l.w} height="4" rx="2" fill={l.c} />
      ))}
    </svg>
  );
}
