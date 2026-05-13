const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login gagal');
    return data;
  },

  async getItems(token) {
    const res = await fetch(`${BASE_URL}/api/item`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengambil data');
    return data.data;
  },

  async createItem(token, { name, media_url }) {
    const res = await fetch(`${BASE_URL}/api/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, media_url }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat item');
    return data.data;
  },

  async updateItem(token, id, { name, media_url }) {
    const res = await fetch(`${BASE_URL}/api/item/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, media_url }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal update item');
    return data.data;
  },

  async deleteItem(token, id) {
    const res = await fetch(`${BASE_URL}/api/item/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus item');
    return data;
  },
};
