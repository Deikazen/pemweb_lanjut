import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function LandingPage() {
  const defaultItems = [
    {
      id: 1,
      name: "Siomay Ayam",
      media_url:
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700",
    },
    {
      id: 2,
      name: "Hakau",
      media_url:
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=700",
    },
    {
      id: 3,
      name: "Lumpia Dimsum",
      media_url:
        "https://images.unsplash.com/photo-1625938146369-adc83368b133?w=700",
    },
  ];

  return (
    <div className="app">
      <nav className="navbar">
        <h2>DimsumKu</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#menu">Menu</a>
          <a href="#contact">Contact</a>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-text">
          <span className="badge">Fresh • Homemade • Halal</span>

          <h1>Kenalan dengan DimsumKu</h1>

          <p>
            DimsumKu adalah landing page pengenalan produk dimsum rumahan.
            Website ini menampilkan informasi brand, keunggulan produk, dan
            preview menu dimsum.
          </p>

          <a href="#about" className="hero-btn">
            Lihat Selengkapnya
          </a>
        </div>

        <div className="hero-card">
          <img
            src="https://images.unsplash.com/photo-1563245372-f21724e3856d?w=900"
            alt="Dimsum"
          />
        </div>
      </section>

      <section className="about" id="about">
        <div className="section-title">
          <h2>Tentang DimsumKu</h2>
          <p>
            DimsumKu hadir sebagai media pengenalan produk dimsum yang praktis,
            enak, dan cocok untuk berbagai kalangan.
          </p>
        </div>

        <div className="about-content">
          <div>
            <h3>Kenapa Dimsum?</h3>
            <p>
              Dimsum memiliki rasa gurih, tekstur lembut, dan mudah dinikmati
              kapan saja. Website ini dibuat untuk memperkenalkan produk dimsum
              secara lebih modern.
            </p>
          </div>

          <div>
            <h3>Tujuan Website</h3>
            <p>
              Website ini menjadi landing page pengenalan brand. Admin dapat
              mengelola gambar atau menu yang tampil melalui halaman admin.
            </p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-title">
          <h2>Keunggulan Produk</h2>
          <p>Nilai utama yang ditampilkan dari DimsumKu.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Bahan Berkualitas</h3>
            <p>Menggunakan bahan pilihan agar rasa tetap enak.</p>
          </div>

          <div className="feature-card">
            <h3>Rasa Gurih</h3>
            <p>Cocok untuk camilan, acara kecil, atau teman santai.</p>
          </div>

          <div className="feature-card">
            <h3>Tampilan Modern</h3>
            <p>Produk diperkenalkan lewat website landing page.</p>
          </div>
        </div>
      </section>

      <section className="menu" id="menu">
        <div className="section-title">
          <h2>Preview Menu</h2>
          <p>
            Contoh varian dimsum yang ditampilkan di landing page. Data ini
            nantinya bisa dikelola oleh admin.
          </p>
        </div>

        <div className="menu-grid">
          {defaultItems.map((item) => (
            <div className="menu-card" key={item.id}>
              <img src={item.media_url} alt={item.name} />
              <h3>{item.name}</h3>
              <p>Varian dimsum yang cocok untuk camilan dan acara santai.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <h2>Informasi Kontak</h2>
        <p>
          Website ini dibuat sebagai landing page pengenalan produk DimsumKu.
        </p>

        <div className="contact-box">
          <p>Email: dimsumku@example.com</p>
          <p>Instagram: @dimsumku</p>
          <p>Lokasi: Bandung, Indonesia</p>
        </div>
      </section>

      <footer>
        <p>© 2026 DimsumKu. Landing Page Frontend React.</p>
      </footer>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [editId, setEditId] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const loginAdmin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showMessage(result.message || result.error || "Login gagal");
        return;
      }

      localStorage.setItem("token", result.token);
      setToken(result.token);
      showMessage("Login berhasil");
    } catch (error) {
      showMessage("Gagal konek ke backend");
    } finally {
      setLoading(false);
    }
  };

  const getItems = async () => {
    if (!token) {
      showMessage("Token tidak ada, silakan login ulang");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/item`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        showMessage(result.message || result.error || "Gagal mengambil data");
        return;
      }

      setItems(result.data || []);
    } catch (error) {
      showMessage("Backend belum jalan atau API error");
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async (e) => {
    e.preventDefault();

    if (!name || !mediaUrl) {
      showMessage("Nama item dan URL gambar wajib diisi");
      return;
    }

    const url = editId
      ? `${API_URL}/api/item/${editId}`
      : `${API_URL}/api/item`;

    const method = editId ? "PUT" : "POST";

    try {
      setLoading(true);

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          media_url: mediaUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showMessage(result.message || result.error || "Gagal menyimpan item");
        return;
      }

      setName("");
      setMediaUrl("");
      setEditId(null);
      showMessage(editId ? "Item berhasil diedit" : "Item berhasil ditambah");
      getItems();
    } catch (error) {
      showMessage("Gagal konek ke backend");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setName(item.name);
    setMediaUrl(item.media_url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus item ini?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/item/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        showMessage(result.message || result.error || "Gagal hapus item");
        return;
      }

      showMessage("Item berhasil dihapus");
      getItems();
    } catch (error) {
      showMessage("Gagal konek ke backend");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setItems([]);
    setEmail("");
    setPassword("");
    showMessage("Berhasil logout");
  };

  useEffect(() => {
    if (token) {
      getItems();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <button className="back-btn" onClick={() => navigate("/")}>
            ← Kembali ke Landing Page
          </button>

          <h1>Admin DimsumKu</h1>
          <p>Login untuk mengelola item/gambar landing page.</p>

          {message && <div className="alert">{message}</div>}

          <form onSubmit={loginAdmin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <nav className="admin-navbar">
        <div>
          <h2>Admin DimsumKu</h2>
          <span>Kelola data landing page dari backend</span>
        </div>

        <div className="admin-nav-actions">
          <button onClick={() => navigate("/")} className="dark-btn">
            Landing Page
          </button>

          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <main className="admin-container">
        {message && <div className="alert">{message}</div>}

        <section className="admin-form-section">
          <h2>
            {editId ? "Edit Item Landing Page" : "Tambah Item Landing Page"}
          </h2>

          <form onSubmit={saveItem} className="admin-form">
            <div>
              <label>Nama Item</label>
              <input
                type="text"
                placeholder="Contoh: Siomay Ayam"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label>URL Gambar</label>
              <input
                type="text"
                placeholder="https://..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading
                  ? "Menyimpan..."
                  : editId
                    ? "Update Item"
                    : "Tambah Item"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditId(null);
                    setName("");
                    setMediaUrl("");
                  }}
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-list-section">
          <div className="section-row">
            <h2>Data Item dari Backend</h2>
            <button onClick={getItems} className="dark-btn">
              Refresh
            </button>
          </div>

          {loading && <p className="loading-text">Loading data...</p>}

          <div className="admin-grid">
            {items.length === 0 && !loading ? (
              <div className="empty-card">
                <h3>Belum ada data</h3>
                <p>Tambahkan item pertama lewat form di atas.</p>
              </div>
            ) : (
              items.map((item) => (
                <div className="admin-item-card" key={item.id}>
                  <img
                    src={item.media_url}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x400?text=No+Image";
                    }}
                  />

                  <div className="admin-item-content">
                    <h3>{item.name}</h3>
                    <p>ID: {item.id}</p>

                    <div className="card-actions">
                      <button onClick={() => startEdit(item)}>Edit</button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteItem(item.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
