// ============================================
// MenuForm.jsx  (Form Tambah / Edit Item Menu)
// → Input: nama, harga, gambar (upload/URL)
// → Tombol simpan + batal edit
// → Dipakai di: AdminPage → Tab Kelola Menu
// ============================================

import ImageUpload from "./ImageUpload";
import "./MenuForm.css";

function MenuForm({
  name,
  price,
  mediaUrl,
  editId,
  loading,
  onNameChange,
  onPriceChange,
  onMediaUrlChange,
  onSubmit,
  onCancelEdit,
}) {
  return (
    <section className="admin-form-section">
      <h2>{editId ? "✏️ Edit Item Menu" : "➕ Tambah Item Menu Baru"}</h2>

      <form onSubmit={onSubmit} className="admin-form">
        <div className="field-group">
          <label>Nama Item</label>
          <input
            type="text"
            placeholder="Contoh: Signature Latte"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Harga Item (Rp)</label>
          <input
            type="number"
            placeholder="Contoh: 25000"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Gambar Item</label>
          <ImageUpload
            id="item-file-upload"
            value={mediaUrl}
            onChange={onMediaUrlChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Menyimpan..." : editId ? "Update Item" : "Tambah Item"}
          </button>

          {editId && (
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancelEdit}
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default MenuForm;
