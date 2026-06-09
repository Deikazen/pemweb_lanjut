// ============================================
// AdminNavbar.jsx
// Navbar Dashboard Admin Kopi Bekmer 70
// ============================================

import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        <img
          src="/assets/logo/logo-bekmer.png"
          alt="Logo Kopi Bekmer 70"
          className="admin-navbar-logo"
        />

        <div>
          <h2>KOPI BEKMER 70</h2>
          <span>DASHBOARD ADMINISTRATOR</span>
        </div>
      </div>

      <div className="admin-navbar-actions">
        <button onClick={() => navigate("/")} className="btn-dark">
          ← LANDING PAGE
        </button>

        <button onClick={onLogout} className="btn-danger">
          LOGOUT
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;