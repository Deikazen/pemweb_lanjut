// ============================================
// ImageUpload.jsx
// Komponen upload foto Kopi Bekmer 70
// ============================================

import "./ImageUpload.css";

function ImageUpload({
  id,
  value,
  onChange,
  showPreview = false,
  previewAlt = "Preview foto produk",
  onClear,
}) {
  const isBase64 = value && value.startsWith("data:");
  const hasImage = Boolean(value);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      onChange(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleUrlChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div
      className={`image-upload-container ${
        showPreview ? "" : "image-upload-container--simple"
      }`}
    >
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
          className={`upload-zone ${hasImage ? "upload-zone--filled" : ""}`}
        >
          <span className="upload-zone__icon">
            {hasImage ? "✓" : "+"}
          </span>

          <span className="upload-zone__text">
            {hasImage ? "FOTO PRODUK SUDAH DIPILIH" : "PILIH FOTO PRODUK"}
          </span>

          <span className="upload-zone__hint">
            {hasImage
              ? "Klik area ini untuk mengganti gambar"
              : "Gunakan format JPG, PNG, atau WebP"}
          </span>
        </label>

        <div className="url-or-divider">
          <span />
          <p>ATAU GUNAKAN URL GAMBAR</p>
          <span />
        </div>

        <input
          type="text"
          className="image-url-input"
          placeholder="https://alamat-gambar..."
          value={isBase64 ? "" : value || ""}
          onChange={handleUrlChange}
        />
      </div>

      {showPreview && hasImage && (
        <div className="image-preview-panel">
          <p className="image-preview-label">PREVIEW GAMBAR</p>

          <img
            src={value}
            alt={previewAlt}
            className="image-preview-img"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          {onClear && (
            <button
              type="button"
              className="btn-clear-image"
              onClick={onClear}
            >
              HAPUS GAMBAR
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;