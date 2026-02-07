import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { graphqlFetch } from "../api/graphql";
import XPBarChart from "../components/charts/XPBarChart";
import AuditRatioDonut from "../components/charts/AuditRatioDonut";
import SkillsChart from "../components/charts/SkillsChart";

import {
  Q_USER_INFO,
  Q_XP_TRANSACTIONS,
  Q_SKILLS,
  Q_RECENT_PROJECTS,
  Q_PROGRESS,
  Q_LEVEL,
  Q_ROOT_EVENT_DETAILS,
  Q_OBJECT_BY_ID,
} from "../api/queries";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userInfo, setUserInfo] = useState(null);
  const [xpData, setXpData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [level, setLevel] = useState(0);
  const [sampleObject, setSampleObject] = useState(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError("");

        const [d1, d2, d3, d4, d5] = await Promise.all([
          graphqlFetch(Q_USER_INFO),
          graphqlFetch(Q_XP_TRANSACTIONS),
          graphqlFetch(Q_SKILLS),
          graphqlFetch(Q_RECENT_PROJECTS),
          graphqlFetch(Q_PROGRESS),
        ]);

        if (!alive) return;

        const u = d1?.user?.[0] ?? null;
        setUserInfo(u);
        setXpData(d2?.transaction ?? []);
        setSkillsData(d3?.transaction ?? []);
        setRecentProjects(d4?.transaction ?? []);
        setProgressData(d5?.progress ?? []);

        const userId = u?.id;
        const rootEventId = Number(import.meta.env.VITE_ROOT_EVENT_ID);
        if (userId && Number.isFinite(rootEventId) && rootEventId > 0) {
          const d6 = await graphqlFetch(Q_ROOT_EVENT_DETAILS, {
            userId,
            rootEventId,
          });
          if (!alive) return;
          setLevel(d6?.level?.[0]?.amount ?? 0);
        } else {
          const d6 = await graphqlFetch(Q_LEVEL);
          if (!alive) return;
          setLevel(d6?.transaction?.[0]?.amount ?? 0);
        }

        // Variables-based query example (arguments + variables)
        const objectId = d5?.progress?.[0]?.objectId;
        if (objectId) {
          const d7 = await graphqlFetch(Q_OBJECT_BY_ID, { id: objectId });
          if (!alive) return;
          setSampleObject(d7?.object?.[0] ?? null);
        }
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Failed to load profile data.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const totalXP = useMemo(() => {
    return xpData.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [xpData]);

  const displayName = useMemo(() => {
    const first = userInfo?.firstName?.trim() || "";
    const last = userInfo?.lastName?.trim() || "";
    const full = `${first} ${last}`.trim();
    return full || null;
  }, [userInfo]);

  const auditStats = useMemo(() => {
    const ratio = userInfo?.auditRatio ?? 0;
    const done = userInfo?.totalUp ?? 0;
    const received = userInfo?.totalDown ?? 0;
    return { ratio: ratio.toFixed(1), done, received };
  }, [userInfo]);

  const auditDenom = (Number(auditStats.done) || 0) + (Number(auditStats.received) || 0);


  const formatXP = (bytes) => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(2)} MB`;
    if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} kB`;
    return `${bytes} B`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="avatar">
            {userInfo?.login?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div>
            <div className="username" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{userInfo?.login ?? 'Loading...'}</span>
              <span
                className="badge success"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                aria-label={`Level ${level}`}
                title={`Level ${level}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M7.5 12.5l2.5 2.5 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Lv {level}</span>
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => { logout(); navigate("/login"); }}>
          Logout
        </button>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="stat-value cyan">Loading...</div>
        </div>
      )}

      {error && (
        <div className="card">
          <div className="error">{error}</div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stats Row */}
          <div className="grid-3" style={{ marginBottom: '20px' }}>

            {/* Audit Ratio Card */}
            <div className="card">
              <div className="section-title">Audit Ratio</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <AuditRatioDonut done={auditStats.done} received={auditStats.received} size={150} />
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ color: '#00d4aa', fontWeight: '600', fontSize: '20px' }}>
                      {formatXP(auditStats.done)}
                    </span>
                    <span className="small" style={{ marginLeft: '8px' }}>Done</span>
                  </div>
                  <div>
                    <span style={{ color: '#ec4899', fontWeight: '600', fontSize: '20px' }}>
                      {formatXP(auditStats.received)}
                    </span>
                    <span className="small" style={{ marginLeft: '8px' }}>Received</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="grid-2">
            {/* Skills */}
            <div className="card">
              <div className="section-title">Top Skills</div>
              <SkillsChart data={skillsData} height={220} />
            </div>

            {/* Recent Projects */}
            <div className="card">
              <div className="section-title">Recent Activity</div>
              {sampleObject && (
                <div className="small" style={{ marginBottom: '12px' }}>
                </div>
              )}
              {recentProjects.length === 0 ? (
                <p className="small">No recent projects</p>
              ) : (
                recentProjects.map((proj, i) => (
                  <div key={i} className="list-item">
                    <div>
                      <div style={{ fontWeight: '500', color: '#fff' }}>
                        {proj.object?.name ?? 'Unknown'}
                      </div>
                      <div className="small">{formatDate(proj.createdAt)}</div>
                    </div>
                    <span className="badge success">{formatXP(proj.amount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* XP over time */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="section-title">XP Progress</div>
            <XPBarChart data={xpData} height={220} />
          </div>
        </>
      )}
    </div>
  );
}
