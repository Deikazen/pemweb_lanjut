// ============================================
// Cart.jsx  (Keranjang Belanja - Slide Drawer)
// → Drawer slide-in dari kanan
// → Menampilkan daftar item keranjang
// → Hapus item, hitung total, checkout
// → [UPDATED] Tombol +/- quantity per item
// → [UPDATED] API sekarang pakai token auth (tanpa userId param)
// → Dipakai di: LandingPage (via Navbar toggle)
// ============================================

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import "./Cart.css";

function Cart({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cartItems, getCart, addToCart, removeFromCart, checkoutOrder, verifyPayment, loading } = useApi();
  const [localCart, setLocalCart] = useState([]);
  const [message, setMessage] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  // [BARU] Track loading state per-item agar tombol +/- tidak spam
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const userId = localStorage.getItem("user_id");

  // Fetch cart data when drawer opens
  // [UPDATED] getCart() tidak perlu userId lagi — backend ambil dari token
  const fetchCart = useCallback(async () => {
    if (userId && isOpen) {
      const result = await getCart();
      if (result?.success) {
        setLocalCart(result.data);
      }
    }
  }, [userId, isOpen, getCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Update localCart when cartItems from hook changes
  useEffect(() => {
    if (cartItems.length >= 0) {
      setLocalCart(cartItems);
    }
  }, [cartItems]);

  // Handle remove item
  const handleRemove = async (cartItemId) => {
    const result = await removeFromCart(cartItemId);
    if (result.success) {
      setLocalCart(prev => prev.filter(item => item.id !== cartItemId));
      setMessage({ text: "Barang dihapus dari keranjang", type: "info" });
      window.dispatchEvent(new Event("cart-updated"));
      setTimeout(() => setMessage(null), 2500);
    }
  };

  // ══════════════════════════════════════════
  // [BARU] Handle update quantity (+/-)
  // Backend addToCart melakukan UPSERT: quantity dijumlahkan
  // quantity: +1 untuk tambah, -1 untuk kurangi
  // ══════════════════════════════════════════
  const handleUpdateQuantity = async (cartItem, delta) => {
    setUpdatingItemId(cartItem.id);

    // Jika mengurangi dan quantity sudah 1, hapus item
    if (delta < 0 && cartItem.quantity <= 1) {
      await handleRemove(cartItem.id);
      setUpdatingItemId(null);
      return;
    }

    const result = await addToCart({ itemId: cartItem.item_id, quantity: delta });
    if (result.success) {
      // Update localCart secara optimistic
      setLocalCart(prev =>
        prev.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
      );
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      setMessage({ text: "Gagal memperbarui quantity", type: "error" });
      setTimeout(() => setMessage(null), 2500);
    }
    setUpdatingItemId(null);
  };

  // Handle checkout → Open Midtrans Snap Payment Popup
  // Setelah Snap callback, panggil verifyPayment untuk update status di database
  const handleCheckout = async () => {
    if (!userId) return;
    const result = await checkoutOrder();

    if (!result.success) {
      setMessage({ text: "Gagal melakukan checkout. Coba lagi.", type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const snapToken = result.token;
    const orderId = result.order?.id; // Supabase order ID
    const midtransOrderId = orderId; // Untuk checkout pertama, order_id = Supabase ID

    // Jika tidak ada snap token (edge case), fallback ke redirect_url atau tampilkan error
    if (!snapToken) {
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }
      setMessage({ text: "Token pembayaran tidak tersedia.", type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Buka Midtrans Snap Payment Popup
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: async function (snapResult) {
          console.log("[Midtrans] Payment Success:", snapResult);
          // Verifikasi pembayaran ke backend → update status di database
          await verifyPayment(orderId, snapResult.order_id || midtransOrderId);
          setLocalCart([]);
          setCheckoutSuccess(true);
          setMessage({ text: "🎉 Pembayaran berhasil! Pesanan Anda sedang diproses.", type: "success" });
          window.dispatchEvent(new Event("cart-updated"));
        },
        onPending: async function (snapResult) {
          console.log("[Midtrans] Payment Pending:", snapResult);
          await verifyPayment(orderId, snapResult.order_id || midtransOrderId);
          setLocalCart([]);
          setCheckoutSuccess(true);
          setMessage({ text: "⏳ Menunggu pembayaran... Cek riwayat pesanan untuk status.", type: "info" });
          window.dispatchEvent(new Event("cart-updated"));
        },
        onError: async function (snapResult) {
          console.error("[Midtrans] Payment Error:", snapResult);
          await verifyPayment(orderId, snapResult.order_id || midtransOrderId);
          setMessage({ text: "❌ Pembayaran gagal. Silakan coba lagi dari riwayat pesanan.", type: "error" });
          setLocalCart([]);
          window.dispatchEvent(new Event("cart-updated"));
          setTimeout(() => setMessage(null), 4000);
        },
        onClose: function () {
          console.log("[Midtrans] Popup closed by user");
          // Verifikasi juga saat popup ditutup (mungkin user sudah bayar tapi tutup popup)
          verifyPayment(orderId, midtransOrderId);
          setMessage({ text: "💡 Pembayaran belum selesai. Anda bisa melanjutkan dari riwayat pesanan.", type: "info" });
          setLocalCart([]);
          window.dispatchEvent(new Event("cart-updated"));
          setTimeout(() => setMessage(null), 5000);
        },
      });
    } else {
      // Fallback jika Snap.js belum ter-load
      console.error("[Midtrans] Snap.js not loaded!");
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        setMessage({ text: "Snap.js belum ter-load. Coba refresh halaman.", type: "error" });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  // Calculate total price
  const totalPrice = localCart.reduce((sum, cartItem) => {
    const price = cartItem.items?.price || 0;
    return sum + (price * cartItem.quantity);
  }, 0);

  // Navigate to order history
  const goToOrders = () => {
    onClose();
    navigate("/orders");
  };

  // Reset checkout success when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setCheckoutSuccess(false);
      setMessage(null);
    }
  }, [isOpen]);

  return (
    <>
      {/* ── Backdrop overlay ── */}
      <div
        className={`cart-backdrop ${isOpen ? "cart-backdrop--visible" : ""}`}
        onClick={onClose}
      />

      {/* ── Drawer ── */}
      <div className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`}>
        {/* ── Header ── */}
        <div className="cart-header">
          <div className="cart-header-brand">
            <img
              src="/assets/logo/logo-bekmer.png"
              alt="Logo Kopi Bekmer 70"
              className="cart-header-logo"
            />

            <div>
              <p>Pesanan Kamu</p>
              <h2>KERANJANG BEKMER</h2>
            </div>
          </div>

          <button className="cart-close-btn" onClick={onClose} id="cart-close-btn">
            ✕
          </button>
        </div>

        {/* ── Message / Alert ── */}
        {message && (
          <div className={`cart-message cart-message--${message.type}`}>
            {message.text}
          </div>
        )}

        {/* ── Content ── */}
        <div className="cart-content">
          {/* Loading state */}
          {loading && localCart.length === 0 && (
            <div className="cart-empty">
              <div className="cart-spinner"></div>
              <p>Memuat keranjang...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && localCart.length === 0 && !checkoutSuccess && (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <h3>KERANJANG MASIH KOSONG</h3>
              <p>Pilih seduhan favoritmu dan tambahkan cerita baru hari ini.</p>
            </div>
          )}

          {/* Checkout success state */}
          {checkoutSuccess && localCart.length === 0 && (
            <div className="cart-empty cart-success-state">
              <span className="cart-empty-icon">🎉</span>
              <h3>Pesanan Berhasil!</h3>
              <p>Terima kasih! Pesanan Anda sedang diproses.</p>
              <button className="cart-orders-btn" onClick={goToOrders}>
                📋 Lihat Riwayat Pesanan
              </button>
            </div>
          )}

          {/* Cart items list */}
          {localCart.length > 0 && (
            <div className="cart-items-list">
              {localCart.map((cartItem) => {
                const itemData = cartItem.items || {};
                const imageUrl = Array.isArray(itemData.media_url)
                  ? itemData.media_url[0]
                  : itemData.media_url;
                const isUpdating = updatingItemId === cartItem.id;

                return (
                  <div className="cart-item" key={cartItem.id}>
                    <div className="cart-item-img">
                      <img
                        src={imageUrl || "/assets/logo/logo-bekmer.png"}
                        alt={itemData.name || "Item"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/assets/logo/logo-bekmer.png";
                        }}
                      />
                    </div>
                    <div className="cart-item-info">
                      <h4>{itemData.name || "Item tidak dikenal"}</h4>
                      <p className="cart-item-price">
                        Rp {Number(itemData.price || 0).toLocaleString('id-ID')}
                      </p>
                      {/* ══ [BARU] Tombol +/- Quantity ══ */}
                      <div className="cart-qty-controls">
                        <button
                          className="cart-qty-btn cart-qty-btn--minus"
                          onClick={() => handleUpdateQuantity(cartItem, -1)}
                          disabled={isUpdating}
                          title="Kurangi quantity"
                          id={`cart-qty-minus-${cartItem.id}`}
                        >
                          −
                        </button>
                        <span className="cart-qty-value">
                          {isUpdating ? "..." : cartItem.quantity}
                        </span>
                        <button
                          className="cart-qty-btn cart-qty-btn--plus"
                          onClick={() => handleUpdateQuantity(cartItem, 1)}
                          disabled={isUpdating}
                          title="Tambah quantity"
                          id={`cart-qty-plus-${cartItem.id}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <p className="cart-item-subtotal">
                        Rp {Number((itemData.price || 0) * cartItem.quantity).toLocaleString('id-ID')}
                      </p>
                      <button
                        className="cart-remove-btn"
                        onClick={() => handleRemove(cartItem.id)}
                        title="Hapus dari keranjang"
                        id={`cart-remove-${cartItem.id}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer with total + checkout ── */}
        {localCart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <strong>Rp {totalPrice.toLocaleString('id-ID')}</strong>
            </div>
            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={loading}
              id="cart-checkout-btn"
            >
              {loading ? "MEMPROSES..." : "CHECKOUT SEKARANG →"}
            </button>
            <button className="cart-orders-link" onClick={goToOrders}>
              LIHAT RIWAYAT PESANAN →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
