// ============================================
// MenuCard.jsx  (Kartu Menu Kopi)
// → Kartu produk dengan gambar, nama, deskripsi
// → Interaksi: hover flip efek + zoom gambar
// → Dipakai di: LandingPage → section Menu
// → Props: item { id, name, media_url }
// ============================================

import "./MenuCard.css";

function MenuCard({ item }) {
  // Ambil URL gambar pertama jika berupa array
  const imageUrl = Array.isArray(item.media_url)
    ? item.media_url[0]
    : item.media_url;

  return (
    <div className="menu-card">
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
        <p>Diseduh dengan cinta dari biji pilihan — nikmat di setiap tegukan.</p>
        <div className="menu-card-footer">
          <span className="menu-tag">☕ Signature</span>
          <span className="menu-tag">🍃 Fresh</span>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
