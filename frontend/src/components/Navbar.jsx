// ============================================
// Navbar.jsx  (Navigation Bar)
// → Sticky navigation bar di atas halaman
// → Desktop: link horizontal biasa
// → Mobile: hamburger ☰ + slide-down drawer
// → Auto-close menu saat link diklik / klik luar
// → Body scroll lock saat mobile menu terbuka
// ============================================

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import useApi from "../hooks/useApi";
import Cart from "./Cart";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCart } = useApi();
  const navRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [role, setRole] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  // Mobile hamburger state
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Tutup menu mobile ──
  const closeMenu = () => setMenuOpen(false);

  // ── Scroll-lock body saat mobile menu terbuka ──
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // ── Tutup menu saat route berubah ──
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // ── Tutup menu saat klik di luar navbar ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // ── Handler navigasi section ──
  const scrollToSection = (sectionId) => {
    closeMenu(); // tutup menu mobile dulu
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };

  // ── Fetch cart count (token-based) ──
  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const result = await getCart();
      if (result?.success) setCartCount(result.data?.length || 0);
    }
  }, [getCart]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    setRole(localStorage.getItem("role"));
    fetchCartCount();
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [fetchCartCount]);

  const handleLogout = () => {
    closeMenu();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    setRole(null);
    setCartCount(0);
    navigate("/login");
  };

  // ── Link items (dipakai di desktop dan mobile) ──
  // PERUBAHAN: Tag <a> diubah menjadi <button> untuk mengatasi error ESLint jsx-a11y/anchor-is-valid
  const NavItems = ({ isMobile = false }) => (
    <>
      <button className={`nav-link-btn ${isMobile ? "mobile-nav-link" : ""}`} onClick={() => scrollToSection("home")}>Home</button>
      <button className={`nav-link-btn ${isMobile ? "mobile-nav-link" : ""}`} onClick={() => scrollToSection("about")}>About</button>
      <button className={`nav-link-btn ${isMobile ? "mobile-nav-link" : ""}`} onClick={() => scrollToSection("menu")}>Menu</button>
      <button className={`nav-link-btn ${isMobile ? "mobile-nav-link" : ""}`} onClick={() => scrollToSection("contact")}>Contact</button>

      {role === "customer" && (
        <>
          <button
            className={`nav-cart-btn ${isMobile ? "mobile-cart-btn" : ""}`}
            onClick={() => { closeMenu(); setCartOpen(true); }}
            title="Keranjang Belanja"
            id={isMobile ? "navbar-cart-btn-mobile" : "navbar-cart-btn"}
          >
            <span className="nav-cart-icon">🛒</span>
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
          </button>
          <Link
            to="/orders"
            className="nav-orders-link"
            title="Riwayat Pesanan"
            onClick={closeMenu}
          >
            📋 Pesanan
          </Link>
        </>
      )}

      {role === "admin" ? (
        <Link to="/admin" className="nav-admin-link" onClick={closeMenu}>Dashboard Admin</Link>
      ) : role === "customer" ? (
        <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
      ) : (
        <Link to="/login" className="nav-admin-link" onClick={closeMenu}>Login</Link>
      )}
    </>
  );

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${menuOpen ? "navbar--menu-open" : ""}`}>
        {/* ── Logo / Brand ── */}
        <div className="navbar-brand" onClick={() => scrollToSection("home")} style={{ cursor: "pointer" }}>
          <span className="brand-icon">☕</span>
          Kopi<span>Bekmer</span>
        </div>

        {/* ── Desktop: link horizontal ── */}
        <div className="nav-links nav-links--desktop">
          <NavItems />
        </div>

        {/* ── Mobile: kanan atas (cart badge + hamburger) ── */}
        <div className="nav-mobile-right">
          {/* Cart badge di mobile (selalu visible tanpa buka menu) */}
          {role === "customer" && (
            <button
              className="nav-cart-btn"
              onClick={() => setCartOpen(true)}
              title="Keranjang"
              id="navbar-cart-btn"
            >
              <span className="nav-cart-icon">🛒</span>
              {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
            </button>
          )}

          {/* Hamburger button */}
          <button
            className={`hamburger-btn ${menuOpen ? "hamburger-btn--open" : ""}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            id="hamburger-btn"
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>

        {/* ── Mobile: drawer slide-down ── */}
        <div className={`nav-mobile-drawer ${menuOpen ? "nav-mobile-drawer--open" : ""}`}>
          <NavItems isMobile={true} />
        </div>
      </nav>

      {/* ── Backdrop mobile menu ── */}
      {menuOpen && (
        <div className="nav-mobile-backdrop" onClick={closeMenu} />
      )}

      {/* ── Cart Drawer ── */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;