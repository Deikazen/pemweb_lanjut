// ============================================
// LandingEditor.jsx  (Editor Landing Page)
// → Form CRUD semua section landing page
// → Sections: Hero, Statistik, About, Keunggulan, Kontak
// → Sidebar navigasi cepat (SectionNav)
// → Sticky save bar di bawah
// → Dipakai di: AdminPage → Tab Edit Landing Page
// ============================================

import SectionNav from "./SectionNav";
import ImageUpload from "./ImageUpload";
import "./LandingEditor.css";

function LandingEditor({ settingsForm, onFieldChange, onSubmit, loading }) {
  // Helper untuk update satu field
  const updateField = (field, value) => {
    onFieldChange({ ...settingsForm, [field]: value });
  };

  return (
    <div className="tab-panel">
      <div className="landing-editor-header">
        <h2>✨ Edit Komponen Landing Page</h2>
        <p>Kelola tulisan, gambar, angka statistik, dan seluruh komponen landing page langsung dari database.</p>
      </div>

      <div className="landing-editor-layout">

        {/* SIDEBAR NAVIGASI CEPAT */}
        <SectionNav />

        {/* FORM UTAMA */}
        <form onSubmit={onSubmit} className="admin-settings-form">

          {/* ═══ SECTION 1: HERO ═══ */}
          <fieldset className="settings-fieldset" id="section-hero">
            <legend><span className="fieldset-num">1</span>🚀 Section Hero (Tampilan Utama)</legend>

            <div className="settings-grid-2">
              <div className="field-group">
                <label>Badge Hero</label>
                <input
                  type="text"
                  value={settingsForm.hero_badge}
                  onChange={(e) => updateField("hero_badge", e.target.value)}
                />
              </div>

              <div className="field-group field-group--span2">
                <label>Judul Hero (Gunakan baris baru untuk memotong teks)</label>
                <textarea
                  rows="3"
                  value={settingsForm.hero_title}
                  onChange={(e) => updateField("hero_title", e.target.value)}
                />
              </div>

              <div className="field-group field-group--span2">
                <label>Deskripsi Hero</label>
                <textarea
                  rows="4"
                  value={settingsForm.hero_desc}
                  onChange={(e) => updateField("hero_desc", e.target.value)}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Gambar Utama Hero</label>
              <ImageUpload
                id="hero-file-upload"
                value={settingsForm.hero_image}
                onChange={(val) => updateField("hero_image", val)}
                showPreview={true}
                previewAlt="Hero preview"
                onClear={() => updateField("hero_image", "")}
              />
            </div>
          </fieldset>

          {/* ═══ SECTION 2: STATISTIK ═══ */}
          <fieldset className="settings-fieldset" id="section-stats">
            <legend><span className="fieldset-num">2</span>📊 Angka Statistik</legend>

            <div className="stats-cards-grid">
              <div className="stat-input-card">
                <span className="stat-input-card__emoji">☕</span>
                <div className="field-group">
                  <label>Varian Kopi</label>
                  <input
                    type="number"
                    value={settingsForm.stat_variankopi}
                    onChange={(e) => updateField("stat_variankopi", e.target.value)}
                  />
                </div>
              </div>

              <div className="stat-input-card">
                <span className="stat-input-card__emoji">🌿</span>
                <div className="field-group">
                  <label>Arabika Asli (%)</label>
                  <input
                    type="number"
                    value={settingsForm.stat_arabikaasli}
                    onChange={(e) => updateField("stat_arabikaasli", e.target.value)}
                  />
                </div>
              </div>

              <div className="stat-input-card">
                <span className="stat-input-card__emoji">⭐</span>
                <div className="field-group">
                  <label>Rating Tamu (1–5)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settingsForm.stat_ratingtamu}
                    onChange={(e) => updateField("stat_ratingtamu", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* ═══ SECTION 3: ABOUT ═══ */}
          <fieldset className="settings-fieldset" id="section-about">
            <legend><span className="fieldset-num">3</span>🌱 Cerita & Tentang Kami</legend>

            <div className="settings-grid-2">
              <div className="field-group">
                <label>Badge (Tahun Berdiri)</label>
                <input
                  type="text"
                  value={settingsForm.about_badge}
                  onChange={(e) => updateField("about_badge", e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>Judul About</label>
                <input
                  type="text"
                  value={settingsForm.about_title}
                  onChange={(e) => updateField("about_title", e.target.value)}
                />
              </div>

              <div className="field-group field-group--span2">
                <label>Deskripsi About</label>
                <textarea
                  rows="4"
                  value={settingsForm.about_desc}
                  onChange={(e) => updateField("about_desc", e.target.value)}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Gambar Section About</label>
              <ImageUpload
                id="about-file-upload"
                value={settingsForm.about_image}
                onChange={(val) => updateField("about_image", val)}
                showPreview={true}
                previewAlt="About preview"
                onClear={() => updateField("about_image", "")}
              />
            </div>

            <div className="about-cards-grid">
              <div className="about-card-editor">
                <h4 className="about-card-editor__title">📌 Kartu Kiri — Kenapa Kami</h4>
                <div className="field-group">
                  <label>Judul Kartu</label>
                  <input
                    type="text"
                    value={settingsForm.about_card1_title}
                    onChange={(e) => updateField("about_card1_title", e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label>Deskripsi</label>
                  <textarea
                    rows="3"
                    value={settingsForm.about_card1_desc}
                    onChange={(e) => updateField("about_card1_desc", e.target.value)}
                  />
                </div>
              </div>

              <div className="about-card-editor">
                <h4 className="about-card-editor__title">📌 Kartu Kanan — Tujuan</h4>
                <div className="field-group">
                  <label>Judul Kartu</label>
                  <input
                    type="text"
                    value={settingsForm.about_card2_title}
                    onChange={(e) => updateField("about_card2_title", e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label>Deskripsi</label>
                  <textarea
                    rows="3"
                    value={settingsForm.about_card2_desc}
                    onChange={(e) => updateField("about_card2_desc", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* ═══ SECTION 4: FEATURES ═══ */}
          <fieldset className="settings-fieldset" id="section-features">
            <legend><span className="fieldset-num">4</span>🛋️ Keunggulan (3 Poin Utama)</legend>

            <div className="features-cards-grid">
              {[1, 2, 3].map((n) => (
                <div className="feature-card-editor" key={n}>
                  <div className="feature-card-editor__header">
                    <span className="feature-card-editor__num">Keunggulan {n}</span>
                    <div className="field-group field-group--icon">
                      <label>Icon</label>
                      <input
                        type="text"
                        value={settingsForm[`feature${n}_icon`]}
                        onChange={(e) => updateField(`feature${n}_icon`, e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="field-group">
                    <label>Judul</label>
                    <input
                      type="text"
                      value={settingsForm[`feature${n}_title`]}
                      onChange={(e) => updateField(`feature${n}_title`, e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label>Deskripsi</label>
                    <textarea
                      rows="3"
                      value={settingsForm[`feature${n}_desc`]}
                      onChange={(e) => updateField(`feature${n}_desc`, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {/* ═══ SECTION 5: KONTAK & FOOTER ═══ */}
          <fieldset className="settings-fieldset" id="section-contact">
            <legend><span className="fieldset-num">5</span>✉️ Kontak & Footer</legend>

            <div className="settings-grid-2">
              <div className="field-group">
                <label>📧 Email Kontak</label>
                <input
                  type="text"
                  value={settingsForm.contact_email}
                  onChange={(e) => updateField("contact_email", e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>📸 Username Instagram</label>
                <input
                  type="text"
                  value={settingsForm.contact_instagram}
                  onChange={(e) => updateField("contact_instagram", e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>📍 Lokasi / Kota</label>
                <input
                  type="text"
                  value={settingsForm.contact_location}
                  onChange={(e) => updateField("contact_location", e.target.value)}
                />
              </div>

              <div className="field-group">
                <label>© Teks Hak Cipta Footer</label>
                <input
                  type="text"
                  value={settingsForm.footer_text}
                  onChange={(e) => updateField("footer_text", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          {/* STICKY SAVE BAR */}
          <div className="sticky-save-bar">
            <span className="sticky-save-bar__info">
              Pastikan semua perubahan sudah benar sebelum menyimpan.
            </span>
            <button type="submit" className="btn-save btn-save--lg" disabled={loading}>
              {loading ? "⏳ Menyimpan Perubahan..." : "💾 Simpan Semua Perubahan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default LandingEditor;
