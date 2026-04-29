import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic Navigation Links
  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    ...(token 
      ? [{ label: "Logout", href: "/logout" }] 
      : [{ label: "Login", href: "/login" }]
    )
  ];

  // Auth sync
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storedToken) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      setUser(storedUser);

      axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      }).then(res => {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }).catch(err => {
        if (err.response?.status === 401) {
           localStorage.clear();
           setToken(null);
           setUser(null);
        }
      });
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleNavClick = (link) => {
    setIsOpen(false);
    navigate(link.href);
  };

  const initials = (name = "") =>
    (name?.split(" ").map((w) => w[0]).join("") || "U").toUpperCase().slice(0, 2);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0a0f;
          --surface: rgba(255,255,255,0.04);
          --border: rgba(255,255,255,0.08);
          --accent: #c8ff00;
          --accent-dim: rgba(200,255,0,0.12);
          --text: #f0f0f0;
          --muted: #888;
          --nav-height: 68px;
        }

        body {
          background: var(--bg);
          padding-top: var(--nav-height);
        }

        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 2000 !important;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: var(--nav-height);
          background: #000000;
          font-family: 'DM Sans', sans-serif;
          transition: 0.4s;
          border-bottom: 1px solid var(--border);
        }

        .navbar.scrolled {
          background: #000000;
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 var(--border), 0 8px 32px rgba(0,0,0,0.4);
        }

        /* LOGO */
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .logo-mark {
          width: 34px;
          height: 34px;
          background: var(--accent);
          color: var(--bg);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          color: var(--text);
        }

        /* NAV LINKS */
        .nav-links {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 20px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          position: relative;
          color: var(--muted);
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        /* REMOVE DEFAULT LINE */
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: var(--accent);
          transition: 0.3s;
        }

        .nav-link:hover {
          color: var(--accent);
          background: var(--accent-dim);
        }

        .nav-link:hover::after {
          width: 24px;
        }

        /* ACTIVE ONLY WHEN ROUTE MATCHES */
        .nav-link.active {
          color: var(--accent);
        }

        .nav-link.active::after {
          width: 24px;
        }

        /* CTA */
        .nav-cta {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
        }

        .btn-ghost {
          color: var(--muted);
          background: none;
          border: none;
          padding: 8px 14px;
          cursor: pointer;
          border-radius: 8px;
          transition: 0.2s;
        }

        .btn-ghost:hover {
          color: var(--accent);
          background: var(--accent-dim);
        }

        .btn-primary {
          background: var(--accent);
          color: var(--bg);
          border: none;
          padding: 9px 18px;
          border-radius: 9px;
          cursor: pointer;
        }

        /* PROFILE WRAP — same color as nav links */
        .nav-profile-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 6px 14px;
          border-radius: 8px;
          transition: all 0.25s ease;
        }
        .nav-profile-wrap:hover {
          background: var(--accent-dim);
        }
        .nav-profile-wrap:hover .nav-user-name {
          color: var(--accent);
        }

        .nav-user-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--muted);
          transition: color 0.25s;
        }

        .nav-avatar-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid var(--muted);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--surface);
          transition: 0.25s;
        }
        .nav-profile-wrap:hover .nav-avatar-circle {
          border-color: var(--accent);
        }

        .nav-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .nav-initials {
          font-size: 12px;
          font-weight: 700;
          color: var(--muted);
          transition: color 0.25s;
        }
        .nav-profile-wrap:hover .nav-initials {
          color: var(--accent);
        }

        /* HAMBURGER */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
        }

        .ham-bar {
          width: 20px;
          height: 2px;
          background: var(--text);
        }

        /* MOBILE */
        .mobile-menu {
          position: fixed;
          top: var(--nav-height);
          left: 0;
          right: 0;
          background: var(--bg);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-10px);
          transition: 0.3s;
          z-index: 1999 !important;
        }

        .mobile-menu.open {
          opacity: 1;
          pointer-events: all;
          transform: translateY(0);
        }

        .mobile-link {
          padding: 12px;
          border-radius: 10px;
          color: var(--muted);
          cursor: pointer;
          transition: 0.2s;
        }

        .mobile-link:hover {
          color: var(--accent);
          background: var(--accent-dim);
        }

        .mobile-link.active {
          color: var(--accent);
        }

        @media (max-width: 768px) {
          .navbar { padding: 0 1rem; }
          .logo-text { font-size: 16px; }
          .nav-links, .nav-cta {
            display: none !important;
          }
          .hamburger {
            display: flex;
          }
          .mobile-menu {
            padding: 1.5rem;
            max-height: calc(100vh - var(--nav-height));
            overflow-y: auto;
          }
          .mobile-link {
            font-size: 16px;
            font-weight: 500;
          }
          .mobile-auth-section {
            border-top: 1px solid var(--border);
            margin-top: 10px;
            padding-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>

      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>

        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/")}>
          <div className="logo-mark">N</div>
          <div className="logo-text">Navbar</div>
        </div>

        {/* DESKTOP LINKS */}
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.label}>
              <div
                className={`nav-link ${location.pathname === link.href ? "active" : ""
                  }`}
                onClick={() => handleNavClick(link)}
              >
                {link.label}
              </div>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="nav-cta">
          {token ? (
            <div className="nav-profile-wrap" onClick={() => navigate("/dashboard")}>
              <span className="nav-user-name">{user?.name?.split(" ")[0]}</span>
              <div className="nav-avatar-circle">
                {user?.profilePic ? (
                  <img src={user.profilePic.startsWith("http") || user.profilePic.startsWith("data:") ? user.profilePic : `${API_BASE_URL}${user.profilePic.startsWith("/") ? user.profilePic : `/${user.profilePic}`}`} className="nav-avatar-img" alt="Profile" />
                ) : (
                  <span className="nav-initials">{initials(user?.name)}</span>
                )}
              </div>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Get Started →
            </button>
          )}
        </div>

        {/* HAMBURGER */}
        <div
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="ham-bar"></span>
          <span className="ham-bar"></span>
          <span className="ham-bar"></span>
        </div>
      </nav>

      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        {links.map((link) => (
          <div
            key={link.label}
            className={`mobile-link ${location.pathname === link.href ? "active" : ""
              }`}
            onClick={() => handleNavClick(link)}
          >
            {link.label}
          </div>
        ))}
        
        {/* MOBILE AUTH/PROFILE SECTION */}
        <div className="mobile-auth-section">
          {token ? (
            <>
              <div className="mobile-link" onClick={() => handleNavClick({ href: "/dashboard" })}>
                👤 Dashboard ({user?.name?.split(" ")[0]})
              </div>
              <div className="mobile-link" style={{ color: '#ff6b6b' }} onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}>
                🚪 Logout
              </div>
            </>
          ) : (
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleNavClick({ href: "/login" })}>
              Get Started →
            </button>
          )}
        </div>
      </div>
    </>
  );
}