// ============================================
// AdminTabs.jsx
// Tab Selector Dashboard Admin Kopi Bekmer 70
// ============================================

import "./AdminTabs.css";

function AdminTabs({ activeTab, onTabChange }) {
  return (
    <div className="admin-tabs-wrap">
      <div className="admin-tabs-container">
        <button
          className={`admin-tab ${activeTab === "menu" ? "admin-tab--active" : ""}`}
          onClick={() => onTabChange("menu")}
        >
          <span className="admin-tab-number">01</span>

          <span className="admin-tab-copy">
            <strong>KELOLA MENU</strong>
            <small>Tambah, edit, dan hapus produk</small>
          </span>
        </button>

        <button
          className={`admin-tab ${activeTab === "landing" ? "admin-tab--active" : ""}`}
          onClick={() => onTabChange("landing")}
        >
          <span className="admin-tab-number">02</span>

          <span className="admin-tab-copy">
            <strong>EDIT LANDING PAGE</strong>
            <small>Perbarui informasi halaman utama</small>
          </span>
        </button>

        <button
          className={`admin-tab ${activeTab === "orders" ? "admin-tab--active" : ""}`}
          onClick={() => onTabChange("orders")}
        >
          <span className="admin-tab-number">03</span>

          <span className="admin-tab-copy">
            <strong>KELOLA PESANAN</strong>
            <small>Pantau transaksi pelanggan</small>
          </span>
        </button>
      </div>
    </div>
  );
}

export default AdminTabs;