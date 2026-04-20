import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./RecommendationPage.css";

/* ── scatter chars ── */
const CHARS = "01→←⟨⟩∇∆∑∏∫⌘⌥⊕⊗|—·∘×≡≠≈∈∉∩∪".split("");
function buildParticles(n = 80) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    char: CHARS[Math.floor(Math.random() * CHARS.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 9 + 8,
    op: Math.random() * 0.18 + 0.05,
  }));
}
const PARTICLES = buildParticles();

/* ── helpers ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function CollabBadge({ type }) {
  const labels = { student: "👨‍🎓 Student", researcher: "🔬 Researcher", both: "🤝 Both" };
  return (
    <span className={`collab-badge ${type}`}>
      {labels[type] ?? type}
    </span>
  );
}

function ScoreRing({ score, rank }) {
  const r    = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(score, 1);
  const gap  = circ - dash;
  const color = rank === 1 ? "#f37e22" : rank === 2 ? "#5b86a2" : "#0e4971";
  return (
    <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
      <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(14,73,113,0.08)" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r}
          fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <span style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Serif Display', serif", fontSize: "13px",
        color, lineHeight: 1,
      }}>
        #{rank}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════
   QUERY FORM
════════════════════════════════════════════ */
function QueryForm({ onRun, loading }) {
  const [skills, setSkills] = useState("");
  const [domain, setDomain] = useState("student");
  const [k, setK]           = useState(5);

  const canRun = skills.trim().length > 0 && !loading;

  return (
    <div className="query-form reveal">

      {/* Skills */}
      <div style={{ marginBottom: "28px" }}>
        <label className="form-label">Your skills</label>
        <input
          className="form-input"
          placeholder="e.g. python machine learning tensorflow nlp"
          value={skills}
          onChange={e => setSkills(e.target.value)}
        />
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(91,134,162,0.7)", marginTop: "6px" }}>
          Separate skills with spaces or commas
        </p>
      </div>

      {/* Domain */}
      <div style={{ marginBottom: "28px" }}>
        <label className="form-label">You are a</label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["student", "researcher"].map(d => (
            <button
              key={d}
              className={`segment-btn${domain === d ? " active" : ""}`}
              onClick={() => setDomain(d)}
            >
              {d === "student" ? "👨‍🎓 Student" : "🔬 Researcher"}
            </button>
          ))}
        </div>
      </div>

      {/* K */}
      <div style={{ marginBottom: "36px" }}>
        <label className="form-label">Number of recommendations</label>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <input
            type="range" min={1} max={20} value={k}
            onChange={e => setK(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#0e4971" }}
          />
          <div style={{ textAlign: "center", minWidth: "48px" }}>
            <span className="k-display">{k}</span>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#5b86a2", marginTop: "2px" }}>posts</p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        className="run-btn"
        disabled={!canRun}
        onClick={() => onRun({ student_skills: skills.trim(), student_domain: domain, k })}
      >
        {loading ? "Running model…" : "Find recommendations →"}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════
   PAGE
════════════════════════════════════════════ */
const API_URL = import.meta.env.VITE_API_URL;

export default function RecommendationPage() {
  const navigate = useNavigate();
  useReveal();

  const [results,    setResults]  = useState(null);
  const [loading,    setLoading]  = useState(false);
  const [query,      setQuery]    = useState(null);
  const [filterType, setFilter]   = useState("all");
  const [apiError,   setApiError] = useState(null);

  async function handleRun(params) {
    setLoading(true);
    setResults(null);
    setQuery(params);
    setFilter("all");
    setApiError(null);

    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills:       params.student_skills,
          profile_type: params.student_domain,
          top_k:        params.k,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        const mapped = data.recommendations.map(r => ({
          post_id:            r.post_id,
          title:              r.title,
          domain:             r.domain,
          collaboration_type: r.collaboration_type,
          score:              r.score,
        }));
        setResults(mapped);
      } else {
        setApiError(data.message || "Model returned an error.");
        setResults([]);
      }

    } catch (err) {
      console.error("API unreachable:", err);
      setApiError("Could not reach the API. Is your HF Space running?");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const displayed = results
    ? results.filter((r, i) => {
        if (filterType === "top3") return i < 3;
        return true;
      })
    : [];

  return (
    <>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{
        background: "#efefed", minHeight: "420px",
        paddingTop: "120px", paddingBottom: "80px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {PARTICLES.map(p => (
            <span key={p.id} style={{
              position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
              fontSize: `${p.size}px`,
              color:    p.x > 45 ? "#0e4971" : "transparent",
              opacity:  p.x > 45 ? p.op : 0,
              fontFamily: "monospace", userSelect: "none",
            }}>{p.char}</span>
          ))}
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>
          <div className="section-label reveal">AI Recommendations</div>
          <h1 style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: "clamp(40px,6vw,80px)", color: "#0e4971",
            letterSpacing: "-0.03em", lineHeight: 1.05,
            marginBottom: "20px", maxWidth: "700px",
          }} className="reveal">
            Discover projects<br/>
            <span style={{ color: "#f37e22" }}>built for you.</span>
          </h1>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: "17px",
            color: "#5b86a2", lineHeight: 1.7, maxWidth: "480px",
          }} className="reveal">
            Enter your skills and domain. Our hybrid model surfaces the most
            relevant research projects and collaboration opportunities — ranked by fit.
          </p>
        </div>
      </section>

      {/* ═══ FORM ═══ */}
      <section style={{ background: "#f8f7f4", padding: "80px 40px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="section-label reveal">Configure your query</div>
          <QueryForm onRun={handleRun} loading={loading} />
        </div>
      </section>

      {/* ═══ RESULTS ═══ */}
      {(loading || results !== null) && (
        <section style={{ background: "#f8f7f4", padding: "80px 40px 120px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

            {/* Loading */}
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", padding: "60px 0" }}>
                <div className="spinner" />
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "#5b86a2" }}>
                  Running hybrid recommendation model…
                </p>
              </div>
            )}

            {/* API Error */}
            {!loading && apiError && (
              <div style={{
                background: "rgba(243,126,34,0.08)", border: "1px solid rgba(243,126,34,0.3)",
                borderRadius: "14px", padding: "24px 28px",
              }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: "#f37e22", margin: 0 }}>
                  ⚠️ {apiError}
                </p>
              </div>
            )}

            {/* Results */}
            {!loading && results && results.length > 0 && (
              <>
                <div className="section-label reveal">Results</div>

                {/* Summary bar */}
                <div className="reveal" style={{
                  background: "#ffffff", border: "1px solid rgba(14,73,113,0.1)",
                  borderRadius: "14px", padding: "20px 28px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: "16px", marginBottom: "32px",
                }}>
                  <div>
                    <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "20px", color: "#0e4971", marginBottom: "4px" }}>
                      {results.length} recommendations for &ldquo;{query?.student_skills}&rdquo;
                    </h3>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#5b86a2", margin: 0 }}>
                      Domain: <strong style={{ color: "#0e4971" }}>{query?.student_domain}</strong>
                      &nbsp;·&nbsp; Top-{query?.k} results
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {[
                      { label: "Avg score", value: (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(2) },
                      { label: "Total",     value: results.length },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        background: "rgba(14,73,113,0.05)", border: "1px solid rgba(14,73,113,0.1)",
                        borderRadius: "10px", padding: "8px 16px", textAlign: "center",
                      }}>
                        <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "20px", color: "#0e4971", margin: 0, lineHeight: 1 }}>
                          {stat.value}
                        </p>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#5b86a2", margin: "3px 0 0" }}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filter bar */}
                <div className="reveal" style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: "12px", marginBottom: "24px",
                }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { key: "all",  label: "All results" },
                      { key: "top3", label: "Top 3" },
                    ].map(f => (
                      <button
                        key={f.key}
                        className={`segment-btn${filterType === f.key ? " active" : ""}`}
                        onClick={() => setFilter(f.key)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(91,134,162,0.7)" }}>
                    {displayed.length} result{displayed.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {displayed.map((r, idx) => {
                    const globalRank = idx + 1;
                    const isTop      = globalRank <= 3;

                    return (
                      <div
                        key={r.post_id}
                        className={`rec-card${globalRank === 1 ? " top-match" : ""} reveal`}
                        style={{ animationDelay: `${idx * 0.06}s` }}
                      >
                        {/* Rank ring */}
                        <ScoreRing score={r.score} rank={globalRank} />

                        {/* Main content */}
                        <div style={{ minWidth: 0 }}>

                          {/* Title + badge */}
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "20px", color: "#0e4971", margin: 0, lineHeight: 1.2 }}>
                              {r.title}
                            </h3>
                            {isTop && (
                              <span style={{
                                fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 500,
                                background: globalRank === 1 ? "rgba(243,126,34,0.12)" : globalRank === 2 ? "rgba(91,134,162,0.12)" : "rgba(34,197,94,0.1)",
                                color:      globalRank === 1 ? "#f37e22"               : globalRank === 2 ? "#5b86a2"               : "#16a34a",
                                borderRadius: "999px", padding: "3px 10px", whiteSpace: "nowrap",
                              }}>
                                {globalRank === 1 ? "🥇 Best match" : globalRank === 2 ? "🥈 Runner-up" : "🥉 Third place"}
                              </span>
                            )}
                          </div>

                          {/* Meta row */}
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                            <span className="domain-tag">{r.domain}</span>
                            <CollabBadge type={r.collaboration_type} />
                            <span style={{ fontFamily: "monospace", fontSize: "11px", color: "rgba(91,134,162,0.6)" }}>
                              ID #{r.post_id}
                            </span>
                          </div>

                          {/* Score bar */}
                          <div style={{ maxWidth: "280px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#5b86a2" }}>Relevance score</span>
                              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#0e4971", fontWeight: 500 }}>
                                {r.score.toFixed(4)}
                              </span>
                            </div>
                            <div className="score-bar-bg">
                              <div
                                className="score-bar-fill"
                                style={{
                                  width: `${Math.min(r.score * 100, 100)}%`,
                                  background: globalRank === 1 ? "#f37e22" : globalRank === 2 ? "#5b86a2" : "#0e4971",
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Score column */}
                        <div className="score-col" style={{ textAlign: "right", paddingTop: "4px", flexShrink: 0 }}>
                          <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#5b86a2", margin: "0 0 4px" }}>Score</p>
                          <p style={{
                            fontFamily: "'DM Serif Display',serif", fontSize: "32px",
                            color: globalRank === 1 ? "#f37e22" : "#0e4971",
                            margin: 0, lineHeight: 1,
                          }}>
                            {r.score.toFixed(2)}
                          </p>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(91,134,162,0.5)", marginTop: "4px" }}>
                            / 1.00
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Model note */}
                <div className="reveal" style={{
                  marginTop: "48px", background: "#ffffff",
                  border: "1px solid rgba(14,73,113,0.1)", borderRadius: "14px",
                  padding: "24px 28px", display: "flex", gap: "20px", alignItems: "flex-start",
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "rgba(14,73,113,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0e4971" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "16px", color: "#0e4971", marginBottom: "8px" }}>
                      How scoring works
                    </h4>
                    <p style={{ fontFamily: "monospace", fontSize: "13px", color: "#5b86a2", lineHeight: 1.7, margin: 0 }}>
                      Model: hybrid_recommendation_model.pkl — hosted on Hugging Face Spaces<br/>
                      Input: skills (text) + profile_type (student / researcher) + top_k<br/>
                      Output: ranked posts with post_id, title, domain, collaboration_type, score (0–1)
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Empty state */}
            {!loading && results && results.length === 0 && !apiError && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "24px", color: "#0e4971", marginBottom: "10px" }}>
                  No results found
                </p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "#5b86a2" }}>
                  Try different skills or switch your profile type.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section style={{
        background: "#0e4971", padding: "80px 40px",
        position: "relative", overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {PARTICLES.slice(0, 40).map(p => (
            <span key={p.id} style={{
              position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
              fontSize: `${p.size}px`, color: "rgba(255,255,255,0.06)",
              fontFamily: "monospace", userSelect: "none",
            }}>{p.char}</span>
          ))}
        </div>
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: "clamp(32px,4vw,56px)", color: "#fff",
            letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px",
          }} className="reveal">
            Found something interesting?<br/>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Start collaborating today.</span>
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }} className="reveal">
            <button
              onClick={() => navigate("/signup")}
              style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 600,
                background: "#f37e22", color: "#fff", border: "none",
                borderRadius: "999px", padding: "14px 28px", cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Join the platform →
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 500,
                background: "transparent", color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: "999px", padding: "14px 28px", cursor: "pointer",
              }}
            >
              Back to home
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}