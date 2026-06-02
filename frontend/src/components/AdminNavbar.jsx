// ============================================
// AdminNavbar.jsx  (Navbar Dashboard Admin)
// → Brand, tombol kembali ke landing, tombol logout
// → Dipakai di: AdminPage (saat sudah login)
// ============================================

import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

function AdminNavbar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        <h2> Dashboard Admin</h2>
      </div>

      <div className="admin-navbar-actions">
        <button onClick={() => navigate("/")} className="btn-dark">
          ← Landing Page
        </button>
        <button onClick={onLogout} className="btn-danger">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
