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
      <img
        src={imageUrl}
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
