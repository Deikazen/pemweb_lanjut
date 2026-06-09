// ============================================
// AdminPage.jsx
// Dashboard Admin Kopi Bekmer 70
// ============================================

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useApi from "../hooks/useApi";

import AdminNavbar from "../components/AdminNavbar";
import AdminTabs from "../components/AdminTabs";
import AlertMessage from "../components/AlertMessage";
import MenuForm from "../components/MenuForm";
import MenuList from "../components/MenuList";
import LandingEditor from "../components/LandingEditor";
import AdminOrders from "../components/AdminOrders";

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

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [activeTab, setActiveTab] = useState("menu");

  // ── Form produk ──────────────────────────
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [description, setDescription] = useState("");
  const [badge, setBadge] = useState("");
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [tag3, setTag3] = useState("");
  const [editId, setEditId] = useState(null);

  // ── Landing page settings ────────────────
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
    footer_text: "",

    contact_whatsapp: "",
    operational_hours: "",
    contact_tiktok: "",
    contact_facebook: "",
    maps_query: "",
    menu_poster_image: "",
  });

  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const showMessage = (text, type = "") => {
    setMessage(text);
    setMsgType(type);

    setTimeout(() => {
      setMessage("");
      setMsgType("");
    }, 3500);
  };

  // ── Proteksi admin ───────────────────────
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    const currentRole = localStorage.getItem("role");

    if (!currentToken || currentRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // ── Load data ────────────────────────────
  useEffect(() => {
    if (token) {
      getItems(token);
      getLandingSettings();
    }
  }, [token, getItems, getLandingSettings]);

  useEffect(() => {
    if (location.state?.editItemId && items.length > 0) {
      const targetItem = items.find(
        (item) => item.id === location.state.editItemId
      );

      if (targetItem) {
        handleStartEdit(targetItem);

        navigate(location.pathname, {
          replace: true,
          state: {},
        });
      }
    }
  }, [
    location.state,
    items,
    navigate,
    location.pathname,
  ]);

  useEffect(() => {
    if (landingSettings) {
      setSettingsForm((previousSettings) => ({
        ...previousSettings,
        ...landingSettings,
      }));
    }
  }, [landingSettings]);

  // ── Simpan menu ──────────────────────────
  const handleSave = async (event) => {
    event.preventDefault();

    if (!name || !mediaUrl || !price) {
      showMessage(
        "Nama, harga, dan gambar wajib diisi atau diupload."
      );

      return;
    }

    const tags = [tag1, tag2, tag3]
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const result = await saveItem({
      token,
      name,
      price,
      mediaUrl,
      editId,
      description,
      tags,
      badge,
    });

    if (result.success) {
      setName("");
      setPrice("");
      setMediaUrl("");
      setDescription("");
      setEditId(null);
      setBadge("");
      setTag1("");
      setTag2("");
      setTag3("");

      showMessage(
        editId
          ? "Menu berhasil diperbarui!"
          : "Menu berhasil ditambahkan!",
        "success"
      );

      getItems(token);
    } else {
      showMessage(error || "Gagal menyimpan menu.");
      clearError();
    }
  };

  // ── Mulai edit menu ──────────────────────
  const handleStartEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setPrice(item.price || "");

    setMediaUrl(
      Array.isArray(item.media_url)
        ? item.media_url[0]
        : item.media_url
    );

    setDescription(item.description || "");
    setBadge(item.badge || "");
    setTag1(item.tags?.[0] || "");
    setTag2(item.tags?.[1] || "");
    setTag3(item.tags?.[2] || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ── Hapus menu ───────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus menu ini?")) {
      return;
    }

    const result = await deleteItem({ token, id });

    if (result.success) {
      showMessage("Menu berhasil dihapus.", "success");
      getItems(token);
    } else {
      showMessage(error || "Gagal menghapus menu.");
      clearError();
    }
  };

  // ── Batalkan edit ────────────────────────
  const handleCancelEdit = () => {
    setEditId(null);
    setName("");
    setMediaUrl("");
    setPrice("");
    setDescription("");
    setBadge("");
    setTag1("");
    setTag2("");
    setTag3("");
  };

  // ── Simpan settings landing page ─────────
  const handleSaveSettings = async (event) => {
    event.preventDefault();

    const result = await saveLandingSettings({
      token,
      settings: settingsForm,
    });

    if (result.success) {
      showMessage(
        "Landing page berhasil diperbarui! Silakan refresh halaman utama.",
        "success"
      );

      getLandingSettings();
    } else {
      showMessage(
        error || "Gagal memperbarui landing page."
      );

      clearError();
    }
  };

  // ── Logout ───────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");

    setToken("");
    navigate("/login");
  };

  return (
    <div className="admin-page">
      <AdminNavbar onLogout={handleLogout} />

      <main className="admin-container">
        {/* ── Hero admin ───────────────────── */}
        <section className="admin-hero">
          <div className="admin-hero-copy">
            <p className="admin-eyebrow">
              DASHBOARD ADMINISTRATOR
            </p>

            <h1>
              KELOLA KOPI
              <span>BEKMER 70.</span>
            </h1>

            <p className="admin-hero-desc">
              Kelola menu, landing page, dan pesanan pelanggan dari
              satu dashboard. Pastikan informasi yang tampil selalu
              sesuai dengan perjalanan Kopi Bekmer 70.
            </p>
          </div>

          <div className="admin-hero-brand">
            <img
              src="/assets/logo/logo-bekmer.png"
              alt="Logo Kopi Bekmer 70"
            />

            <div>
              <strong>KOPI BEKMER 70</strong>
              <span>DARI BIJI LAHIR CERITA.</span>
            </div>
          </div>
        </section>

        {/* ── Ringkasan admin ──────────────── */}
        <section className="admin-summary-grid">
          <article className="admin-summary-card">
            <p>MENU DATABASE</p>
            <strong>{items.length}</strong>
            <span>Produk tersedia untuk pelanggan</span>
          </article>

          <article className="admin-summary-card">
            <p>PANEL ADMIN</p>
            <strong>03</strong>
            <span>Menu, landing page, dan pesanan pelanggan</span>
          </article>

          <article className="admin-summary-card admin-summary-card--accent">
            <p>IDENTITAS BRAND</p>
            <strong>70</strong>
            <span>Terinspirasi motor bebek merah klasik</span>
          </article>
        </section>

        <AdminTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <AlertMessage message={message} type={msgType} />

        {/* ── Tab menu ─────────────────────── */}
        {activeTab === "menu" && (
          <div className="tab-panel">
            <MenuForm
              name={name}
              price={price}
              mediaUrl={mediaUrl}
              description={description}
              badge={badge}
              tag1={tag1}
              tag2={tag2}
              tag3={tag3}
              editId={editId}
              loading={loading}
              onNameChange={setName}
              onPriceChange={setPrice}
              onMediaUrlChange={setMediaUrl}
              onDescriptionChange={setDescription}
              onBadgeChange={setBadge}
              onTag1Change={setTag1}
              onTag2Change={setTag2}
              onTag3Change={setTag3}
              onSubmit={handleSave}
              onCancelEdit={handleCancelEdit}
            />

            <MenuList
              items={items}
              loading={loading}
              error={error}
              onRefresh={() => getItems(token)}
              onEdit={handleStartEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        {/* ── Tab editor landing page ──────── */}
        {activeTab === "landing" && (
          <LandingEditor
            settingsForm={settingsForm}
            onFieldChange={setSettingsForm}
            onSubmit={handleSaveSettings}
            loading={loading}
          />
        )}

        {/* ── Tab pesanan ──────────────────── */}
        {activeTab === "orders" && <AdminOrders />}
      </main>
    </div>
  );
}

export default AdminPage;