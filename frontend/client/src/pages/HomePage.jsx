import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ── fonts + global reset ── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; background: #f8f7f4; color: #0e4971; -webkit-font-smoothing: antialiased; }

/* scrolling ticker */
@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.ticker-track { display: flex; animation: ticker 30s linear infinite; width: max-content; }
.ticker-track:hover { animation-play-state: paused; }

/* fade-up on scroll */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
.reveal { opacity: 0; }
.reveal.visible { animation: fadeUp 0.7s ease forwards; }

/* hero char rain */
@keyframes charFall {
  0%   { opacity: 0; transform: translateY(-10px); }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.15; }
  100% { opacity: 0; transform: translateY(20px); }
}

/* section label line */
.section-label {
  display: flex; align-items: center; gap: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 500;
  color: #5b86a2; margin-bottom: 32px;
}
.section-label::before {
  content: '';
  display: block; width: 32px; height: 1px;
  background: #5b86a2;
}
`;

/* ── scatter chars ── */
const CHARS  = "01→←⟨⟩∇∆∑∏∫⌘⌥⊕⊗|—·∘×≡≠≈∈∉∩∪".split("");
const COUNT  = 120;
function buildParticles() {
  return Array.from({ length: COUNT }, (_, i) => ({
    id:   i,
    char: CHARS[Math.floor(Math.random() * CHARS.length)],
    x:    Math.random() * 100,
    y:    Math.random() * 100,
    size: Math.random() * 9 + 8,
    op:   Math.random() * 0.22 + 0.06,
    dur:  Math.random() * 5 + 4,
    del:  Math.random() * 6,
  }));
}
const PARTICLES = buildParticles();

/* ── features ── */
const FEATURES = [
  {
    num: "01",
    title: "AI-Powered Matching",
    desc: "Our model analyses your research profile and surfaces collaborators whose work complements yours — across departments and institutions.",
    visual: (
      <div style={{ width: "100%", maxWidth: 340, border: "1px solid rgba(14,73,113,0.15)", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(14,73,113,0.08)", display: "flex", gap: "6px" }}>
          {["#f37e22","#5b86a2","#22c55e"].map(c => <span key={c} style={{ width:10, height:10, borderRadius:"50%", background:c, display:"inline-block" }}/>)}
        </div>
        <div style={{ padding: "20px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          {[85,70,55,40].map((w,i) => (
            <div key={i} style={{ height:8, width:`${w}%`, borderRadius:4, background: i===0 ? "#0e4971" : i===1 ? "#5b86a2" : "rgba(14,73,113,0.15)" }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "Semantic Paper Search",
    desc: "Go beyond keywords. Describe what you're looking for in plain language and our search engine finds the most relevant papers instantly.",
    visual: (
      <div style={{ width: "100%", maxWidth: 340, border: "1px solid rgba(14,73,113,0.15)", borderRadius: 12, overflow:"hidden", background:"#fff" }}>
        <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(14,73,113,0.08)", display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ flex:1, height:32, borderRadius:8, background:"rgba(14,73,113,0.05)", border:"1px solid rgba(14,73,113,0.12)" }} />
          <div style={{ width:32, height:32, borderRadius:8, background:"#f37e22", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
        </div>
        <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ padding:"10px 12px", border:"1px solid rgba(14,73,113,0.08)", borderRadius:8 }}>
              <div style={{ height:7, width:"70%", borderRadius:4, background:"#0e4971", marginBottom:6 }} />
              <div style={{ height:5, width:"90%", borderRadius:4, background:"rgba(14,73,113,0.15)" }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "03",
    title: "Collaborative Workspaces",
    desc: "Shared project boards, file storage, and discussion threads — everything your team needs to run a research project end-to-end.",
    visual: (
      <div style={{ width:"100%", maxWidth:340, border:"1px solid rgba(14,73,113,0.15)", borderRadius:12, padding:20, background:"#fff" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {["To Do","In Progress","Done"].map(col => (
            <div key={col}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:600, color:"#5b86a2", marginBottom:8 }}>{col}</p>
              {[1,2].map(i => (
                <div key={i} style={{ padding:"8px 10px", background:"rgba(14,73,113,0.05)", borderRadius:6, marginBottom:6 }}>
                  <div style={{ height:5, width:`${50+i*20}%`, borderRadius:3, background: col==="Done"?"#5b86a2":col==="In Progress"?"#f37e22":"rgba(14,73,113,0.2)" }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

/* ── tools ── */
const TOOLS = [
  { name:"Python",    cat:"Language" },
  { name:"PyTorch",   cat:"ML Framework" },
  { name:"TensorFlow",cat:"ML Framework" },
  { name:"Jupyter",   cat:"Notebook" },
 
  
];

/* ── useReveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io  = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ════════════════════════ PAGE ════════════════════════ */
export default function HomePage() {
  const navigate = useNavigate();
  useReveal();

  return (
    <>
      
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{
        background:   "#efefed",
        minHeight:    "100vh",
        paddingTop:   "120px",
        paddingBottom:"80px",
        position:     "relative",
        overflow:     "hidden",
      }}>
        {/* Scattered particles (right side) */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          {PARTICLES.map(p => (
            <span key={p.id} style={{
              position:   "absolute",
              left:       `${p.x}%`,
              top:        `${p.y}%`,
              fontSize:   `${p.size}px`,
              color:      p.x > 45 ? "#0e4971" : "transparent",
              opacity:    p.x > 45 ? p.op : 0,
              fontFamily: "monospace",
              fontWeight: 400,
              animation:  `charFall ${p.dur}s ${p.del}s ease-in-out infinite`,
              userSelect: "none",
            }}>
              {p.char}
            </span>
          ))}
        </div>

        <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 40px", position:"relative", zIndex:1 }}>
          {/* label */}
          <div className="section-label reveal" style={{ marginBottom:40 , color: "#0e4971"  }}>
            AI-Enhanced Research Collaboration · ENSIA
          </div>

          {/* Giant headline */}
          <h1 style={{
            fontFamily:    "'DM Serif Display', serif",
            fontSize:      "clamp(54px, 8vw, 112px)",
            lineHeight:    1.0,
            letterSpacing: "-0.03em",
            color:         "#0e4971",
            marginBottom:  "32px",
            maxWidth:      "820px",
          }} className="reveal">
            The platform<br/>
            <span style={{ color: "#f37e22" }}>to research.</span>
          </h1>

          <p style={{
            fontFamily:  "'DM Sans', sans-serif",
            fontSize:    "18px",
            color:       "#5b86a2",
            lineHeight:  1.65,
            maxWidth:    "480px",
            marginBottom:"48px",
          }} className="reveal">
            Connect with ENSIA researchers, discover cutting-edge papers,
            and publish your work — supercharged by AI.
          </p>

          {/* CTA buttons */}
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }} className="reveal">
            <button
              onClick={() => navigate("/signup")}
              style={{
                fontFamily:  "'DM Sans', sans-serif",
                fontSize:    "15px",
                fontWeight:  600,
                background:  "#0e4971",
                color:       "#fff",
                border:      "none",
                borderRadius:"999px",
                padding:     "14px 28px",
                cursor:      "pointer",
                display:     "flex",
                alignItems:  "center",
                gap:         "8px",
                transition:  "transform 0.15s, background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#0a3a5c"}
              onMouseLeave={e => e.currentTarget.style.background = "#0e4971"}
            >
              Get started free &nbsp;→
            </button>
            <button style={{
              fontFamily:   "'DM Sans', sans-serif",
              fontSize:     "15px",
              fontWeight:   500,
              background:   "transparent",
              color:        "#0e4971",
              border:       "1.5px solid rgba(14,73,113,0.25)",
              borderRadius: "999px",
              padding:      "14px 28px",
              cursor:       "pointer",
              transition:   "border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#0e4971"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(14,73,113,0.25)"}
            >
              Explore research
            </button>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section style={{
        background:  "#0e4971",
        padding:     "32px 40px",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px", textAlign: "center",
        }} className="stats-grid">
          {[
            { v:"1,200+", l:"Researchers" },
            { v:"340+",   l:"Published Papers" },
            { v:"95+",    l:"Active Projects" },
            { v:"18",     l:"Research Domains" },
          ].map(s => (
            <div key={s.l}>
              <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:"36px", color:"#f37e22", marginBottom:"4px" }}>{s.v}</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"rgba(255,255,255,0.55)" }}>{s.l}</p>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:640px){.stats-grid{grid-template-columns:1fr 1fr!important}}`}</style>
      </section>

      {/* ═══ CAPABILITIES ═══ */}
      <section id="explore" style={{ background:"#f8f7f4", padding:"120px 40px" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div className="section-label reveal">Capabilities</div>
          <h2 style={{
            fontFamily:    "'DM Serif Display',serif",
            fontSize:      "clamp(40px,5vw,72px)",
            letterSpacing: "-0.03em",
            color:         "#0e4971",
            marginBottom:  "80px",
            lineHeight:    1.05,
          }} className="reveal">
            The Oportunity is available.<br/>
            <span style={{ color:"rgba(14,73,113,0.3)" }}>For everyone.</span>
          </h2>

          <div style={{ display:"flex", flexDirection:"column", gap:"1px", borderTop:"1px solid rgba(14,73,113,0.1)" }}>
            {FEATURES.map((f, i) => (
              <div key={f.num} className="reveal" style={{
                display:      "grid",
                gridTemplateColumns: "80px 1fr 1fr",
                gap:          "32px",
                padding:      "56px 0",
                borderBottom: "1px solid rgba(14,73,113,0.1)",
                alignItems:   "start",
              }}>
                <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:"13px", color:"rgba(14,73,113,0.35)", paddingTop:"4px" }}>{f.num}</span>
                <div>
                  <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"28px", color:"#0e4971", marginBottom:"16px", letterSpacing:"-0.02em" }}>{f.title}</h3>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"16px", color:"#5b86a2", lineHeight:1.7, maxWidth:"400px" }}>{f.desc}</p>
                </div>
                <div style={{ display:"flex", justifyContent:"flex-end" }}>
                  {f.visual}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DARK SECTION — HOW IT WORKS ═══ */}
      <section id="dashboard" style={{
        background:   "#0e4971",
        padding:      "120px 40px",
        position:     "relative",
        overflow:     "hidden",
      }}>
        {/* diagonal texture lines */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)",
        }} />

        <div style={{ maxWidth:"1200px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <div className="section-label reveal" style={{ color:"rgba(255,255,255,0.4)" }}>
            <span style={{ background:"rgba(255,255,255,0.15)", width:32, height:1, display:"inline-block" }} />
            Process
          </div>

          <h2 style={{
            fontFamily:"'DM Serif Display',serif",
            fontSize:  "clamp(40px,5vw,72px)",
            color:     "#ffffff",
            letterSpacing: "-0.03em",
            marginBottom:"80px",
            lineHeight: 1.05,
          }} className="reveal">
            Four steps.<br/>
            <span style={{ color:"rgba(255,255,255,0.3)" }}>Infinite possibilities.</span>
          </h2>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px", alignItems:"start" }} className="how-grid">
            {/* Steps */}
            <div style={{ display:"flex", flexDirection:"column" }}>
              {[
                { n:"I",   title:"Create your profile",       desc:"Upload your CV. AI extracts your skills, education, and experience automatically." },
                { n:"II",  title:"Discover research",         desc:"Browse AI-curated papers and projects matched to your expertise and interests." },
                { n:"III", title:"Build your team",           desc:"Connect with complementary researchers and launch collaborative projects." },
                { n:"IV",  title:"Publish & earn recognition",desc:"Submit work for peer review, publish within the platform, and track your impact." },
              ].map((s, i) => (
                <div key={s.n} className="reveal" style={{
                  display:     "flex",
                  gap:         "24px",
                  padding:     "32px 0",
                  borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}>
                  <span style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize:   "13px",
                    color:      "rgba(255,255,255,0.3)",
                    minWidth:   "28px",
                    paddingTop: "3px",
                  }}>{s.n}</span>
                  <div>
                    <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"22px", color:"#fff", marginBottom:"8px" }}>{s.title}</h3>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px", color:"rgba(255,255,255,0.5)", lineHeight:1.65 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Code editor mockup */}
            <div className="reveal" style={{
              background:   "rgba(255,255,255,0.05)",
              border:       "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              overflow:     "hidden",
              position:     "sticky",
              top:          "100px",
            }}>
              {/* titlebar */}
              <div style={{
                display:    "flex",
                alignItems: "center",
                justifyContent:"space-between",
                padding:    "12px 16px",
                borderBottom:"1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{ display:"flex", gap:"6px" }}>
                  {["#f37e22","#5b86a2","rgba(255,255,255,0.2)"].map(c => (
                    <span key={c} style={{ width:10, height:10, borderRadius:"50%", background:c, display:"inline-block" }} />
                  ))}
                </div>
                <span style={{ fontFamily:"monospace", fontSize:"12px", color:"rgba(255,255,255,0.3)" }}>research.config.js</span>
              </div>
              {/* code body */}
              <div style={{ padding:"24px 20px", fontFamily:"monospace", fontSize:"13px", lineHeight:"1.9" }}>
                {[
                  { ln:1,  code:'researchAI.init({',                   color:"#fff" },
                  { ln:2,  code:'  user: "amira.benali@ensia.dz",',     color:"rgba(255,255,255,0.55)" },
                  { ln:3,  code:'  domain: "machine-learning",',        color:"rgba(255,255,255,0.55)" },
                  { ln:4,  code:'  collaboration: true,',               color:"rgba(255,255,255,0.55)" },
                  { ln:5,  code:'  autoMatch: "semantic",',             color:"rgba(255,255,255,0.55)" },
                  { ln:6,  code:'});',                                   color:"#fff" },
                  { ln:7,  code:'',                                      color:"" },
                  { ln:8,  code:'// 3 collaborators found ✓',           color:"#f37e22" },
                  { ln:9,  code:'// 14 papers matched ✓',               color:"#f37e22" },
                  { ln:10, code:'// Profile score: 94%',                color:"#5b86a2" },
                ].map(r => (
                  <div key={r.ln} style={{ display:"flex", gap:"16px" }}>
                    <span style={{ color:"rgba(255,255,255,0.2)", minWidth:"16px", textAlign:"right" }}>{r.ln}</span>
                    <span style={{ color: r.color }}>{r.code}</span>
                  </div>
                ))}
              </div>
              {/* status bar */}
              <div style={{
                display:"flex", alignItems:"center", gap:"8px",
                padding:"10px 16px",
                borderTop:"1px solid rgba(255,255,255,0.08)",
              }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
                <span style={{ fontFamily:"monospace", fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>Ready · Workspace active</span>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:760px){.how-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ═══ TOOLS / INTEGRATIONS ═══ */}
      <section id="myposts" style={{ background:"#f8f7f4", padding:"120px 0" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto 56px", padding:"0 40px", textAlign:"center" }}>
          <div className="section-label reveal" style={{ justifyContent:"center" }}>
            <span style={{ width:32, height:1, background:"#5b86a2", display:"inline-block" }} />
            Integrations
            <span style={{ width:32, height:1, background:"#5b86a2", display:"inline-block" }} />
          </div>
          <h2 style={{
            fontFamily:"'DM Serif Display',serif",
            fontSize:  "clamp(36px,5vw,64px)",
            color:     "#0e4971",
            letterSpacing:"-0.03em",
            lineHeight:1.05,
            marginBottom:"16px",
          }} className="reveal">
            Works with every tool<br/>you already use.
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"16px", color:"#5b86a2" }} className="reveal">
            Connects seamlessly to the research ecosystem.
          </p>
        </div>

        {/* Scrolling rows */}
        {[0, TOOLS.length / 2].map((start, ri) => (
          <div key={ri} style={{ overflow:"hidden", marginBottom: ri === 0 ? "12px" : 0 }}>
            <div
              className="ticker-track"
              style={{ animationDirection: ri === 1 ? "reverse" : "normal", gap:"12px", padding:"0 6px" }}
            >
              {[...TOOLS, ...TOOLS].map((t, i) => (
                <div key={i} style={{
                  background:   "#ffffff",
                  border:       "1px solid rgba(14,73,113,0.1)",
                  borderRadius: "14px",
                  padding:      "20px 28px",
                  minWidth:     "160px",
                  flexShrink:   0,
                }}>
                  <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:"16px", color:"#0e4971", marginBottom:"4px" }}>{t.name}</p>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"#5b86a2" }}>{t.cat}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{
        background:  "#f8f7f4",
        padding:     "120px 40px",
        position:    "relative",
        overflow:    "hidden",
        borderTop:   "1px solid rgba(14,73,113,0.08)",
        borderBottom:"1px solid rgba(14,73,113,0.08)",
      }}>
        {/* scattered chars — denser, forms a loose circle on the right */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          {PARTICLES.slice(0, 80).map(p => (
            <span key={p.id} style={{
              position:   "absolute",
              left:       `${40 + p.x * 0.6}%`,
              top:        `${p.y}%`,
              fontSize:   `${p.size + 2}px`,
              color:      "#0e4971",
              opacity:    p.op * 0.8,
              fontFamily: "monospace",
              userSelect: "none",
            }}>{p.char}</span>
          ))}
        </div>

        <div style={{ maxWidth:"1200px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <div className="section-label reveal">Get started</div>
          <h2 style={{
            fontFamily:"'DM Serif Display',serif",
            fontSize:  "clamp(40px,5.5vw,80px)",
            color:     "#0e4971",
            letterSpacing:"-0.03em",
            lineHeight:1.05,
            marginBottom:"24px",
            maxWidth:  "640px",
          }} className="reveal">
            Ready to accelerate<br/>your research?
          </h2>
          <p style={{
            fontFamily:"'DM Sans',sans-serif",
            fontSize:  "16px",
            color:     "#5b86a2",
            lineHeight:1.7,
            maxWidth:  "400px",
            marginBottom:"40px",
          }} className="reveal">
            Join the ENSIA community. Start free, publish faster, collaborate smarter.
          </p>
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }} className="reveal">
            <button
              onClick={() => navigate("/signup")}
              style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:  "15px",
                fontWeight:600,
                background:"#f37e22",
                color:     "#fff",
                border:    "none",
                borderRadius:"999px",
                padding:   "14px 28px",
                cursor:    "pointer",
                display:   "flex",
                alignItems:"center",
                gap:       "8px",
                transition:"opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >
              Start building free &nbsp;→
            </button>
            <button style={{
              fontFamily:  "'DM Sans',sans-serif",
              fontSize:    "15px",
              fontWeight:  500,
              background:  "transparent",
              color:       "#0e4971",
              border:      "1.5px solid rgba(14,73,113,0.25)",
              borderRadius:"999px",
              padding:     "14px 28px",
              cursor:      "pointer",
            }}>
              Browse research
            </button>
          </div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"rgba(91,134,162,0.6)", marginTop:"16px" }}>
            Free for all ENSIA students · No credit card required
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
