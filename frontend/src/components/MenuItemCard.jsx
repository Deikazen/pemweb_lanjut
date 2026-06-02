// ============================================
// MenuItemCard.jsx  (Kartu Item Menu Admin)
// → Menampilkan satu item menu dengan gambar, nama, harga
// → Tombol Edit dan Hapus
// → Dipakai di: MenuList
// ============================================

import "./MenuItemCard.css";

function MenuItemCard({ item, onEdit, onDelete }) {
  const imageUrl = Array.isArray(item.media_url) ? item.media_url[0] : item.media_url;

  return (
    <div className="admin-item-card">
      <div className="admin-item-img-wrap" style={{ position: "relative", width: "100%", height: "160px", overflow: "hidden" }}>
        <img
          src={imageUrl}
          alt={item.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {item.badge && (
          <span style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "var(--caramel, #c07d3e)",
            color: "white",
            fontSize: "10px",
            fontWeight: "600",
            padding: "4px 8px",
            borderRadius: "4px",
            textTransform: "uppercase",
            zIndex: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
          }}>
            {item.badge}
          </span>
        )}
      </div>
      <div className="admin-item-content">
        <h3>{item.name}</h3>
        <p style={{ color: "#d2691e", fontWeight: "600" }}>
          {item.price ? `Rp ${Number(item.price).toLocaleString('id-ID')}` : 'Harga belum diisi'}
        </p>
        {item.description && (
          <p style={{ fontSize: "13px", color: "rgba(245, 234, 216, 0.6)", margin: "6px 0", lineHeight: "1.4" }}>
            {item.description}
          </p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "6px 0 10px" }}>
            {item.tags.map((tag, idx) => (
              <span key={idx} style={{ background: "rgba(245, 234, 216, 0.08)", color: "rgba(245, 234, 216, 0.7)", fontSize: "11px", padding: "2px 8px", borderRadius: "4px" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
        <p style={{ fontSize: "11px", color: "rgba(245, 234, 216, 0.3)" }}>ID: {item.id}</p>
        <div className="card-actions">
          <button className="btn-edit" onClick={() => onEdit(item)}>
            Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(item.id)}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard;
