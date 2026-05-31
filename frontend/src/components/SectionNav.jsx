// ============================================
// SectionNav.jsx  (Sidebar Navigasi Cepat)
// → Navigasi anchor link ke section landing editor
// → Dipakai di: LandingEditor
// ============================================

import "./SectionNav.css";

const NAV_ITEMS = [
  { href: "#section-hero",     num: "1", icon: "🚀", label: "Hero" },
  { href: "#section-stats",    num: "2", icon: "📊", label: "Statistik" },
  { href: "#section-about",    num: "3", icon: "🌱", label: "Tentang Kami" },
  { href: "#section-features", num: "4", icon: "🛋️", label: "Keunggulan" },
  { href: "#section-contact",  num: "5", icon: "✉️", label: "Kontak & Footer" },
];

function SectionNav() {
  return (
    <aside className="landing-section-nav">
      <p className="section-nav-title">Navigasi Cepat</p>
      {NAV_ITEMS.map((item) => (
        <a key={item.href} href={item.href} className="section-nav-link">
          <span className="section-nav-num">{item.num}</span>
          <span>{item.icon} {item.label}</span>
        </a>
      ))}
    </aside>
  );
}

export default SectionNav;
