// ============================================
// SectionNav.jsx
// Navigasi cepat editor landing page Bekmer 70
// ============================================

import "./SectionNav.css";

const NAV_ITEMS = [
  { href: "#section-hero", num: "01", label: "Hero Utama" },
  { href: "#section-stats", num: "02", label: "Statistik Brand" },
  { href: "#section-about", num: "03", label: "Cerita Kami" },
  { href: "#section-features", num: "04", label: "Keunggulan" },
  { href: "#section-contact", num: "05", label: "Kontak & Footer" },
];

function SectionNav() {
  return (
    <aside className="landing-section-nav">
      <p className="section-nav-title">NAVIGASI CEPAT</p>

      <div className="section-nav-links">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="section-nav-link">
            <span className="section-nav-num">{item.num}</span>
            <span className="section-nav-label">{item.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

export default SectionNav;