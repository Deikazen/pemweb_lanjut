// ============================================
// LandingPage.jsx
// Landing page utama Kopi Bekmer 70
// → Data menu dari backend
// → Data landing page dapat diedit admin
// → Best Seller otomatis dari badge produk
// ============================================

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MenuCard from "../components/MenuCard";
import RevealSection from "../components/RevealSection";
import useApi from "../hooks/useApi";
import "./LandingPage.css";

// ── Fallback menu jika backend belum aktif ────────────────────────
const defaultItems = [
  {
    id: "fallback-menu-1",
    name: "Kopi Susu Gula Aren",
    price: 15000,
    media_url: "/assets/products/kopi-susu-gula-aren.jpg",
    description:
      "Perpaduan kopi arabika dan gula aren dengan karakter creamy, lembut, dan nyaman dinikmati.",
    badge: "BEST SELLER",
    tags: ["Milk Coffee"],
  },
  {
    id: "fallback-menu-2",
    name: "Bekmer Citrus'70",
    price: 15000,
    media_url: "/assets/products/bekmer-citrus-70.jpg",
    description:
      "Americano dengan lemon asli. Memberikan sensasi fresh, ringan, dan menyegarkan.",
    badge: "BEST SELLER",
    tags: ["Americano Series"],
  },
  {
    id: "fallback-menu-3",
    name: "Bekmer Creamy Drip",
    price: 15000,
    media_url: "/assets/products/bekmer-creamy-drip.jpg",
    description:
      "Kopi creamy dengan sentuhan butterscotch yang smooth, manis, dan aromatik.",
    badge: "BEST SELLER",
    tags: ["Signature Coffee"],
  },
  {
    id: "fallback-menu-4",
    name: "Matcha'70",
    price: 15000,
    media_url: "/assets/products/matcha-70.jpg",
    description:
      "Pure matcha dengan karakter lembut dan ringan untuk teman bersantai.",
    badge: "BEST SELLER",
    tags: ["Non Coffee"],
  },
];

// ── Fallback landing settings jika backend kosong ─────────────────
const defaultSettings = {
  hero_badge: "100% ARABIKA · KABUPATEN BANDUNG",
  hero_title: "DARI BIJI\nLAHIR CERITA.",
  hero_desc:
    "Seduhan kopi lokal dengan karakter yang lebih smooth dan nyaman dinikmati. Berawal dari motor bebek merah tahun 70-an, kini hadir membawa cerita di setiap cangkir.",
  hero_image: "/assets/logo/logo-bekmer.png",

  stat_variankopi: "40",
  stat_arabikaasli: "100",
  stat_ratingtamu: "5",

  about_badge: "EST. 2025",
  about_title: "BERAWAL DARI\nMOTOR BEBEK MERAH.",
  about_desc:
    "Kopi Bekmer 70 dirintis pada 28 September 2025. Awalnya, kami berjualan di atas motor bebek merah tua dan hanya beroperasi setiap akhir pekan. Memasuki awal tahun 2026, perjalanan ini berkembang menjadi coffee bar yang hadir setiap hari.",
  about_image: "/assets/logo/logo-bekmer.png",

  about_card1_title: "MOTOR BEBEK TAHUN 70-AN",
  about_card1_desc:
    "Nama Kopi Bekmer 70 terinspirasi dari motor kesayangan kami: bebek merah klasik tahun 70-an. Ikon tersebut menjadi identitas utama brand hingga diwujudkan dalam konsep bar seduh menggunakan motor roda tiga.",

  about_card2_title: "100% LOKAL KABUPATEN BANDUNG",
  about_card2_desc:
    "Kami menggunakan beans pilihan hasil petani Kabupaten Bandung. Tujuannya sederhana: mengenalkan bahwa kopi lokal Bandung memiliki potensi dan kualitas yang tidak kalah dari daerah lainnya.",

  feature1_icon: "☕",
  feature1_title: "ARABIKA LOKAL BANDUNG",
  feature1_desc:
    "Beans berasal dari petani Kabupaten Bandung untuk memperkenalkan kualitas kopi lokal yang tidak kalah dari daerah lainnya.",

  feature2_icon: "✦",
  feature2_title: "SMOOTH DAN NYAMAN",
  feature2_desc:
    "Arabika dipilih karena memiliki karakter rasa yang lebih ringan, smooth, dan nyaman untuk menemani aktivitas sehari-hari.",

  feature3_icon: "🏍",
  feature3_title: "BAR MOTOR RODA TIGA",
  feature3_desc:
    "Konsep bar seduh kopi menggunakan motor roda tiga menjadi identitas unik yang terinspirasi dari motor bebek merah tahun 70-an.",

  contact_email: "kopibekmer70@gmail.com",
  contact_instagram: "https://www.instagram.com/kopibekmer70",
  contact_location: "KABUPATEN BANDUNG",
  footer_text: "© 2026 KOPI BEKMER 70",

  contact_whatsapp: "6281313523326",
  operational_hours: "07.00–22.00",
  contact_tiktok: "https://www.tiktok.com/@kopi.bekmer.70",
  contact_facebook: "",
  maps_query: "Kopi Bekmer 70",
  menu_poster_image: "/assets/menu/menu-bekmer.png",
};

// ── Helper ─────────────────────────────────────────────────────────
const mergeSettings = (landingSettings) => {
  const merged = {
    ...defaultSettings,
    ...(landingSettings || {}),
  };

  Object.keys(defaultSettings).forEach((key) => {
    if (
      merged[key] === undefined ||
      merged[key] === null ||
      String(merged[key]).trim() === ""
    ) {
      merged[key] = defaultSettings[key];
    }
  });

  return merged;
};

const renderSplitTitle = (text) =>
  String(text || "")
    .split("\n")
    .map((line, index) => (
      <span
        key={`${line}-${index}`}
        className={index > 0 ? "bekmer-accent-line" : ""}
      >
        {line}
      </span>
    ));

const normalizeWhatsapp = (number) =>
  String(number || "").replace(/[^0-9]/g, "");

const displayWhatsapp = (number) => {
  const normalized = normalizeWhatsapp(number);

  if (normalized.startsWith("62")) {
    return `0${normalized.slice(2)}`;
  }

  return normalized;
};

// ── Komponen utama ─────────────────────────────────────────────────
function LandingPage() {
  const { items, landingSettings, getItems, getLandingSettings } = useApi();

  const [pageVisible, setPageVisible] = useState(false);

  useEffect(() => {
    getItems();
    getLandingSettings();

    const timeout = setTimeout(() => {
      setPageVisible(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, [getItems, getLandingSettings]);

  const settings = mergeSettings(landingSettings);

  const displayItems =
    Array.isArray(items) && items.length > 0 ? items : defaultItems;

  const databaseBestSellers = (Array.isArray(items) ? items : [])
    .filter((item) =>
      String(item.badge || "")
        .toLowerCase()
        .includes("best seller")
    )
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.tags?.[0] || "Menu Pilihan",
      image: Array.isArray(item.media_url)
        ? item.media_url[0]
        : item.media_url,
      description:
        item.description ||
        "Menu pilihan Kopi Bekmer 70 dengan karakter rasa yang nyaman dinikmati.",
      label: item.badge || "BEST SELLER",
    }));

  const fallbackBestSellers = defaultItems.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.tags?.[0] || "Menu Pilihan",
    image: item.media_url,
    description: item.description,
    label: item.badge || "BEST SELLER",
  }));

  const bestSellerItems =
    databaseBestSellers.length > 0
      ? databaseBestSellers
      : fallbackBestSellers;

  const whatsappNumber = normalizeWhatsapp(settings.contact_whatsapp);

  const mapsQuery =
    settings.maps_query ||
    settings.contact_location ||
    "Kopi Bekmer 70";

  return (
    <div className={`app ${pageVisible ? "fade-in" : ""}`}>
      {/* ── NAVBAR ──────────────────────────── */}
      <Navbar />

      {/* ── HERO ────────────────────────────── */}
      <section className="bekmer-hero" id="home">
        <div className="bekmer-hero-pattern" />

        <div className="bekmer-hero-content">
          <div className="bekmer-hero-copy">
            <p className="bekmer-eyebrow">
              {settings.hero_badge}
            </p>

            <h1>{renderSplitTitle(settings.hero_title)}</h1>

            <p className="bekmer-hero-desc">
              {settings.hero_desc}
            </p>

            <div className="bekmer-hero-actions">
              <a href="#menu" className="bekmer-btn-primary">
                PESAN SEKARANG
              </a>

              <a href="#about" className="bekmer-btn-outline">
                CERITA KAMI
              </a>
            </div>

            <div className="bekmer-hero-notes">
              <div>
                <strong>{settings.about_badge}</strong>
                <span>Dirintis dari motor bebek merah</span>
              </div>

              <div>
                <strong>{settings.operational_hours}</strong>
                <span>Buka setiap hari</span>
              </div>
            </div>
          </div>

          <div className="bekmer-hero-visual">
            <div className="bekmer-logo-card">
              <span className="bekmer-logo-small-text">
                KOPI LOKAL BANDUNG
              </span>

              <img
                src={settings.hero_image || "/assets/logo/logo-bekmer.png"}
                alt="Visual utama Kopi Bekmer 70"
                className="bekmer-hero-logo"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    "/assets/logo/logo-bekmer.png";
                }}
              />

              <span className="bekmer-logo-year">
                BEKMER · 70
              </span>
            </div>

            <div className="bekmer-sticker bekmer-sticker-top">
              ARABIKA
            </div>

            <div className="bekmer-sticker bekmer-sticker-bottom">
              SMOOTH & LOCAL
            </div>
          </div>
        </div>

        <div className="bekmer-marquee">
          <div className="bekmer-marquee-track">
            <span>KOPI BEKMER 70</span>
            <span>✦</span>
            <span>BEANS PILIHAN KABUPATEN BANDUNG</span>
            <span>✦</span>
            <span>DARI BIJI LAHIR CERITA</span>
            <span>✦</span>
            <span>KOPI BEKMER 70</span>
            <span>✦</span>
            <span>BEANS PILIHAN KABUPATEN BANDUNG</span>
          </div>
        </div>
      </section>

      {/* ── STATISTIK BRAND ─────────────────── */}
      <section className="bekmer-stat-strip">
        <div>
          <strong>{settings.stat_variankopi}+</strong>
          <span>VARIAN MENU</span>
        </div>

        <div>
          <strong>{settings.stat_arabikaasli}%</strong>
          <span>ARABIKA PILIHAN</span>
        </div>

        <div>
          <strong>{settings.stat_ratingtamu}/5</strong>
          <span>RATING TAMU</span>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────── */}
      <section className="bekmer-about" id="about">
        <div className="bekmer-about-header">
          <p className="section-label">
            CERITA KAMI · {settings.about_badge}
          </p>

          <h2>{renderSplitTitle(settings.about_title)}</h2>

          <p className="bekmer-about-lead">
            {settings.about_desc}
          </p>
        </div>

        <div className="bekmer-about-grid">
          <article className="bekmer-story-card bekmer-story-card-main">
            <div className="bekmer-card-number">01</div>

            <p className="bekmer-card-kicker">IKON BRAND</p>

            <h3>{settings.about_card1_title}</h3>

            <p>{settings.about_card1_desc}</p>

            <div className="bekmer-story-image-wrap">
              <img
                src={
                  settings.about_image ||
                  "/assets/logo/logo-bekmer.png"
                }
                alt="Cerita Kopi Bekmer 70"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    "/assets/logo/logo-bekmer.png";
                }}
              />
            </div>

            <div className="bekmer-card-tag">
              KLASIK · SEDERHANA · PENUH CERITA
            </div>
          </article>

          <article className="bekmer-story-card">
            <div className="bekmer-card-number">02</div>

            <p className="bekmer-card-kicker">BEANS PILIHAN</p>

            <h3>{settings.about_card2_title}</h3>

            <p>{settings.about_card2_desc}</p>
          </article>

          <article className="bekmer-story-card">
            <div className="bekmer-card-number">03</div>

            <p className="bekmer-card-kicker">
              KARAKTER SEDUHAN
            </p>

            <h3>LEBIH SMOOTH DAN NYAMAN</h3>

            <p>
              Arabika menjadi identitas utama Kopi Bekmer 70 karena
              memiliki karakter yang lebih ringan dan nyaman dinikmati.
              Untuk manual brew, tersedia juga pilihan robusta dan
              liberika.
            </p>
          </article>
        </div>

        <div className="bekmer-quote">
          <span>“</span>

          <div>
            <p>DARI BIJI LAHIR CERITA.</p>

            <small>
              Setiap cangkir bukan hanya tentang rasa, tetapi juga
              perjalanan, pengalaman, dan cerita yang tercipta di
              dalamnya.
            </small>
          </div>
        </div>
      </section>

      {/* ── BEST SELLER ─────────────────────── */}
      <section className="bekmer-best-seller" id="best-seller">
        <div className="bekmer-best-header">
          <div>
            <p className="section-label">MENU UNGGULAN</p>

            <h2>
              BEST SELLER
              <span>KOPI BEKMER 70.</span>
            </h2>
          </div>

          <p>
            Menu favorit yang mewakili karakter Kopi Bekmer 70:
            lokal, smooth, ringan, dan tetap punya cerita di setiap
            tegukan.
          </p>
        </div>

        <div className="bekmer-best-grid">
          {bestSellerItems.map((item, index) => (
            <article className="bekmer-product-card" key={item.id}>
              <div className="bekmer-product-image-wrap">
                <img
                  src={
                    item.image ||
                    "/assets/logo/logo-bekmer.png"
                  }
                  alt={item.name}
                  className="bekmer-product-image"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "/assets/logo/logo-bekmer.png";
                  }}
                />

                <span className="bekmer-product-label">
                  {item.label}
                </span>

                <span className="bekmer-product-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="bekmer-product-body">
                <p className="bekmer-product-category">
                  {item.category}
                </p>

                <h3>{item.name}</h3>

                <p className="bekmer-product-desc">
                  {item.description}
                </p>

                <a href="#menu" className="bekmer-product-link">
                  LIHAT MENU LENGKAP <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="bekmer-best-footer">
          <p>
            Masih banyak pilihan lainnya: manual brew, milk coffee,
            matcha, yakult, dan crumble series.
          </p>

          <a href="#menu">
            JELAJAHI SEMUA MENU →
          </a>
        </div>
      </section>

      {/* ── POSTER MENU ─────────────────────── */}
      <section className="bekmer-menu-poster" id="menu-poster">
        <div className="bekmer-menu-poster-header">
          <div>
            <p className="section-label">MENU LENGKAP</p>

            <h2>
              PILIH CERITA
              <span>DI SETIAP TEGUKAN.</span>
            </h2>
          </div>

          <div className="bekmer-menu-poster-intro">
            <p>
              Mulai dari black coffee, milk coffee, filter coffee,
              signature coffee, matcha, yakult, hingga crumble
              series. Temukan minuman yang paling cocok untuk
              menemani ceritamu hari ini.
            </p>

            <a href="#menu" className="bekmer-poster-order-btn">
              PESAN MENU ONLINE →
            </a>
          </div>
        </div>

        <div className="bekmer-menu-poster-frame">
          <div className="bekmer-menu-poster-topbar">
            <span>KOPI BEKMER 70</span>
            <span>100% ARABIKA · KABUPATEN BANDUNG</span>
            <span>{settings.about_badge}</span>
          </div>

          <img
            src={
              settings.menu_poster_image ||
              "/assets/menu/menu-bekmer.png"
            }
            alt="Daftar menu lengkap Kopi Bekmer 70"
            className="bekmer-menu-poster-image"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "/assets/menu/menu-bekmer.png";
            }}
          />

          <div className="bekmer-menu-poster-bottombar">
            <span>DARI BIJI LAHIR CERITA.</span>
            <span>
              BUKA SETIAP HARI · {settings.operational_hours}
            </span>
          </div>
        </div>
      </section>

      {/* ── KEUNGGULAN ──────────────────────── */}
      <section className="bekmer-values">
        <div className="bekmer-values-header">
          <div>
            <p className="section-label">
              KENAPA KOPI BEKMER 70?
            </p>

            <h2>
              BUKAN SEKADAR
              <span>NGOPI BIASA.</span>
            </h2>
          </div>

          <p>
            Kopi Bekmer 70 hadir dengan identitas lokal yang kuat,
            seduhan yang nyaman dinikmati, dan konsep bar kopi yang
            berbeda dari biasanya.
          </p>
        </div>

        <div className="bekmer-values-grid">
          <article className="bekmer-value-card">
            <span className="bekmer-value-number">01</span>

            <div className="bekmer-value-icon">
              {settings.feature1_icon}
            </div>

            <p className="bekmer-value-label">
              BEANS PILIHAN
            </p>

            <h3>{settings.feature1_title}</h3>

            <p>{settings.feature1_desc}</p>
          </article>

          <article className="bekmer-value-card">
            <span className="bekmer-value-number">02</span>

            <div className="bekmer-value-icon">
              {settings.feature2_icon}
            </div>

            <p className="bekmer-value-label">
              KARAKTER SEDUHAN
            </p>

            <h3>{settings.feature2_title}</h3>

            <p>{settings.feature2_desc}</p>
          </article>

          <article className="bekmer-value-card">
            <span className="bekmer-value-number">03</span>

            <div className="bekmer-value-icon">
              {settings.feature3_icon}
            </div>

            <p className="bekmer-value-label">
              IKON BRAND
            </p>

            <h3>{settings.feature3_title}</h3>

            <p>{settings.feature3_desc}</p>
          </article>

          <article className="bekmer-value-card">
            <span className="bekmer-value-number">04</span>

            <div className="bekmer-value-icon">♨</div>

            <p className="bekmer-value-label">
              PILIHAN SEDUHAN
            </p>

            <h3>TIDAK HANYA ARABIKA</h3>

            <p>
              Untuk manual brew, tersedia juga pilihan robusta dan
              liberika agar setiap pelanggan dapat menemukan
              karakter kopi favoritnya.
            </p>
          </article>
        </div>
      </section>

      {/* ── MENU ONLINE ─────────────────────── */}
      <RevealSection className="menu bekmer-order-menu" id="menu">
        <div className="bekmer-order-head">
          <div>
            <p className="section-label">PESAN ONLINE</p>

            <h2>
              PILIH MENU,
              <span>TAMBAHKAN KE KERANJANG.</span>
            </h2>
          </div>

          <div className="bekmer-order-intro">
            <p>
              Pilih menu favoritmu lalu tambahkan ke keranjang.
              Klik foto produk untuk melihat detail minuman sebelum
              melakukan pemesanan.
            </p>

            <div className="bekmer-order-info">
              <span>{displayItems.length} MENU TERSEDIA</span>
              <span>●</span>
              <span>
                BUKA {settings.operational_hours}
              </span>
            </div>
          </div>
        </div>

        <div className="menu-grid">
          {displayItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </RevealSection>

      {/* ── KONTAK ──────────────────────────── */}
      <section className="bekmer-contact" id="contact">
        <div className="bekmer-contact-header">
          <div>
            <p className="section-label">TEMUKAN KAMI</p>

            <h2>
              MAMPIR,
              <span>SEDIAP HARI.</span>
            </h2>
          </div>

          <p>
            Datang langsung ke coffee bar Kopi Bekmer 70 atau
            hubungi kami melalui WhatsApp. Nikmati seduhan lokal
            dengan cerita yang berbeda di setiap cangkirnya.
          </p>
        </div>

        <div className="bekmer-contact-layout">
          <div className="bekmer-contact-info">
            <article className="bekmer-contact-card bekmer-contact-card-main">
              <p className="bekmer-contact-kicker">
                LOKASI COFFEE BAR
              </p>

              <h3>KOPI BEKMER 70</h3>

              <p>
                {settings.contact_location}. Klik tombol di bawah
                untuk membuka petunjuk arah menuju coffee bar kami.
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  mapsQuery
                )}`}
                target="_blank"
                rel="noreferrer"
                className="bekmer-contact-button"
              >
                BUKA GOOGLE MAPS →
              </a>
            </article>

            <div className="bekmer-contact-small-grid">
              <article className="bekmer-contact-card">
                <p className="bekmer-contact-kicker">
                  JAM OPERASIONAL
                </p>

                <h3>{settings.operational_hours}</h3>

                <p>
                  Buka setiap hari untuk menemani cerita dan
                  aktivitasmu.
                </p>
              </article>

              <article className="bekmer-contact-card">
                <p className="bekmer-contact-kicker">
                  WHATSAPP
                </p>

                <h3>{displayWhatsapp(settings.contact_whatsapp)}</h3>

                <p>
                  Hubungi kami untuk informasi menu, pemesanan, atau
                  kolaborasi.
                </p>

                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bekmer-contact-text-link"
                >
                  CHAT WHATSAPP →
                </a>
              </article>
            </div>

            <article className="bekmer-social-card">
              <div>
                <p className="bekmer-contact-kicker">
                  MEDIA SOSIAL
                </p>

                <h3>IKUTI CERITA KAMI.</h3>
              </div>

              <div className="bekmer-social-links">
                <a
                  href={settings.contact_instagram || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram Kopi Bekmer 70"
                >
                  INSTAGRAM
                </a>

                <a
                  href={settings.contact_tiktok || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok Kopi Bekmer 70"
                >
                  TIKTOK
                </a>

                <a
                  href={settings.contact_facebook || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook Kopi Bekmer 70"
                >
                  FACEBOOK
                </a>

                <a
                  href={`mailto:${settings.contact_email}`}
                  aria-label="Email Kopi Bekmer 70"
                >
                  EMAIL
                </a>
              </div>
            </article>
          </div>

          <div className="bekmer-map-wrap">
            <div className="bekmer-map-topbar">
              <span>KOPI BEKMER 70</span>
              <span>{settings.contact_location}</span>
            </div>

            <iframe
              title="Lokasi Kopi Bekmer 70"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                mapsQuery
              )}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="bekmer-map-bottombar">
              <span>BUKA SETIAP HARI</span>
              <span>{settings.operational_hours}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────── */}
      <footer className="bekmer-footer">
        <div className="bekmer-footer-checker" />

        <div className="bekmer-footer-inner">
          <div className="bekmer-footer-brand">
            <img
              src="/assets/logo/logo-bekmer.png"
              alt="Logo Kopi Bekmer 70"
            />

            <div>
              <h3>KOPI BEKMER 70</h3>
              <p>DARI BIJI LAHIR CERITA.</p>
            </div>
          </div>

          <div className="bekmer-footer-links">
            <a href="#home">HOME</a>
            <a href="#about">CERITA KAMI</a>
            <a href="#best-seller">BEST SELLER</a>
            <a href="#menu-poster">MENU LENGKAP</a>
            <a href="#contact">KONTAK</a>
          </div>
        </div>

        <div className="bekmer-footer-bottom">
          <span>{settings.footer_text}</span>
          <span>BEANS PILIHAN KABUPATEN BANDUNG</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;