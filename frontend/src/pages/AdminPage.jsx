// ============================================
// AdminPage.jsx  (Halaman Admin / /admin)
// → Login: form email + password → dapat JWT token
// → Dashboard: Tab Kelola Menu (CRUD item) & Tab Edit Landing Page (CRUD settings)
// → File Upload / Choose File untuk item, hero image, dan about image via Base64!
// → Semua API call via useApi custom hook
// ============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import "./AdminPage.css";

function AdminPage() {
  const navigate = useNavigate();
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
    loginAdmin
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
    hero_badge: "",
    hero_title: "",
    hero_desc: "",
    hero_image: "",
    stat_variankopi: "",
    stat_arabikaasli: "",
    stat_ratingtamu: "",
    about_image: "",
    about_badge: "",
    about_title: "",
    about_desc: "",
    about_card1_title: "",
    about_card1_desc: "",
    about_card2_title: "",
    about_card2_desc: "",
    feature1_icon: "",
    feature1_title: "",
    feature1_desc: "",
    feature2_icon: "",
    feature2_title: "",
    feature2_desc: "",
    feature3_icon: "",
    feature3_title: "",
    feature3_desc: "",
    contact_email: "",
    contact_instagram: "",
    contact_location: "",
    footer_text: ""
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
    const result = await loginAdmin({ email, password });
    if (result.success) {
      localStorage.setItem("token", result.token);
      setToken(result.token);
      showMessage("Login berhasil! Selamat datang.", "success");
    } else {
      showMessage(error || "Login gagal. Periksa kembali email & password Anda.");
      clearError();
    }
  };

  // ── FILE UPLOAD UNTUK MENU ITEM (Base64) ──
  const handleItemFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result); // Simpan base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // ── SAVE ITEM (tambah / edit) ────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !mediaUrl || !price) {
      showMessage("Nama, harga dan gambar wajib diisi/diupload");
      return;
    }
    const result = await saveItem({ token, name, price, mediaUrl, editId });
    if (result.success) {
      setName("");
      setPrice("");
      setMediaUrl("");
      setEditId(null);
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

  // ── FILE UPLOADS UNTUK LANDING SETTINGS ───
  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm(prev => ({ ...prev, hero_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAboutImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm(prev => ({ ...prev, about_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
    setToken("");
    setEmail("");
    setPassword("");
    showMessage("Berhasil logout");
  };

  // ─────────────────────────────────────────
  // TAMPILAN: HALAMAN LOGIN
  // ─────────────────────────────────────────
  if (!token) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Kembali ke Landing Page
          </button>

          <h1>Admin Panel</h1>
          <p>Login untuk mengelola menu KopiNara.</p>

          {message && (
            <div className={`alert ${msgType === "success" ? "alert-success" : ""}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="admin@gmail.com"
                defaultValue={"admkopibekmer@gmail.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

  // ─────────────────────────────────────────
  // TAMPILAN: DASHBOARD ADMIN (Tab Kelola Menu & Edit Landing Page)
  // ─────────────────────────────────────────
  return (
    <div className="admin-page">

      {/* ── NAVBAR ADMIN ──────────────────── */}
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          <h2>☕ Admin KopiNara</h2>
          <span>Dashboard CRUD Full Monorepo</span>
        </div>

        <div className="admin-navbar-actions">
          <button onClick={() => navigate("/")} className="btn-dark">
            ← Landing Page
          </button>
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>
      </nav>

      {/* ── TAB SELECTOR ──────────────────── */}
      <div className="admin-tabs-container">
        <button
          className={`admin-tab ${activeTab === "menu" ? "admin-tab--active" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          📋 Kelola Menu (CRUD Menu)
        </button>
        <button
          className={`admin-tab ${activeTab === "landing" ? "admin-tab--active" : ""}`}
          onClick={() => setActiveTab("landing")}
        >
          ✨ Edit Landing Page (CRUD Sections)
        </button>
      </div>

      <main className="admin-container">

        {/* Alert / Toast */}
        {message && (
          <div className={`alert ${msgType === "success" ? "alert-success" : ""}`}>
            {message}
          </div>
        )}

        {/* ─────────────────────────────────────────
            TAB PANEL 1: KELOLA MENU (CRUD ITEMS)
           ───────────────────────────────────────── */}
        {activeTab === "menu" && (
          <div className="tab-panel">
            {/* FORM TAMBAH / EDIT ITEM */}
            <section className="admin-form-section">
              <h2>{editId ? "✏️ Edit Item Menu" : "➕ Tambah Item Menu Baru"}</h2>

              <form onSubmit={handleSave} className="admin-form">
                <div className="field-group">
                  <label>Nama Item</label>
                  <input
                    type="text"
                    placeholder="Contoh: Signature Latte"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label>Harga Item (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 25000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label>Gambar Item</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleItemFileChange}
                    className="admin-file-input-hidden"
                    id="item-file-upload"
                  />
                  <label
                    htmlFor="item-file-upload"
                    className={`upload-zone ${mediaUrl.startsWith("data:") ? "upload-zone--filled" : ""}`}
                  >
                    <span className="upload-zone__icon">
                      {mediaUrl.startsWith("data:") ? "✅" : "📂"}
                    </span>
                    <span className="upload-zone__text">
                      {mediaUrl.startsWith("data:") ? "Gambar berhasil dipilih" : "Klik untuk pilih gambar"}
                    </span>
                    <span className="upload-zone__hint">
                      {mediaUrl.startsWith("data:") ? "Klik untuk ganti gambar" : "JPG, PNG, WebP"}
                    </span>
                  </label>
                  <span className="url-or-divider">atau masukkan URL gambar manual</span>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={mediaUrl.startsWith("data:") ? "" : mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Menyimpan..." : editId ? "Update Item" : "Tambah Item"}
                  </button>

                  {editId && (
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => { setEditId(null); setName(""); setMediaUrl(""); setPrice(""); }}
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* DAFTAR ITEM */}
            <section className="admin-list-section">
              <div className="section-row">
                <h2>📋 Menu Terdaftar</h2>
                <button onClick={() => getItems(token)} className="btn-dark">
                  🔄 Refresh
                </button>
              </div>

              {loading && <p className="loading-text">Memuat data...</p>}
              {error && <p className="error-text" style={{ color: "#ff4a4a", textAlign: "center", margin: "10px 0" }}>⚠️ Error: {error}</p>}

              <div className="admin-grid">
                {items.length === 0 && !loading ? (
                  <div className="empty-card">
                    <h3>Belum ada data menu</h3>
                    <p>Tambahkan item menu pertama lewat form di atas.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div className="admin-item-card" key={item.id}>
                      <img
                        src={Array.isArray(item.media_url) ? item.media_url[0] : item.media_url}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                        }}
                      />
                      <div className="admin-item-content">
                        <h3>{item.name}</h3>
                        <p style={{ color: "#d2691e", fontWeight: "600" }}>
                          {item.price ? `Rp ${Number(item.price).toLocaleString('id-ID')}` : 'Harga belum diisi'}
                        </p>
                        <p>ID: {item.id}</p>
                        <div className="card-actions">
                          <button className="btn-edit" onClick={() => handleStartEdit(item)}>
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        {/* ─────────────────────────────────────────
            TAB PANEL 2: EDIT LANDING PAGE (CRUD SETTINGS)
           ───────────────────────────────────────── */}
        {activeTab === "landing" && (
          <div className="tab-panel">

            <div className="landing-editor-header">
              <h2>✨ Edit Komponen Landing Page</h2>
              <p>Kelola tulisan, gambar, angka statistik, dan seluruh komponen landing page langsung dari database.</p>
            </div>

            <div className="landing-editor-layout">

              {/* SIDEBAR NAVIGASI CEPAT */}
              <aside className="landing-section-nav">
                <p className="section-nav-title">Navigasi Cepat</p>
                <a href="#section-hero" className="section-nav-link">
                  <span className="section-nav-num">1</span>
                  <span>🚀 Hero</span>
                </a>
                <a href="#section-stats" className="section-nav-link">
                  <span className="section-nav-num">2</span>
                  <span>📊 Statistik</span>
                </a>
                <a href="#section-about" className="section-nav-link">
                  <span className="section-nav-num">3</span>
                  <span>🌱 Tentang Kami</span>
                </a>
                <a href="#section-features" className="section-nav-link">
                  <span className="section-nav-num">4</span>
                  <span>🛋️ Keunggulan</span>
                </a>
                <a href="#section-contact" className="section-nav-link">
                  <span className="section-nav-num">5</span>
                  <span>✉️ Kontak & Footer</span>
                </a>
              </aside>

              {/* FORM UTAMA */}
              <form onSubmit={handleSaveSettings} className="admin-settings-form">

                {/* ═══ SECTION 1: HERO ═══ */}
                <fieldset className="settings-fieldset" id="section-hero">
                  <legend><span className="fieldset-num">1</span>🚀 Section Hero (Tampilan Utama)</legend>

                  <div className="settings-grid-2">
                    <div className="field-group">
                      <label>Badge Hero</label>
                      <input
                        type="text"
                        value={settingsForm.hero_badge}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hero_badge: e.target.value })}
                      />
                    </div>

                    <div className="field-group field-group--span2">
                      <label>Judul Hero (Gunakan baris baru untuk memotong teks)</label>
                      <textarea
                        rows="3"
                        value={settingsForm.hero_title}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                      />
                    </div>

                    <div className="field-group field-group--span2">
                      <label>Deskripsi Hero</label>
                      <textarea
                        rows="4"
                        value={settingsForm.hero_desc}
                        onChange={(e) => setSettingsForm({ ...settingsForm, hero_desc: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label>Gambar Utama Hero</label>
                    <div className="image-upload-container">
                      <div className="image-upload-controls">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageChange}
                          className="admin-file-input-hidden"
                          id="hero-file-upload"
                        />
                        <label
                          htmlFor="hero-file-upload"
                          className={`upload-zone ${settingsForm.hero_image.startsWith("data:") ? "upload-zone--filled" : ""}`}
                        >
                          <span className="upload-zone__icon">
                            {settingsForm.hero_image.startsWith("data:") ? "✅" : "📂"}
                          </span>
                          <span className="upload-zone__text">
                            {settingsForm.hero_image.startsWith("data:") ? "Gambar berhasil dipilih" : "Klik untuk pilih gambar"}
                          </span>
                          <span className="upload-zone__hint">
                            {settingsForm.hero_image.startsWith("data:") ? "Klik untuk ganti gambar" : "JPG, PNG, WebP"}
                          </span>
                        </label>
                        <span className="url-or-divider">atau masukkan URL gambar manual</span>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={settingsForm.hero_image.startsWith("data:") ? "" : settingsForm.hero_image}
                          onChange={(e) => setSettingsForm({ ...settingsForm, hero_image: e.target.value })}
                        />
                      </div>
                      {settingsForm.hero_image && (
                        <div className="image-preview-panel">
                          <span className="image-preview-label">Preview</span>
                          <img
                            src={settingsForm.hero_image}
                            alt="Hero preview"
                            className="image-preview-img"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          <button
                            type="button"
                            className="btn-clear-image"
                            onClick={() => setSettingsForm({ ...settingsForm, hero_image: "" })}
                          >
                            Hapus Gambar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </fieldset>

                {/* ═══ SECTION 2: STATISTIK ═══ */}
                <fieldset className="settings-fieldset" id="section-stats">
                  <legend><span className="fieldset-num">2</span>📊 Angka Statistik</legend>

                  <div className="stats-cards-grid">
                    <div className="stat-input-card">
                      <span className="stat-input-card__emoji">☕</span>
                      <div className="field-group">
                        <label>Varian Kopi</label>
                        <input
                          type="number"
                          value={settingsForm.stat_variankopi}
                          onChange={(e) => setSettingsForm({ ...settingsForm, stat_variankopi: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="stat-input-card">
                      <span className="stat-input-card__emoji">🌿</span>
                      <div className="field-group">
                        <label>Arabika Asli (%)</label>
                        <input
                          type="number"
                          value={settingsForm.stat_arabikaasli}
                          onChange={(e) => setSettingsForm({ ...settingsForm, stat_arabikaasli: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="stat-input-card">
                      <span className="stat-input-card__emoji">⭐</span>
                      <div className="field-group">
                        <label>Rating Tamu (1–5)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settingsForm.stat_ratingtamu}
                          onChange={(e) => setSettingsForm({ ...settingsForm, stat_ratingtamu: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* ═══ SECTION 3: ABOUT ═══ */}
                <fieldset className="settings-fieldset" id="section-about">
                  <legend><span className="fieldset-num">3</span>🌱 Cerita & Tentang Kami</legend>

                  <div className="settings-grid-2">
                    <div className="field-group">
                      <label>Badge (Tahun Berdiri)</label>
                      <input
                        type="text"
                        value={settingsForm.about_badge}
                        onChange={(e) => setSettingsForm({ ...settingsForm, about_badge: e.target.value })}
                      />
                    </div>

                    <div className="field-group">
                      <label>Judul About</label>
                      <input
                        type="text"
                        value={settingsForm.about_title}
                        onChange={(e) => setSettingsForm({ ...settingsForm, about_title: e.target.value })}
                      />
                    </div>

                    <div className="field-group field-group--span2">
                      <label>Deskripsi About</label>
                      <textarea
                        rows="4"
                        value={settingsForm.about_desc}
                        onChange={(e) => setSettingsForm({ ...settingsForm, about_desc: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label>Gambar Section About</label>
                    <div className="image-upload-container">
                      <div className="image-upload-controls">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAboutImageChange}
                          className="admin-file-input-hidden"
                          id="about-file-upload"
                        />
                        <label
                          htmlFor="about-file-upload"
                          className={`upload-zone ${settingsForm.about_image.startsWith("data:") ? "upload-zone--filled" : ""}`}
                        >
                          <span className="upload-zone__icon">
                            {settingsForm.about_image.startsWith("data:") ? "✅" : "📂"}
                          </span>
                          <span className="upload-zone__text">
                            {settingsForm.about_image.startsWith("data:") ? "Gambar berhasil dipilih" : "Klik untuk pilih gambar"}
                          </span>
                          <span className="upload-zone__hint">
                            {settingsForm.about_image.startsWith("data:") ? "Klik untuk ganti gambar" : "JPG, PNG, WebP"}
                          </span>
                        </label>
                        <span className="url-or-divider">atau masukkan URL gambar manual</span>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={settingsForm.about_image.startsWith("data:") ? "" : settingsForm.about_image}
                          onChange={(e) => setSettingsForm({ ...settingsForm, about_image: e.target.value })}
                        />
                      </div>
                      {settingsForm.about_image && (
                        <div className="image-preview-panel">
                          <span className="image-preview-label">Preview</span>
                          <img
                            src={settingsForm.about_image}
                            alt="About preview"
                            className="image-preview-img"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          <button
                            type="button"
                            className="btn-clear-image"
                            onClick={() => setSettingsForm({ ...settingsForm, about_image: "" })}
                          >
                            Hapus Gambar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="about-cards-grid">
                    <div className="about-card-editor">
                      <h4 className="about-card-editor__title">📌 Kartu Kiri — Kenapa Kami</h4>
                      <div className="field-group">
                        <label>Judul Kartu</label>
                        <input
                          type="text"
                          value={settingsForm.about_card1_title}
                          onChange={(e) => setSettingsForm({ ...settingsForm, about_card1_title: e.target.value })}
                        />
                      </div>
                      <div className="field-group">
                        <label>Deskripsi</label>
                        <textarea
                          rows="3"
                          value={settingsForm.about_card1_desc}
                          onChange={(e) => setSettingsForm({ ...settingsForm, about_card1_desc: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="about-card-editor">
                      <h4 className="about-card-editor__title">📌 Kartu Kanan — Tujuan</h4>
                      <div className="field-group">
                        <label>Judul Kartu</label>
                        <input
                          type="text"
                          value={settingsForm.about_card2_title}
                          onChange={(e) => setSettingsForm({ ...settingsForm, about_card2_title: e.target.value })}
                        />
                      </div>
                      <div className="field-group">
                        <label>Deskripsi</label>
                        <textarea
                          rows="3"
                          value={settingsForm.about_card2_desc}
                          onChange={(e) => setSettingsForm({ ...settingsForm, about_card2_desc: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* ═══ SECTION 4: FEATURES ═══ */}
                <fieldset className="settings-fieldset" id="section-features">
                  <legend><span className="fieldset-num">4</span>🛋️ Keunggulan (3 Poin Utama)</legend>

                  <div className="features-cards-grid">
                    {[1, 2, 3].map((n) => (
                      <div className="feature-card-editor" key={n}>
                        <div className="feature-card-editor__header">
                          <span className="feature-card-editor__num">Keunggulan {n}</span>
                          <div className="field-group field-group--icon">
                            <label>Icon</label>
                            <input
                              type="text"
                              value={settingsForm[`feature${n}_icon`]}
                              onChange={(e) => setSettingsForm({ ...settingsForm, [`feature${n}_icon`]: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="field-group">
                          <label>Judul</label>
                          <input
                            type="text"
                            value={settingsForm[`feature${n}_title`]}
                            onChange={(e) => setSettingsForm({ ...settingsForm, [`feature${n}_title`]: e.target.value })}
                          />
                        </div>
                        <div className="field-group">
                          <label>Deskripsi</label>
                          <textarea
                            rows="3"
                            value={settingsForm[`feature${n}_desc`]}
                            onChange={(e) => setSettingsForm({ ...settingsForm, [`feature${n}_desc`]: e.target.value })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>

                {/* ═══ SECTION 5: KONTAK & FOOTER ═══ */}
                <fieldset className="settings-fieldset" id="section-contact">
                  <legend><span className="fieldset-num">5</span>✉️ Kontak & Footer</legend>

                  <div className="settings-grid-2">
                    <div className="field-group">
                      <label>📧 Email Kontak</label>
                      <input
                        type="text"
                        value={settingsForm.contact_email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                      />
                    </div>

                    <div className="field-group">
                      <label>📸 Username Instagram</label>
                      <input
                        type="text"
                        value={settingsForm.contact_instagram}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contact_instagram: e.target.value })}
                      />
                    </div>

                    <div className="field-group">
                      <label>📍 Lokasi / Kota</label>
                      <input
                        type="text"
                        value={settingsForm.contact_location}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contact_location: e.target.value })}
                      />
                    </div>

                    <div className="field-group">
                      <label>© Teks Hak Cipta Footer</label>
                      <input
                        type="text"
                        value={settingsForm.footer_text}
                        onChange={(e) => setSettingsForm({ ...settingsForm, footer_text: e.target.value })}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* STICKY SAVE BAR */}
                <div className="sticky-save-bar">
                  <span className="sticky-save-bar__info">
                    Pastikan semua perubahan sudah benar sebelum menyimpan.
                  </span>
                  <button type="submit" className="btn-save btn-save--lg" disabled={loading}>
                    {loading ? "⏳ Menyimpan Perubahan..." : "💾 Simpan Semua Perubahan"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminPage;
