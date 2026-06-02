// A golf ball with dimples. Round collider, so it reads great while it rolls.
export default function GolfBall() {
  const dimples = [
    [50, 24],
    [38, 31],
    [62, 31],
    [29, 42],
    [50, 40],
    [71, 42],
    [38, 52],
    [62, 52],
    [50, 56],
    [33, 63],
    [67, 63],
    [50, 72],
  ];
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="Golf ball" style={{ display: "block" }}>
      <circle cx="50" cy="50" r="38" fill="#fdfdfb" stroke="var(--ink)" strokeWidth="3.4" />
      {/* highlight */}
      <path d="M30 34 Q40 24 54 26" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
      {dimples.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.1" fill="#d7dbcf" />
      ))}
    </svg>
  );
}
