import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Login", href: "/login" },
  { label: "Logout", href: "/logout" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // ✅ real route tracking

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (link) => {
    setIsOpen(false);
    if (link.href !== "#") navigate(link.href);
  };

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
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: var(--nav-height);
          font-family: 'DM Sans', sans-serif;
          transition: 0.4s;
        }

        .navbar.scrolled {
          background: rgba(10,10,15,0.85);
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
          gap: 4px;
          list-style: none;
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
          gap: 10px;
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
          .nav-links, .nav-cta {
            display: none;
          }
          .hamburger {
            display: flex;
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
          {navLinks.map((link) => (
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
          <button className="btn-ghost" onClick={() => navigate("/login")}>
            Sign in
          </button>
          <button className="btn-primary">
            Get Started →
          </button>
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

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <div
            key={link.label}
            className={`mobile-link ${location.pathname === link.href ? "active" : ""
              }`}
            onClick={() => handleNavClick(link)}
          >
            {link.label}
          </div>
        ))}
      </div>
    </>
  );
}