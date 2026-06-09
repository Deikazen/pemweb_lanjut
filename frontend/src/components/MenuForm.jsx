// ============================================
// MenuForm.jsx
// Form tambah / edit menu Kopi Bekmer 70
// ============================================

import ImageUpload from "./ImageUpload";
import "./MenuForm.css";

function MenuForm({
  name,
  price,
  mediaUrl,
  description,
  badge,
  tag1,
  tag2,
  tag3,
  editId,
  loading,
  onNameChange,
  onPriceChange,
  onMediaUrlChange,
  onDescriptionChange,
  onBadgeChange,
  onTag1Change,
  onTag2Change,
  onTag3Change,
  onSubmit,
  onCancelEdit,
}) {
  return (
    <section className="admin-form-section">
      <div className="admin-section-heading">
        <div>
          <p className="admin-section-eyebrow">
            {editId ? "PERBARUI PRODUK" : "TAMBAH PRODUK BARU"}
          </p>

          <h2>
            {editId ? "EDIT MENU BEKMER." : "MASUKKAN MENU BEKMER."}
          </h2>
        </div>

        <span className="admin-section-number">
          {editId ? "02" : "01"}
        </span>
      </div>

      <p className="admin-section-desc">
        Isi informasi produk dengan lengkap agar pelanggan lebih mudah
        memilih menu yang ingin dipesan.
      </p>

      <form onSubmit={onSubmit} className="admin-form">
        <div className="field-group">
          <label>Nama Menu</label>

          <input
            type="text"
            placeholder="Contoh: Bekmer Creamy Drip"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Harga Menu (Rp)</label>

          <input
            type="number"
            placeholder="Contoh: 25000"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
          />
        </div>

        <div className="field-group admin-form-full">
          <label>Deskripsi Menu</label>

          <textarea
            className="admin-textarea"
            placeholder="Contoh: Kopi creamy dengan sentuhan butterscotch yang smooth, manis, dan aromatik."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows="4"
          />
        </div>

        <div className="field-group">
          <label>Badge Card</label>

          <input
            type="text"
            placeholder="Contoh: Best Seller"
            value={badge}
            onChange={(e) => onBadgeChange(e.target.value)}
          />

          <small className="field-helper">
            Opsional. Tampil di bagian kiri atas kartu produk.
          </small>
        </div>

        <div className="field-group">
          <label>Tag Menu</label>

          <div className="admin-tag-inputs">
            <input
              type="text"
              placeholder="Tag 1"
              value={tag1}
              onChange={(e) => onTag1Change(e.target.value)}
            />

            <input
              type="text"
              placeholder="Tag 2"
              value={tag2}
              onChange={(e) => onTag2Change(e.target.value)}
            />

            <input
              type="text"
              placeholder="Tag 3"
              value={tag3}
              onChange={(e) => onTag3Change(e.target.value)}
            />
          </div>

          <small className="field-helper">
            Opsional. Maksimal tiga tag untuk membantu kategori menu.
          </small>
        </div>

        <div className="field-group admin-form-full">
          <label>Foto Produk</label>

          <ImageUpload
            id="item-file-upload"
            value={mediaUrl}
            onChange={onMediaUrlChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={loading}>
            {loading
              ? "MENYIMPAN..."
              : editId
                ? "SIMPAN PERUBAHAN →"
                : "TAMBAHKAN MENU →"}
          </button>

          {editId && (
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancelEdit}
            >
              BATAL EDIT
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default MenuForm;