import { useState, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/apiConfig";

// Reuse styles similar to EditPost but scoped to modal
const formStyle = `
  .img-section-label { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 10px; text-align: left; }
  .img-mode-toggle { display: flex; gap: 0; margin-bottom: 14px; border-radius: 10px; overflow: hidden; border: 1.5px solid #e5e7eb; }
  .img-mode-btn { flex: 1; padding: 10px 0; font-size: 13px; font-weight: 500; border: none; cursor: pointer; transition: 0.2s; background: #fafafa; color: #6b7280; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .img-mode-btn.active { background: linear-gradient(135deg, #B22222, #8b0000); color: #fff; }
  .img-mode-btn:not(.active):hover { background: #f3f4f6; color: #111827; }
  
  .img-preview-box { border: 1.5px dashed #e5e7eb; border-radius: 10px; padding: 14px; background: #fafafa; margin-bottom: 14px; transition: 0.2s; }
  .img-preview-box.has-img { border-color: #B22222; border-style: solid; background: #fff; }
  
  .img-preview-thumb { width: 100%; max-height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; border: 1px solid #eee; }
  .img-empty { text-align: center; padding: 20px 0; color: #9ca3af; font-size: 13px; }
  .img-empty-icon { font-size: 28px; margin-bottom: 6px; }
  
  .img-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px; }
  .img-action-btn { padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1px solid #e5e7eb; background: #fff; color: #6b7280; transition: 0.2s; display: inline-flex; align-items: center; gap: 4px; }
  .img-action-btn:hover { background: #f3f4f6; }
  .img-action-btn.danger { color: #dc2626; border-color: #fecaca; }
  .img-action-btn.danger:hover { background: #fef2f2; }
  
  .file-input-hidden { display: none; }
  .img-name-label { font-size: 12px; color: #6b7280; word-break: break-all; margin-top: 4px; }
`;

const CreatePostForm = ({ onClose, onPostCreated }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const [imageMode, setImageMode] = useState("url"); // "url" or "file"
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [doneStatus, setDoneStatus] = useState("published");

  const statusRef = useRef("published");

  const tagPills = form.tags
    ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    setImageFile(file);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImageFile(null);
  };

  const hasImage = () => {
    return imageMode === "url" ? !!imageUrl : !!imageFile;
  };

  const getPreviewSrc = () => {
    if (imageMode === "file" && imageFile) return URL.createObjectURL(imageFile);
    if (imageMode === "url" && imageUrl) return imageUrl;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("tags", JSON.stringify(tagPills));
      formData.append("status", statusRef.current);

      if (imageMode === "file" && imageFile) {
        formData.append("image", imageFile);
      } else if (imageMode === "url" && imageUrl) {
        formData.append("imageUrl", imageUrl);
      }

      const res = await axios.post(`${API_BASE_URL}/post/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onPostCreated(res.data.post);
      setDoneStatus(statusRef.current);
      setDone(true);
      setTimeout(onClose, 1400);

    } catch (err) {
      console.error(err);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <div className="success-flash">
        <span className="success-icon">
          {doneStatus === "draft" ? "📝" : "🎉"}
        </span>
        <div className="success-msg">
          {doneStatus === "draft" ? "Saved as Draft!" : "Post Published!"}
        </div>
        <div className="success-sub">
          {doneStatus === "draft"
            ? "You can publish it anytime."
            : "Your new post is live."}
        </div>
      </div>
    );

  const previewSrc = getPreviewSrc();

  return (
    <>
      <style>{formStyle}</style>
      <form onSubmit={handleSubmit}>
        <div className="field-group">

          {/* Title */}
          <div className="field-wrap">
            <input
              className="field-input"
              name="title"
              placeholder=" "
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              value={form.title}
              required
            />
            <span className="field-label">Post title *</span>
          </div>

          {/* Content */}
          <div className="field-wrap">
            <textarea
              className="field-textarea field-input"
              name="content"
              placeholder=" "
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              value={form.content}
              required
            />
            <span className="field-label">Content *</span>
            <div className="char-counter">{form.content.length} chars</div>
          </div>

          {/* ── IMAGE SECTION ── */}
          <div style={{ marginBottom: 18 }}>
            <div className="img-section-label">Cover Image</div>

            <div className="img-mode-toggle">
              <button
                type="button"
                className={`img-mode-btn ${imageMode === "url" ? "active" : ""}`}
                onClick={() => setImageMode("url")}
              >
                🔗 Image URL
              </button>
              <button
                type="button"
                className={`img-mode-btn ${imageMode === "file" ? "active" : ""}`}
                onClick={() => setImageMode("file")}
              >
                📁 Upload File
              </button>
            </div>

            <div className={`img-preview-box ${hasImage() ? "has-img" : ""}`}>
              {previewSrc && (
                <img src={previewSrc} alt="Preview" className="img-preview-thumb" onError={(e) => e.target.style.display = "none"} />
              )}

              {imageMode === "url" ? (
                <input
                  className="field-input"
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => setImageUrl(e.target.value)}
                  value={imageUrl}
                  style={{ fontSize: 13 }}
                />
              ) : (
                <div style={{ textAlign: "left" }}>
                  <input
                    type="file"
                    id="create-image-upload"
                    className="file-input-hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {!imageFile ? (
                    <div className="img-empty">
                      <div className="img-empty-icon">📁</div>
                      <div>Select a cover image to upload</div>
                    </div>
                  ) : (
                    <div className="img-name-label">📁 Selected: {imageFile.name}</div>
                  )}
                  <div style={{ marginTop: 10 }}>
                    <label htmlFor="create-image-upload" className="img-action-btn">
                      📁 {imageFile ? "Change File" : "Choose File"}
                    </label>
                  </div>
                </div>
              )}

              {hasImage() && (
                <div className="img-actions">
                  <button type="button" className="img-action-btn danger" onClick={handleRemoveImage}>
                    🗑️ Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="field-wrap">
            <input
              className="field-input"
              name="tags"
              placeholder=" "
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              value={form.tags}
            />
            <span className="field-label">Tags (comma separated)</span>
            {tagPills.length > 0 && (
              <div className="tags-preview">
                {tagPills.map((t) => (
                  <span className="tag-pill" key={t}>#{t}</span>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button
            type="submit"
            className="btn-cancel"
            disabled={loading}
            onClick={() => { statusRef.current = "draft"; }}
            style={{ borderColor: "#d1d5db", color: "#6b7280" }}
          >
            {loading && statusRef.current === "draft" ? "Saving…" : "💾 Save Draft"}
          </button>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
            onClick={() => { statusRef.current = "published"; }}
          >
            {loading && statusRef.current === "published" ? "Publishing…" : "Publish Post →"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreatePostForm;