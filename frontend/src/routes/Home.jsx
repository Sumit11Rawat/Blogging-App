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

  .hero-left {
    flex: 1;
  }

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
  .cta-link:hover {
    color: var(--ink);
  }

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

  /* ── POSTS SECTION ── */
  .posts-section {
    padding: 0 60px 100px;
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 0 60px 80px;
  }

  .post-card {
    position: relative;
    background: #fffdfd;
    border: 1px solid rgba(178,34,34,0.08);
    border-radius: 16px;
    overflow: hidden;
    padding: 24px 24px 22px;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  /* Reddish accent like dashboard */
  .post-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #B22222 0%, #ff6b6b 40%, #c9a84c 100%);
  }

  .post-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(178,34,34,0.12), 0 8px 24px rgba(0,0,0,0.06);
    border-color: var(--gold);
    background: #fff;
  }

  .post-card-image {
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: #f0f0f0;
  }
  .post-card-image img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
  .post-card:hover .post-card-image img { transform: scale(1.05); }

  .post-card-body {
    padding: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .post-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 12px;
  }
  .post-excerpt {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.7;
    flex: 1;
    margin-bottom: 20px;
  }
  .post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(0,0,0,0.05);
    padding-top: 16px;
    font-size: 12px;
    color: var(--muted);
  }
  .read-more { color: var(--gold); font-weight: 600; }

  @media (max-width: 1100px) {
    .posts-section { padding: 0 32px 100px; }
    .hero { padding: 60px 32px; }
    .posts-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 700px) {
    .posts-grid { grid-template-columns: 1fr; }
  }
`;

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8001/post/");
        const published = (res.data || []).filter(p => p.status === "published");
        setPosts(published);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleStartWriting = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <style>{homeStyle}</style>
      <div className="home-root">
        
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-left">
            <h1 className="hero-title" style={{ lineHeight: '1.2' }}>
              <em>WRITE</em><br />
              CONNECT<br />
              <em>INSPIRE</em> THE <em>WORLD</em>.
            </h1>
            <p className="hero-sub" style={{ maxWidth: '520px' }}>
              Experience a minimalist writing space designed for clarity and craft.<br />Share your perspectives with a community of refined readers.
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

        {/* ── TOTAL COUNT ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 60px', marginBottom: '8px' }}>
          <div className="divider-label" style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '13px' }}>
            TOTAL POSTS: {posts.length}
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="section-divider">
          <div className="divider-line" />
          <div className="divider-boxed">Recent Stories</div>
          <div className="divider-line" />
        </div>

        {/* ── POSTS SECTION ── */}
        <section className="posts-section">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>Loading stories...</div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>No stories published yet.</div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post._id} className="post-card" onClick={() => navigate(`/post/${post._id}`)}>
                  <div className="post-card-image">
                    {post.image ? <img src={post.image} alt={post.title} /> : <div style={{ height: '100%', background: '#eee' }} />}
                  </div>
                  <div className="post-card-body">
                    <div className="post-title">{post.title}</div>
                    <div className="post-excerpt">{post.content?.slice(0, 140)}...</div>
                    <div className="post-footer">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="read-more">Read Entry →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}