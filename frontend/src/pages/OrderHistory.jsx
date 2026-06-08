// ============================================
// OrderHistory.jsx  (Halaman Riwayat Pesanan)
// → Route: /orders
// → Status: belum bayar | diproses | selesai | dibatalkan
// → Customer bisa: batalkan (belum bayar) | konfirmasi selesai (diproses)
// → Modal konfirmasi custom untuk kedua aksi
// ============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import Navbar from "../components/Navbar";
import "./OrderHistory.css";

function OrderHistory() {
  const navigate = useNavigate();
  const { orders, getOrders, cancelOrder, completeOrder, repayOrder, verifyPayment, loading } = useApi();
  const [localOrders, setLocalOrders]   = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast]               = useState(null);

  // ── State modal konfirmasi ──
  const [modal, setModal] = useState(null);
  // modal = { orderId, type: 'cancel' | 'complete' }

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    getOrders();
  }, [userId, getOrders, navigate]);

  useEffect(() => { setLocalOrders(orders); }, [orders]);

  // ── Toast ──
  const showToast = (text, type = "info") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Buka modal konfirmasi ──
  const openModal = (orderId, type) => setModal({ orderId, type });
  const closeModal = () => setModal(null);

  // ── Eksekusi aksi setelah konfirmasi modal ──
  const handleConfirm = async () => {
    if (!modal) return;
    const { orderId, type } = modal;
    closeModal();
    setProcessingId(orderId);

    if (type === "cancel") {
      const result = await cancelOrder(orderId);
      if (result.success) {
        setLocalOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status: "dibatalkan" } : o)
        );
        showToast("Pesanan berhasil dibatalkan.", "info");
      } else {
        showToast(result.message || "Gagal membatalkan pesanan.", "error");
      }
    } else if (type === "complete") {
      const result = await completeOrder(orderId);
      if (result.success) {
        setLocalOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status: "selesai" } : o)
        );
        showToast("Terima kasih! Pesanan dikonfirmasi selesai. ✅", "success");
      } else {
        showToast(result.message || "Gagal mengkonfirmasi pesanan.", "error");
      }
    }

    setProcessingId(null);
  };

  // ── Bayar ulang order yang belum dibayar (re-open Midtrans Snap) ──
  const handleRepay = async (orderId) => {
    setProcessingId(orderId);
    const result = await repayOrder(orderId);

    if (!result.success) {
      showToast(result.message || "Gagal mendapatkan token pembayaran.", "error");
      setProcessingId(null);
      return;
    }

    const snapToken = result.token;

    if (!snapToken) {
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        showToast("Token pembayaran tidak tersedia.", "error");
      }
      setProcessingId(null);
      return;
    }

    // Buka Midtrans Snap popup
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: async function (snapResult) {
          // Verifikasi pembayaran ke backend → update status di database
          const verifyResult = await verifyPayment(orderId, snapResult.order_id);
          const newStatus = verifyResult?.status || "diproses";
          showToast("🎉 Pembayaran berhasil! Pesanan sedang diproses.", "success");
          setLocalOrders(prev =>
            prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
          );
          setProcessingId(null);
        },
        onPending: async function (snapResult) {
          await verifyPayment(orderId, snapResult.order_id);
          showToast("⏳ Menunggu pembayaran...", "info");
          setProcessingId(null);
        },
        onError: async function (snapResult) {
          const verifyResult = await verifyPayment(orderId, snapResult.order_id);
          const newStatus = verifyResult?.status || "belum bayar";
          setLocalOrders(prev =>
            prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
          );
          showToast("❌ Pembayaran gagal. Silakan coba lagi.", "error");
          setProcessingId(null);
        },
        onClose: function () {
          // Verifikasi saat popup ditutup
          verifyPayment(orderId, orderId);
          showToast("💡 Popup pembayaran ditutup. Anda bisa membayar kapan saja.", "info");
          setProcessingId(null);
        },
      });
    } else {
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        showToast("Snap.js belum ter-load. Coba refresh halaman.", "error");
      }
      setProcessingId(null);
    }
  };

  // ── Format tanggal ──
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  // ── Status helpers ──
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'selesai':     return 'status-completed';
      case 'diproses':    return 'status-processing';
      case 'dibatalkan':  return 'status-cancelled';
      case 'belum bayar':
      default:            return 'status-pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'selesai':    return '✅ Selesai';
      case 'diproses':   return '🔄 Diproses';
      case 'dibatalkan': return '❌ Dibatalkan';
      case 'belum bayar':
      default:           return '⏳ Belum Bayar';
    }
  };

  // ── Konten modal berdasarkan type ──
  const modalConfig = modal?.type === "complete"
    ? {
        icon: "✅",
        title: "Konfirmasi Pesanan Selesai",
        desc: "Apakah Anda sudah menerima pesanan dan ingin menandai pesanan ini sebagai selesai? Aksi ini tidak dapat dibatalkan.",
        confirmLabel: "Ya, Pesanan Selesai",
        confirmClass: "modal-confirm-btn--success",
      }
    : {
        icon: "❌",
        title: "Batalkan Pesanan?",
        desc: "Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.",
        confirmLabel: "Ya, Batalkan",
        confirmClass: "modal-confirm-btn--danger",
      };

  return (
    <div className="order-history-page">
      <Navbar />

      {/* ══ Modal Konfirmasi ══ */}
      {modal && (
        <>
          <div className="order-modal-backdrop" onClick={closeModal} />
          <div className="order-modal">
            <span className="order-modal-icon">{modalConfig.icon}</span>
            <h3 className="order-modal-title">{modalConfig.title}</h3>
            <p className="order-modal-desc">{modalConfig.desc}</p>
            <div className="order-modal-actions">
              <button className="modal-cancel-btn" onClick={closeModal}>
                Tidak, Kembali
              </button>
              <button
                className={`modal-confirm-btn ${modalConfig.confirmClass}`}
                onClick={handleConfirm}
              >
                {modalConfig.confirmLabel}
              </button>
            </div>
          </div>
        </>
      )}

      <div className="order-history-container">
        {/* ── Header ── */}
        <div className="order-history-header">
          <button className="order-back-btn" onClick={() => navigate("/")}>
            ← Kembali
          </button>
          <div className="order-history-title">
            <p className="section-label">Riwayat Pesanan</p>
            <h1>📋 Pesanan Anda</h1>
            <p className="order-subtitle">Semua transaksi pembelian kopi Anda tercatat di sini.</p>
          </div>
        </div>

        {/* ── Toast ── */}
        {toast && (
          <div className={`order-toast order-toast--${toast.type}`}>
            {toast.text}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="order-loading">
            <div className="order-spinner"></div>
            <p>Memuat riwayat pesanan...</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && localOrders.length === 0 && (
          <div className="order-empty">
            <span className="order-empty-icon">📭</span>
            <h3>Belum Ada Pesanan</h3>
            <p>Anda belum pernah melakukan pemesanan. Jelajahi menu kami!</p>
            <button className="order-cta-btn" onClick={() => navigate("/")}>
              ☕ Jelajahi Menu
            </button>
          </div>
        )}

        {/* ── Orders list ── */}
        {!loading && localOrders.length > 0 && (
          <div className="order-list">
            {localOrders.map((order, index) => {
              const isProcessing = processingId === order.id;
              const canCancel    = order.status === "belum bayar";
              const canComplete  = order.status === "diproses";

              return (
                <div
                  className="order-card"
                  key={order.id}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* ── Card header ── */}
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
                        ? itemData.media_url[0] : itemData.media_url;
                      return (
                        <div className="order-item-row" key={orderItem.id || i}>
                          <div className="order-item-img">
                            <img
                              src={imageUrl || "https://via.placeholder.com/50x50?text=☕"}
                              alt={itemData.name || "Item"}
                              onError={(e) => { e.target.src = "https://via.placeholder.com/50x50?text=☕"; }}
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

                  {/* ── Footer: total + tombol aksi ── */}
                  <div className="order-card-footer">
                    <div className="order-footer-total">
                      <span className="order-total-label">Total Pembayaran</span>
                      <span className="order-total-amount">
                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Tombol aksi customer */}
                    <div className="order-action-btns">
                      {/* Batalkan — hanya saat 'belum bayar' */}
                        {canCancel && (
                          <>
                            <button
                              className="order-pay-btn"
                              onClick={() => handleRepay(order.id)}
                              disabled={isProcessing}
                              id={`repay-order-${order.id}`}
                            >
                              {isProcessing ? "⏳..." : "💳 Bayar Sekarang"}
                            </button>
                            <button
                              className="order-cancel-btn"
                              onClick={() => openModal(order.id, "cancel")}
                              disabled={isProcessing}
                              id={`cancel-order-${order.id}`}
                            >
                              {isProcessing ? "⏳..." : "❌ Batalkan"}
                            </button>
                          </>
                        )}

                      {/* Konfirmasi selesai — hanya saat 'diproses' */}
                      {canComplete && (
                        <button
                          className="order-complete-btn"
                          onClick={() => openModal(order.id, "complete")}
                          disabled={isProcessing}
                          id={`complete-order-${order.id}`}
                        >
                          {isProcessing ? "⏳ Memproses..." : "✅ Pesanan Selesai"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
