import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "#explore" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "My Posts", href: "#myposts" },
  ];

  const pillStyle = {
    background: "#0e4971",
    borderRadius: "999px",
    padding: scrolled ? "10px 20px" : "12px 24px",
    boxShadow: scrolled
      ? "0 4px 24px rgba(14,73,113,0.12), 0 1px 4px rgba(0,0,0,0.08)"
      : "0 2px 12px rgba(14,73,113,0.08)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(14,73,113,0.08)",
  };

  return (
    <header
      style={{
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "calc(100% - 40px)",
        maxWidth: "1300px",
      }}
    >
      <nav
        style={{
          ...pillStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "18px",
              color: "#ebeef1",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Research<span style={{ color: "#f37e22" }}>AI</span>
            <sup
              style={{
                fontSize: "9px",
                color: "#5b86a2",
                marginLeft: "2px",
                fontFamily: "sans-serif",
              }}
            >
              ENSIA
            </sup>
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "#f9fbfd",
                fontWeight: 450,
                textDecoration: "none",
                whiteSpace: "nowrap",
                padding: "6px 10px",
                borderRadius: "999px",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(14,73,113,0.06)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "transparent")
              }
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              color: "#f1f1ee",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 12px",
              fontWeight: 450,
            }}
          >
            Sign in
          </button>

          <button
            onClick={() => navigate("/signup")}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              background: "#f37e22",
              color: "#ffffff",
              border: "none",
              borderRadius: "999px",
              padding: "8px 20px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "opacity 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = "0.88";
              e.target.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "1";
              e.target.style.transform = "scale(1)";
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
}