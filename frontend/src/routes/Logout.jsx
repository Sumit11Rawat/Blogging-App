import { useState } from "react";
import { useNavigate } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f4f6f8;
    min-height: 100vh;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes popIn {
    0%   { transform: scale(0.7); opacity: 0; }
    70%  { transform: scale(1.08); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes wave {
    0%   { transform: rotate(0deg);  }
    20%  { transform: rotate(20deg); }
    40%  { transform: rotate(-10deg);}
    60%  { transform: rotate(15deg); }
    80%  { transform: rotate(-5deg); }
    100% { transform: rotate(0deg);  }
  }

  /* ── Root ── */
  .logout-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000000;
    animation: fadeIn 0.4s ease both;
  }

  /* ── Card ── */
  .logout-card {
    width: 420px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 52px 44px 44px;
    box-shadow: 0 12px 48px rgba(0,0,0,0.08);
    text-align: center;
    animation: fadeUp 0.55s ease both;
  }

  /* ── Icon ── */
  .logout-icon-wrap {
    width: 80px; height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    border: 2px solid #fecaca;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 28px;
    font-size: 36px;
    animation: popIn 0.5s cubic-bezier(.34,1.56,.64,1) 0.2s both;
  }

  .logout-icon-wrap.waving {
    animation: popIn 0.5s cubic-bezier(.34,1.56,.64,1) 0.2s both,
               wave 0.8s ease 0.7s 1;
  }

  /* ── Text ── */
  .logout-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 10px;
    animation: fadeUp 0.5s ease 0.25s both;
  }

  .logout-sub {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 36px;
    animation: fadeUp 0.5s ease 0.32s both;
  }

  /* ── Buttons ── */
  .btn-row {
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: fadeUp 0.5s ease 0.38s both;
  }

  .btn-confirm {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: white;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 6px 20px rgba(239,68,68,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-confirm:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    box-shadow: 0 10px 28px rgba(239,68,68,0.35);
    transform: translateY(-1px);
  }

  .btn-confirm:active { transform: scale(0.98); }

  .btn-confirm.loading {
    opacity: 0.75;
    pointer-events: none;
  }

  .btn-cancel {
    width: 100%;
    padding: 13px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-cancel:hover {
    background: #f9fafb;
    border-color: #34c759;
    color: #34c759;
  }

  /* ── Spinner ── */
  .spinner-sm {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  /* ── Bye state ── */
  .bye-wrap {
    animation: fadeUp 0.5s ease both;
  }

  .bye-icon {
    font-size: 52px;
    margin-bottom: 18px;
    display: block;
    animation: wave 1s ease 0.1s 1;
  }

  .bye-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }

  .bye-sub {
    font-size: 14px;
    color: #9ca3af;
  }

  .bye-bar-wrap {
    margin-top: 28px;
    height: 4px;
    background: #f3f4f6;
    border-radius: 99px;
    overflow: hidden;
  }

  .bye-bar {
    height: 100%;
    background: linear-gradient(90deg, #34c759, #30d158);
    border-radius: 99px;
    animation: fillBar 1.8s ease forwards;
  }

  @keyframes fillBar {
    from { width: 0%; }
    to   { width: 100%; }
  }

  /* ── Divider ── */
  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 4px 0;
    animation: fadeUp 0.5s ease 0.38s both;
  }
  .divider-line { flex: 1; height: 1px; background: #f3f4f6; }
  .divider-text { font-size: 12px; color: #d1d5db; }
`;

export default function LogoutPage() {
  const navigate   = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    // Simulate a brief delay for UX (remove setTimeout if not needed)
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoading(false);
      setLoggedOut(true);

      // Redirect to login after showing bye screen
      setTimeout(() => navigate("/login"), 2000);
    }, 900);
  };

  const handleCancel = () => navigate(-1); // go back to previous page

  return (
    <>
      <style>{style}</style>

      <div className="logout-root">
        <div className="logout-card">

          {loggedOut ? (
            /* ── Goodbye state ── */
            <div className="bye-wrap">
              <span className="bye-icon">👋</span>
              <div className="bye-title">See you soon!</div>
              <div className="bye-sub">You've been logged out successfully.<br />Redirecting to login…</div>
              <div className="bye-bar-wrap">
                <div className="bye-bar" />
              </div>
            </div>
          ) : (
            /* ── Confirm state ── */
            <>
              <div className="logout-icon-wrap waving">🔒</div>

              <div className="logout-title">Log out?</div>
              <div className="logout-sub">
                You're about to sign out of your account.<br />
                Any unsaved changes will be lost.
              </div>

              <div className="btn-row">
                <button
                  className={`btn-confirm ${loading ? "loading" : ""}`}
                  onClick={handleLogout}
                >
                  {loading ? (
                    <><span className="spinner-sm" /> Signing out…</>
                  ) : (
                    "Yes, log me out"
                  )}
                </button>

                <div className="divider">
                  <span className="divider-line" />
                  <span className="divider-text">or</span>
                  <span className="divider-line" />
                </div>

                <button className="btn-cancel" onClick={handleCancel}>
                  Cancel — take me back
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}