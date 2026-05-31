// ============================================
// AdminTabs.jsx  (Tab Selector)
// → Toggle antara "Kelola Menu" dan "Edit Landing Page"
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
        📋 Kelola Menu (CRUD Menu)
      </button>
      <button
        className={`admin-tab ${activeTab === "landing" ? "admin-tab--active" : ""}`}
        onClick={() => onTabChange("landing")}
      >
        ✨ Edit Landing Page (CRUD Sections)
      </button>
    </div>
  );
}

export default AdminTabs;
