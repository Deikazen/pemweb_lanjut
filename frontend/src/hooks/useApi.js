// ============================================
// useApi.js  (Custom Hook)
// → Semua pemanggilan ke backend API
// → Dipakai di: LandingPage, AdminPage
// → Returns: { items, loading, error, getItems, saveItem, deleteItem, loginAdmin }
// ============================================

import { useState, useCallback } from "react";

const API_URL = process.env.NODE_ENV === "production"
  ? "" 
  : (process.env.REACT_APP_API_URL || "http://localhost:5000");

function useApi() {
  const [items, setItems] = useState([]);
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

  // ── POST / PUT item (tambah atau edit) ───
  const saveItem = useCallback(async ({ token, name, mediaUrl, editId }) => {
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
        body: JSON.stringify({ name, media_url: [mediaUrl] }),
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

  // ── POST login admin ──────────────────────
  const loginAdmin = useCallback(async ({ email, password }) => {
    console.log(`[useApi] POST /api/login | Target: ${API_URL}/api/login | Email: ${email}`);
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log(`[useApi] POST /api/login Status: ${res.status}`);
      const result = await res.json();
      console.log("[useApi] POST /api/login Result:", result);
      if (!res.ok) throw new Error(result.message || result.error || "Login gagal");
      return { success: true, token: result.token };
    } catch (err) {
      console.error("[useApi] POST /api/login Exception:", err);
      setError(err.message || "Gagal konek ke backend");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError("");

  return { items, loading, error, clearError, getItems, saveItem, deleteItem, loginAdmin };
}

export default useApi;
