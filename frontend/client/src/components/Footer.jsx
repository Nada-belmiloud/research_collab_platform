export default function Footer() {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: "Platform",
      links: ["Explore Research", "Dashboard", "My Posts", "Submit Paper", "Find Collaborators"],
    },
    {
      title: "Resources",
      links: ["Documentation", "Research Guidelines", "Academic Ethics", "FAQ", "API"],
    },
    {
      title: "School",
      links: ["About ENSIA", "Research Labs", "Faculty", "Alumni Network", "Contact"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Use", "Academic Code", "Accessibility"],
    },
  ];

  const socials = ["GitHub", "LinkedIn", "Instagram", "YouTube"];

  return (
    <footer style={{ background: "#f7f6f3", position: "relative", overflow: "hidden" }}>

      {/* Dot grid background — exact Optimus style */}
      <div style={{
        position:   "absolute",
        inset:      0,
        backgroundImage: "radial-gradient(circle, rgba(14,73,113,0.12) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "80px 40px 40px" }}>

        {/* Main grid */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          gap:                 "48px",
          marginBottom:        "64px",
        }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <span style={{
                fontFamily:    "'DM Serif Display', serif",
                fontSize:      "26px",
                color:         "#0e4971",
                letterSpacing: "-0.02em",
              }}>
                Research<span style={{ color: "#f37e22" }}>AI</span>
                <sup style={{ fontSize: "11px", fontFamily: "sans-serif", color: "#5b86a2", marginLeft: "3px" }}>™</sup>
              </span>
            </div>
            <p style={{
              fontFamily:  "'DM Sans', sans-serif",
              fontSize:    "14px",
              color:       "#5b86a2",
              lineHeight:  1.7,
              marginBottom:"24px",
              maxWidth:    "260px",
            }}>
              The AI-powered research collaboration platform built by ENSIA students.
              Discover, connect, and publish with the community.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {socials.map(s => (
                <a
                  key={s}
                  href="#"
                  style={{
                    fontFamily:     "'DM Sans', sans-serif",
                    fontSize:       "13px",
                    color:          "#5b86a2",
                    textDecoration: "none",
                    transition:     "color 0.15s",
                  }}
                  onMouseEnter={e => e.target.style.color = "#0e4971"}
                  onMouseLeave={e => e.target.style.color = "#5b86a2"}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {cols.map(col => (
            <div key={col.title}>
              <p style={{
                fontFamily:    "'DM Sans', sans-serif",
                fontSize:      "13px",
                fontWeight:    600,
                color:         "#0e4971",
                marginBottom:  "20px",
                letterSpacing: "0.01em",
              }}>
                {col.title}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        fontFamily:     "'DM Sans', sans-serif",
                        fontSize:       "14px",
                        color:          "#5b86a2",
                        textDecoration: "none",
                        transition:     "color 0.15s",
                      }}
                      onMouseEnter={e => e.target.style.color = "#0e4971"}
                      onMouseLeave={e => e.target.style.color = "#5b86a2"}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ENSIA address block */}
        <div style={{
          background:   "rgba(14,73,113,0.05)",
          border:       "1px solid rgba(14,73,113,0.1)",
          borderRadius: "16px",
          padding:      "20px 24px",
          marginBottom: "40px",
          display:      "flex",
          flexWrap:     "wrap",
          gap:          "24px",
          alignItems:   "center",
          justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: "#0e4971", marginBottom: "4px" }}>
              École Nationale Supérieure d'Intelligence Artificielle
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#5b86a2" }}>
              Sidi Abdellah, Algiers, Algeria &nbsp;·&nbsp;
              <a href="https://www.ensia.edu.dz" style={{ color: "#f37e22", textDecoration: "none" }}>
                www.ensia.edu.dz
              </a>
            </p>
          </div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize:   "12px",
            color:      "#5b86a2",
            background: "rgba(14,73,113,0.07)",
            padding:    "4px 12px",
            borderRadius: "999px",
          }}>
            Student Project · Class of 2025
          </span>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop:   "1px solid rgba(14,73,113,0.1)",
          paddingTop:  "24px",
          display:     "flex",
          flexWrap:    "wrap",
          alignItems:  "center",
          justifyContent: "space-between",
          gap:         "12px",
        }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#5b86a2" }}>
            {year} ResearchAI · ENSIA. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#5b86a2" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
