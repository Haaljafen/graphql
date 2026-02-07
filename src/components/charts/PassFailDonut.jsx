export default function PassFailDonut({ pass, fail, size = 180 }) {
  const total = pass + fail;
  if (!total) return <p className="small">No progress data</p>;

  const radius = size / 2 - 16;
  const circumference = 2 * Math.PI * radius;

  const passPercent = pass / total;
  const passStroke = passPercent * circumference;
  const failStroke = (1 - passPercent) * circumference;

  return (
    <svg
      className="chart-svg donut-svg"
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="passGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4aa" />
          <stop offset="100%" stopColor="#00a88a" />
        </linearGradient>
        <linearGradient id="failGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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

      {/* fail arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#failGradient)"
        strokeWidth="16"
        fill="none"
        strokeDasharray={`${failStroke} ${circumference}`}
        strokeDashoffset={-passStroke}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        strokeLinecap="round"
      />

      {/* pass arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#passGradient)"
        strokeWidth="16"
        fill="none"
        strokeDasharray={`${passStroke} ${circumference}`}
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
        {Math.round(passPercent * 100)}%
      </text>
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fill="#a0a0a0"
      >
        Pass Rate
      </text>
    </svg>
  );
}
