import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    // background: #ffffff;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-root {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // background: #ffffff;
  }

  .card {
    width: 420px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    padding: 48px 44px 40px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    animation: fadeUp 0.6s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .logo-area {
    text-align: center;
    margin-bottom: 30px;
  }

  .logo-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: #111827;
  }

  .logo-sub {
    font-size: 13px;
    color: #6b7280;
  }

  .field-group {
    margin-bottom: 16px;
  }

  .field-label {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 6px;
    display: block;
  }

  .field-input {
    width: 100%;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
    font-size: 14px;
    color: #111827;
    outline: none;
    transition: all 0.2s;
  }

  .field-input:focus {
    border-color: #34c759;
    box-shadow: 0 0 0 3px rgba(52,199,89,0.15);
  }

  .error-msg {
    font-size: 12px;
    color: #ef4444;
    margin-top: 4px;
  }

  .row-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 18px 0;
    font-size: 13px;
  }

  .remember {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6b7280;
    cursor: pointer;
  }

  .forgot {
    color: #34c759;
    background: none;
    border: none;
    cursor: pointer;
  }

  /* 🍏 Apple style button */
  .btn-login {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #34c759, #30d158);
    font-size: 14px;
    font-weight: 500;
    color: white;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 6px 20px rgba(52,199,89,0.25);
  }

  .btn-login:hover {
    background: linear-gradient(135deg, #30d158, #28c84c);
    box-shadow: 0 10px 30px rgba(52,199,89,0.35);
    transform: translateY(-1px);
  }

  .btn-login:active {
    transform: scale(0.98);
    box-shadow: 0 4px 12px rgba(52,199,89,0.2);
  }

  .btn-login.loading {
    opacity: 0.7;
    pointer-events: none;
  }

  .spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.5);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 8px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .signup-row {
    text-align: center;
    margin-top: 14px;
    font-size: 13px;
    color: #6b7280;
    
  }

  .signup-link {
    color: #34c759;
    border: none;
    background: none;
    cursor: pointer;
    margin-left: 4px;
  }

//   .success-banner {
//     background: #ecfdf5;
//     border: 1px solid #bbf7d0;
//     border-radius: 10px;
//     padding: 10px;
//     font-size: 13px;
//     color: #166534;
//     text-align: center;
//     margin-bottom: 15px;
//   }
`;

export default function LoginPage() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "At least 6 characters";
    return e;
  };

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const payload={
      email:form.email,
      password:form.password,
    }
    try {
      const res = await axios.post(
        "http://localhost:8001/auth/login",
        payload
      );

      // ✅ store token and user info (if backend sends it)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.userId) {
        localStorage.setItem("userId", res.data.userId);
      }
      if (res.data.userName) {
        localStorage.setItem("userName", res.data.userName);
      }
      toast.success("Login successful 🎉");
      // ✅ redirect after login
      setTimeout(() => {
        navigate("/dashboard");
      }, 600);

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <>
      <style>{style}</style>

      <div className="login-root">
        <div className="card">

          {success && (
            <div className="success-banner">
              ✓ Welcome back!
            </div>
          )}

          <div className="logo-area">
            <div className="logo-title">Welcome back</div>
            <div className="logo-sub">Sign in to continue</div>
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
            />
            {errors.email && <div className="error-msg">{errors.email}</div>}
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              placeholder="••••••"
              value={form.password}
              onChange={ set("password")}
            />
            {errors.password && <div className="error-msg">{errors.password}</div>}
          </div>

          <div className="row-between">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>
            <button className="forgot">Forgot?</button>
          </div>

          <button
            className={`btn-login ${loading ? "loading" : ""}`}
            onClick={handleLogin}
          >
            {loading ? (
              <>
                <span className="spinner" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="signup-row">
            Don't have an account?
            <button 
                 className="signup-link"
                onClick={() => navigate("/register")}
             >
                 Register here
            </button>
          </div>

        </div>
      </div>
    </>
  );
}