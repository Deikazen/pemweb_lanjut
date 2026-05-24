// ============================================
// AdminPage.jsx  (Halaman Admin / /admin)
// → Login: form email + password → dapat JWT token
// → Dashboard: CRUD item menu (tambah, edit, hapus)
// → Upload Gambar: Langsung ke Supabase Storage (bucket: media-produk)
// ============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { supabase } from "../utils/supabase"; // Pastikan file ini sudah dibuat
import "./AdminPage.css";

function AdminPage() {
  const navigate = useNavigate();
  const { items, loading, error, clearError, getItems, saveItem, deleteItem, loginAdmin } = useApi();

  // Auth state
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form state (tambah / edit item)
  const [name, setName] = useState("");
  const [mediaFile, setMediaFile] = useState(null); // File yang akan diupload
  const [previewUrl, setPreviewUrl] = useState(""); // URL gambar (untuk preview / data lama)
  const [editId, setEditId] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // State loading saat upload ke Supabase

  // Toast message
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // "success" | ""

  const showMessage = (text, type = "") => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => { setMessage(""); setMsgType(""); }, 3500);
  };

  // ── LOGIN ────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginAdmin({ email, password });
    if (result.success) {
      localStorage.setItem("token", result.token);
      setToken(result.token);
      showMessage("Login berhasil! Selamat datang.", "success");
    } else {
      showMessage(error || "Login gagal");
      clearError();
    }
  };

  // ── SAVE ITEM (tambah / edit) ────────────
  const handleSave = async (e) => {
    e.preventDefault();

    if (!name) {
      showMessage("Nama item wajib diisi");
      return;
    }
    // Jika buat item baru, wajib ada file. Jika edit, boleh tidak ada file (pakai gambar lama)
    if (!mediaFile && !editId) {
      showMessage("Gambar wajib diupload untuk item baru");
      return;
    }

    let finalMediaUrl = previewUrl;

    // 1. Jika ada file gambar baru yang dipilih, upload ke Supabase
    if (mediaFile) {
      try {
        setIsUploading(true);
        showMessage("Mengunggah gambar...", "success");

        // Generate nama unik
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload ke Supabase
        const { error: uploadError } = await supabase.storage
          .from('media-produk')
          .upload(fileName, mediaFile);

        if (uploadError) throw uploadError;

        // Ambil Public URL
        const { data: publicUrlData } = supabase.storage
          .from('media-produk')
          .getPublicUrl(fileName);

        finalMediaUrl = publicUrlData.publicUrl;
      } catch (err) {
        showMessage("Gagal mengunggah gambar ke Supabase");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    // 2. Simpan URL ke database via backend
    const result = await saveItem({ token, name, mediaUrl: finalMediaUrl, editId });

    if (result.success) {
      setName("");
      setMediaFile(null);
      setPreviewUrl("");
      setEditId(null);
      showMessage(editId ? "Item berhasil diupdate!" : "Item berhasil ditambahkan!", "success");
      getItems(token);
    } else {
      showMessage(error || "Gagal menyimpan item");
      clearError();
    }
  };

  // ── START EDIT ───────────────────────────
  const handleStartEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    const currentUrl = Array.isArray(item.media_url) ? item.media_url[0] : item.media_url;
    setPreviewUrl(currentUrl);
    setMediaFile(null); // Reset file yang baru dipilih
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── DELETE ───────────────────────────────
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

  // ── LOGOUT ───────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setEmail("");
    setPassword("");
    showMessage("Berhasil logout");
  };

  // Load items saat sudah login
  useEffect(() => {
    if (token) getItems(token);
  }, [token, getItems]);

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
  // TAMPILAN: DASHBOARD ADMIN
  // ─────────────────────────────────────────
  return (
    <div className="admin-page">

      {/* ── NAVBAR ADMIN ──────────────────── */}
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          <h2>☕ Admin KopiNara</h2>
          <span>Kelola data landing page dari backend</span>
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

      <main className="admin-container">

        {/* Alert / Toast */}
        {message && (
          <div className={`alert ${msgType === "success" ? "alert-success" : ""}`}>
            {message}
          </div>
        )}

        {/* ── FORM TAMBAH / EDIT ─────────── */}
        <section className="admin-form-section">
          <h2>{editId ? "✏️ Edit Item" : "➕ Tambah Item Baru"}</h2>

          <form onSubmit={handleSave} className="admin-form">
            <div className="field-group">
              <label>Nama Item</label>
              <input
                type="text"
                placeholder="Contoh: Siomay Ayam"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Upload Gambar Produk</label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setMediaFile(file);
                  if (file) {
                    setPreviewUrl(URL.createObjectURL(file)); // Buat URL sementara untuk preview
                  } else if (!editId) {
                    setPreviewUrl(""); // Reset jika file di-cancel saat tambah baru
                  }
                }}
              />

              {/* Tampilkan preview gambar kecil jika ada URL */}
              {previewUrl && (
                <div style={{ marginTop: "12px", border: "1px dashed #ccc", padding: "8px", display: "inline-block", borderRadius: "8px" }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ height: "120px", objectFit: "cover", borderRadius: "4px" }}
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={loading || isUploading}>
                {loading || isUploading ? "Menyimpan..." : editId ? "Update Item" : "Tambah Item"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setEditId(null);
                    setName("");
                    setMediaFile(null);
                    setPreviewUrl("");
                  }}
                >
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ── DAFTAR ITEM ────────────────── */}
        <section className="admin-list-section">
          <div className="section-row">
            <h2>📋 Data Item dari Backend</h2>
            <button onClick={() => getItems(token)} className="btn-dark">
              🔄 Refresh
            </button>
          </div>

          {loading && <p className="loading-text">Memuat data...</p>}

          <div className="admin-grid">
            {items.length === 0 && !loading ? (
              <div className="empty-card">
                <h3>Belum ada data</h3>
                <p>Tambahkan item pertama lewat form di atas.</p>
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

      </main>
    </div>
  );
}

export default AdminPage;