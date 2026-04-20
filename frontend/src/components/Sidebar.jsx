import { useState } from "react";

const sidebarStyle = `
  .home-sidebar {
    width: 320px;
    flex-shrink: 0;
    position: sticky;
    top: 0; 
    height: 100%;
    max-height: 630px; /* Adjusted for the new lower divider position */
    overflow-y: auto;
    padding: 30px 20px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-right: none;
    border-radius: 28px 0 0 28px;
    box-shadow: -15px 15px 50px rgba(0,0,0,0.05);
    scrollbar-width: none;
    z-index: 10;
  }
  .home-sidebar::-webkit-scrollbar { display: none; }

  .sidebar-widget {
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.03);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 20px;
    transition: 0.3s;
  }
  .sidebar-widget:last-child { margin-bottom: 0; }
  .sidebar-widget:hover { border-color: var(--gold); background: #fff; }

  .widget-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .search-wrap {
    position: relative;
    margin-bottom: 8px;
  }
  .search-input {
    width: 100%;
    padding: 12px 16px 12px 40px;
    background: #fff;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    outline: none;
    transition: 0.2s;
  }
  .search-input:focus { border-color: #B22222; box-shadow: 0 0 0 4px rgba(178,34,34,0.05); }
  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    opacity: 0.6;
  }

  .mini-card {
    display: flex;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0,0,0,0.04);
    cursor: pointer;
    transition: 0.2s;
  }
  .mini-card:last-child { border-bottom: none; }
  .mini-card:hover .mini-title { color: #B22222; }

  .mini-img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    background: var(--cream);
    flex-shrink: 0;
  }

  .mini-info { flex: 1; min-width: 0; }
  .mini-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.3;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .mini-meta {
    font-size: 11px;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag-pill {
    font-size: 11px;
    font-weight: 500;
    background: #fff;
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: 20px;
    cursor: pointer;
    transition: 0.2s;
    color: var(--muted);
  }
  .tag-pill:hover, .tag-pill.active { background: #B22222; color: #fff; border-color: #B22222; }

  .sidebar-toggle {
    display: none;
    width: 100%;
    padding: 14px;
    background: var(--ink);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 24px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: 0.3s;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .sidebar-toggle:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.15);
  }

  .sidebar-toggle::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: 0.5s;
    animation: shimmerToggle 4s infinite linear;
  }

  @keyframes shimmerToggle {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  @media (max-width: 1100px) {
    .sidebar-toggle { display: flex; }
    .home-sidebar { 
      width: 100%; 
      position: relative; 
      top: 0; 
      height: auto; 
      padding: 0 20px 20px; 
      background: transparent;
      border: none;
      box-shadow: none;
    }
    .sidebar-content {
      display: none;
      animation: slideDown 0.3s ease-out;
    }
    .sidebar-content.open {
      display: block;
    }
    .sidebar-widget {
       margin-bottom: 16px;
       border: 1.5px solid rgba(13,13,15,0.06);
       box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Sidebar = ({ 
  posts, 
  onSearchChange, 
  onTagSelect, 
  searchQuery, 
  selectedTag,
  getImageSrc,
  onPostClick
}) => {
  
  const trendingPosts = [...posts]
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
    .slice(0, 5);

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const uniqueTags = [...new Set(posts.flatMap(p => p.tags || []))].sort();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <style>{sidebarStyle}</style>
      <aside className="home-sidebar">
        
        {/* MOBILE TOGGLE */}
        <button 
          className="sidebar-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? "📖 Hide Filters & Search" : "🔍 Search & Filter Stories"}
        </button>

        <div className={`sidebar-content ${isMobileOpen ? "open" : ""}`}>
          {/* SEARCH WIDGET */}
          <div className="sidebar-widget">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search stories..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* TRENDING WIDGET */}
          <div className="sidebar-widget">
            <h3 className="widget-title">🔥 Trending</h3>
            <div className="mini-list">
              {trendingPosts.map(post => (
                <div key={post._id} className="mini-card" onClick={() => onPostClick(`/post/${post._id}`)}>
                  <img src={getImageSrc(post.image) || "https://via.placeholder.com/60"} className="mini-img" alt="" />
                  <div className="mini-info">
                    <div className="mini-title">{post.title}</div>
                    <div className="mini-meta">
                      <span>❤️ {post.likes?.length || 0} Likes</span>
                      <span>•</span>
                      <span>{post.author?.name || "Anonymous"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT STORIES WIDGET */}
          <div className="sidebar-widget">
            <h3 className="widget-title">⏳ Recent Stories</h3>
            <div className="mini-list">
              {recentPosts.map(post => (
                <div key={post._id} className="mini-card" onClick={() => onPostClick(`/post/${post._id}`)}>
                  <div className="mini-info">
                    <div className="mini-title">{post.title}</div>
                    <div className="mini-meta">
                      <span>🗓 {new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORIES WIDGET */}
          <div className="sidebar-widget">
            <h3 className="widget-title">📁 Categories</h3>
            <div className="tag-cloud">
              <div 
                className={`tag-pill ${!selectedTag ? "active" : ""}`}
                onClick={() => onTagSelect("")}
              >
                All Stories
              </div>
              {uniqueTags.map(tag => (
                <div 
                  key={tag} 
                  className={`tag-pill ${selectedTag === tag ? "active" : ""}`}
                  onClick={() => onTagSelect(tag)}
                >
                  #{tag}
                </div>
              ))}
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
