import { useState, useEffect } from "react";
import axios from "axios";

const UpdatePostForm = ({ post, onClose, onPostUpdated }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Prefill form when modal opens
  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "",
        content: post.content || "",
        tags: post.tags ? post.tags.join(",") : "",
        image: post.image || ""
      });
    }
  }, [post]);

  const tagPills = form.tags
    ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:8001/post/${post._id}/update`,
        {
          title: form.title,
          content: form.content,
          tags: tagPills,
          image: form.image
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      onPostUpdated(res.data.post); // Callback to refresh posts in Dashboard
      setDone(true);
      setTimeout(onClose, 1400);

    } catch (err) {
      console.error(err);
      alert("Error updating post");
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <div className="success-flash">
        <span className="success-icon">✅</span>
        <div className="success-msg">Post updated!</div>
        <div className="success-sub">Your post changes have been saved.</div>
      </div>
    );

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-group">

        {/* Title */}
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

        {/* Content */}
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

        {/* Tags + Image */}
        <div className="fields-row">
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
                  <span className="tag-pill" key={t}>
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="field-wrap">
            <input
              className="field-input"
              name="image"
              placeholder=" "
              onChange={handleChange}
              value={form.image}
            />
            <span className="field-label">Image URL</span>
          </div>
        </div>

      </div>

      <div className="modal-actions">
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancel
        </button>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Updating…" : "Update Post →"}
        </button>
      </div>
    </form>
  );
};

export default UpdatePostForm;