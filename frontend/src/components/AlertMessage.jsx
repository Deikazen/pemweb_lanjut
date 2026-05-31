// ============================================
// AlertMessage.jsx  (Komponen Alert / Toast)
// → Menampilkan pesan sukses atau error
// → Dipakai di: AdminPage (login + dashboard)
// ============================================

import "./AlertMessage.css";

function AlertMessage({ message, type }) {
  if (!message) return null;

  return (
    <div className={`alert ${type === "success" ? "alert-success" : ""}`}>
      {message}
    </div>
  );
}

export default AlertMessage;
