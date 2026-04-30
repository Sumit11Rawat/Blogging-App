import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f4f6f8;
    margin: 0;
  }

  /* ── Background layer ── */
  .bg-canvas { position: fixed; inset: 0; z-index: 0; background: #f4f6f8; overflow: hidden; }
  .blob { position: absolute; border-radius: 50%; filter: blur(90px); animation: blobFloat var(--dur) ease-in-out var(--delay) infinite alternate; opacity: 0.45; }
  .blob-1 { width: 500px; height: 500px; background: radial-gradient(circle, #f9c0c0, #f4c2d8); top: -120px; left: -100px; --dur: 14s; --delay: 0s; }
  .blob-2 { width: 400px; height: 400px; background: radial-gradient(circle, #c2d4f9, #c9e8f5); bottom: -80px; right: -80px; --dur: 18s; --delay: -5s; }
  .blob-3 { width: 280px; height: 280px; background: radial-gradient(circle, #f9e6c0, #fde8d0); top: 40%; left: 60%; --dur: 11s; --delay: -3s; }
  .blob-4 { width: 200px; height: 200px; background: radial-gradient(circle, #d4f0c2, #c8f0e8); top: 60%; left: 10%; --dur: 15s; --delay: -8s; }
  @keyframes blobFloat { 0%{transform:translate(0,0) scale(1);} 50%{transform:translate(30px,-30px) scale(1.06);} 100%{transform:translate(-15px,20px) scale(0.96);} }
  .dot-grid { position: absolute; inset: 0; background-image: radial-gradient(circle, #b0b8c4 1.2px, transparent 1.2px); background-size: 28px 28px; opacity: 0.35; mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%); }
  .ring { position: absolute; border-radius: 50%; border: 1.5px solid rgba(178,34,34,0.1); animation: ringPulse var(--rdur) ease-in-out var(--rdelay) infinite; }
  .ring-1 { width: 260px; height: 260px; top: 8%; left: 5%; --rdur: 8s; --rdelay: 0s; }
  .ring-2 { width: 160px; height: 160px; top: 20%; left: 12%; --rdur: 8s; --rdelay: 0s; }
  .ring-3 { width: 340px; height: 340px; bottom: 6%; right: 4%; --rdur: 10s; --rdelay: -3s; }
  .ring-4 { width: 200px; height: 200px; bottom: 14%; right: 11%; --rdur: 10s; --rdelay: -3s; }
  @keyframes ringPulse { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.08);opacity:1} }
  .streak { position: absolute; width: 1px; background: linear-gradient(to bottom, transparent, rgba(178,34,34,0.12), transparent); animation: streakFade var(--sdur) ease-in-out var(--sdelay) infinite; opacity: 0; transform: rotate(-30deg); transform-origin: top center; }
  .streak-1 { height: 300px; top: 5%; left: 25%; --sdur: 7s; --sdelay: 0s; }
  .streak-2 { height: 200px; top: 30%; left: 70%; --sdur: 9s; --sdelay: -4s; }
  .streak-3 { height: 250px; top: 55%; left: 45%; --sdur: 6s; --sdelay: -2s; }
  @keyframes streakFade { 0%,100%{opacity:0} 40%,60%{opacity:1} }

  /* ── Card ── */
  .edit-root { position: relative; z-index: 1; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 40px 16px; }
  .edit-card { width: 600px; max-width: 95%; background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; }
  .edit-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #111827; }
  .field-wrap { position: relative; margin-bottom: 18px; }
  .field-input, .field-textarea, .field-select { width: 100%; padding: 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; background: #fafafa; font-size: 14px; outline: none; transition: 0.2s; font-family: 'DM Sans', sans-serif; color: #111827; box-sizing: border-box; }
  .field-input:focus, .field-textarea:focus, .field-select:focus { border-color: #B22222; background: #fff; box-shadow: 0 0 0 3px rgba(178,34,34,0.1); }
  .field-label { position: absolute; left: 12px; top: 13px; font-size: 13px; color: #9ca3af; background: #fff; padding: 0 4px; transition: 0.2s; pointer-events: none; }
  .field-input:focus + .field-label,
  .field-input:not(:placeholder-shown) + .field-label,
  .field-textarea:focus + .field-label,
  .field-textarea:not(:placeholder-shown) + .field-label { top: -8px; font-size: 11px; color: #B22222; }
  .field-select + .field-label { top: -8px; font-size: 11px; color: #B22222; }
  .field-textarea { min-height: 120px; resize: vertical; }

  /* ── Image Selector ── */
  .img-section-label {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 10px;
  }
  .img-mode-toggle {
    display: flex;
    gap: 0;
    margin-bottom: 14px;
    border-radius: 10px;
    overflow: hidden;
    border: 1.5px solid #e5e7eb;
  }
  .img-mode-btn {
    flex: 1;
    padding: 10px 0;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    background: #fafafa;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .img-mode-btn.active {
    background: linear-gradient(135deg, #B22222, #8b0000);
    color: #fff;
  }
  .img-mode-btn:not(.active):hover {
    background: #f3f4f6;
    color: #111827;
  }
  .img-preview-box {
    border: 1.5px dashed #e5e7eb;
    border-radius: 10px;
    padding: 14px;
    background: #fafafa;
    margin-bottom: 14px;
  }
  .img-preview-box.has-img {
    border-color: #B22222;
    border-style: solid;
    background: #fff;
  }
  .img-preview-thumb {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  .img-preview-name {
    font-size: 12px;
    color: #6b7280;
    word-break: break-all;
  }
  .img-empty {
    text-align: center;
    padding: 18px 0;
    color: #9ca3af;
    font-size: 13px;
  }
  .img-empty-icon { font-size: 28px; margin-bottom: 6px; }
  .img-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .img-action-btn {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #6b7280;
    transition: 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .img-action-btn:hover { background: #f3f4f6; }
  .img-action-btn.danger { color: #dc2626; border-color: #fecaca; }
  .img-action-btn.danger:hover { background: #fef2f2; }
  .file-input-hidden { display: none; }

  .feedback-msg { padding: 10px 14px; border-radius: 8px; margin-bottom: 14px; font-size: 13px; display: flex; align-items: center; gap: 8px; }
  .feedback-msg.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .feedback-msg.error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .btn-row { display: flex; justify-content: space-between; margin-top: 20px; gap: 10px; }
  .btn-cancel { padding: 10px 18px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
  .btn-cancel:hover { background: #f3f4f6; }
  .btn-update { padding: 10px 22px; border-radius: 10px; background: linear-gradient(135deg, #B22222, #8b0000); color: #fff; border: none; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 6px 18px rgba(178,34,34,.35); transition: 0.2s; display: flex; align-items: center; gap: 6px; }
  .btn-update:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(178,34,34,.45); }
  .btn-update:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
  .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// Helper to resolve image src for preview
const resolveImageSrc = (image) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
    return image;
  }
  return `${API_BASE_URL}${image.startsWith("/") ? image : "/" + image}`;
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [post, setPost] = useState({
    title: "",
    content: "",
    tags: "",
    status: "draft",
  });

  // Image state
  const [imageMode, setImageMode] = useState("url"); // "url" or "file"
  const [imageUrl, setImageUrl] = useState("");       // URL text input
  const [imageFile, setImageFile] = useState(null);   // File object
  const [existingImage, setExistingImage] = useState(""); // original image from DB

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ── Fetch post ──
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/post/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setPost({
          title: data.title || "",
          content: data.content || "",
          tags: data.tags?.join(", ") || "",
          status: data.status || "draft",
        });

        // Set existing image
        const img = data.image || "";
        setExistingImage(img);
        if (img) {
          if (img.startsWith("/uploads")) {
            setImageMode("file");
          } else {
            setImageMode("url");
            setImageUrl(img);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setMessage({ type: "error", text: "Failed to load post." });
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id, token]);

  // ── Handle file selection ──
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select a valid image file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image must be less than 5MB." });
      return;
    }
    setImageFile(file);
    setMessage({ type: "", text: "" });
  };

  // ── Remove image ──
  const handleRemoveImage = () => {
    setImageUrl("");
    setImageFile(null);
    setExistingImage("");
  };

  // ── Determine current preview image ──
  const getPreviewSrc = () => {
    if (imageMode === "file" && imageFile) {
      return URL.createObjectURL(imageFile);
    }
    if (imageMode === "url" && imageUrl) {
      return resolveImageSrc(imageUrl);
    }
    // Fallback to existing image from DB if nothing new was set
    if (existingImage && imageMode === "file") {
      return resolveImageSrc(existingImage);
    }
    return null;
  };

  const hasImage = () => {
    if (imageMode === "url") return !!imageUrl;
    if (imageMode === "file") return !!(imageFile || (existingImage && existingImage.startsWith("/uploads")));
    return false;
  };

  const [improving, setImproving] = useState(false);

  const handleImprove = async () => {
    if (!post.content) {
      alert("Please write some content first!");
      return;
    }
    setImproving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE_URL}/ai/improve`, { content: post.content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPost(prev => ({ ...prev, content: res.data.improvedContent }));
    } catch (err) {
      console.error(err);
      alert("Failed to improve content.");
    } finally {
      setImproving(false);
    }
  };

  // ── Update post ──
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("content", post.content);
      formData.append("tags", JSON.stringify(post.tags.split(",").map((t) => t.trim()).filter(Boolean)));
      formData.append("status", post.status);

      // Handle image based on mode
      if (imageMode === "file" && imageFile) {
        // New file upload
        formData.append("image", imageFile);
      } else if (imageMode === "url" && imageUrl) {
        // URL input
        formData.append("imageUrl", imageUrl);
      } else if (!hasImage()) {
        // Image was removed
        formData.append("removeImage", "true");
      }

      await axios.put(`${API_BASE_URL}/post/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ type: "success", text: "Post updated successfully!" });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Update failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const previewSrc = getPreviewSrc();

  return (
    <>
      <style>{style}</style>

      {/* Background */}
      <div className="bg-canvas">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="dot-grid" />
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
        <div className="ring ring-4" />
        <div className="streak streak-1" />
        <div className="streak streak-2" />
        <div className="streak streak-3" />
      </div>

      {/* Card */}
      <div className="edit-root">
        <div className="edit-card">
          <div className="edit-title">Edit Post</div>

          {fetching ? (
            <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading post…</p>
          ) : (
            <form onSubmit={handleUpdate}>
              {message.text && (
                <div className={`feedback-msg ${message.type}`}>
                  <span>{message.type === "success" ? "✓" : "✕"}</span> {message.text}
                </div>
              )}

              {/* Title */}
              <div className="field-wrap">
                <input
                  type="text"
                  className="field-input"
                  value={post.title}
                  placeholder=" "
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  required
                />
                <label className="field-label">Title</label>
              </div>

              {/* Content */}
              <div className="field-wrap" style={{ position: "relative" }}>
                <textarea
                  className="field-textarea"
                  value={post.content}
                  placeholder=" "
                  onChange={(e) => setPost({ ...post, content: e.target.value })}
                  required
                />
                <label className="field-label">Content</label>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <button 
                    type="button" 
                    onClick={handleImprove}
                    disabled={improving}
                    style={{ 
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", 
                      color: "#fff", 
                      border: "none", 
                      padding: "4px 10px", 
                      borderRadius: "6px", 
                      fontSize: "11px", 
                      fontWeight: "600", 
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "0.2s opacity",
                      opacity: improving ? 0.7 : 1
                    }}>
                    {improving ? "⏳ Improving..." : "✨ Improve with AI"}
                  </button>
                  <div style={{ fontSize: "11px", color: "#d1d5db" }}>{post.content.length} chars</div>
                </div>
              </div>

              {/* Tags */}
              <div className="field-wrap">
                <input
                  type="text"
                  className="field-input"
                  value={post.tags}
                  placeholder=" "
                  onChange={(e) => setPost({ ...post, tags: e.target.value })}
                />
                <label className="field-label">Tags (comma separated)</label>
              </div>

              {/* ── IMAGE SELECTOR ── */}
              <div style={{ marginBottom: 18 }}>
                <div className="img-section-label">Cover Image</div>

                {/* Mode Toggle */}
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

                {/* Preview / Input Area */}
                <div className={`img-preview-box ${hasImage() ? "has-img" : ""}`}>
                  {/* Image Preview */}
                  {previewSrc && (
                    <img
                      src={previewSrc}
                      alt="Preview"
                      className="img-preview-thumb"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}

                  {/* URL mode input */}
                  {imageMode === "url" && (
                    <input
                      type="text"
                      className="field-input"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      style={{ fontSize: 13 }}
                    />
                  )}

                  {/* File mode input */}
                  {imageMode === "file" && (
                    <>
                      <input
                        type="file"
                        id="edit-image-upload"
                        className="file-input-hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {imageFile ? (
                        <div className="img-preview-name">
                          📁 {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                        </div>
                      ) : !existingImage?.startsWith("/uploads") ? (
                        <div className="img-empty">
                          <div className="img-empty-icon">📁</div>
                          <div>Choose a file to upload</div>
                        </div>
                      ) : (
                        <div className="img-preview-name">
                          📁 Current: {existingImage.split("/").pop()}
                        </div>
                      )}
                      <div style={{ marginTop: 10 }}>
                        <label
                          htmlFor="edit-image-upload"
                          className="img-action-btn"
                          style={{ cursor: "pointer" }}
                        >
                          📁 {imageFile || existingImage?.startsWith("/uploads") ? "Change File" : "Choose File"}
                        </label>
                      </div>
                    </>
                  )}

                  {/* Remove btn */}
                  {hasImage() && (
                    <div className="img-actions">
                      <button
                        type="button"
                        className="img-action-btn danger"
                        onClick={handleRemoveImage}
                      >
                        🗑️ Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="field-wrap">
                <select
                  className="field-select"
                  value={post.status || "draft"}
                  onChange={(e) => setPost({ ...post, status: e.target.value })}
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <label className="field-label">Status</label>
              </div>

              {/* Buttons */}
              <div className="btn-row">
                <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard")} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn-update" disabled={loading}>
                  {loading && <span className="spinner" />}
                  {loading ? "Updating…" : "Update Post"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default EditPost;