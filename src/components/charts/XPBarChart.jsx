export default function XPBarChart({ data, width = 500, height = 220 }) {
  if (!data.length) return <p className="small">No XP data</p>;

  // group XP by month
  const map = {};
  data.forEach((t) => {
    const d = new Date(t.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    map[key] = (map[key] || 0) + t.amount;
  });

  const entries = Object.entries(map).slice(-8);
  const max = Math.max(...entries.map(([, v]) => v));
  const barWidth = width / entries.length;
  const chartHeight = height - 40;

  return (
    <svg
      className="chart-svg bar-svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00d4aa" />
          <stop offset="100%" stopColor="#00a88a" />
        </linearGradient>
      </defs>
      
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
        <line
          key={ratio}
          x1="0"
          y1={chartHeight - ratio * chartHeight}
          x2={width}
          y2={chartHeight - ratio * chartHeight}
          stroke="#2a2a2a"
          strokeDasharray="4"
        />
      ))}

      {entries.map(([label, value], i) => {
        const barHeight = (value / max) * chartHeight;
        const xpKB = (value / 1000).toFixed(0);
        return (
          <g key={label}>
            <rect
              x={i * barWidth + 8}
              y={chartHeight - barHeight}
              width={barWidth - 16}
              height={barHeight}
              rx="6"
              fill="url(#barGradient)"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 212, 170, 0.3))' }}
            />
            <text
              x={i * barWidth + barWidth / 2}
              y={chartHeight - barHeight - 8}
              textAnchor="middle"
              fontSize="11"
              fill="#00d4aa"
              fontWeight="600"
            >
              {xpKB}k
            </text>
            <text
              x={i * barWidth + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#a0a0a0"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
