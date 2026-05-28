// ============================================
// LandingPage.jsx  (Halaman Utama / /)
// → Landing page KopiNara — Cafe Kopi Modern & Cozy
// → Sections: Hero, About, Features, Menu, Contact, Footer
// → Interaksi:
//     · Parallax floating particles di hero
//     · Animated number counter saat scroll
//     · Reveal animasi section saat masuk viewport
//     · Hover efek kartu & tombol
//     · Navbar glassmorphism saat scroll
// → Data menu: dari backend via useApi (fallback ke defaultItems)
// ============================================

import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import MenuCard from "../components/MenuCard";
import useApi from "../hooks/useApi";
import "./LandingPage.css";

// ── Data placeholder jika backend belum aktif ──────────────────────
const defaultItems = [
  {
    id: 1,
    name: "Signature Espresso",
    price: 28000,
    media_url: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=700",
  },
  {
    id: 2,
    name: "Caramel Latte",
    price: 32000,
    media_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=700",
  },
  {
    id: 3,
    name: "Matcha Cold Brew",
    price: 35000,
    media_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700",
  },
];

// ── Custom hook: animasi angka naik dari 0 ke target ──────────────
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ── Partikel mengambang (dekorasi hero) ───────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size:  4 + Math.random() * 10,
    left:  Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 10,
    opacity: 0.08 + Math.random() * 0.18,
  }));

  return (
    <div className="particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width:  p.size,
            height: p.size,
            left:   `${p.left}%`,
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ── Komponen section yang reveal saat masuk viewport ──────────────
function RevealSection({ children, className, id }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`${className} ${visible ? "section--visible" : "section--hidden"}`}
      id={id}
    >
      {children}
    </section>
  );
}

// ── Komponen stat dengan animated counter ─────────────────────────
function StatCounter({ value, label, suffix = "" }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, 1600, started);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-stat" ref={ref}>
      <strong>{count}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

const defaultSettings = {
  hero_badge: "☕ Artisan · Cozy · Soulful",
  hero_title: "Tempat Kopi\nyang Bikin Betah",
  hero_desc: "KopiNara hadir untuk mereka yang menghargai kopi berkualitas, suasana hangat, dan momen tenang di tengah hari yang sibuk.",
  hero_image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900",
  stat_variankopi: "40",
  stat_arabikaasli: "100",
  stat_ratingtamu: "5",
  about_image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800",
  about_badge: "Est. 2022",
  about_title: "Dibuat dengan Hati, Diseduh dengan Cinta",
  about_desc: "KopiNara lahir dari kecintaan mendalam terhadap kopi yang sesungguhnya — bukan sekadar minuman, melainkan sebuah pengalaman. Kami memilih biji kopi terbaik dari petani lokal dan menyeduhnya dengan teknik artisan.",
  about_card1_title: "🌱 Kenapa Kopi Kami?",
  about_card1_desc: "Dipetik dari kebun pilihan, dipanggang segar, dan diseduh barista berpengalaman setiap hari.",
  about_card2_title: "🌐 Tujuan Website",
  about_card2_desc: "Landing page ini menampilkan brand KopiNara. Admin dapat mengelola menu via halaman admin.",
  feature1_icon: "☕",
  feature1_title: "Biji Pilihan Terbaik",
  feature1_desc: "Arabika single origin dari petani lokal — fresh roast setiap minggu, rasa selalu konsisten.",
  feature2_icon: "✨",
  feature2_title: "Racikan Barista Ahli",
  feature2_desc: "Setiap minuman dibuat oleh barista terlatih dengan teknik pour-over, espresso, dan cold brew.",
  feature3_icon: "🛋️",
  feature3_title: "Suasana Cozy & Hangat",
  feature3_desc: "Desain interior yang nyaman dengan pencahayaan hangat — tempat ideal untuk kerja atau bersantai.",
  contact_email: "kopinara@example.com",
  contact_instagram: "@kopinara.id",
  contact_location: "Bandung, Indonesia",
  footer_text: "© 2026 KopiNara · Landing Page Frontend React"
};

// ── Komponen utama LandingPage ─────────────────────────────────────
function LandingPage() {
  const { items, landingSettings, getItems, getLandingSettings } = useApi();
  const [pageVisible, setPageVisible] = useState(false);

  useEffect(() => {
    getItems();
    getLandingSettings();
    // Fade-in seluruh halaman saat mount
    setTimeout(() => setPageVisible(true), 50);
  }, [getItems, getLandingSettings]);

  const displayItems = items.length > 0 ? items : defaultItems;
  const settings = landingSettings || defaultSettings;

  return (
    <div className={`app ${pageVisible ? "fade-in" : ""}`}>

      {/* ── NAVBAR ──────────────────────────── */}
      <Navbar />

      {/* ── HERO ────────────────────────────── */}
      <section className="hero" id="home">
        <FloatingParticles />

        <div className="hero-text">
          <div className="hero-badge">{settings.hero_badge}</div>

          <h1 style={{ whiteSpace: "pre-line" }}>
            {settings.hero_title}
          </h1>

          <p className="hero-desc">
            {settings.hero_desc}
          </p>

          <div className="hero-actions">
            <a href="#menu" className="btn-primary">Jelajahi Menu</a>
            <a href="#about" className="btn-ghost">Cerita Kami →</a>
          </div>
        </div>

        {/* ── Gambar hero + stats ── */}
        <div className="hero-visual">
          <div className="hero-img-frame">
            <img
              src={settings.hero_image}
              alt="Suasana Kafe KopiNara"
            />
            <div className="hero-img-glow" />
          </div>

          <div className="hero-stats">
            <StatCounter value={parseInt(settings.stat_variankopi) || 0}  suffix="+" label="Varian Kopi" />
            <StatCounter value={parseInt(settings.stat_arabikaasli) || 0} suffix="%" label="Arabika Asli" />
            <StatCounter value={parseInt(settings.stat_ratingtamu) || 0}   suffix="★" label="Rating Tamu" />
          </div>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────── */}
      <RevealSection className="about" id="about">
        <div className="about-inner">
          <div className="about-img">
            <img
              src={settings.about_image}
              alt="Interior KopiNara"
            />
            <div className="about-img-badge">{settings.about_badge}</div>
          </div>

          <div className="about-text">
            <p className="section-label">Tentang Kami</p>
            <h2>{settings.about_title}</h2>
            <p>
              {settings.about_desc}
            </p>

            <div className="about-cards">
              <div className="about-card">
                <h3>{settings.about_card1_title}</h3>
                <p>{settings.about_card1_desc}</p>
              </div>
              <div className="about-card">
                <h3>{settings.about_card2_title}</h3>
                <p>{settings.about_card2_desc}</p>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ── FEATURES ────────────────────────── */}
      <RevealSection className="features">
        <p className="section-label" style={{ textAlign: "center", marginBottom: 12 }}>
          Keunggulan
        </p>
        <h2 className="features-title">Mengapa Memilih KopiNara?</h2>
        <p className="features-sub">Nilai utama yang kami jaga di setiap cangkir.</p>

        <div className="feature-grid">
          {[
            { icon: settings.feature1_icon, title: settings.feature1_title, desc: settings.feature1_desc },
            { icon: settings.feature2_icon, title: settings.feature2_title, desc: settings.feature2_desc },
            { icon: settings.feature3_icon, title: settings.feature3_title, desc: settings.feature3_desc },
          ].map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ── MENU ────────────────────────────── */}
      <RevealSection className="menu" id="menu">
        <div className="section-head">
          <p className="section-label">Preview Menu</p>
          <h2>Menu Andalan Kami</h2>
          <p>Data menu diambil langsung dari database via backend.</p>
        </div>

        <div className="menu-grid">
          {displayItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </RevealSection>

      {/* ── CONTACT ─────────────────────────── */}
      <RevealSection className="contact" id="contact">
        <div className="section-head">
          <p className="section-label">Hubungi Kami</p>
          <h2>Ada Pertanyaan?</h2>
          <p>Kami senang mendengar dari Anda.</p>
        </div>

        <div className="contact-box">
          {[
            { icon: "✉️", text: settings.contact_email },
            { icon: "📸", text: settings.contact_instagram },
            { icon: "📍", text: settings.contact_location },
          ].map((row, i) => (
            <div className="contact-row" key={i}>
              <span className="contact-row-icon">{row.icon}</span>
              {row.text}
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ── FOOTER ──────────────────────────── */}
      <footer className="footer">
        {settings.footer_text}
      </footer>

    </div>
  );
}

export default LandingPage;
