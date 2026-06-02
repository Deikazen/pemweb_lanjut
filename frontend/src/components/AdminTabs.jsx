// ============================================
// AdminTabs.jsx  (Tab Selector)
// → Toggle antara "Kelola Menu", "Edit Landing Page", dan "Kelola Pesanan"
// → [UPDATED] Tambah tab baru untuk manajemen pesanan
// → Dipakai di: AdminPage (dashboard)
// ============================================

import "./AdminTabs.css";

function AdminTabs({ activeTab, onTabChange }) {
  return (
    <div className="admin-tabs-container">
      <button
        className={`admin-tab ${activeTab === "menu" ? "admin-tab--active" : ""}`}
        onClick={() => onTabChange("menu")}
      >
        📋 Kelola Menu
      </button>
      <button
        className={`admin-tab ${activeTab === "landing" ? "admin-tab--active" : ""}`}
        onClick={() => onTabChange("landing")}
      >
        ✨ Edit Landing Page
      </button>
      {/* [BARU] Tab Kelola Pesanan */}
      <button
        className={`admin-tab ${activeTab === "orders" ? "admin-tab--active" : ""}`}
        onClick={() => onTabChange("orders")}
      >
        📦 Kelola Pesanan
      </button>
    </div>
  );
}

export default AdminTabs;
