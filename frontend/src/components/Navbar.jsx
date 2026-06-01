// ============================================
// Navbar.jsx  (Navigation Bar)
// → Sticky navigation bar di atas halaman
// → Berisi: logo kafe, link section, link admin/login dinamis
// → Efek: background blur saat scroll (glassmorphism)
// → Dipakai di: LandingPage
// ============================================

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // Deteksi scroll untuk efek glassmorphism navbar
  const [scrolled, setScrolled] = useState(false);

  // State untuk menyimpan role user yang login
  const [role, setRole] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    // Cek role dari localStorage saat Navbar dimuat
    setRole(localStorage.getItem("role"));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi untuk customer logout dari Landing Page
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
    navigate("/login");
  };

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

        {/* ── LOGIKA TOMBOL DINAMIS ── */}
        {role === "admin" ? (
          // Jika login sebagai Admin
          <Link to="/admin" className="nav-admin-link">Dashboard Admin</Link>
        ) : role === "customer" ? (
          // Jika login sebagai Customer
          <button
            onClick={handleLogout}
            className="nav-admin-link"
            style={{ background: 'red', cursor: 'pointer', border: '1px solid currentColor' }}
          >
            Logout
          </button>
        ) : (
          // Jika belum login sama sekali
          <Link to="/login" className="nav-admin-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;