import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const homeStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --ink: #0d0d0f;
    --paper: #f7f3ed;
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --cream: #ede9e0;
    --muted: #8a8070;
    --card-bg: #ffffff;
    --border: rgba(201,168,76,0.25);
  }

  .home-root {
    min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    background: var(--paper);
    color: var(--ink);
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .hero {
    position: relative;
    padding: 100px 60px 100px;
    display: flex;
    align-items: center;
    gap: 60px;
    overflow: hidden;
  }

  .hero-left { flex: 1; }

  .hero-eyebrow {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }

  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 300;
    line-height: 1.0;
    color: var(--ink);
    margin-bottom: 24px;
  }

  .hero-title em {
    font-style: italic;
    color: var(--gold);
  }

  .hero-sub {
    font-size: 17px;
    font-weight: 300;
    color: var(--muted);
    max-width: 480px;
    line-height: 1.7;
    margin-bottom: 32px;
  }

  .hero-cta {
    display: flex;
    gap: 24px;
    align-items: center;
  }

  .cta-primary {
    padding: 14px 36px;
    background: var(--ink);
    color: var(--paper);
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: 0.3s;
  }
  .cta-primary:hover {
    background: var(--gold);
    color: var(--ink);
    transform: translateY(-2px);
  }

  .cta-link {
    font-size: 15px;
    color: var(--muted);
    text-decoration: underline;
    text-underline-offset: 4px;
    cursor: pointer;
    background: none;
    border: none;
    transition: color 0.2s;
  }
  .cta-link:hover { color: var(--ink); }

  /* ── DIVIDER ── */
  .section-divider {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 60px;
    margin-bottom: 60px;
  }
  .divider-line { flex: 1; height: 1.5px; background: rgba(0,0,0,0.8); }
  .divider-boxed {
    border: 1.5px solid var(--ink);
    padding: 8px 18px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--ink);
    background: transparent;
  }
  .divider-label {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--gold);
  }

  /* ── POSTS GRID ── */
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    padding: 0 60px 80px;
  }

  /* ── POST CARD ── */
  .post-card {
    position: relative;
    background: #fffdfd;
    border: 1px solid rgba(178,34,34,0.08);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  .post-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 4px;
    background: linear-gradient(90deg, #B22222 0%, #ff6b6b 40%, #c9a84c 100%);
    z-index: 1;
  }

  .post-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(178,34,34,0.12), 0 8px 24px rgba(0,0,0,0.06);
    border-color: var(--gold);
    background: #fff;
  }

  /* ── CARD IMAGE ── */
  .post-card-image {
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: #ede9e0;
    flex-shrink: 0;
  }

  .post-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    display: block;
  }

  .post-card:hover .post-card-image img {
    transform: scale(1.06);
  }

  /* ── NO IMAGE PLACEHOLDER ── */
  .post-card-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ede9e0 0%, #e0dbd0 100%);
    gap: 10px;
  }

  .placeholder-icon {
    font-size: 32px;
    opacity: 0.4;
  }

  .placeholder-text {
    font-size: 12px;
    color: var(--muted);
    font-weight: 500;
    letter-spacing: 0.05em;
    opacity: 0.6;
  }

  /* ── CARD BODY ── */
  .post-card-body {
    padding: 22px 24px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .post-tag {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #B22222;
    background: rgba(178,34,34,0.07);
    padding: 3px 8px;
    border-radius: 4px;
  }

  .post-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 21px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.3;
  }

  .post-excerpt {
    font-size: 13.5px;
    color: var(--muted);
    line-height: 1.7;
    flex: 1;
  }

  .post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(0,0,0,0.06);
    padding-top: 14px;
    margin-top: 4px;
    font-size: 12px;
    color: var(--muted);
  }

  .post-date {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .read-more {
    color: var(--gold);
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.03em;
    transition: color 0.2s;
  }

  .post-card:hover .read-more { color: #B22222; }

  /* ── EMPTY / LOADING ── */
  .state-box {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 40px;
    gap: 16px;
    color: var(--muted);
  }

  .state-icon { font-size: 40px; opacity: 0.4; }
  .state-title { font-size: 18px; font-weight: 500; color: var(--ink); }
  .state-sub { font-size: 14px; }

  /* ── SKELETON LOADER ── */
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }

  .skeleton {
    background: linear-gradient(90deg, #ede9e0 25%, #e5e0d6 50%, #ede9e0 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 6px;
  }

  .skeleton-card {
    background: #fffdfd;
    border: 1px solid rgba(178,34,34,0.06);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  .skeleton-img  { height: 220px; width: 100%; }
  .skeleton-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 12px; }
  .skeleton-tag  { height: 18px; width: 60px; border-radius: 4px; }
  .skeleton-title-1 { height: 22px; width: 90%; }
  .skeleton-title-2 { height: 22px; width: 65%; }
  .skeleton-line-1  { height: 14px; width: 100%; }
  .skeleton-line-2  { height: 14px; width: 85%; }
  .skeleton-line-3  { height: 14px; width: 70%; }
  .skeleton-footer  { height: 14px; width: 50%; margin-top: 10px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) {
    .hero         { padding: 60px 32px; }
    .posts-grid   { grid-template-columns: repeat(2, 1fr); padding: 0 32px 80px; }
    .section-divider { padding: 0 32px; }
  }

  @media (max-width: 700px) {
    .hero         { padding: 48px 20px; }
    .posts-grid   { grid-template-columns: 1fr; padding: 0 20px 60px; }
    .section-divider { padding: 0 20px; }
  }
`;

/* ── SKELETON CARD ── */
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-tag" />
      <div className="skeleton skeleton-title-1" />
      <div className="skeleton skeleton-title-2" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        <div className="skeleton skeleton-line-1" />
        <div className="skeleton skeleton-line-2" />
        <div className="skeleton skeleton-line-3" />
      </div>
      <div className="skeleton skeleton-footer" />
    </div>
  </div>
);

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  /* ── auth check ── */
  useEffect(() => {
    const check = () => setIsAuthenticated(!!localStorage.getItem("token"));
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  /* ── fetch posts ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:8001/post/");
        const published = (res.data || []).filter(p => p.status === "published");
        setPosts(published);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── image helper: handles both URL and uploaded file paths ── */
  // ✅ Replace your existing getImageSrc with this robust version
const getImageSrc = (image) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
    return image;
  }
  // Normalize path: ensure it starts with /
  const normalizedPath = image.startsWith("/") ? image : `/${image}`;
  return `http://localhost:8001${normalizedPath}`;
};
  const handleStartWriting = () => navigate(isAuthenticated ? "/dashboard" : "/login");

  return (
    <>
      <style>{homeStyle}</style>
      <div className="home-root">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-left">
            <p className="hero-eyebrow">A space for thinkers & writers</p>
            <h1 className="hero-title" style={{ lineHeight: "1.2" }}>
              <em>WRITE</em><br />
              CONNECT<br />
              <em>INSPIRE</em> THE <em>WORLD</em>.
            </h1>
            <p className="hero-sub">
              Experience a minimalist writing space designed for clarity and craft.<br />
              Share your perspectives with a community of refined readers.
            </p>
            <div className="hero-cta">
              <button className="cta-primary" onClick={handleStartWriting}>
                Start Writing Today
              </button>
              <button className="cta-link" onClick={() => navigate("/about")}>
                About our mission →
              </button>
            </div>
          </div>
        </section>

        {/* ── POST COUNT ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 60px", marginBottom: "10px" }}>
          <span className="divider-label" style={{ color: "var(--ink)", fontWeight: 700, fontSize: 13 }}>
            TOTAL POSTS: {loading ? "—" : posts.length}
          </span>
        </div>

        {/* ── DIVIDER ── */}
        <div className="section-divider">
          <div className="divider-line" />
          <div className="divider-boxed">Recent Stories</div>
          <div className="divider-line" />
        </div>

        {/* ── POSTS GRID ── */}
        <div className="posts-grid">

          {/* skeleton while loading */}
          {loading && [1, 2, 3].map(n => <SkeletonCard key={n} />)}

          {/* empty state */}
          {!loading && posts.length === 0 && (
            <div className="state-box">
              <div className="state-icon">📭</div>
              <div className="state-title">No stories yet</div>
              <div className="state-sub">Be the first to publish something.</div>
            </div>
          )}

          {/* post cards */}
          {!loading && posts.map((post) => (
            <div
              key={post._id}
              className="post-card"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              {/* ── IMAGE ── */}
              <div className="post-card-image">
                {post.image ? (
                  <img
                    src={getImageSrc(post.image)}
                    alt={post.title}
                    onError={(e) => {
                      // if image fails to load, show placeholder
                      e.target.style.display = "none";
                      e.target.parentNode.innerHTML = `
                        <div class="post-card-image-placeholder">
                          <div class="placeholder-icon">🖼️</div>
                          <div class="placeholder-text">Image unavailable</div>
                        </div>`;
                    }}
                  />
                ) : (
                  <div className="post-card-image-placeholder">
                    <div className="placeholder-icon">✍️</div>
                    <div className="placeholder-text">No cover image</div>
                  </div>
                )}
              </div>

              {/* ── BODY ── */}
              <div className="post-card-body">

                {/* tags */}
                {post.tags?.length > 0 && (
                  <div className="post-tags">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="post-tag">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="post-title">{post.title}</div>

                <div className="post-excerpt">
                  {post.content?.slice(0, 130)}...
                </div>

                <div className="post-footer">
                  <span className="post-date">
                    🗓 {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric"
                    })}
                  </span>
                  <span className="read-more">Read Entry →</span>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}