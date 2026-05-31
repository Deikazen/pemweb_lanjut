// ============================================
// ImageUpload.jsx  (Komponen Upload Gambar)
// → Upload file gambar via Base64 + input URL manual
// → Opsional: panel preview gambar + tombol hapus
// → Dipakai di: MenuForm, LandingEditor (hero & about)
// ============================================

import "./ImageUpload.css";

function ImageUpload({
  id,
  value,
  onChange,
  showPreview = false,
  previewAlt = "Preview",
  onClear,
}) {
  // Apakah value berupa base64 data URI
  const isBase64 = value && value.startsWith("data:");

  // Handler upload file → convert ke base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler input URL manual
  const handleUrlChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`image-upload-container ${showPreview ? "" : "image-upload-container--simple"}`}>
      <div className="image-upload-controls">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="admin-file-input-hidden"
          id={id}
        />
        <label
          htmlFor={id}
          className={`upload-zone ${isBase64 ? "upload-zone--filled" : ""}`}
        >
          <span className="upload-zone__icon">
            {isBase64 ? "✅" : "📂"}
          </span>
          <span className="upload-zone__text">
            {isBase64 ? "Gambar berhasil dipilih" : "Klik untuk pilih gambar"}
          </span>
          <span className="upload-zone__hint">
            {isBase64 ? "Klik untuk ganti gambar" : "JPG, PNG, WebP"}
          </span>
        </label>
        <span className="url-or-divider">atau masukkan URL gambar manual</span>
        <input
          type="text"
          placeholder="https://..."
          value={isBase64 ? "" : (value || "")}
          onChange={handleUrlChange}
        />
      </div>

      {showPreview && value && (
        <div className="image-preview-panel">
          <span className="image-preview-label">Preview</span>
          <img
            src={value}
            alt={previewAlt}
            className="image-preview-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          {onClear && (
            <button
              type="button"
              className="btn-clear-image"
              onClick={onClear}
            >
              Hapus Gambar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
