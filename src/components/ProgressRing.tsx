export default function ProgressRing({ progress, size = 120, stroke = 8 }: { progress: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circ = radius * 2 * Math.PI;
  const offset = circ - (progress / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#6366f1" strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
      </svg>
      <span className="absolute font-bold text-lg">{progress}%</span>
    </div>
  );
}
