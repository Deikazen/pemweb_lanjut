// ============================================
// AdminPage.jsx  (Halaman Admin / /admin)
// → Orchestrator: mengelola state & logic
// → Mendelegasikan tampilan ke sub-komponen:
//     · LoginPage     → form login
//     · AdminNavbar   → navbar dashboard
//     · AdminTabs     → tab selector
//     · AlertMessage  → toast/alert
//     · MenuForm      → form CRUD item
//     · MenuList      → daftar item
//     · LandingEditor → editor landing page
// → Semua API call via useApi custom hook
// ============================================

import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";

// ── Sub-komponen ──
import LoginPage from "../components/LoginPage";
import AdminNavbar from "../components/AdminNavbar";
import AdminTabs from "../components/AdminTabs";
import AlertMessage from "../components/AlertMessage";
import MenuForm from "../components/MenuForm";
import MenuList from "../components/MenuList";
import LandingEditor from "../components/LandingEditor";

import "./AdminPage.css";

function AdminPage() {
  const {
    items,
    landingSettings,
    loading,
    error,
    clearError,
    getItems,
    getLandingSettings,
    saveLandingSettings,
    saveItem,
    deleteItem,
    loginUser,
    registerUser
  } = useApi();

  // Auth state
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("admkopibekmer@gmail.com");
  const [password, setPassword] = useState("admin123");

  // Navigation tab: "menu" | "landing"
  const [activeTab, setActiveTab] = useState("menu");

  // Form state (tambah / edit item)
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [editId, setEditId] = useState(null);

  // Landing Page Settings Form state
  const [settingsForm, setSettingsForm] = useState({
    hero_badge: "", hero_title: "", hero_desc: "", hero_image: "",
    stat_variankopi: "", stat_arabikaasli: "", stat_ratingtamu: "",
    about_image: "", about_badge: "", about_title: "", about_desc: "",
    about_card1_title: "", about_card1_desc: "", about_card2_title: "", about_card2_desc: "",
    feature1_icon: "", feature1_title: "", feature1_desc: "",
    feature2_icon: "", feature2_title: "", feature2_desc: "",
    feature3_icon: "", feature3_title: "", feature3_desc: "",
    contact_email: "", contact_instagram: "", contact_location: "", footer_text: ""
  });

  // Toast message
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // "success" | ""

  const showMessage = (text, type = "") => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => { setMessage(""); setMsgType(""); }, 3500);
  };

  // Load data saat sudah login
  useEffect(() => {
    if (token) {
      getItems(token);
      getLandingSettings();
    }
  }, [token, getItems, getLandingSettings]);

  // Populasi form settings saat data landingSettings termuat
  useEffect(() => {
    if (landingSettings) {
      setSettingsForm(landingSettings);
    }
  }, [landingSettings]);

  // ── LOGIN ────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser({ email, password });
    if (result.success) {
      localStorage.setItem("token", result.token);
      setToken(result.token);
      showMessage("Login berhasil! Selamat datang.", "success");
    } else {
      showMessage(error || "Login gagal. Periksa kembali email & password Anda.");
      clearError();
    }
  };

  // - REGISTER ────────────────────────────────
  const handleRegister = async (e, { name, email, password, confirmPassword }) => {
    if (e) e.preventDefault();

    if (password !== confirmPassword) {
      showMessage("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    if (!name || !email || !password) {
      showMessage("Semua field wajib diisi!");
      return;
    }

    const result = await registerUser({ name, email, password });

    if (result.success) {
      showMessage("Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.", "success");
    } else {
      showMessage(error || "Gagal mendaftarkan akun. Email mungkin sudah digunakan.");
      clearError();
    }
  }; // <--- SEBELUMNYA KURUNG KURAWAL INI HILANG TERHAPUS!

  // ── SAVE ITEM (tambah / edit) ────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !mediaUrl || !price) {
      showMessage("Nama, harga dan gambar wajib diisi/diupload");
      return;
    }
    const result = await saveItem({ token, name, price, mediaUrl, editId });
    if (result.success) {
      setName(""); setPrice(""); setMediaUrl(""); setEditId(null);
      showMessage(editId ? "Item berhasil diupdate!" : "Item berhasil ditambahkan!", "success");
      getItems(token);
    } else {
      showMessage(error || "Gagal menyimpan item");
      clearError();
    }
  };

  // ── START EDIT ITEM ──────────────────────
  const handleStartEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setPrice(item.price || "");
    setMediaUrl(Array.isArray(item.media_url) ? item.media_url[0] : item.media_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── DELETE ITEM ──────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus item ini?")) return;
    const result = await deleteItem({ token, id });
    if (result.success) {
      showMessage("Item berhasil dihapus", "success");
      getItems(token);
    } else {
      showMessage(error || "Gagal hapus item");
      clearError();
    }
  };

  // ── CANCEL EDIT ──────────────────────────
  const handleCancelEdit = () => {
    setEditId(null); setName(""); setMediaUrl(""); setPrice("");
  };

  // ── SAVE LANDING SETTINGS ─────────────────
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const result = await saveLandingSettings({ token, settings: settingsForm });
    if (result.success) {
      showMessage("Landing page berhasil diperbarui! Silakan refresh halaman utama.", "success");
    } else {
      showMessage(error || "Gagal memperbarui landing page");
      clearError();
    }
  };

  // ── LOGOUT ───────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(""); setEmail(""); setPassword("");
    showMessage("Berhasil logout");
  };

  // ─────────────────────────────────────────
  // TAMPILAN: HALAMAN LOGIN
  // ─────────────────────────────────────────
  if (!token) {
    return (
      <LoginPage
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onLoginSubmit={handleLogin}
        onRegisterSubmit={handleRegister}
        loading={loading}
        message={message}
        msgType={msgType}
      />
    );
  }

  // ─────────────────────────────────────────
  // TAMPILAN: DASHBOARD ADMIN
  // ─────────────────────────────────────────
  return (
    <div className="admin-page">
      <AdminNavbar onLogout={handleLogout} />
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="admin-container">
        <AlertMessage message={message} type={msgType} />

        {activeTab === "menu" && (
          <div className="tab-panel">
            <MenuForm
              name={name} price={price} mediaUrl={mediaUrl} editId={editId}
              loading={loading} onNameChange={setName} onPriceChange={setPrice}
              onMediaUrlChange={setMediaUrl} onSubmit={handleSave} onCancelEdit={handleCancelEdit}
            />
            <MenuList
              items={items} loading={loading} error={error}
              onRefresh={() => getItems(token)} onEdit={handleStartEdit} onDelete={handleDelete}
            />
          </div>
        )}

        {activeTab === "landing" && (
          <LandingEditor
            settingsForm={settingsForm} onFieldChange={setSettingsForm}
            onSubmit={handleSaveSettings} loading={loading}
          />
        )}
      </main>
    </div>
  );
}

export default AdminPage;