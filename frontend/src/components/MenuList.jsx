// ============================================
// MenuList.jsx
// Daftar menu database Kopi Bekmer 70
// ============================================

import MenuItemCard from "./MenuItemCard";
import "./MenuList.css";

function MenuList({ items, loading, error, onRefresh, onEdit, onDelete }) {
  return (
    <section className="admin-list-section">
      <div className="admin-list-header">
        <div>
          <p className="admin-section-eyebrow">DATABASE PRODUK</p>

          <h2>MENU TERDAFTAR.</h2>

          <p>
            Periksa menu yang tampil di halaman pelanggan. Gunakan tombol
            edit untuk memperbarui informasi atau hapus untuk menghilangkan
            produk dari database.
          </p>
        </div>

        <div className="admin-list-actions">
          <span>{items.length} MENU</span>

          <button onClick={onRefresh} className="admin-refresh-btn">
            REFRESH DATA ↻
          </button>
        </div>
      </div>

      {loading && <p className="loading-text">MEMUAT DATA MENU...</p>}

      {error && (
        <p className="admin-error-text">
          ⚠ TERJADI KESALAHAN: {error}
        </p>
      )}

      <div className="admin-grid">
        {items.length === 0 && !loading ? (
          <div className="empty-card">
            <h3>BELUM ADA MENU.</h3>

            <p>
              Tambahkan produk pertama melalui form di atas agar menu
              dapat tampil pada halaman pelanggan.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default MenuList;