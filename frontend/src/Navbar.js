import { useState, useEffect } from "react";

const navLinks = ["Beranda", "Menu", "Tentang", "Kontak"];

export default function Navbar({ onAdminClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .nav-link {
          color: rgba(250,246,238,0.8);
          text-decoration: none;
          font-weight: 300;
          font-size: 14px;
          letter-spacing: 1px;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--gold); }
        .nav-admin-btn {
          background: linear-gradient(135deg, var(--rouge), var(--rouge-dark));
          color: var(--gold-light);
          border: 1px solid var(--gold);
          padding: 8px 20px;
          border-radius: 2px;
          cursor: pointer;
          font-size: 12px;
          letter-spacing: 2px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          text-transform: uppercase;
          transition: all 0.3s;
          animation: pulse-glow 2s infinite;
        }
        .nav-admin-btn:hover {
          background: var(--gold);
          color: var(--ink);
        }
        @media(max-width:768px){
          .nav-links { display: none !important; }
        }
      `}</style>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: scrolled ? "12px 40px" : "22px 40px",
          background: scrolled ? "rgba(26,10,0,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(212,160,23,0.2)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.4s ease",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🧧</span>
          <div>
            <div
              style={{
                fontFamily: "Noto Serif SC, serif",
                color: "var(--gold)",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              Golden Basket
            </div>
            <div
              style={{
                color: "rgba(212,160,23,0.6)",
                fontSize: 10,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              Authentic Dimsum
            </div>
          </div>
        </div>

        {/* Links */}
        <div
          className="nav-links"
          style={{ display: "flex", gap: 36, alignItems: "center" }}
        >
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">
              {link}
            </a>
          ))}
          <button className="nav-admin-btn" onClick={onAdminClick}>
            Admin
          </button>
        </div>
      </nav>
    </>
  );
}
