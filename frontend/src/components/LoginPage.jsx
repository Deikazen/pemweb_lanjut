// ============================================
// LoginPage.jsx  (Halaman Auth Universal)
// → Form Login & Register (tab-based)
// → Bisa dipakai oleh Admin maupun Customer
// → Register: nama, email, password → akun baru
// → Login: email, password → dapat JWT token + role
// → Tombol kembali ke Landing Page
// → Dipakai di: AdminPage (saat belum login)
// ============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "./AlertMessage";
import "./LoginPage.css";

function LoginPage({
  // Login props
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLoginSubmit,
  // Register props
  onRegisterSubmit,
  // Shared
  loading,
  message,
  msgType,
}) {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  // Register form state (managed locally)
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      // Parent will handle this via showMessage, but we can pass it up
      onRegisterSubmit(e, { name: regName, email: regEmail, password: regPassword, confirmPassword: regConfirmPassword });
      return;
    }
    onRegisterSubmit(e, { name: regName, email: regEmail, password: regPassword, confirmPassword: regConfirmPassword });
  };

  const switchToLogin = () => {
    setAuthMode("login");
  };

  const switchToRegister = () => {
    setAuthMode("register");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Kembali ke Landing Page
        </button>

        {/* ── Brand Header ── */}
        <div className="auth-brand">
          <span className="auth-brand-icon">☕</span>
          <h1>Kopi<span>Nara</span></h1>
        </div>

        {/* ── Auth Mode Tabs ── */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${authMode === "login" ? "auth-tab--active" : ""}`}
            onClick={switchToLogin}
            type="button"
          >
            Masuk
          </button>
          <button
            className={`auth-tab ${authMode === "register" ? "auth-tab--active" : ""}`}
            onClick={switchToRegister}
            type="button"
          >
            Daftar Baru
          </button>
        </div>

        <AlertMessage message={message} type={msgType} />

        {/* ═══ LOGIN FORM ═══ */}
        {authMode === "login" && (
          <form onSubmit={onLoginSubmit} className="auth-form">
            <p className="auth-subtitle">Masuk ke akun Anda untuk melanjutkan.</p>

            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <p className="auth-switch-text">
              Belum punya akun?{" "}
              <button type="button" className="auth-switch-link" onClick={switchToRegister}>
                Daftar sekarang
              </button>
            </p>
          </form>
        )}

        {/* ═══ REGISTER FORM ═══ */}
        {authMode === "register" && (
          <form onSubmit={handleRegister} className="auth-form">
            <p className="auth-subtitle">Buat akun baru untuk memesan kopi favorit Anda.</p>

            <div className="field-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="email@contoh.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-row">
              <div className="field-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 karakter"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="field-group">
                <label>Konfirmasi Password</label>
                <input
                  type="password"
                  placeholder="Ulangi password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-submit btn-submit--register" disabled={loading}>
              {loading ? "Mendaftarkan..." : "Daftar Akun"}
            </button>

            <p className="auth-switch-text">
              Sudah punya akun?{" "}
              <button type="button" className="auth-switch-link" onClick={switchToLogin}>
                Masuk di sini
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
