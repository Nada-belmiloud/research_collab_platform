import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "15px",
    fontWeight: 500,
    color: isActive ? "#f37e22" : "#0e4971",
    textDecoration: "none",
    paddingBottom: "2px",
    borderBottom: isActive ? "1.5px solid #f37e22" : "1.5px solid transparent",
    transition: "color 0.2s, border-color 0.2s",
    whiteSpace: "nowrap",
  });

  return (
    <nav style={{
      width: "100%",
      background: "#f8f7f4",
      borderBottom: "1px solid rgba(14,73,113,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "18px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
      }}>

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "22px",
            color: "#0e4971",
            cursor: "pointer",
            letterSpacing: "-0.02em",
            flexShrink: 0,
            userSelect: "none",
          }}
        >
          ResearchAI
        </div>

        {/* CENTER LINKS */}
        <div style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          gap: "36px",
        }}>
          <NavLink to="/" end style={linkStyle}>Home</NavLink>
          <NavLink to="/recommendations" style={linkStyle}>Recommendations</NavLink>
          <NavLink to="/ranking_page" style={linkStyle}>Ranking</NavLink>
        </div>

        {/* RIGHT BUTTONS */}
        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          <button
            onClick={() => navigate("/login")}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              padding: "9px 20px",
              borderRadius: "999px",
              border: "1.5px solid rgba(14,73,113,0.3)",
              background: "transparent",
              color: "#0e4971",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/signup")}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              padding: "9px 20px",
              borderRadius: "999px",
              border: "none",
              background: "#f37e22",
              color: "#fff",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
          >
            Sign up
          </button>
        </div>

      </div>
    </nav>
  );
}