// ============================================
// AdminOrders.jsx
// Panel kelola pesanan pelanggan Kopi Bekmer 70
// ============================================

import { useCallback, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import "./AdminOrders.css";

function AdminOrders() {
  const { getAllOrders, updateOrderStatus, loading } = useApi();

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const STATUS_OPTIONS = [
    { value: "belum bayar", label: "BELUM BAYAR", color: "#b77900" },
    { value: "diproses", label: "DIPROSES", color: "#1f6fa5" },
    { value: "selesai", label: "SELESAI", color: "#277f4b" },
    { value: "dibatalkan", label: "DIBATALKAN", color: "#b42318" },
  ];

  const fetchOrders = useCallback(async () => {
    const result = await getAllOrders();

    if (result?.success) {
      setOrders(result.data);
    }
  }, [getAllOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);

    const result = await updateOrderStatus(orderId, newStatus);

    if (result.success) {
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      setMessage({
        text: `Status pesanan berhasil diubah menjadi "${newStatus}".`,
        type: "success",
      });
    } else {
      setMessage({
        text: "Gagal mengubah status pesanan.",
        type: "error",
      });
    }

    setTimeout(() => setMessage(null), 3000);
    setUpdatingOrderId(null);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusStyle = (status) => {
    const selectedStatus = STATUS_OPTIONS.find(
      (option) => option.value === status?.toLowerCase()
    );

    if (!selectedStatus) return {};

    return {
      background: `${selectedStatus.color}16`,
      borderColor: `${selectedStatus.color}55`,
      color: selectedStatus.color,
    };
  };

  return (
    <section className="admin-orders">
      <div className="admin-orders-header">
        <div>
          <p className="admin-section-eyebrow">TRANSAKSI PELANGGAN</p>

          <h2>KELOLA PESANAN.</h2>

          <p className="admin-orders-subtitle">
            Pantau semua pesanan yang masuk dan ubah status transaksi sesuai
            proses pelayanan Kopi Bekmer 70.
          </p>
        </div>

        <div className="admin-orders-header-actions">
          <span>{orders.length} PESANAN</span>

          <button
            className="admin-orders-refresh"
            onClick={fetchOrders}
            disabled={loading}
          >
            {loading ? "MEMUAT..." : "REFRESH DATA ↻"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`admin-orders-message admin-orders-message--${message.type}`}
        >
          {message.text}
        </div>
      )}

      {loading && orders.length === 0 && (
        <div className="admin-orders-loading">
          <div className="admin-orders-spinner" />
          <p>MEMUAT SEMUA PESANAN...</p>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="admin-orders-empty">
          <img
            src="/assets/logo/logo-bekmer.png"
            alt="Logo Kopi Bekmer 70"
            className="admin-orders-empty-logo"
          />

          <h3>BELUM ADA PESANAN.</h3>

          <p>
            Pesanan pelanggan yang masuk akan tampil di bagian ini.
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="admin-orders-list">
          {orders.map((order, index) => (
            <article
              className="admin-order-card"
              key={order.id}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="admin-order-header">
                <div className="admin-order-meta">
                  <p className="admin-order-label">ID PESANAN</p>

                  <span className="admin-order-id">
                    #{order.id?.slice(0, 8)}
                  </span>

                  <span className="admin-order-user">
                    Pelanggan:{" "}
                    {order.users?.name ||
                      order.users?.email ||
                      `User ${order.user_id?.slice(0, 8)}...`}
                  </span>

                  <span className="admin-order-date">
                    {formatDate(order.created_at)}
                  </span>
                </div>

                <div className="admin-order-status-control">
                  <span
                    className="admin-order-status-badge"
                    style={getStatusStyle(order.status)}
                  >
                    {order.status || "belum bayar"}
                  </span>

                  <select
                    className="admin-order-status-select"
                    value={order.status || "belum bayar"}
                    onChange={(event) =>
                      handleStatusChange(order.id, event.target.value)
                    }
                    disabled={updatingOrderId === order.id}
                    id={`order-status-${order.id}`}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-order-items">
                {order.order_items?.map((orderItem, itemIndex) => {
                  const itemData = orderItem.items || {};

                  return (
                    <div
                      className="admin-order-item-row"
                      key={orderItem.id || itemIndex}
                    >
                      <span className="admin-order-item-name">
                        {itemData.name || "Item"}
                      </span>

                      <span className="admin-order-item-qty">
                        x{orderItem.quantity}
                      </span>

                      <span className="admin-order-item-price">
                        Rp{" "}
                        {Number(
                          orderItem.price_at_time * orderItem.quantity
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="admin-order-footer">
                <span className="admin-order-total-label">
                  TOTAL PEMBAYARAN
                </span>

                <span className="admin-order-total-amount">
                  Rp {Number(order.total_price).toLocaleString("id-ID")}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminOrders;