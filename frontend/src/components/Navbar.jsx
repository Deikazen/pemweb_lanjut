// ============================================
// Navbar.jsx  (Navigation Bar)
// → Sticky navigation bar di atas halaman
// → Berisi: logo kafe, link section, link admin/login dinamis
// → Cart icon dengan badge jumlah item
// → Link ke Riwayat Pesanan
// → Efek: background blur saat scroll (glassmorphism)
// → Dipakai di: LandingPage, OrderHistory
// ============================================

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import useApi from "../hooks/useApi";
import Cart from "./Cart";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { getCart } = useApi();

  // Deteksi scroll untuk efek glassmorphism navbar
  const [scrolled, setScrolled] = useState(false);

  // State untuk menyimpan role user yang login
  const [role, setRole] = useState(null);

  // Cart states
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count
  const fetchCartCount = useCallback(async () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      const result = await getCart(userId);
      if (result?.success) {
        setCartCount(result.data?.length || 0);
      }
    }
  }, [getCart]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    // Cek role dari localStorage saat Navbar dimuat
    setRole(localStorage.getItem("role"));

    // Fetch cart count if user is logged in
    fetchCartCount();

    // Listen for cart-updated events (dispatched by MenuCard and Cart)
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [fetchCartCount]);

  // Fungsi untuk customer logout dari Landing Page
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    setRole(null);
    setCartCount(0);
    navigate("/login");
  };

  return (
    <>
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

          {/* ── Cart Icon (hanya untuk customer yang login) ── */}
          {role === "customer" && (
            <>
              <button
                className="nav-cart-btn"
                onClick={() => setCartOpen(true)}
                title="Keranjang Belanja"
                id="navbar-cart-btn"
              >
                <span className="nav-cart-icon">🛒</span>
                {cartCount > 0 && (
                  <span className="nav-cart-badge">{cartCount}</span>
                )}
              </button>
              <Link to="/orders" className="nav-orders-link" title="Riwayat Pesanan">
                📋 Pesanan
              </Link>
            </>
          )}

          {/* ── LOGIKA TOMBOL DINAMIS ── */}
          {role === "admin" ? (
            // Jika login sebagai Admin
            <Link to="/admin" className="nav-admin-link">Dashboard Admin</Link>
          ) : role === "customer" ? (
            // Jika login sebagai Customer
            <button
              onClick={handleLogout}
              className="nav-logout-btn"
            >
              Logout
            </button>
          ) : (
            // Jika belum login sama sekali
            <Link to="/login" className="nav-admin-link">Login</Link>
          )}
        </div>
      </nav>

      {/* ── Cart Drawer ── */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;