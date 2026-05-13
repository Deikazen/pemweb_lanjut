import "./App.css";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2>DimsumKu</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
        </div>
      </nav>

      <section className="hero" id="home">
        <div>
          <h1>Dimsum Enak, Harga Bersahabat</h1>
          <p>
            Aplikasi dummy frontend React untuk menampilkan menu dimsum, harga,
            dan tombol pemesanan.
          </p>
          <button>Pesan Sekarang</button>
        </div>
      </section>

      <section className="menu" id="menu">
        <h2>Menu Dimsum</h2>

        <div className="menu-list">
          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500"
              alt="Siomay"
            />
            <h3>Siomay</h3>
            <p>Dimsum ayam lembut dengan saus spesial.</p>
            <h4>Rp 15.000</h4>
            <button>Tambah</button>
          </div>

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500"
              alt="Hakau"
            />
            <h3>Hakau</h3>
            <p>Dimsum udang dengan kulit tipis dan kenyal.</p>
            <h4>Rp 18.000</h4>
            <button>Tambah</button>
          </div>

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1625938146369-adc83368b133?w=500"
              alt="Lumpia"
            />
            <h3>Lumpia Dimsum</h3>
            <p>Lumpia goreng renyah isi ayam dan sayuran.</p>
            <h4>Rp 12.000</h4>
            <button>Tambah</button>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <h2>Tentang DimsumKu</h2>
        <p>
          DimsumKu adalah tampilan frontend sederhana menggunakan React. Nanti
          halaman ini bisa dikembangkan menjadi aplikasi pemesanan makanan yang
          terhubung ke backend dan database.
        </p>
      </section>

      <footer>
        <p>© 2026 DimsumKu. Frontend React Project.</p>
      </footer>
    </div>
  );
}

export default App;
