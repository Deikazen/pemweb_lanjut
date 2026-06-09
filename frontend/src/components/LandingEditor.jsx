// ============================================
// LandingEditor.jsx
// Editor landing page Kopi Bekmer 70
// ============================================

import SectionNav from "./SectionNav";
import ImageUpload from "./ImageUpload";
import "./LandingEditor.css";

function LandingEditor({
  settingsForm,
  onFieldChange,
  onSubmit,
  loading,
}) {
  const updateField = (field, value) => {
    onFieldChange({
      ...settingsForm,
      [field]: value,
    });
  };

  return (
    <div className="tab-panel">
      <div className="landing-editor-header">
        <p className="admin-section-eyebrow">
          PENGATURAN HALAMAN UTAMA
        </p>

        <h2>EDIT LANDING PAGE.</h2>

        <p>
          Perbarui tulisan, gambar, statistik, keunggulan, dan
          informasi kontak yang tampil pada halaman utama Kopi
          Bekmer 70.
        </p>
      </div>

      <div className="landing-editor-layout">
        {/* ── Sidebar navigasi ─────────────── */}
        <SectionNav />

        {/* ── Form utama ───────────────────── */}
        <form onSubmit={onSubmit} className="admin-settings-form">
          {/* ═══ SECTION 1: HERO ═══ */}
          <fieldset className="settings-fieldset" id="section-hero">
            <legend>
              <span className="fieldset-num">01</span>
              HERO UTAMA
            </legend>

            <div className="settings-grid-2">
              <div className="field-group field-group--span2">
                <label>Badge Hero</label>

                <input
                  type="text"
                  placeholder="Contoh: 100% ARABIKA · KABUPATEN BANDUNG"
                  value={settingsForm.hero_badge || ""}
                  onChange={(event) =>
                    updateField("hero_badge", event.target.value)
                  }
                />
              </div>

              <div className="field-group field-group--span2">
                <label>
                  Judul Hero — Gunakan Enter untuk baris baru
                </label>

                <textarea
                  rows="3"
                  placeholder={"DARI BIJI\nLAHIR CERITA."}
                  value={settingsForm.hero_title || ""}
                  onChange={(event) =>
                    updateField("hero_title", event.target.value)
                  }
                />
              </div>

              <div className="field-group field-group--span2">
                <label>Deskripsi Hero</label>

                <textarea
                  rows="4"
                  value={settingsForm.hero_desc || ""}
                  onChange={(event) =>
                    updateField("hero_desc", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="field-group">
              <label>Gambar atau Logo Hero</label>

              <ImageUpload
                id="hero-file-upload"
                value={settingsForm.hero_image || ""}
                onChange={(value) =>
                  updateField("hero_image", value)
                }
                showPreview={true}
                previewAlt="Preview hero"
                onClear={() => updateField("hero_image", "")}
              />
            </div>
          </fieldset>

          {/* ═══ SECTION 2: STATISTIK ═══ */}
          <fieldset className="settings-fieldset" id="section-stats">
            <legend>
              <span className="fieldset-num">02</span>
              STATISTIK BRAND
            </legend>

            <div className="stats-cards-grid">
              <div className="stat-input-card">
                <span className="stat-input-card__emoji">☕</span>

                <div className="field-group">
                  <label>Jumlah Varian Menu</label>

                  <input
                    type="number"
                    value={settingsForm.stat_variankopi || ""}
                    onChange={(event) =>
                      updateField(
                        "stat_variankopi",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="stat-input-card">
                <span className="stat-input-card__emoji">🌿</span>

                <div className="field-group">
                  <label>Arabika Pilihan (%)</label>

                  <input
                    type="number"
                    value={settingsForm.stat_arabikaasli || ""}
                    onChange={(event) =>
                      updateField(
                        "stat_arabikaasli",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="stat-input-card">
                <span className="stat-input-card__emoji">⭐</span>

                <div className="field-group">
                  <label>Rating Tamu</label>

                  <input
                    type="number"
                    step="0.1"
                    value={settingsForm.stat_ratingtamu || ""}
                    onChange={(event) =>
                      updateField(
                        "stat_ratingtamu",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* ═══ SECTION 3: ABOUT ═══ */}
          <fieldset className="settings-fieldset" id="section-about">
            <legend>
              <span className="fieldset-num">03</span>
              CERITA KAMI
            </legend>

            <div className="settings-grid-2">
              <div className="field-group">
                <label>Badge Tahun Berdiri</label>

                <input
                  type="text"
                  placeholder="Contoh: EST. 2025"
                  value={settingsForm.about_badge || ""}
                  onChange={(event) =>
                    updateField("about_badge", event.target.value)
                  }
                />
              </div>

              <div className="field-group">
                <label>
                  Judul Cerita — Gunakan Enter untuk baris baru
                </label>

                <textarea
                  rows="2"
                  placeholder={"BERAWAL DARI\nMOTOR BEBEK MERAH."}
                  value={settingsForm.about_title || ""}
                  onChange={(event) =>
                    updateField("about_title", event.target.value)
                  }
                />
              </div>

              <div className="field-group field-group--span2">
                <label>Deskripsi Cerita Utama</label>

                <textarea
                  rows="4"
                  value={settingsForm.about_desc || ""}
                  onChange={(event) =>
                    updateField("about_desc", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="field-group">
              <label>Gambar Cerita Kami</label>

              <ImageUpload
                id="about-file-upload"
                value={settingsForm.about_image || ""}
                onChange={(value) =>
                  updateField("about_image", value)
                }
                showPreview={true}
                previewAlt="Preview cerita kami"
                onClear={() => updateField("about_image", "")}
              />
            </div>

            <div className="about-cards-grid">
              <div className="about-card-editor">
                <h4 className="about-card-editor__title">
                  KARTU 01 — IKON BRAND
                </h4>

                <div className="field-group">
                  <label>Judul Kartu</label>

                  <input
                    type="text"
                    value={settingsForm.about_card1_title || ""}
                    onChange={(event) =>
                      updateField(
                        "about_card1_title",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="field-group">
                  <label>Deskripsi</label>

                  <textarea
                    rows="4"
                    value={settingsForm.about_card1_desc || ""}
                    onChange={(event) =>
                      updateField(
                        "about_card1_desc",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="about-card-editor">
                <h4 className="about-card-editor__title">
                  KARTU 02 — BEANS PILIHAN
                </h4>

                <div className="field-group">
                  <label>Judul Kartu</label>

                  <input
                    type="text"
                    value={settingsForm.about_card2_title || ""}
                    onChange={(event) =>
                      updateField(
                        "about_card2_title",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="field-group">
                  <label>Deskripsi</label>

                  <textarea
                    rows="4"
                    value={settingsForm.about_card2_desc || ""}
                    onChange={(event) =>
                      updateField(
                        "about_card2_desc",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* ═══ SECTION 4: FEATURES ═══ */}
          <fieldset
            className="settings-fieldset"
            id="section-features"
          >
            <legend>
              <span className="fieldset-num">04</span>
              KEUNGGULAN BRAND
            </legend>

            <div className="features-cards-grid">
              {[1, 2, 3].map((number) => (
                <div className="feature-card-editor" key={number}>
                  <div className="feature-card-editor__header">
                    <span className="feature-card-editor__num">
                      KEUNGGULAN {number}
                    </span>

                    <div className="field-group field-group--icon">
                      <label>Icon</label>

                      <input
                        type="text"
                        value={
                          settingsForm[`feature${number}_icon`] ||
                          ""
                        }
                        onChange={(event) =>
                          updateField(
                            `feature${number}_icon`,
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label>Judul</label>

                    <input
                      type="text"
                      value={
                        settingsForm[`feature${number}_title`] ||
                        ""
                      }
                      onChange={(event) =>
                        updateField(
                          `feature${number}_title`,
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label>Deskripsi</label>

                    <textarea
                      rows="4"
                      value={
                        settingsForm[`feature${number}_desc`] ||
                        ""
                      }
                      onChange={(event) =>
                        updateField(
                          `feature${number}_desc`,
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          {/* ═══ SECTION 5: KONTAK ═══ */}
          <fieldset
            className="settings-fieldset"
            id="section-contact"
          >
            <legend>
              <span className="fieldset-num">05</span>
              KONTAK DAN FOOTER
            </legend>

            <div className="settings-grid-2">
              <div className="field-group">
                <label>Email Kontak</label>

                <input
                  type="text"
                  placeholder="kopibekmer70@gmail.com"
                  value={settingsForm.contact_email || ""}
                  onChange={(event) =>
                    updateField(
                      "contact_email",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field-group">
                <label>URL Instagram</label>

                <input
                  type="text"
                  placeholder="https://www.instagram.com/..."
                  value={settingsForm.contact_instagram || ""}
                  onChange={(event) =>
                    updateField(
                      "contact_instagram",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field-group">
                <label>Lokasi Singkat</label>

                <input
                  type="text"
                  placeholder="Contoh: Kabupaten Bandung"
                  value={settingsForm.contact_location || ""}
                  onChange={(event) =>
                    updateField(
                      "contact_location",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field-group">
                <label>Teks Footer</label>

                <input
                  type="text"
                  placeholder="© 2026 KOPI BEKMER 70"
                  value={settingsForm.footer_text || ""}
                  onChange={(event) =>
                    updateField("footer_text", event.target.value)
                  }
                />
              </div>

              <div className="field-group">
                <label>Nomor WhatsApp</label>

                <input
                  type="text"
                  placeholder="Contoh: 6281313523326"
                  value={settingsForm.contact_whatsapp || ""}
                  onChange={(event) =>
                    updateField(
                      "contact_whatsapp",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field-group">
                <label>Jam Operasional</label>

                <input
                  type="text"
                  placeholder="Contoh: 07.00–22.00"
                  value={settingsForm.operational_hours || ""}
                  onChange={(event) =>
                    updateField(
                      "operational_hours",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field-group">
                <label>URL TikTok</label>

                <input
                  type="text"
                  placeholder="https://www.tiktok.com/@..."
                  value={settingsForm.contact_tiktok || ""}
                  onChange={(event) =>
                    updateField(
                      "contact_tiktok",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field-group">
                <label>URL Facebook</label>

                <input
                  type="text"
                  placeholder="https://www.facebook.com/..."
                  value={settingsForm.contact_facebook || ""}
                  onChange={(event) =>
                    updateField(
                      "contact_facebook",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field-group field-group--span2">
                <label>Kata Kunci Google Maps</label>

                <input
                  type="text"
                  placeholder="Contoh: Kopi Bekmer 70"
                  value={settingsForm.maps_query || ""}
                  onChange={(event) =>
                    updateField("maps_query", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="field-group">
              <label>Poster Menu Lengkap</label>

              <ImageUpload
                id="menu-poster-file-upload"
                value={settingsForm.menu_poster_image || ""}
                onChange={(value) =>
                  updateField("menu_poster_image", value)
                }
                showPreview={true}
                previewAlt="Preview poster menu"
                onClear={() =>
                  updateField("menu_poster_image", "")
                }
              />
            </div>
          </fieldset>

          {/* ── Sticky save bar ─────────────── */}
          <div className="sticky-save-bar">
            <span className="sticky-save-bar__info">
              Periksa kembali seluruh informasi sebelum menyimpan
              perubahan.
            </span>

            <button
              type="submit"
              className="btn-save btn-save--lg"
              disabled={loading}
            >
              {loading
                ? "MENYIMPAN PERUBAHAN..."
                : "SIMPAN SEMUA PERUBAHAN →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LandingEditor;