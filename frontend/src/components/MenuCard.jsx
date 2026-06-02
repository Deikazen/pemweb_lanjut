// ============================================
// MenuCard.jsx  (Kartu Menu Kopi)
// → Kartu produk dengan gambar, nama, deskripsi
// → Interaksi: hover flip efek + zoom gambar
// → Tombol "Tambah ke Keranjang" (Add to Cart)
// → Dipakai di: LandingPage → section Menu
// → Props: item { id, name, media_url, price }, onAddToCart
// ============================================

import { useState } from "react";
import useApi from "../hooks/useApi";
import "./MenuCard.css";

function MenuCard({ item }) {
  const { addToCart } = useApi();
  const [toast, setToast] = useState(null);
  const [adding, setAdding] = useState(false);

  // Ambil URL gambar pertama jika berupa array
  const imageUrl = Array.isArray(item.media_url)
    ? item.media_url[0]
    : item.media_url;

  const handleAddToCart = async () => {
    // [UPDATED] Cek token (bukan user_id), karena backend pakai verifyToken
    const token = localStorage.getItem("token");

    if (!token) {
      setToast({ message: "Silakan login terlebih dahulu!", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setAdding(true);
    // [UPDATED] Tidak perlu kirim userId lagi — backend ambil dari JWT
    const result = await addToCart({ itemId: item.id, quantity: 1 });
    setAdding(false);

    if (result.success) {
      setToast({ message: "Berhasil ditambahkan ke keranjang! 🛒", type: "success" });
      // Dispatch custom event agar Navbar bisa update badge
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      setToast({ message: "Gagal menambahkan ke keranjang", type: "error" });
    }

    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="menu-card">
      {/* ── Toast notification ── */}
      {toast && (
        <div className={`menu-card-toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          {toast.message}
        </div>
      )}

      {/* ── Gambar dengan badge ── */}
      <div className="menu-card-img-wrap">
        <img
          src={imageUrl}
          alt={item.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x400?text=KopiNara";
          }}
        />
        <span className="menu-card-badge">Favorit</span>
        <div className="menu-card-overlay">
          <span className="overlay-text">Lihat Detail →</span>
        </div>
      </div>

      {/* ── Info menu ── */}
      <div className="menu-card-body">
        <h3>{item.name}</h3>
        <h4 style={{ color: "#d2691e", marginTop: "5px" }}>
          {item.price ? `Rp ${Number(item.price).toLocaleString('id-ID')}` : 'Harga tidak tersedia'}
        </h4>
        <p>Diseduh dengan cinta dari biji pilihan — nikmat di setiap tegukan.</p>
        <div className="menu-card-footer">
          <span className="menu-tag">☕ Signature</span>
          <span className="menu-tag">🍃 Fresh</span>
        </div>

        {/* ── Tombol Add to Cart ── */}
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
      </div>
    </div>
  );
}

export default MenuCard;
