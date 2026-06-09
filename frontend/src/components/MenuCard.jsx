// ============================================
// MenuCard.jsx  (Kartu Menu Kopi)
// → Kartu produk dengan gambar, nama, deskripsi
// → Interaksi: klik card/gambar untuk detail modal (tengah layar via React Portal)
// → Dinamis rendering badge atas & tag bawah
// → Tombol "Tambah ke Keranjang" (Add to Cart) / Edit (Admin)
// ============================================

import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import "./MenuCard.css";

function MenuCard({ item }) {
  const { addToCart } = useApi();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [adding, setAdding] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const isAdmin = localStorage.getItem("role") === "admin";

  // Ambil URL gambar pertama jika berupa array
  const imageUrl = Array.isArray(item.media_url)
    ? item.media_url[0]
    : item.media_url;

  // Helper untuk menentukan tipe seduhan kopi secara dinamis berdasarkan nama/tag
  const getBrewType = (item) => {
    if (item.tags && item.tags[0]) {
      return item.tags[0].charAt(0).toUpperCase() + item.tags[0].slice(1) + " Brew";
    }
    const nameLower = item.name.toLowerCase();
    if (nameLower.includes("latte") || nameLower.includes("espresso") || nameLower.includes("cappuccino")) {
      return "Espresso Based";
    }
    if (nameLower.includes("matcha") || nameLower.includes("tea") || nameLower.includes("teh")) {
      return "Artisan Tea";
    }
    if (nameLower.includes("cold") || nameLower.includes("brew") || nameLower.includes("ice")) {
      return "Cold Brewed";
    }
    return "Artisan Brew";
  };

  const handleAddToCart = async (e) => {
    if (e) e.stopPropagation();
    
    const token = localStorage.getItem("token");

    if (!token) {
      setToast({ message: "Silakan login terlebih dahulu!", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setAdding(true);
    const result = await addToCart({ itemId: item.id, quantity: 1 });
    setAdding(false);

    if (result.success) {
      setToast({ message: "Berhasil ditambahkan ke keranjang! 🛒", type: "success" });
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      setToast({ message: "Gagal menambahkan ke keranjang", type: "error" });
    }

    setTimeout(() => setToast(null), 3000);
  };

  const handleCardClick = () => {
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="menu-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
        {/* ── Toast notification ── */}
        {toast && (
          <div className={`menu-card-toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
            {toast.message}
          </div>
        )}

        {/* ── Gambar dengan badge ── */}
        <div className="menu-card-img-wrap">
          <img
            src={imageUrl || "/assets/logo/logo-bekmer.png"}
            alt={item.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/assets/logo/logo-bekmer.png";
            }}
          />
          {item.badge && <span className="menu-card-badge">{item.badge}</span>}
          <div className="menu-card-overlay">
            <span className="overlay-text">LIHAT DETAIL MENU →</span>
          </div>
        </div>

        {/* ── Info menu ── */}
        <div className="menu-card-body">
          <h3>{item.name}</h3>
          <h4 className="menu-card-price">
            {item.price
              ? `Rp ${Number(item.price).toLocaleString("id-ID")}`
              : "Harga tidak tersedia"}
          </h4>
          <p className="menu-card-short-desc">
            {item.description || "Diseduh dengan cinta dari biji pilihan — nikmat di setiap tegukan."}
          </p>
          
          <div className="menu-card-footer">
            {item.tags && item.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="menu-tag">#{tag}</span>
            ))}
          </div>

          {/* ── Tombol Add to Cart / Kelola (Admin) ── */}
          {isAdmin ? (
            <button
              className="menu-card-cart-btn admin-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin", { state: { editItemId: item.id } });
              }}
              style={{
                background: "linear-gradient(135deg, #2c3e50, #34495e)",
                color: "#ecf0f1",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              ⚙️ Kelola Menu (Admin)
            </button>
          ) : (
            <button
              className="menu-card-cart-btn"
              onClick={handleAddToCart}
              disabled={adding}
              id={`add-to-cart-${item.id}`}
            >
              {adding ? (
                <span className="btn-loading">⏳ Menambahkan...</span>
              ) : (
                <>
                  <span className="cart-icon">🛒</span>
                  Tambah ke Keranjang
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Detail Modal (Popup) di-render di body via Portal ── */}
      {showDetailModal && createPortal(
        <div className="menu-detail-backdrop" onClick={() => setShowDetailModal(false)}>
          <div className="menu-detail-modal" onClick={(e) => e.stopPropagation()}>
            {/* Tombol Tutup */}
            <button className="menu-detail-close" onClick={() => setShowDetailModal(false)}>
              &times;
            </button>

            <div className="menu-detail-flex">
              {/* Sisi Kiri: Gambar */}
              <div className="menu-detail-img-box">
                <img
                  src={imageUrl || "/assets/logo/logo-bekmer.png"}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/logo/logo-bekmer.png";
                  }}
                />
              </div>

              {/* Sisi Kanan: Detail Info */}
              <div className="menu-detail-info-box">
              <p className="menu-detail-eyebrow">DETAIL MENU KOPI BEKMER 70</p>

              {item.badge && (
                <span className="menu-detail-badge">{item.badge}</span>
              )}

              <h2>{item.name}</h2>
                <h3 className="menu-detail-price">
                  {item.price ? `Rp ${Number(item.price).toLocaleString('id-ID')}` : 'Harga tidak tersedia'}
                </h3>

                <div className="menu-detail-divider" />

                <h4 className="menu-detail-section-title">Deskripsi Menu</h4>
                <p className="menu-detail-desc text-scroll">
                  {item.description ||
                    "Diseduh dari beans pilihan Kabupaten Bandung dengan karakter yang smooth, ringan, dan nyaman dinikmati di setiap tegukan."}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="menu-detail-meta-grid">
                    <div className="meta-item">
                      <span className="meta-icon">☕</span>
                      <div className="meta-text">
                        <strong>Tipe</strong>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                          <span className="menu-tag" style={{ margin: 0 }}>#{getBrewType(item)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">🏷️</span>
                      <div className="meta-text">
                        <strong>Tag</strong>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="menu-tag" style={{ margin: 0 }}>#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tombol Add to Cart / Edit (Admin) dalam Modal */}
                {isAdmin ? (
                  <button
                    className="menu-detail-cart-btn admin-action-btn"
                    onClick={() => {
                      setShowDetailModal(false);
                      navigate("/admin", { state: { editItemId: item.id } });
                    }}
                    style={{
                      background: "linear-gradient(135deg, #2c3e50, #34495e)",
                      color: "#ecf0f1",
                      boxShadow: "0 4px 15px rgba(44, 62, 80, 0.3)"
                    }}
                  >
                    ✏️ Edit Menu Ini (Admin)
                  </button>
                ) : (
                  <button
                    className="menu-detail-cart-btn"
                    onClick={(e) => {
                      handleAddToCart(e);
                      setShowDetailModal(false);
                    }}
                    disabled={adding}
                  >
                    {adding ? "MENAMBAHKAN..." : "TAMBAHKAN KE KERANJANG →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default MenuCard;
