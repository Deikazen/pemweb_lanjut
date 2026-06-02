// ============================================
// Cart.jsx  (Keranjang Belanja - Slide Drawer)
// → Drawer slide-in dari kanan
// → Menampilkan daftar item keranjang
// → Hapus item, hitung total, checkout
// → Dipakai di: LandingPage (via Navbar toggle)
// ============================================

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import "./Cart.css";

function Cart({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cartItems, getCart, removeFromCart, checkoutOrder, loading } = useApi();
  const [localCart, setLocalCart] = useState([]);
  const [message, setMessage] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const userId = localStorage.getItem("user_id");

  // Fetch cart data when drawer opens
  const fetchCart = useCallback(async () => {
    if (userId && isOpen) {
      const result = await getCart(userId);
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

  // Handle checkout
  const handleCheckout = async () => {
    if (!userId) return;
    const result = await checkoutOrder(userId);
    if (result.success) {
      setLocalCart([]);
      setCheckoutSuccess(true);
      setMessage({ text: "🎉 Checkout berhasil! Pesanan Anda sedang diproses.", type: "success" });
      window.dispatchEvent(new Event("cart-updated"));
    } else {
      setMessage({ text: "Gagal melakukan checkout. Coba lagi.", type: "error" });
      setTimeout(() => setMessage(null), 3000);
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
          <h2>🛒 Keranjang</h2>
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
              <h3>Keranjang Kosong</h3>
              <p>Belum ada barang di keranjang Anda. Jelajahi menu dan tambahkan kopi favorit!</p>
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

                return (
                  <div className="cart-item" key={cartItem.id}>
                    <div className="cart-item-img">
                      <img
                        src={imageUrl || "https://via.placeholder.com/80x80?text=☕"}
                        alt={itemData.name || "Item"}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x80?text=☕";
                        }}
                      />
                    </div>
                    <div className="cart-item-info">
                      <h4>{itemData.name || "Item tidak dikenal"}</h4>
                      <p className="cart-item-price">
                        Rp {Number(itemData.price || 0).toLocaleString('id-ID')}
                      </p>
                      <span className="cart-item-qty">Qty: {cartItem.quantity}</span>
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
              {loading ? "⏳ Memproses..." : "💳 Checkout Sekarang"}
            </button>
            <button className="cart-orders-link" onClick={goToOrders}>
              📋 Lihat Riwayat Pesanan
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
