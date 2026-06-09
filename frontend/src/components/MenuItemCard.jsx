// ============================================
// MenuItemCard.jsx
// Kartu produk database di dashboard admin
// ============================================

import "./MenuItemCard.css";

function MenuItemCard({ item, onEdit, onDelete }) {
  const imageUrl = Array.isArray(item.media_url)
    ? item.media_url[0]
    : item.media_url;

  return (
    <article className="admin-item-card">
      <div className="admin-item-img-wrap">
        <img
          src={imageUrl || "/assets/logo/logo-bekmer.png"}
          alt={item.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/logo/logo-bekmer.png";
          }}
        />

        {item.badge && (
          <span className="admin-item-badge">
            {item.badge}
          </span>
        )}
      </div>

      <div className="admin-item-content">
        <h3>{item.name}</h3>

        <p className="admin-item-price">
          {item.price
            ? `Rp ${Number(item.price).toLocaleString("id-ID")}`
            : "Harga belum diisi"}
        </p>

        <p className="admin-item-desc">
          {item.description ||
            "Deskripsi produk belum tersedia. Tambahkan detail agar pelanggan lebih mudah memilih menu."}
        </p>

        {item.tags && item.tags.length > 0 && (
          <div className="admin-item-tags">
            {item.tags.map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>
        )}

        <p className="admin-item-id">
          ID: {item.id}
        </p>

        <div className="card-actions">
          <button className="btn-edit" onClick={() => onEdit(item)}>
            EDIT MENU
          </button>

          <button className="btn-delete" onClick={() => onDelete(item.id)}>
            HAPUS
          </button>
        </div>
      </div>
    </article>
  );
}

export default MenuItemCard;