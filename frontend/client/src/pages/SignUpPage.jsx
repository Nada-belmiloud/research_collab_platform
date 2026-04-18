import { useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ── fonts shared with homepage ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #f8f7f4; color: #0e4971; -webkit-font-smoothing: antialiased; }

@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.fade-up { animation: fadeUp 0.5s ease forwards; }
.d1{animation-delay:0.05s;opacity:0} .d2{animation-delay:0.12s;opacity:0} .d3{animation-delay:0.2s;opacity:0} .d4{animation-delay:0.28s;opacity:0}

@keyframes spin { to{transform:rotate(360deg)} }
.spin { animation: spin 0.9s linear infinite; }

@keyframes bar { from{width:0} to{width:100%} }
.bar-anim { animation: bar 16s linear forwards; }

@keyframes checkIn { 0%{stroke-dashoffset:80} 100%{stroke-dashoffset:0} }
.check-draw { stroke-dasharray:80; stroke-dashoffset:80; animation: checkIn 0.6s 0.4s ease forwards; }

input, textarea {
  font-family: 'DM Sans', sans-serif;
  background: #ffffff;
  border: 1.5px solid rgba(14,73,113,0.15);
  border-radius: 10px;
  color: #0e4971;
  font-size: 14px;
  padding: 11px 14px;
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
}
input:focus, textarea:focus { border-color: #f37e22; }
input::placeholder, textarea::placeholder { color: rgba(91,134,162,0.5); }
textarea { resize: vertical; min-height: 76px; }

label { font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; color:#5b86a2; text-transform:uppercase; letter-spacing:0.05em; display:block; margin-bottom:6px; }

.tag-pill {
  display:inline-flex; align-items:center; gap:5px;
  background:rgba(14,73,113,0.07); border:1px solid rgba(14,73,113,0.14);
  border-radius:999px; padding:4px 12px; font-size:12px; color:#0e4971;
}
.tag-pill button { background:none; border:none; cursor:pointer; color:rgba(91,134,162,0.7); font-size:15px; line-height:1; padding:0; }
.tag-pill button:hover { color:#0e4971; }

.card {
  background:#ffffff; width: 600px ; border:1.5px solid rgba(14,73,113,0.1); border-radius:16px; padding:24px; margin-bottom:16px;
}
.card h3 {
  font-family:'DM Serif Display',serif; font-size:18px; color:#0e4971;
  margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid rgba(14,73,113,0.08);
}

.btn-primary {
  font-family:'DM Sans',sans-serif; font-weight:600; font-size:15px;
  background:#f37e22; color:#fff; border:none; border-radius:999px;
  padding:13px 28px; cursor:pointer; transition:opacity 0.15s,transform 0.15s;
}
.btn-primary:hover { opacity:0.88; transform:scale(1.02); }
.btn-primary:disabled { background:rgba(14,73,113,0.15); color:rgba(14,73,113,0.4); cursor:not-allowed; transform:none; opacity:1; }

.btn-outline {
  font-family:'DM Sans',sans-serif; font-weight:500; font-size:14px;
  background:transparent; color:#5b86a2;
  border:1.5px solid rgba(14,73,113,0.18); border-radius:999px;
  padding:11px 22px; cursor:pointer; transition:border-color 0.15s,color 0.15s;
}
.btn-outline:hover { border-color:#0e4971; color:#0e4971; }

.step-dot {
  width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center;
  font-family:'DM Serif Display',serif; font-size:13px; flex-shrink:0;
  transition:all 0.3s ease;
}
.err { color:#ef4444; font-size:12px; margin-top:4px; font-family:'DM Sans',sans-serif; }
`;

/* ── helpers ── */
// Local Flask server — run cv_extractor.py before using Sign Up
const BACKEND_URL = "http://localhost:5000";

function Field({ label, req, err, children }) {
  return (
    <div>
      <label>{label}{req && <span style={{ color:"#f37e22" }}> *</span>}</label>
      {children}
      {err && <p className="err">{err}</p>}
    </div>
  );
}

function TagEditor({ tags, onChange, placeholder }) {
  const [v, setV] = useState("");
  const add = () => {
    const t = v.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setV("");
  };
  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom: tags.length ? "8px" : 0 }}>
        {tags.map(t => (
          <span key={t} className="tag-pill">
            {t}
            <button type="button" onClick={() => onChange(tags.filter(x => x !== t))}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display:"flex", gap:"8px" }}>
        <input value={v} onChange={e => setV(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder || "Type and press Enter"} style={{ flex:1 }} />
        <button type="button" onClick={add} style={{
          fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600,
          background:"rgba(14,73,113,0.07)", border:"1.5px solid rgba(14,73,113,0.14)",
          color:"#0e4971", borderRadius:"10px", padding:"0 16px", cursor:"pointer",
        }}>Add</button>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  const steps = ["Upload CV", "Extracting", "Review", "Done"];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0", marginBottom:"40px" }}>
      {steps.map((s, i) => {
        const done   = step > i;
        const active = step === i;
        return (
          <div key={s} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
              <div className="step-dot" style={{
                background:  done ? "#0e4971" : active ? "rgba(14,73,113,0.1)" : "rgba(14,73,113,0.05)",
                border:      active ? "2px solid #0e4971" : done ? "2px solid #0e4971" : "2px solid rgba(14,73,113,0.15)",
                color:       done || active ? (done ? "#fff" : "#0e4971") : "rgba(14,73,113,0.3)",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize:"10px", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap",
                color: active ? "#0e4971" : done ? "#5b86a2" : "rgba(14,73,113,0.3)", fontWeight: active ? 600 : 400 }}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width:"44px", height:"1.5px", background: done ? "#0e4971" : "rgba(14,73,113,0.1)", margin:"0 4px 18px", transition:"background 0.4s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════ PAGE ════════════════════════ */
export default function SignUpPage() {
  const navigate   = useNavigate();
  const dropRef    = useRef(null);
  const fileRef    = useRef(null);

  const [step, setStep]       = useState(0);
  const [dragging, setDrag]   = useState(false);
  const [file, setFile]       = useState(null);
  const [apiErr, setApiErr]   = useState("");
  const [log, setLog]         = useState("Initialising…");
  const [errs, setErrs]       = useState({});

  const [form, setForm] = useState({
    name:"", email:"", phone:"", location:"",
    linkedin:"", github:"", summary:"",
    technical_skills:[], soft_skills:[], languages:[],
    education:[], experience:[],
    password:"", confirmPassword:"",
  });

  /* drag/drop */
  const onDragOver  = useCallback(e => { e.preventDefault(); setDrag(true); },  []);
  const onDragLeave = useCallback(()  => setDrag(false), []);
  const onDrop      = useCallback(e => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
  }, []);

  /* AI extraction — calls local Python Flask server */
  async function extract() {
    if (!file) return;
    setStep(1); setApiErr("");
    try {
      setLog("Uploading your CV…");

      // Send PDF as multipart/form-data to the local Flask server
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BACKEND_URL}/extract`, {
        method: "POST",
        body:   formData,
        // Do NOT set Content-Type — browser sets it with boundary automatically
      });

      setLog("AI is reading your CV…");

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const parsed = await res.json();
      setLog("Filling your profile…");
      setLog("Filling your profile…");
      await new Promise(r => setTimeout(r, 500));
      setForm(f => ({
        ...f,
        name:             parsed.name             || "",
        email:            parsed.email            || "",
        phone:            parsed.phone            || "",
        location:         parsed.location         || "",
        linkedin:         parsed.linkedin         || "",
        github:           parsed.github           || "",
        summary:          parsed.summary          || "",
        technical_skills: parsed.technical_skills || [],
        soft_skills:      parsed.soft_skills      || [],
        languages:        parsed.languages        || [],
        education:        (parsed.education || []).map(e => ({
          degree:e.degree||"", field:e.field||"", school:e.school||"", start_year:e.start_year||"", end_year:e.end_year||"",
        })),
        experience: (parsed.experience || []).map(e => ({
          role:e.role||"", company:e.company||"", start_date:e.start_date||"", end_date:e.end_date||"", description:e.description||"",
        })),
      }));
      setStep(2);
    } catch(err) {
      setApiErr(err.message || "Extraction failed. You can fill the form manually.");
      setStep(0);
    }
  }

  /* form helpers */
  const set     = (k, v) => setForm(f => ({ ...f, [k]:v }));
  const updEdu  = (i, k, v) => setForm(f => { const a=[...f.education];   a[i]={...a[i],[k]:v}; return {...f,education:a}; });
  const remEdu  = i => setForm(f => ({ ...f, education:  f.education.filter((_,j)=>j!==i) }));
  const addEdu  = () => setForm(f => ({ ...f, education:  [...f.education,  {degree:"",field:"",school:"",start_year:"",end_year:""}] }));
  const updExp  = (i, k, v) => setForm(f => { const a=[...f.experience];  a[i]={...a[i],[k]:v}; return {...f,experience:a}; });
  const remExp  = i => setForm(f => ({ ...f, experience: f.experience.filter((_,j)=>j!==i) }));
  const addExp  = () => setForm(f => ({ ...f, experience: [...f.experience, {role:"",company:"",start_date:"",end_date:"",description:""}] }));

  function validate() {
    const e = {};
    if (!form.name.trim())              e.name            = "Required";
    if (!form.email.trim())             e.email           = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email   = "Invalid email";
    if (!form.password)                 e.password        = "Required";
    else if (form.password.length < 8)  e.password        = "Min. 8 characters";
    if (form.password !== form.confirmPassword) e.confirm = "Passwords do not match";
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  function submit(e) {
    e.preventDefault();
    if (validate()) setStep(3);
  }

  /* ─────────── RENDER ─────────── */
  const BG = "#f8f7f4";

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:BG }}>

        {/* ─── Top bar ─── */}
        <header style={{
          position:"sticky", top:0, zIndex:100,
          background:"rgba(248,247,244,0.92)", backdropFilter:"blur(12px)",
          borderBottom:"1px solid rgba(14,73,113,0.08)",
          padding:"14px 40px", display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <Link to="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:"6px" }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#5b86a2" strokeWidth="1.8">
              <path d="M15 10H5M9 5l-5 5 5 5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#5b86a2" }}>Back</span>
          </Link>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:"17px", color:"#0e4971" }}>
            Research<span style={{ color:"#f37e22" }}>AI</span>
          </span>
          <div style={{ width:"60px" }} />
        </header>

        <main style={{ maxWidth:"640px", margin:"0 auto", padding:"48px 20px 80px" }}>
          <Stepper step={step} />

          {/* ══ STEP 0: UPLOAD ══ */}
          {step === 0 && (
            <div className="fade-up">
              <div style={{ textAlign:"center", marginBottom:"36px" }}>
                <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"36px", color:"#0e4971", letterSpacing:"-0.03em", marginBottom:"10px" }}>
                  Join ResearchAI
                </h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"15px", color:"#5b86a2" }}>
                  Upload your CV and AI will fill your profile automatically
                </p>
              </div>

              {apiErr && (
                <div style={{ background:"rgba(239,68,68,0.06)", border:"1.5px solid rgba(239,68,68,0.2)", borderRadius:"12px", padding:"12px 16px", marginBottom:"20px", display:"flex", gap:"10px" }}>
                  <span style={{ color:"#ef4444", fontSize:"18px", lineHeight:1 }}>!</span>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#dc2626" }}>{apiErr}</p>
                </div>
              )}

              {/* Drop zone */}
              <div
                ref={dropRef}
                onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border:       `2px dashed ${dragging || file ? "#f37e22" : "rgba(14,73,113,0.2)"}`,
                  borderRadius: "20px",
                  padding:      "56px 32px",
                  textAlign:    "center",
                  cursor:       "pointer",
                  background:   file ? "rgba(243,126,34,0.04)" : "#fff",
                  transition:   "all 0.2s",
                }}
              >
                <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }}
                  onChange={e => e.target.files[0] && setFile(e.target.files[0])} />

                {file ? (
                  <>
                    <div style={{ fontSize:"40px", marginBottom:"12px" }}>📄</div>
                    <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:"18px", color:"#0e4971", marginBottom:"6px" }}>{file.name}</p>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#f37e22" }}>{(file.size/1024).toFixed(0)} KB · PDF ready</p>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"rgba(91,134,162,0.5)", marginTop:"6px" }}>Click to change</p>
                  </>
                ) : (
                  <>
                    <div style={{ width:"56px", height:"56px", borderRadius:"16px", background:"rgba(14,73,113,0.06)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5b86a2" strokeWidth="1.5">
                        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                    </div>
                    <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:"18px", color:"#0e4971", marginBottom:"6px" }}>Drop your CV here</p>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#5b86a2" }}>or click to browse · PDF only</p>
                  </>
                )}
              </div>

              {/* How it works */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", margin:"20px 0" }}>
                {[["📄","Upload PDF"],["🤖","AI reads it"],["✏️","You review"]].map(([ic,t]) => (
                  <div key={t} style={{ background:"#fff", border:"1px solid rgba(14,73,113,0.08)", borderRadius:"12px", padding:"16px", textAlign:"center" }}>
                    <div style={{ fontSize:"22px", marginBottom:"6px" }}>{ic}</div>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"#5b86a2" }}>{t}</p>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                <button className="btn-primary" onClick={extract} disabled={!file} style={{ width:"100%", padding:"15px" }}>
                  Extract with AI →
                </button>
                <button className="btn-outline" onClick={() => setStep(2)} style={{ width:"100%" }}>
                  Skip — fill manually
                </button>
              </div>
            </div>
          )}

          {/* ══ STEP 1: EXTRACTING ══ */}
          {step === 1 && (
            <div className="fade-up" style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ position:"relative", width:"96px", height:"96px", margin:"0 auto 28px" }}>
                <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"rgba(243,126,34,0.08)" }} />
                <div className="spin" style={{
                  position:"absolute", inset:"8px",
                  borderRadius:"50%",
                  border:"3px solid rgba(14,73,113,0.1)",
                  borderTopColor:"#f37e22",
                }} />
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>🤖</div>
              </div>
              <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"26px", color:"#0e4971", marginBottom:"8px" }}>
                Extracting your information
              </h2>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"14px", color:"#f37e22", marginBottom:"28px" }}>{log}</p>
              <div style={{ height:"3px", background:"rgba(14,73,113,0.08)", borderRadius:"999px", overflow:"hidden", maxWidth:"300px", margin:"0 auto 32px" }}>
                <div className="bar-anim" style={{ height:"100%", background:"#f37e22", borderRadius:"999px" }} />
              </div>
              <div style={{ background:"#fff", border:"1px solid rgba(14,73,113,0.1)", borderRadius:"14px", padding:"20px", maxWidth:"320px", margin:"0 auto" }}>
                {["Reading CV text","Identifying personal info","Extracting skills","Parsing education","Parsing experience"].map(t => (
                  <div key={t} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"6px 0" }}>
                    <span style={{ width:"18px", height:"18px", borderRadius:"50%", background:"rgba(14,73,113,0.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", color:"#0e4971" }}>✓</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#5b86a2" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ STEP 2: REVIEW FORM ══ */}
          {step === 2 && (
            <div className="fade-up">
              {file && (
                <div style={{ background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:"12px", padding:"12px 16px", marginBottom:"24px", display:"flex", gap:"8px", alignItems:"center" }}>
                  <span style={{ color:"#22c55e", fontSize:"16px" }}>✓</span>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"#166534" }}>
                    AI extracted your data — review and edit below, then confirm
                  </p>
                </div>
              )}
              <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"32px", color:"#0e4971", letterSpacing:"-0.02em", marginBottom:"28px" }}>
                Review your profile
              </h1>

              <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"0" }}>

                {/* Personal */}
                <div className="card">
                  <h3>Personal Information</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                    <Field label="Full Name" req err={errs.name}>
                      <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Amira Benali" />
                    </Field>
                    <Field label="Email" req err={errs.email}>
                      <input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="you@ensia.edu.dz" />
                    </Field>
                    <Field label="Phone">
                      <input value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+213 XXX XXX XXX" />
                    </Field>
                    <Field label="Location">
                      <input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="Algiers, Algeria" />
                    </Field>
                    <Field label="LinkedIn">
                      <input value={form.linkedin} onChange={e=>set("linkedin",e.target.value)} placeholder="linkedin.com/in/…" />
                    </Field>
                    <Field label="GitHub">
                      <input value={form.github} onChange={e=>set("github",e.target.value)} placeholder="github.com/…" />
                    </Field>
                  </div>
                  <div style={{ marginTop:"16px" }}>
                    <Field label="Professional Summary">
                      <textarea value={form.summary} onChange={e=>set("summary",e.target.value)} placeholder="Brief research background…" />
                    </Field>
                  </div>
                </div>

                {/* Skills */}
                <div className="card">
                  <h3>Skills &amp; Languages</h3>
                  <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                    <Field label="Technical Skills">
                      <TagEditor tags={form.technical_skills} onChange={v=>set("technical_skills",v)} placeholder="Python, ML, NLP…" />
                    </Field>
                    <Field label="Soft Skills">
                      <TagEditor tags={form.soft_skills} onChange={v=>set("soft_skills",v)} placeholder="Leadership, Communication…" />
                    </Field>
                    <Field label="Languages">
                      <TagEditor tags={form.languages} onChange={v=>set("languages",v)} placeholder="Arabic, French, English…" />
                    </Field>
                  </div>
                </div>

                {/* Education */}
                <div className="card">
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", paddingBottom:"12px", borderBottom:"1px solid rgba(14,73,113,0.08)" }}>
                    <h3 style={{ margin:0, padding:0, border:"none" }}>Education</h3>
                    <button type="button" onClick={addEdu} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600, background:"none", border:"1.5px solid rgba(14,73,113,0.2)", borderRadius:"999px", padding:"5px 14px", cursor:"pointer", color:"#0e4971" }}>+ Add</button>
                  </div>
                  {form.education.length === 0 && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"rgba(91,134,162,0.5)", textAlign:"center", padding:"12px 0" }}>No entries yet</p>}
                  {form.education.map((e,i) => (
                    <div key={i} style={{ background:"rgba(14,73,113,0.03)", border:"1px solid rgba(14,73,113,0.08)", borderRadius:"12px", padding:"16px", marginBottom:"12px", position:"relative" }}>
                      <button type="button" onClick={()=>remEdu(i)} style={{ position:"absolute", top:"10px", right:"12px", background:"none", border:"none", cursor:"pointer", color:"rgba(239,68,68,0.5)", fontSize:"18px" }}>×</button>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                        <Field label="Degree"><input value={e.degree} onChange={x=>updEdu(i,"degree",x.target.value)} placeholder="B.Sc. / M.Sc. / PhD" /></Field>
                        <Field label="Field"><input value={e.field} onChange={x=>updEdu(i,"field",x.target.value)} placeholder="Artificial Intelligence" /></Field>
                        <Field label="University" ><input value={e.school} onChange={x=>updEdu(i,"school",x.target.value)} placeholder="ENSIA" /></Field>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                          <Field label="Start"><input value={e.start_year} onChange={x=>updEdu(i,"start_year",x.target.value)} placeholder="2021" /></Field>
                          <Field label="End"><input value={e.end_year} onChange={x=>updEdu(i,"end_year",x.target.value)} placeholder="2025" /></Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experience */}
                <div className="card">
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", paddingBottom:"12px", borderBottom:"1px solid rgba(14,73,113,0.08)" }}>
                    <h3 style={{ margin:0, padding:0, border:"none" }}>Experience</h3>
                    <button type="button" onClick={addExp} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600, background:"none", border:"1.5px solid rgba(14,73,113,0.2)", borderRadius:"999px", padding:"5px 14px", cursor:"pointer", color:"#0e4971" }}>+ Add</button>
                  </div>
                  {form.experience.length === 0 && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", color:"rgba(91,134,162,0.5)", textAlign:"center", padding:"12px 0" }}>No entries yet</p>}
                  {form.experience.map((e,i) => (
                    <div key={i} style={{ background:"rgba(14,73,113,0.03)", border:"1px solid rgba(14,73,113,0.08)", borderRadius:"12px", padding:"16px", marginBottom:"12px", position:"relative" }}>
                      <button type="button" onClick={()=>remExp(i)} style={{ position:"absolute", top:"10px", right:"12px", background:"none", border:"none", cursor:"pointer", color:"rgba(239,68,68,0.5)", fontSize:"18px" }}>×</button>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                        <Field label="Role"><input value={e.role} onChange={x=>updExp(i,"role",x.target.value)} placeholder="Research Intern" /></Field>
                        <Field label="Company/Lab"><input value={e.company} onChange={x=>updExp(i,"company",x.target.value)} placeholder="CERIST" /></Field>
                        <Field label="Start"><input value={e.start_date} onChange={x=>updExp(i,"start_date",x.target.value)} placeholder="Jun 2023" /></Field>
                        <Field label="End"><input value={e.end_date} onChange={x=>updExp(i,"end_date",x.target.value)} placeholder="Present" /></Field>
                      </div>
                      <div style={{ marginTop:"12px" }}>
                        <Field label="Description"><textarea value={e.description} onChange={x=>updExp(i,"description",x.target.value)} placeholder="Summary of responsibilities…" style={{ minHeight:"60px" }} /></Field>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Password */}
                <div className="card">
                  <h3>Set Password</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                    <Field label="Password" req err={errs.password}>
                      <input type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Min. 8 characters" />
                    </Field>
                    <Field label="Confirm Password" err={errs.confirm}>
                      <input type="password" value={form.confirmPassword} onChange={e=>set("confirmPassword",e.target.value)} placeholder="Repeat password" />
                    </Field>
                  </div>
                </div>

                <div style={{ display:"flex", gap:"10px", paddingTop:"8px" }}>
                  <button type="button" className="btn-outline" onClick={() => setStep(0)}>← Back</button>
                  <button type="submit" className="btn-primary" style={{ flex:1, padding:"15px" }}>
                    Create my account →
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ══ STEP 3: SUCCESS ══ */}
          {step === 3 && (
            <div className="fade-up" style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{ width:"96px", height:"96px", borderRadius:"50%", background:"rgba(34,197,94,0.1)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
                <svg width="56" height="56" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                  <path d="M17 28l8 8 14-16" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-draw" />
                </svg>
              </div>
              <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"32px", color:"#0e4971", letterSpacing:"-0.02em", marginBottom:"10px" }}>
                Welcome, {form.name.split(" ")[0] || "Researcher"}!
              </h2>
              <div style={{ width:"40px", height:"2px", background:"#f37e22", margin:"0 auto 16px" }} />
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"15px", color:"#5b86a2", maxWidth:"340px", margin:"0 auto 32px", lineHeight:1.65 }}>
                Your profile is live. You're now part of the ENSIA research community.
              </p>

              {/* Profile card */}
              <div style={{ background:"#fff", border:"1.5px solid rgba(14,73,113,0.1)", borderRadius:"16px", padding:"20px", maxWidth:"340px", margin:"0 auto 28px", textAlign:"left" }}>
                <div style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"14px" }}>
                  <div style={{ width:"44px", height:"44px", borderRadius:"50%", background:"#0e4971", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Serif Display',serif", fontSize:"18px", color:"#fff", flexShrink:0 }}>
                    {(form.name?.[0]||"?").toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:"16px", color:"#0e4971" }}>{form.name||"—"}</p>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"12px", color:"#f37e22" }}>{form.email}</p>
                  </div>
                </div>
                {form.technical_skills.length > 0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                    {form.technical_skills.slice(0,5).map(s => (
                      <span key={s} className="tag-pill" style={{ fontSize:"11px" }}>{s}</span>
                    ))}
                    {form.technical_skills.length > 5 && <span className="tag-pill" style={{ fontSize:"11px" }}>+{form.technical_skills.length-5}</span>}
                  </div>
                )}
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:"10px", maxWidth:"300px", margin:"0 auto" }}>
                <button className="btn-primary" onClick={() => navigate("/")} style={{ padding:"15px" }}>
                  Go to Dashboard →
                </button>
                <button className="btn-outline" onClick={() => navigate("/")}>
                  Explore Research
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
