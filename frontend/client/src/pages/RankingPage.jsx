import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import STUDENTS_DATA from "../data/studentsData";
import "./RankingPage.css";

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
    dur: Math.random() * 5 + 4,
    del: Math.random() * 6,
  }));
}
const PARTICLES = buildParticles();

/* ════════════════════════════════════════════
   MATCHING MODEL  (JS port of Python script)
   Uses LCS-based SequenceMatcher ratio
════════════════════════════════════════════ */
function sequenceSimilarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 1;
  const m = a.length, n = b.length;
  if (m === 0 || n === 0) return 0;
  let prev = new Array(n + 1).fill(0);
  let lcs = 0;
  for (let i = 1; i <= m; i++) {
    const curr = new Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        curr[j] = prev[j - 1] + 1;
        if (curr[j] > lcs) lcs = curr[j];
      }
    }
    prev = curr;
  }
  return (2 * lcs) / (m + n);
}

function normalizeSkills(skills) {
  return skills.map(s => s.toLowerCase().trim());
}

function computeScore(student, project) {
  const studentSkills = normalizeSkills(student.skills);
  const totalWeight = Object.values(project.skills).reduce((a, b) => a + b, 0);

  let skillScore = 0;
  const matchedSkills = [];

  for (const [skill, weight] of Object.entries(project.skills)) {
    for (const s of studentSkills) {
      const sim = sequenceSimilarity(skill, s);
      if (sim > 0.5) {
        skillScore += weight;
        matchedSkills.push(skill);
        break;
      }
    }
  }

  skillScore /= totalWeight;
  const finalScore =
    skillScore * 0.5 +
    student.experience * 0.2 +
    student.motivation * 0.3;

  return {
    finalScore:    Math.round(finalScore * 100) / 100,
    skillScore:    Math.round(skillScore * 100) / 100,
    experience:    student.experience,
    motivation:    student.motivation,
    matchedSkills,
  };
}

function getRankedResults(project) {
  const results = STUDENTS_DATA.map(student => ({
    name:     student.name,
    skills:   student.skills,
    ...computeScore(student, project),
  }));
  results.sort((a, b) => b.finalScore - a.finalScore);
  return results;
}

/* ── helpers ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}

function medalColor(rank) {
  if (rank === 1) return "#f37e22";
  if (rank === 2) return "#5b86a2";
  if (rank === 3) return "#22c55e";
  return "rgba(14,73,113,0.25)";
}

function Avatar({ name, rank }) {
  const parts    = name.split(" ");
  const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  const bg =
    rank === 1 ? "rgba(243,126,34,0.12)"  :
    rank === 2 ? "rgba(91,134,162,0.12)"  :
    rank === 3 ? "rgba(34,197,94,0.1)"    :
    "rgba(14,73,113,0.06)";
  const color = rank <= 3 ? medalColor(rank) : "#0e4971";
  return (
    <div style={{
      width: "48px", height: "48px", borderRadius: "50%",
      background: bg, border: `2px solid ${color}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Serif Display', serif", fontSize: "16px",
      color, flexShrink: 0,
    }}>
      {initials.toUpperCase()}
    </div>
  );
}

/* ════════════════════════════════════════════
   PROJECT SETUP FORM
════════════════════════════════════════════ */
function ProjectSetupForm({ onRun }) {
  const [projectTitle, setProjectTitle] = useState("");
  const [skillRows, setSkillRows] = useState([
    { id: 1, name: "", weight: "0.3" },
    { id: 2, name: "", weight: "0.5" },
    { id: 3, name: "", weight: "0.2" },
  ]);

  const totalWeight = skillRows.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0);
  const weightOk    = Math.abs(totalWeight - 1.0) < 0.001;
  const canRun      = projectTitle.trim() && skillRows.every(r => r.name.trim()) && weightOk;

  function addSkill() {
    setSkillRows(prev => [...prev, { id: Date.now(), name: "", weight: "0.1" }]);
  }

  function removeSkill(id) {
    setSkillRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  }

  function updateRow(id, field, value) {
    setSkillRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }

  function handleRun() {
    const skillsObj = {};
    skillRows.forEach(r => {
      if (r.name.trim()) skillsObj[r.name.trim()] = parseFloat(r.weight) || 0;
    });
    onRun({ title: projectTitle.trim(), skills: skillsObj });
  }

  return (
    <div className="project-form reveal">
      {/* Project title */}
      <div style={{ marginBottom: "28px" }}>
        <label className="form-label">Project title</label>
        <input
          className="form-input"
          placeholder="e.g. AI Research Project — NLP & Data Science"
          value={projectTitle}
          onChange={e => setProjectTitle(e.target.value)}
        />
      </div>

      {/* Skills */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 36px", gap: "10px", marginBottom: "10px" }}>
          <label className="form-label" style={{ margin: 0 }}>Required skill</label>
          <label className="form-label" style={{ margin: 0, textAlign: "center" }}>Weight (0–1)</label>
          <div />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {skillRows.map(row => (
            <div key={row.id} className="skill-row">
              <input
                className="form-input"
                placeholder="e.g. Python, ML, Data Analysis…"
                value={row.name}
                onChange={e => updateRow(row.id, "name", e.target.value)}
              />
              <input
                className="weight-input"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={row.weight}
                onChange={e => updateRow(row.id, "weight", e.target.value)}
              />
              <button className="remove-btn" onClick={() => removeSkill(row.id)}>×</button>
            </div>
          ))}
        </div>

        {/* Weight feedback */}
        <div style={{ marginTop: "10px" }}>
          {skillRows.some(r => r.name.trim()) && (
            weightOk
              ? <p className="weight-ok">✓ Weights sum to 1.00 — ready to run</p>
              : <p className="weight-warning">⚠ Weights sum to {totalWeight.toFixed(2)} — must equal 1.00</p>
          )}
        </div>
      </div>

      {/* Add skill */}
      <button className="add-skill-btn" onClick={addSkill} style={{ marginBottom: "28px" }}>
        + Add skill
      </button>

      {/* Run */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="run-btn" disabled={!canRun} onClick={handleRun}>
          Run matching model →
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════ PAGE ══════════════════════ */
export default function RankingPage() {
  const navigate = useNavigate();
  useReveal();

  const [project, setProject]   = useState(null);   // null = setup mode
  const [results, setResults]   = useState([]);
  const [filter, setFilter]     = useState("all");

  function handleRun(proj) {
    const ranked = getRankedResults(proj);
    setProject(proj);
    setResults(ranked);
    // scroll to results after a tick
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleReset() {
    setProject(null);
    setResults([]);
    setFilter("all");
  }

  const displayed = results.filter(r => {
    if (filter === "matched") return r.matchedSkills.length > 0;
    if (filter === "top3")    return results.indexOf(r) < 3;
    return true;
  });

  return (
    <>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{
        background: "#efefed", minHeight: "420px",
        paddingTop: "130px", paddingBottom: "80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* particles */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {PARTICLES.map(p => (
            <span key={p.id} style={{
              position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
              fontSize: `${p.size}px`,
              color: p.x > 40 ? "#0e4971" : "transparent",
              opacity: p.x > 40 ? p.op : 0,
              fontFamily: "monospace",
              animation: `charFall ${p.dur}s ${p.del}s ease-in-out infinite`,
              userSelect: "none",
            }}>{p.char}</span>
          ))}
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}>
          <div className="section-label reveal">AI Matching Engine · ENSIA Platform</div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(48px, 7vw, 96px)",
            lineHeight: 1.0, letterSpacing: "-0.03em",
            color: "#0e4971", marginBottom: "24px", maxWidth: "720px",
          }} className="reveal">
            Student<br/>
            <span style={{ color: "#f37e22" }}>rankings.</span>
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "17px",
            color: "#5b86a2", lineHeight: 1.65, maxWidth: "460px",
          }} className="reveal">
            Define your project and required skills, then let the AI rank every candidate using fuzzy matching for typos and synonyms.
          </p>
        </div>
      </section>

      {/* ═══ PROJECT SETUP ═══ */}
      <section style={{ background: "#f8f7f4", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="section-label reveal">Step 1 — Configure your project</div>

          {!project ? (
            <ProjectSetupForm onRun={handleRun} />
          ) : (
            /* project badge (post-run) */
            <div className="reveal" style={{
              display: "inline-flex", alignItems: "center", gap: "12px",
              background: "rgba(14,73,113,0.06)", border: "1px solid rgba(14,73,113,0.12)",
              borderRadius: "14px", padding: "14px 22px",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f37e22", flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "18px", color: "#0e4971", marginBottom: "4px" }}>
                  {project.title}
                </p>
                <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#5b86a2" }}>
                  weights →{" "}
                  {Object.entries(project.skills).map(([k, v]) => `${k} ${Math.round(v * 100)}%`).join(" · ")}
                </p>
              </div>
              <button
                onClick={handleReset}
                style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 500,
                  background: "transparent", color: "#5b86a2",
                  border: "1px solid rgba(14,73,113,0.2)", borderRadius: "999px",
                  padding: "6px 14px", cursor: "pointer", marginLeft: "8px",
                }}
              >
                Edit project
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ STATS BAR (only when results exist) ═══ */}
      {results.length > 0 && (
        <section style={{ background: "#0e4971", padding: "28px 40px" }} id="results-section">
          <div style={{
            maxWidth: "1200px", margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            gap: "24px", textAlign: "center",
          }} className="stats-grid">
            {[
              { v: results.length,                                              l: "Total candidates" },
              { v: results.filter(r => r.matchedSkills.length > 0).length,     l: "Skills matched" },
              { v: results.filter(r => r.finalScore >= 0.70).length,           l: "High scorers" },
              { v: (results.reduce((a, b) => a + b.finalScore, 0) / results.length).toFixed(2), l: "Avg. final score" },
            ].map(s => (
              <div key={s.l}>
                <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "36px", color: "#f37e22", marginBottom: "4px" }}>{s.v}</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ RANKING TABLE ═══ */}
      {results.length > 0 && (
        <section style={{ background: "#f8f7f4", padding: "80px 40px 120px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

            {/* filters */}
            <div className="reveal" style={{
              display: "flex", gap: "10px", flexWrap: "wrap",
              marginBottom: "40px", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { key: "all",     label: "All candidates" },
                  { key: "matched", label: "Skill match only" },
                  { key: "top3",    label: "Top 3" },
                ].map(f => (
                  <button key={f.key}
                    onClick={() => setFilter(f.key)}
                    style={{
                      fontFamily: "'DM Sans',sans-serif", fontSize: "13px",
                      fontWeight: filter === f.key ? 600 : 400,
                      background: filter === f.key ? "#0e4971" : "transparent",
                      color:      filter === f.key ? "#fff" : "#5b86a2",
                      border:     filter === f.key ? "none" : "1px solid rgba(14,73,113,0.2)",
                      borderRadius: "999px", padding: "8px 18px",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >{f.label}</button>
                ))}
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(91,134,162,0.7)" }}>
                {displayed.length} result{displayed.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {displayed.map((r, idx) => {
                const globalRank = results.indexOf(r) + 1;
                const isTop = globalRank <= 3;
                return (
                  <div
                    key={r.name}
                    className={`rank-card${globalRank === 1 ? " gold" : ""} reveal`}
                    style={{ animationDelay: `${idx * 0.06}s` }}
                  >
                    {/* rank */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", paddingTop: "4px" }}>
                      <span style={{
                        fontFamily: "'DM Serif Display',serif",
                        fontSize: globalRank <= 9 ? "28px" : "22px",
                        color: medalColor(globalRank), lineHeight: 1,
                      }}>#{globalRank}</span>
                      <Avatar name={r.name} rank={globalRank} />
                    </div>

                    {/* info */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "20px", color: "#0e4971", margin: 0 }}>
                          {r.name}
                        </h3>
                        {isTop && (
                          <span style={{
                            fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 500,
                            background: globalRank===1?"rgba(243,126,34,0.12)":globalRank===2?"rgba(91,134,162,0.12)":"rgba(34,197,94,0.1)",
                            color: medalColor(globalRank), borderRadius: "999px", padding: "3px 10px",
                          }}>
                            {globalRank===1?"🥇 Top match":globalRank===2?"🥈 Runner-up":"🥉 Third place"}
                          </span>
                        )}
                      </div>

                      {/* skill pills */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                        {r.skills.map(s => {
                          const isMatched = r.matchedSkills.some(m => sequenceSimilarity(m, s) > 0.5);
                          return (
                            <span key={s} className={`skill-pill ${isMatched ? "matched" : "unmatched"}`}>
                              {isMatched && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0e4971", display: "inline-block" }} />}
                              {s}
                            </span>
                          );
                        })}
                      </div>

                      {/* score bars */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                        {[
                          { label: "Skill match", value: r.skillScore,  color: "#0e4971" },
                          { label: "Experience",  value: r.experience,  color: "#5b86a2" },
                          { label: "Motivation",  value: r.motivation,  color: "#f37e22" },
                        ].map(bar => (
                          <div key={bar.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "#5b86a2" }}>{bar.label}</span>
                              <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#0e4971", fontWeight: 500 }}>{bar.value.toFixed(2)}</span>
                            </div>
                            <div className="score-bar-bg">
                              <div className="score-bar-fill" style={{ width: `${bar.value * 100}%`, background: bar.color }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {r.matchedSkills.length === 0 && (
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(91,134,162,0.6)", marginTop: "10px" }}>
                          No project skills matched
                        </p>
                      )}
                    </div>

                    {/* final score */}
                    <div style={{ textAlign: "right", paddingTop: "4px", flexShrink: 0 }}>
                      <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#5b86a2", margin: "0 0 4px" }}>Final score</p>
                      <p style={{
                        fontFamily: "'DM Serif Display',serif", fontSize: "32px",
                        color: globalRank===1?"#f37e22":"#0e4971", margin: 0, lineHeight: 1,
                      }}>{r.finalScore.toFixed(2)}</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(91,134,162,0.5)", marginTop: "4px" }}>/ 1.00</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* formula note */}
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
                <h4 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "16px", color: "#0e4971", marginBottom: "8px" }}>Scoring formula</h4>
                <p style={{ fontFamily: "monospace", fontSize: "13px", color: "#5b86a2", lineHeight: 1.7, margin: 0 }}>
                  Final Score = (Skill Score × 0.5) + (Experience × 0.2) + (Motivation × 0.3)<br/>
                  Skill Score uses fuzzy string matching (LCS ratio &gt; 0.5 threshold) to handle typos and abbreviations.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ═══ */}
      <section style={{
        background: "#0e4971", padding: "80px 40px",
        position: "relative", overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: "clamp(32px,4vw,56px)", color: "#fff",
            letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px",
          }} className="reveal">
            Ready to find your<br/>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>perfect research team?</span>
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