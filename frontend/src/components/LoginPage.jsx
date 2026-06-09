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
      <div className="auth-pattern" />

      <div className="auth-shell">
        {/* ── Panel branding ── */}
        <section className="auth-visual">
          <div className="auth-visual-content">
            <button className="auth-back-link" onClick={() => navigate("/")}>
              ← KEMBALI KE BERANDA
            </button>

            <div className="auth-logo-wrap">
              <img
                src="/assets/logo/logo-bekmer.png"
                alt="Logo Kopi Bekmer 70"
                className="auth-logo"
              />
            </div>

            <p className="auth-eyebrow">KOPI LOKAL KABUPATEN BANDUNG</p>

            <h1>
              DARI BIJI
              <span>LAHIR CERITA.</span>
            </h1>

            <p className="auth-visual-desc">
              Masuk untuk memesan seduhan favoritmu. Kopi Bekmer 70 membawa
              karakter arabika lokal yang lebih smooth, ringan, dan nyaman
              dinikmati.
            </p>

            <div className="auth-highlights">
              <div>
                <strong>EST. 2025</strong>
                <span>Berawal dari motor bebek merah</span>
              </div>

              <div>
                <strong>07.00–22.00</strong>
                <span>Buka setiap hari</span>
              </div>
            </div>
          </div>

          <div className="auth-visual-footer">
            <span>KOPI BEKMER 70</span>
            <span>✦</span>
            <span>ARABIKA LOKAL BANDUNG</span>
          </div>
        </section>

        {/* ── Panel form ── */}
        <section className="auth-form-panel">
          <div className="auth-card">
            <button className="back-btn" onClick={() => navigate("/")}>
              ← Kembali ke Beranda
            </button>

            <div className="auth-brand">
              <img
                src="/assets/logo/logo-bekmer.png"
                alt="Logo Kopi Bekmer 70"
                className="auth-brand-logo"
              />

              <div>
                <h2>KOPI BEKMER 70</h2>
                <p>DARI BIJI LAHIR CERITA.</p>
              </div>
            </div>

            <div className="auth-heading">
              <p className="auth-heading-label">
                {authMode === "login" ? "SELAMAT DATANG KEMBALI" : "BUAT AKUN BARU"}
              </p>

              <h3>
                {authMode === "login"
                  ? "MASUK UNTUK MEMESAN."
                  : "MULAI CERITAMU."}
              </h3>
            </div>

            {/* ── Tabs ── */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${
                  authMode === "login" ? "auth-tab--active" : ""
                }`}
                onClick={switchToLogin}
                type="button"
              >
                MASUK
              </button>

              <button
                className={`auth-tab ${
                  authMode === "register" ? "auth-tab--active" : ""
                }`}
                onClick={switchToRegister}
                type="button"
              >
                DAFTAR BARU
              </button>
            </div>

            <AlertMessage message={message} type={msgType} />

            {/* ═══ LOGIN FORM ═══ */}
            {authMode === "login" && (
              <form onSubmit={handleLogin} className="auth-form">
                <p className="auth-subtitle">
                  Masuk ke akunmu untuk menambahkan menu favorit ke keranjang.
                </p>

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
                  {loading ? "MEMPROSES..." : "MASUK SEKARANG →"}
                </button>

                <p className="auth-switch-text">
                  Belum punya akun?{" "}

                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={switchToRegister}
                  >
                    Daftar sekarang
                  </button>
                </p>
              </form>
            )}

            {/* ═══ REGISTER FORM ═══ */}
            {authMode === "register" && (
              <form onSubmit={handleRegister} className="auth-form">
                <p className="auth-subtitle">
                  Daftar untuk mulai memesan menu Kopi Bekmer 70 favoritmu.
                </p>

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

                <button
                  type="submit"
                  className="btn-submit btn-submit--register"
                  disabled={loading}
                >
                  {loading ? "MENDAFTARKAN..." : "DAFTAR AKUN →"}
                </button>

                <p className="auth-switch-text">
                  Sudah punya akun?{" "}

                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={switchToLogin}
                  >
                    Masuk di sini
                  </button>
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;