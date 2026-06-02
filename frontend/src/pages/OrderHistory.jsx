// ============================================
// OrderHistory.jsx  (Halaman Riwayat Pesanan)
// → Route: /orders
// → Menampilkan daftar pesanan dari GET /api/orders
// → Nested join: order → order_items → items
// → Card per pesanan: tanggal, status, total, daftar barang
// ============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import Navbar from "../components/Navbar";
import "./OrderHistory.css";

function OrderHistory() {
  const navigate = useNavigate();
  const { orders, getOrders, loading } = useApi();
  const [localOrders, setLocalOrders] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    // Redirect jika belum login
    if (!userId) {
      navigate("/login");
      return;
    }
    getOrders(userId);
  }, [userId, getOrders, navigate]);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  // Format tanggal Indonesia
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Status badge color
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'selesai':
        return 'status-completed';
      case 'processing':
      case 'diproses':
        return 'status-processing';
      case 'cancelled':
      case 'dibatalkan':
        return 'status-cancelled';
      case 'pending':
      default:
        return 'status-pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'Selesai';
      case 'processing': return 'Diproses';
      case 'cancelled': return 'Dibatalkan';
      case 'pending': return 'Menunggu';
      default: return status || 'Menunggu';
    }
  };

  return (
    <div className="order-history-page">
      <Navbar />

      <div className="order-history-container">
        {/* ── Header ── */}
        <div className="order-history-header">
          <button className="order-back-btn" onClick={() => navigate("/")}>
            ← Kembali
          </button>
          <div className="order-history-title">
            <p className="section-label">Riwayat Pesanan</p>
            <h1>📋 Pesanan Anda</h1>
            <p className="order-subtitle">
              Semua transaksi pembelian kopi Anda tercatat di sini.
            </p>
          </div>
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div className="order-loading">
            <div className="order-spinner"></div>
            <p>Memuat riwayat pesanan...</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && localOrders.length === 0 && (
          <div className="order-empty">
            <span className="order-empty-icon">📭</span>
            <h3>Belum Ada Pesanan</h3>
            <p>Anda belum pernah melakukan pemesanan. Jelajahi menu kami dan pesan kopi favorit Anda!</p>
            <button className="order-cta-btn" onClick={() => navigate("/")}>
              ☕ Jelajahi Menu
            </button>
          </div>
        )}

        {/* ── Orders list ── */}
        {!loading && localOrders.length > 0 && (
          <div className="order-list">
            {localOrders.map((order, index) => (
              <div
                className="order-card"
                key={order.id}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* ── Order header ── */}
                <div className="order-card-header">
                  <div className="order-card-meta">
                    <span className="order-id">Order #{order.id?.slice(0, 8)}</span>
                    <span className="order-date">{formatDate(order.created_at)}</span>
                  </div>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* ── Order items ── */}
                <div className="order-items">
                  {order.order_items?.map((orderItem, i) => {
                    const itemData = orderItem.items || {};
                    const imageUrl = Array.isArray(itemData.media_url)
                      ? itemData.media_url[0]
                      : itemData.media_url;

                    return (
                      <div className="order-item-row" key={orderItem.id || i}>
                        <div className="order-item-img">
                          <img
                            src={imageUrl || "https://via.placeholder.com/50x50?text=☕"}
                            alt={itemData.name || "Item"}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/50x50?text=☕";
                            }}
                          />
                        </div>
                        <div className="order-item-detail">
                          <span className="order-item-name">{itemData.name || "Item"}</span>
                          <span className="order-item-qty">x{orderItem.quantity}</span>
                        </div>
                        <span className="order-item-price">
                          Rp {Number(orderItem.price_at_time * orderItem.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* ── Order footer / total ── */}
                <div className="order-card-footer">
                  <span className="order-total-label">Total Pembayaran</span>
                  <span className="order-total-amount">
                    Rp {Number(order.total_price).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
