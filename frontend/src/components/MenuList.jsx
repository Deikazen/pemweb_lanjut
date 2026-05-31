// ============================================
// MenuList.jsx  (Daftar Item Menu)
// → Grid kartu item menu + tombol refresh
// → Empty state jika belum ada data
// → Dipakai di: AdminPage → Tab Kelola Menu
// ============================================

import MenuItemCard from "./MenuItemCard";
import "./MenuList.css";

function MenuList({ items, loading, error, onRefresh, onEdit, onDelete }) {
  return (
    <section className="admin-list-section">
      <div className="section-row">
        <h2>📋 Menu Terdaftar</h2>
        <button onClick={onRefresh} className="btn-dark">
          🔄 Refresh
        </button>
      </div>

      {loading && <p className="loading-text">Memuat data...</p>}
      {error && (
        <p className="error-text" style={{ color: "#ff4a4a", textAlign: "center", margin: "10px 0" }}>
          ⚠️ Error: {error}
        </p>
      )}

      <div className="admin-grid">
        {items.length === 0 && !loading ? (
          <div className="empty-card">
            <h3>Belum ada data menu</h3>
            <p>Tambahkan item menu pertama lewat form di atas.</p>
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
