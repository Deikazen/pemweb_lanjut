// ============================================
// AlertMessage.jsx
// Notifikasi dashboard dan autentikasi
// ============================================

import "./AlertMessage.css";

function AlertMessage({ message, type }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div className={`alert ${isSuccess ? "alert-success" : "alert-error"}`}>
      <span className="alert-icon">
        {isSuccess ? "✓" : "!"}
      </span>

      <span>{message}</span>
    </div>
  );
}

export default AlertMessage;