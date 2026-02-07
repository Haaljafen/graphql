export default function AuditRatioDonut({ done, received, size = 180 }) {
  const total = done + received;
  if (!total) return <p className="small">No audit data</p>;

  const radius = size / 2 - 16;
  const circumference = 2 * Math.PI * radius;

  const donePercent = done / total;
  const doneStroke = donePercent * circumference;
  const receivedStroke = (1 - donePercent) * circumference;

  const ratio = received ? (done / received).toFixed(1) : '0.0';

  return (
    <svg
      className="chart-svg donut-svg"
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="doneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4aa" />
          <stop offset="100%" stopColor="#00a88a" />
        </linearGradient>
        <linearGradient id="receivedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#2a2a2a"
        strokeWidth="16"
        fill="none"
      />

      {/* received arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#receivedGradient)"
        strokeWidth="16"
        fill="none"
        strokeDasharray={`${receivedStroke} ${circumference}`}
        strokeDashoffset={-doneStroke}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        strokeLinecap="round"
      />

      {/* done arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#doneGradient)"
        strokeWidth="16"
        fill="none"
        strokeDasharray={`${doneStroke} ${circumference}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        strokeLinecap="round"
        filter="url(#glow)"
      />

      {/* center text */}
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="28"
        fontWeight="bold"
        fill="#00d4aa"
      >
        {ratio}
      </text>
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fill="#a0a0a0"
      >
        Audit Ratio
      </text>
    </svg>
  );
}
