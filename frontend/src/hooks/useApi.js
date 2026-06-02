// ============================================
// useApi.js  (Custom Hook)
// → Semua pemanggilan ke backend API
// → Dipakai di: LandingPage, AdminPage, Cart, OrderHistory
// → Returns: { items, loading, error, getItems, saveItem, deleteItem, loginUser, registerUser,
//              cartItems, getCart, addToCart, removeFromCart, orders, checkoutOrder, getOrders }
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
  // ══════════════════════════════════════════

  // ── GET isi keranjang user ────────────────
  const getCart = useCallback(async (userId) => {
    if (!userId) return;
    console.log(`[useApi] GET /api/cart | user_id: ${userId}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cart?user_id=${userId}`);
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
  const addToCart = useCallback(async ({ userId, itemId, quantity = 1 }) => {
    console.log(`[useApi] POST /api/cart | user_id: ${userId} | item_id: ${itemId} | qty: ${quantity}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, item_id: itemId, quantity }),
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
  const removeFromCart = useCallback(async (cartItemId) => {
    console.log(`[useApi] DELETE /api/cart/${cartItemId}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cart/${cartItemId}`, {
        method: "DELETE",
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
  const checkoutOrder = useCallback(async (userId) => {
    console.log(`[useApi] POST /api/orders/checkout | user_id: ${userId}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
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
  const getOrders = useCallback(async (userId) => {
    if (!userId) return;
    console.log(`[useApi] GET /api/orders | user_id: ${userId}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/orders?user_id=${userId}`);
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
    // Orders
    checkoutOrder,
    getOrders
  };
}

export default useApi;
