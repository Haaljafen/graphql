export default function SkillsChart({ data, width = 300, height = 200 }) {
  if (!data.length) return <p className="small">No skills data</p>;

  // Aggregate skills by type and get top 6
  const skillMap = {};
  data.forEach((t) => {
    const skillName = t.type.replace('skill_', '').replace(/_/g, ' ');
    if (!skillMap[skillName] || t.amount > skillMap[skillName]) {
      skillMap[skillName] = t.amount;
    }
  });

  const formatSkillName = (s) => {
    return String(s)
      .replace(/[-_]+/g, " ")
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  const truncate = (text, maxLen) => {
    const t = String(text);
    if (t.length <= maxLen) return t;
    return `${t.slice(0, Math.max(0, maxLen - 1))}…`;
  };

  const skills = Object.entries(skillMap)
    .sort((a, b) => (b[1] - a[1]) || String(a[0]).localeCompare(String(b[0])))
    .slice(0, 6);

  return (
    <div className="skills-chart">
      {skills.map(([name, value]) => {
        const percent = Math.max(0, Math.min(100, Number(value) || 0));
        return (
          <div key={name} className="skill-row">
            <div className="skill-label">{truncate(formatSkillName(name), 14)}</div>
            <div className="skill-track">
              <div className="skill-fill" style={{ width: `${percent}%` }} />
            </div>
            <div className="skill-percent">{percent}%</div>
          </div>
        );
      })}
    </div>
  );
}
