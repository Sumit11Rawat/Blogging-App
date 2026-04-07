import { useState, useRef } from "react";
import axios from "axios";

const CreatePostForm = ({ onClose, onPostCreated }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    image: "",
    imageFile: null
  });

  const [imageType, setImageType] = useState("url");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [doneStatus, setDoneStatus] = useState("published");

  const statusRef = useRef("published");

  const tagPills = form.tags
    ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // 🔹 Handle input
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // 🔹 Handle file
  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      imageFile: e.target.files[0],
    }));
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      let payload;
      let headers = { Authorization: `Bearer ${token}` };

      if (imageType === "file" && form.imageFile) {
        payload = new FormData();
        payload.append("title", form.title);
        payload.append("content", form.content);
        payload.append("tags", JSON.stringify(tagPills));
        payload.append("image", form.imageFile);
        payload.append("status", statusRef.current);

        headers["Content-Type"] = "multipart/form-data";
      } else {
        payload = {
          title: form.title,
          content: form.content,
          tags: tagPills,
          image: form.image,
          status: statusRef.current,
        };
      }

      const res = await axios.post(
        "http://localhost:8001/post/create",
        payload,
        { headers }
      );

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

  // 🔹 Success UI
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-group">

        {/* 🔹 Title */}
        <div className="field-wrap">
          <input
            className="field-input"
            name="title"
            placeholder=" "
            onChange={handleChange}
            value={form.title}
            required
          />
          <span className="field-label">Post title *</span>
        </div>

        {/* 🔹 Content */}
        <div className="field-wrap">
          <textarea
            className="field-textarea field-input"
            name="content"
            placeholder=" "
            onChange={handleChange}
            value={form.content}
            required
          />
          <span className="field-label">Content *</span>
          <div className="char-counter">{form.content.length} chars</div>
        </div>

        {/* 🔥 Image LEFT + Tags RIGHT */}
        <div className="fields-row">

          {/* 🔥 Image (LEFT) */}
          <div className="field-wrap">

            <select
              className="field-input"
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
            >
              <option value="url">Image URL</option>
              <option value="file">Upload from Desktop</option>
            </select>
            <span className="field-label">Image Source</span>

            {imageType === "url" ? (
              <input
                className="field-input"
                name="image"
                placeholder="Enter image URL"
                onChange={handleChange}
                value={form.image}
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="field-input"
              />
            )}
          </div>

          {/* 🔹 Tags (RIGHT) */}
          <div>
            <div className="field-wrap">
              <input
                className="field-input"
                name="tags"
                placeholder=" "
                onChange={handleChange}
                value={form.tags}
              />
              <span className="field-label">Tags</span>
            </div>

            {tagPills.length > 0 && (
              <div className="tags-preview">
                {tagPills.map((t) => (
                  <span className="tag-pill" key={t}>#{t}</span>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 🔹 Actions */}
      <div className="modal-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancel
        </button>

        {/* Draft */}
        <button
          type="submit"
          className="btn-cancel"
          disabled={loading}
          onClick={() => { statusRef.current = "draft"; }}
          style={{ borderColor: "#d1d5db", color: "#6b7280" }}
        >
          {loading && statusRef.current === "draft"
            ? "Saving…"
            : "💾 Save Draft"}
        </button>

        {/* Publish */}
        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
          onClick={() => { statusRef.current = "published"; }}
        >
          {loading && statusRef.current === "published"
            ? "Publishing…"
            : "Publish Post →"}
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;