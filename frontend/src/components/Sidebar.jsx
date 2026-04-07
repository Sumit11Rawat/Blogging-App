import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const sidebarStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Outfit:wght@300;400;500;600&display=swap');

  .sidebar-container {
    width: 300px;
    flex-shrink: 0;
    padding: 20px 0 40px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    font-family: 'Outfit', sans-serif;
  }

  .sidebar-card {
    background: #ffffff;
    border: 1.5px solid rgba(201,168,76,0.25);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .sidebar-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  }

  .sidebar-card-header {
    padding: 16px 20px 12px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar-card-icon { font-size: 18px; }
  .sidebar-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 600;
    color: #0d0d0f;
  }

  .sidebar-card-body { padding: 12px 20px 16px; }

  /* Trending items */
  .trending-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0,0,0,0.04);
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 8px;
    padding-left: 8px; padding-right: 8px; margin: 0 -8px;
  }
  .trending-item:last-child { border-bottom: none; }
  .trending-item:hover { background: rgba(201,168,76,0.06); }

  .trending-rank {
    width: 26px; height: 26px; border-radius: 8px;
    background: linear-gradient(135deg, rgba(139,0,0,0.9), rgba(178,34,34,0.85));
    color: #fff; font-size: 11px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    margin-top: 2px;
  }
  .trending-info { flex: 1; min-width: 0; }
  .trending-title {
    font-size: 13px; font-weight: 600; color: #0d0d0f; line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    margin-bottom: 3px;
  }
  .trending-meta { font-size: 11px; color: #8a8070; display: flex; gap: 8px; align-items: center; }

  /* Categories */
  .categories-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .category-pill {
    font-size: 12px; font-weight: 500; color: #c9a84c;
    background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25);
    padding: 5px 14px; border-radius: 20px; cursor: default; transition: all 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .category-pill:hover { background: rgba(201,168,76,0.18); border-color: #c9a84c; transform: translateY(-1px); }
  .category-count { font-size: 10px; font-weight: 700; background: rgba(201,168,76,0.2); color: #c9a84c; padding: 1px 6px; border-radius: 10px; }

  /* Recent items */
  .recent-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 0;
    border-bottom: 1px solid rgba(0,0,0,0.04); cursor: pointer;
    transition: background 0.2s; border-radius: 6px;
    padding-left: 8px; padding-right: 8px; margin: 0 -8px;
  }
  .recent-item:last-child { border-bottom: none; }
  .recent-item:hover { background: rgba(201,168,76,0.06); }
  .recent-dot { width: 6px; height: 6px; border-radius: 50%; background: #c9a84c; flex-shrink: 0; }
  .recent-info { flex: 1; min-width: 0; }
  .recent-title { font-size: 13px; font-weight: 500; color: #0d0d0f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .recent-date { font-size: 11px; color: #8a8070; }

  @media (max-width: 1100px) {
    .sidebar-container { display: none; }
  }
`;

export default function Sidebar() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:8001/post/");
        const published = res.data.filter(p => p.status === "published");
        setPosts(published);
      } catch (err) {
        console.error("Sidebar fetch failed:", err);
      }
    };
    fetchPosts();
  }, []);

  const trendingPosts = [...posts]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5);

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const categories = posts.reduce((acc, post) => {
    (post.tags || []).forEach(tag => {
      const t = tag.trim().toLowerCase();
      if (t) acc[t] = (acc[t] || 0) + 1;
    });
    return acc;
  }, {});

  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <aside className="sidebar-container">
      <style>{sidebarStyle}</style>

      {/* 🔥 Trending */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <span className="sidebar-card-icon">🔥</span>
          <span className="sidebar-card-title">Trending</span>
        </div>
        <div className="sidebar-card-body">
          {trendingPosts.length === 0 ? (
            <div style={{ color: '#8a8070', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>No stories yet</div>
          ) : (
            trendingPosts.map((post, i) => (
              <div key={post._id} className="trending-item" onClick={() => navigate(`/post/${post._id}`)}>
                <div className="trending-rank">{i + 1}</div>
                <div className="trending-info">
                  <div className="trending-title">{post.title}</div>
                  <div className="trending-meta">
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>·</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🏷️ Categories */}
      {sortedCategories.length > 0 && (
        <div className="sidebar-card">
          <div className="sidebar-card-header">
            <span className="sidebar-card-icon">🏷️</span>
            <span className="sidebar-card-title">Categories</span>
          </div>
          <div className="sidebar-card-body">
            <div className="categories-list">
              {sortedCategories.map(([tag, count]) => (
                <span className="category-pill" key={tag}>
                  {tag}
                  <span className="category-count">{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 📝 Recent */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <span className="sidebar-card-icon">📝</span>
          <span className="sidebar-card-title">Recent</span>
        </div>
        <div className="sidebar-card-body">
          {recentPosts.map((post) => (
            <div key={post._id} className="recent-item" onClick={() => navigate(`/post/${post._id}`)}>
              <div className="recent-dot" />
              <div className="recent-info">
                <div className="recent-title">{post.title}</div>
                <div className="recent-date">{formatDate(post.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
