// ============================================
// AdminOrders.jsx  (Panel Kelola Pesanan Admin)
// → Menampilkan SEMUA pesanan dari seluruh user
// → Admin bisa mengubah status pesanan via dropdown
// → Pilihan status: pending, diproses, dikirim, selesai, dibatalkan
// → Endpoint: GET /api/orders/all, PUT /api/orders/:id/status
// → Dipakai di: AdminPage (via AdminTabs)
// ============================================

import { useEffect, useState, useCallback } from "react";
import useApi from "../hooks/useApi";
import "./AdminOrders.css";

function AdminOrders() {
  const { getAllOrders, updateOrderStatus, loading } = useApi();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Opsi status sesuai backend (4 kategori)
  const STATUS_OPTIONS = [
    { value: "belum bayar", label: "⏳ Belum Bayar", color: "#f1c40f" },
    { value: "diproses",    label: "🔄 Diproses",    color: "#3498db" },
    { value: "selesai",     label: "✅ Selesai",      color: "#2ecc71" },
    { value: "dibatalkan",  label: "❌ Dibatalkan",   color: "#e74c3c" },
  ];

  // Fetch semua pesanan saat komponen mount
  const fetchOrders = useCallback(async () => {
    const result = await getAllOrders();
    if (result?.success) {
      setOrders(result.data);
    }
  }, [getAllOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle perubahan status pesanan
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      // Update state lokal agar langsung reflect di UI
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setMessage({ text: `Status pesanan berhasil diubah ke "${newStatus}"`, type: "success" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ text: "Gagal mengubah status pesanan", type: "error" });
      setTimeout(() => setMessage(null), 3000);
    }
    setUpdatingOrderId(null);
  };

  // Format tanggal
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Warna badge status
  const getStatusStyle = (status) => {
    const found = STATUS_OPTIONS.find(s => s.value === status?.toLowerCase());
    if (!found) return {};
    return {
      background: `${found.color}22`,
      borderColor: `${found.color}66`,
      color: found.color
    };
  };

  return (
    <div className="admin-orders">
      {/* Header */}
      <div className="admin-orders-header">
        <h2>📦 Kelola Pesanan</h2>
        <p className="admin-orders-subtitle">
          Kelola semua pesanan dari seluruh pelanggan. Ubah status dengan klik dropdown.
        </p>
        <button
          className="admin-orders-refresh"
          onClick={fetchOrders}
          disabled={loading}
        >
          {loading ? "⏳ Memuat..." : "🔄 Refresh Data"}
        </button>
      </div>

      {/* Message / Alert */}
      {message && (
        <div className={`admin-orders-message admin-orders-message--${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Loading state */}
      {loading && orders.length === 0 && (
        <div className="admin-orders-loading">
          <div className="admin-orders-spinner"></div>
          <p>Memuat semua pesanan...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && orders.length === 0 && (
        <div className="admin-orders-empty">
          <span className="admin-orders-empty-icon">📭</span>
          <h3>Belum Ada Pesanan</h3>
          <p>Belum ada pesanan masuk dari pelanggan.</p>
        </div>
      )}

      {/* Orders table/list */}
      {orders.length > 0 && (
        <div className="admin-orders-list">
          {orders.map((order, index) => (
            <div
              className="admin-order-card"
              key={order.id}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Order header */}
              <div className="admin-order-header">
                <div className="admin-order-meta">
                  <span className="admin-order-id">#{order.id?.slice(0, 8)}</span>
                  <span className="admin-order-user">
                    👤 {order.users?.name || order.users?.email || `User ${order.user_id?.slice(0, 8)}...`}
                  </span>
                  <span className="admin-order-date">{formatDate(order.created_at)}</span>
                </div>
                <div className="admin-order-status-control">
                  <span
                    className="admin-order-status-badge"
                    style={getStatusStyle(order.status)}
                  >
                    {order.status || "pending"}
                  </span>
                  <select
                    className="admin-order-status-select"
                    value={order.status || "pending"}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={updatingOrderId === order.id}
                    id={`order-status-${order.id}`}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order items */}
              <div className="admin-order-items">
                {order.order_items?.map((orderItem, i) => {
                  const itemData = orderItem.items || {};
                  return (
                    <div className="admin-order-item-row" key={orderItem.id || i}>
                      <span className="admin-order-item-name">
                        {itemData.name || "Item"}
                      </span>
                      <span className="admin-order-item-qty">
                        x{orderItem.quantity}
                      </span>
                      <span className="admin-order-item-price">
                        Rp {Number(orderItem.price_at_time * orderItem.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order footer */}
              <div className="admin-order-footer">
                <span className="admin-order-total-label">Total</span>
                <span className="admin-order-total-amount">
                  Rp {Number(order.total_price).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
