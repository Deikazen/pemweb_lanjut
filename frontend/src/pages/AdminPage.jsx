// ============================================
// AdminPage.jsx  (Halaman Admin / /admin)
// → Orchestrator: mengelola state & logic DASHBOARD
// → Dilengkapi Route Protection: Hanya untuk Role 'admin'
// → Mendelegasikan tampilan ke sub-komponen:
//     · AdminNavbar   → navbar dashboard
//     · AdminTabs     → tab selector
//     · AlertMessage  → toast/alert
//     · MenuForm      → form CRUD item
//     · MenuList      → daftar item
//     · LandingEditor → editor landing page
// ============================================

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useApi from "../hooks/useApi";

// ── Sub-komponen ──
import AdminNavbar from "../components/AdminNavbar";
import AdminTabs from "../components/AdminTabs";
import AlertMessage from "../components/AlertMessage";
import MenuForm from "../components/MenuForm";
import MenuList from "../components/MenuList";
import LandingEditor from "../components/LandingEditor";
import AdminOrders from "../components/AdminOrders"; // [BARU] Panel kelola pesanan

import "./AdminPage.css";

function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
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
  } = useApi();

  // Auth state
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Navigation tab: "menu" | "landing"
  const [activeTab, setActiveTab] = useState("menu");

  // Form state (tambah / edit item)
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("");
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [tag3, setTag3] = useState("");
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

  // ── PROTEKSI RUTE ADMIN ──────────────────
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    const currentRole = localStorage.getItem("role");

    // Jika tidak ada token ATAU role bukan admin, tendang ke halaman login
    if (!currentToken || currentRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // ── LOAD DATA ────────────────────────────
  useEffect(() => {
    if (token) {
      getItems(token);
      getLandingSettings();
    }
  }, [token, getItems, getLandingSettings]);

  // ── PERBAIKAN DI SINI (Menambahkan location.pathname ke dependency array) ──
  useEffect(() => {
    if (location.state?.editItemId && items.length > 0) {
      const targetItem = items.find(item => item.id === location.state.editItemId);
      if (targetItem) {
        handleStartEdit(targetItem);
        // Hapus state agar tidak terpicu kembali saat reload
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, items, navigate, location.pathname]);

  useEffect(() => {
    if (landingSettings) {
      setSettingsForm(landingSettings);
    }
  }, [landingSettings]);

  // ── SAVE ITEM (tambah / edit) ────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !mediaUrl || !price) {
      showMessage("Nama, harga dan gambar wajib diisi/diupload");
      return;
    }
    const tags = [tag1, tag2, tag3].map(t => t.trim()).filter(t => t !== "");
    const result = await saveItem({ token, name, price, mediaUrl, editId, description, tags, badge });
    if (result.success) {
      setName(""); setPrice(""); setMediaUrl(""); setDescription(""); setEditId(null);
      setBadge(""); setTag1(""); setTag2(""); setTag3("");
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
    setDescription(item.description || "");
    setBadge(item.badge || "");
    setTag1(item.tags?.[0] || "");
    setTag2(item.tags?.[1] || "");
    setTag3(item.tags?.[2] || "");
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
    setEditId(null); setName(""); setMediaUrl(""); setPrice(""); setDescription("");
    setBadge(""); setTag1(""); setTag2(""); setTag3("");
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
    localStorage.removeItem("role"); // Hapus juga role-nya
    setToken("");
    navigate("/login"); // Arahkan kembali ke halaman login
  };

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
              name={name} price={price} mediaUrl={mediaUrl} description={description}
              badge={badge} tag1={tag1} tag2={tag2} tag3={tag3} editId={editId}
              loading={loading} onNameChange={setName} onPriceChange={setPrice}
              onMediaUrlChange={setMediaUrl} onDescriptionChange={setDescription}
              onBadgeChange={setBadge} onTag1Change={setTag1} onTag2Change={setTag2} onTag3Change={setTag3}
              onSubmit={handleSave} onCancelEdit={handleCancelEdit}
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

        {/* [BARU] Tab Kelola Pesanan */}
        {activeTab === "orders" && (
          <AdminOrders />
        )}
      </main>
    </div>
  );
}

export default AdminPage;