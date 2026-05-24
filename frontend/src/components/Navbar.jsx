// ============================================
// Navbar.jsx  (Navigation Bar)
// → Sticky navigation bar di atas halaman
// → Berisi: logo kafe, link section, link admin
// → Efek: background blur saat scroll (glassmorphism)
// → Dipakai di: LandingPage
// ============================================

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  // Deteksi scroll untuk efek glassmorphism navbar
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      {/* ── Logo / Brand ── */}
      <div className="navbar-brand">
        <span className="brand-icon">☕</span>
        Kopi<span>Nara</span>
      </div>

      {/* ── Links navigasi ── */}
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#menu">Menu</a>
        <a href="#contact">Contact</a>
        <Link to="/admin" className="nav-admin-link">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
