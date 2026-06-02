// ============================================
// LoginPage.jsx  (Halaman Auth Universal Mandiri)
// → Bisa diakses melalui rute /login
// → Menangani state form dan API call sendiri
// → Redirect cerdas berdasarkan role (Admin vs Customer)
// ============================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi"; // Pastikan import custom hook kamu
import AlertMessage from "./AlertMessage";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  // Ambil fungsi API dari hook
  const { loginUser, registerUser, loading, error, clearError } = useApi();

  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Toast message state
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const showMessage = (text, type = "") => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => { setMessage(""); setMsgType(""); }, 3500);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Jika sudah punya token, langsung redirect tanpa perlu lihat form
    if (token) {
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  // ── LOGIKA LOGIN ──
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser({ email, password });

    if (result.success) {
      // 1. Simpan token, role, dan user_id ke localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.user.role);
      localStorage.setItem("user_id", result.user.id);
      localStorage.setItem("user_name", result.user.name);

      // 2. Redirect Universal berdasarkan Role
      if (result.user.role === "admin") {
        navigate("/admin"); // Admin langsung ke dashboard
      } else {
        navigate("/"); // Customer langsung ke landing page
      }
    } else {
      showMessage(error || "Login gagal. Periksa kembali email & password Anda.");
      clearError();
    }
  };

  // ── LOGIKA REGISTER ──
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      showMessage("Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    if (!regName || !regEmail || !regPassword) {
      showMessage("Semua field wajib diisi!");
      return;
    }

    const result = await registerUser({ name: regName, email: regEmail, password: regPassword });

    if (result.success) {
      showMessage("Registrasi berhasil! Silakan masuk.", "success");
      setAuthMode("login"); // Otomatis pindah ke tab login
      setEmail(regEmail); // Otomatis isi email yang baru didaftarkan
      setRegPassword("");
    } else {
      showMessage(error || "Gagal mendaftarkan akun.");
      clearError();
    }
  };

  const switchToLogin = () => setAuthMode("login");
  const switchToRegister = () => setAuthMode("register");

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
          <form onSubmit={handleLogin} className="auth-form">
            <p className="auth-subtitle">Masuk ke akun Anda untuk melanjutkan.</p>

            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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