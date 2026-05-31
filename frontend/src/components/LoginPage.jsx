// ============================================
// LoginPage.jsx  (Halaman Login Admin)
// → Form email + password → dapat JWT token
// → Tombol kembali ke Landing Page
// → Dipakai di: AdminPage (saat belum login)
// ============================================

import { useNavigate } from "react-router-dom";
import AlertMessage from "./AlertMessage";
import "./LoginPage.css";

function LoginPage({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
  message,
  msgType,
}) {
  const navigate = useNavigate();

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Kembali ke Landing Page
        </button>

        <h1>Admin Panel</h1>
        <p>Login untuk mengelola menu KopiNara.</p>

        <AlertMessage message={message} type={msgType} />

        <form onSubmit={onSubmit}>
          <div className="field-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Loading..." : "Login Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
