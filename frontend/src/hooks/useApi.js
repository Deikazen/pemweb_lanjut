// ============================================
// useApi.js  (Custom Hook)
// → Semua pemanggilan ke backend API
// → Dipakai di: LandingPage, AdminPage, Cart, OrderHistory
// → Returns: { items, loading, error, getItems, saveItem, deleteItem, loginUser, registerUser,
//              cartItems, getCart, addToCart, removeFromCart, orders, checkoutOrder, getOrders,
//              getAllOrders, updateOrderStatus }
// → [UPDATED] Cart & Order API sekarang pakai Authorization header
//   (backend verifyToken middleware, user_id dari JWT)
// ============================================

import { useState, useCallback } from "react";

const API_URL = process.env.NODE_ENV === "production"
  ? ""
  : "http://localhost:5000";

function useApi() {
  const [items, setItems] = useState([]);
  const [landingSettings, setLandingSettings] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── GET semua item menu ──────────────────
  const getItems = useCallback(async (token = null) => {
    try {
      setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log(`[useApi] GET /api/item | Target: ${API_URL}/api/item | Token:`, token ? "Ada" : "Tidak Ada");
      const res = await fetch(`${API_URL}/api/item`, { headers });
      console.log(`[useApi] GET /api/item Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] GET /api/item Result:", result);
      if (res.ok) {
        setItems(result.data || []);
      } else {
        const errorMsg = result.message || result.error || "Gagal mengambil data";
        console.error("[useApi] GET /api/item Error:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("[useApi] GET /api/item Exception:", err);
      setError("Backend belum jalan atau API error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── GET settings landing page ────────────
  const getLandingSettings = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`[useApi] GET /api/settings | Target: ${API_URL}/api/settings`);
      const res = await fetch(`${API_URL}/api/settings`);
      console.log(`[useApi] GET /api/settings Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] GET /api/settings Result:", result);
      if (res.ok) {
        setLandingSettings(result.settings);
        return { success: true, settings: result.settings };
      } else {
        const errorMsg = result.message || result.error || "Gagal mengambil settings";
        console.error("[useApi] GET /api/settings Error:", errorMsg);
        setError(errorMsg);
        return { success: false };
      }
    } catch (err) {
      console.error("[useApi] GET /api/settings Exception:", err);
      setError("Gagal mengambil settings dari backend");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── POST settings landing page (update) ──
  const saveLandingSettings = useCallback(async ({ token, settings }) => {
    console.log(`[useApi] POST /api/settings | Target: ${API_URL}/api/settings`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      });
      console.log(`[useApi] POST /api/settings Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] POST /api/settings Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Gagal menyimpan settings");
      setLandingSettings(settings);
      return { success: true };
    } catch (err) {
      console.error("[useApi] POST /api/settings Exception:", err);
      setError(err.message || "Gagal menyimpan settings ke backend");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── POST / PUT item (tambah atau edit) ───
  const saveItem = useCallback(async ({ token, name, price, mediaUrl, editId }) => {
    const url = editId ? `${API_URL}/api/item/${editId}` : `${API_URL}/api/item`;
    const method = editId ? "PUT" : "POST";
    console.log(`[useApi] ${method} ${url} | Name: ${name} | mediaUrl: ${mediaUrl}`);

    try {
      setLoading(true);
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, price, media_url: [mediaUrl] }),
      });
      console.log(`[useApi] ${method} Response Status: ${res.status}`);
      const result = await res.json();
      console.log(`[useApi] ${method} Result:`, result);
      if (!res.ok) throw new Error(result.message || result.error || "Gagal menyimpan");
      return { success: true };
    } catch (err) {
      console.error(`[useApi] ${method} Exception:`, err);
      setError(err.message || "Gagal konek ke backend");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── DELETE item ──────────────────────────
  const deleteItem = useCallback(async ({ token, id }) => {
    console.log(`[useApi] DELETE ${API_URL}/api/item/${id}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/item/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`[useApi] DELETE Response Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] DELETE Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Gagal hapus");
      return { success: true };
    } catch (err) {
      console.error("[useApi] DELETE Exception:", err);
      setError(err.message || "Gagal konek ke backend");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── POST login user (universal: admin & customer) ──
  const loginUser = useCallback(async ({ email, password }) => {
    console.log(`[useApi] POST /api/user/login | Target: ${API_URL}/api/user/login | Email: ${email}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log(`[useApi] POST /api/user/login Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] POST /api/user/login Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Login gagal");
      return {
        success: true,
        token: result.token,
        user: result.user || { email, role: 'customer', name: email }
      };
    } catch (err) {
      console.error("[useApi] POST /api/user/login Exception:", err);
      setError(err.message || "Gagal konek ke backend");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── POST register user baru ──────────────
  const registerUser = useCallback(async ({ name, email, password }) => {
    console.log(`[useApi] POST /api/user/register | Target: ${API_URL}/api/user/register | Email: ${email}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      console.log(`[useApi] POST /api/user/register Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] POST /api/user/register Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Registrasi gagal");
      return { success: true, message: result.message };
    } catch (err) {
      console.error("[useApi] POST /api/user/register Exception:", err);
      setError(err.message || "Gagal konek ke backend");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ══════════════════════════════════════════
  // CART API FUNCTIONS
  // → Backend menggunakan verifyToken middleware
  // → user_id diambil dari JWT token (req.user.id)
  // → Semua request WAJIB kirim Authorization header
  // ══════════════════════════════════════════

  // Helper: ambil token dari localStorage
  const getToken = () => localStorage.getItem("token");

  // ── GET isi keranjang user ────────────────
  // [UPDATED] Backend sekarang pakai verifyToken, user_id dari req.user.id
  // Tidak perlu kirim user_id di query param lagi
  const getCart = useCallback(async () => {
    const token = getToken();
    if (!token) return { success: false };
    console.log(`[useApi] GET /api/cart (auth via token)`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`[useApi] GET /api/cart Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] GET /api/cart Result:", result);
      if (res.ok) {
        setCartItems(result.data || []);
        return { success: true, data: result.data || [] };
      } else {
        const errorMsg = result.message || result.error || "Gagal mengambil keranjang";
        console.error("[useApi] GET /api/cart Error:", errorMsg);
        setError(errorMsg);
        return { success: false };
      }
    } catch (err) {
      console.error("[useApi] GET /api/cart Exception:", err);
      setError("Gagal mengambil data keranjang");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── POST tambah barang ke keranjang ───────
  // [UPDATED] Backend pakai verifyToken; user_id dari token, body cukup { item_id, quantity }
  // Backend melakukan UPSERT: jika item sudah ada, quantity dijumlahkan
  const addToCart = useCallback(async ({ itemId, quantity = 1 }) => {
    const token = getToken();
    if (!token) return { success: false };
    console.log(`[useApi] POST /api/cart | item_id: ${itemId} | qty: ${quantity}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ item_id: itemId, quantity }),
      });
      console.log(`[useApi] POST /api/cart Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] POST /api/cart Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Gagal menambahkan ke keranjang");
      return { success: true, message: result.message };
    } catch (err) {
      console.error("[useApi] POST /api/cart Exception:", err);
      setError(err.message || "Gagal menambahkan ke keranjang");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── DELETE hapus item dari keranjang ──────
  // [UPDATED] Kirim Authorization header; param /:id = cart_items.id (BUKAN item_id)
  const removeFromCart = useCallback(async (cartItemId) => {
    const token = getToken();
    if (!token) return { success: false };
    console.log(`[useApi] DELETE /api/cart/${cartItemId}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cart/${cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`[useApi] DELETE /api/cart Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] DELETE /api/cart Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Gagal menghapus dari keranjang");
      return { success: true };
    } catch (err) {
      console.error("[useApi] DELETE /api/cart Exception:", err);
      setError(err.message || "Gagal menghapus dari keranjang");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ══════════════════════════════════════════
  // ORDER API FUNCTIONS
  // ══════════════════════════════════════════

  // ── POST checkout pesanan ─────────────────
  // [UPDATED] Backend pakai verifyToken; user_id dari token
  const checkoutOrder = useCallback(async () => {
    const token = getToken();
    if (!token) return { success: false };
    console.log(`[useApi] POST /api/orders/checkout (auth via token)`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      console.log(`[useApi] POST /api/orders/checkout Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] POST /api/orders/checkout Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Gagal melakukan checkout");
      setCartItems([]); // Kosongkan keranjang di state setelah checkout sukses
      return { success: true, order: result.order_summary, message: result.message };
    } catch (err) {
      console.error("[useApi] POST /api/orders/checkout Exception:", err);
      setError(err.message || "Gagal melakukan checkout");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── GET riwayat pesanan user ──────────────
  // [UPDATED] Backend pakai verifyToken; user_id dari token
  const getOrders = useCallback(async () => {
    const token = getToken();
    if (!token) return { success: false };
    console.log(`[useApi] GET /api/orders (auth via token)`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`[useApi] GET /api/orders Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] GET /api/orders Result:", result);
      if (res.ok) {
        setOrders(result.data || []);
        return { success: true, data: result.data || [] };
      } else {
        const errorMsg = result.message || result.error || "Gagal mengambil riwayat pesanan";
        console.error("[useApi] GET /api/orders Error:", errorMsg);
        setError(errorMsg);
        return { success: false };
      }
    } catch (err) {
      console.error("[useApi] GET /api/orders Exception:", err);
      setError("Gagal mengambil riwayat pesanan");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ══════════════════════════════════════════
  // ADMIN ORDER API FUNCTIONS (BARU)
  // ══════════════════════════════════════════

  // ── GET semua pesanan (Admin) ─────────────
  const getAllOrders = useCallback(async () => {
    const token = getToken();
    if (!token) return { success: false };
    console.log(`[useApi] GET /api/orders/all (admin)`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`[useApi] GET /api/orders/all Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] GET /api/orders/all Result:", result);
      if (res.ok) {
        return { success: true, data: result.data || [] };
      } else {
        const errorMsg = result.message || result.error || "Gagal mengambil semua pesanan";
        console.error("[useApi] GET /api/orders/all Error:", errorMsg);
        setError(errorMsg);
        return { success: false };
      }
    } catch (err) {
      console.error("[useApi] GET /api/orders/all Exception:", err);
      setError("Gagal mengambil semua pesanan");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── PUT update status pesanan (Admin) ─────
  // Pilihan status: belum bayar, diproses, selesai, dibatalkan
  const updateOrderStatus = useCallback(async (orderId, status) => {
    const token = getToken();
    if (!token) return { success: false };
    console.log(`[useApi] PUT /api/orders/${orderId}/status | status: ${status}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      console.log(`[useApi] PUT /api/orders/status Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] PUT /api/orders/status Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Gagal mengubah status pesanan");
      return { success: true, data: result.data };
    } catch (err) {
      console.error("[useApi] PUT /api/orders/status Exception:", err);
      setError(err.message || "Gagal mengubah status pesanan");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── PUT batalkan pesanan (Customer) ─────
  // Hanya bisa jika status masih 'belum bayar'
  const cancelOrder = useCallback(async (orderId) => {
    const token = getToken();
    if (!token) return { success: false };
    console.log(`[useApi] PUT /api/orders/${orderId}/cancel`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`[useApi] PUT /api/orders/cancel Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] PUT /api/orders/cancel Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Gagal membatalkan pesanan");
      return { success: true, data: result.data };
    } catch (err) {
      console.error("[useApi] PUT /api/orders/cancel Exception:", err);
      setError(err.message || "Gagal membatalkan pesanan");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── PUT konfirmasi pesanan selesai (Customer) ──
  // Hanya bisa jika status 'diproses'
  const completeOrder = useCallback(async (orderId) => {
    const token = getToken();
    if (!token) return { success: false };
    console.log(`[useApi] PUT /api/orders/${orderId}/complete`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders/${orderId}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`[useApi] PUT /api/orders/complete Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] PUT /api/orders/complete Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Gagal mengkonfirmasi pesanan");
      return { success: true, data: result.data };
    } catch (err) {
      console.error("[useApi] PUT /api/orders/complete Exception:", err);
      setError(err.message || "Gagal mengkonfirmasi pesanan");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError("");

  return {
    items,
    landingSettings,
    cartItems,
    orders,
    loading,
    error,
    clearError,
    getItems,
    getLandingSettings,
    saveLandingSettings,
    saveItem,
    deleteItem,
    loginUser,
    registerUser,
    // Cart
    getCart,
    addToCart,
    removeFromCart,
    // Orders (Customer)
    checkoutOrder,
    getOrders,
    cancelOrder,
    completeOrder,
    // Orders (Admin) — BARU
    getAllOrders,
    updateOrderStatus
  };
}

export default useApi;
