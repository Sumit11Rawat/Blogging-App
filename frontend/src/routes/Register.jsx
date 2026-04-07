import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ✅ Keep global dark (navbar safe) */
  body {
    font-family: 'DM Sans', sans-serif;
    // background: #0a0a0f;
  }

  /* ✅ Only this section white */
  .reg-root {
    min-height: calc(100vh - 70px);
    display: flex;
    align-items: center;
    justify-content: center;
    // background: #f9fafb;
    padding: 30px 15px;
  }

  .card {
    width: 420px;
    background: #ffffff;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  }

  .logo-area {
    text-align: center;
    margin-bottom: 20px;
  }

  .logo-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: #111827;
  }

  .logo-sub {
    font-size: 13px;
    color: #6b7280;
  }

  .two-col {
    display: flex;
    gap: 10px;
  }

  .field-group {
    margin-bottom: 14px;
    width: 100%;
  }

  .field-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
    display: block;
  }

  .field-input {
    width: 100%;
    padding: 11px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    font-size: 14px;
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

  /* 🍏 Apple button */
  .btn-register {
    width: 100%;
    padding: 13px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #34c759, #30d158);
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 6px 20px rgba(52,199,89,0.25);
  }

  .btn-register:hover {
    background: linear-gradient(135deg, #30d158, #28c84c);
    box-shadow: 0 10px 30px rgba(52,199,89,0.35);
    transform: translateY(-1px);
  }

  .btn-register:active {
    transform: scale(0.98);
  }

  .terms-row {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: #6b7280;
    margin: 12px 0;
  }

  .success-banner {
    background: #ecfdf5;
    border: 1px solid #bbf7d0;
    padding: 10px;
    border-radius: 10px;
    text-align: center;
    color: #166534;
    margin-bottom: 10px;
  }

  .login-row {
    text-align: center;
    margin-top: 14px;
    font-size: 13px;
    color: #6b7280;
  }

  .login-link {
    color: #34c759;
    border: none;
    background: none;
    cursor: pointer;
    margin-left: 4px;
  }
`;

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: ""
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
  };

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = "Required";
    if (!form.lastName) e.lastName = "Required";
    if (!form.email) e.email = "Required";
    if (!form.password) e.password = "Required";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.firstName + " " + form.lastName,
      email: form.email,
      password: form.password,
    };
    try {
      const res = await axios.post(
        "http://localhost:8001/auth/signup",
        payload
      );
      // console.log(res.data);
        
      toast.success("Registration successful 🎉");
      // console.log(res.data);
      // alert(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 600);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <>
      <style>{style}</style>

      <div className="reg-root">
        <div className="card">

          {success && (
            <div className="success-banner">
              ✓ Account created successfully
            </div>
          )}

          <div className="logo-area">
            <div className="logo-title">Create account</div>
            <div className="logo-sub">Join us today</div>
          </div>

          <div className="two-col">
            <div className="field-group">
              <label className="field-label">First Name</label>
              <input className="field-input" value={form.firstName} onChange={set("firstName")} />
              {errors.firstName && <div className="error-msg">{errors.firstName}</div>}
            </div>

            <div className="field-group">
              <label className="field-label">Last Name</label>
              <input className="field-input" value={form.lastName} onChange={set("lastName")} />
              {errors.lastName && <div className="error-msg">{errors.lastName}</div>}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input className="field-input" value={form.email} onChange={set("email")} />
            {errors.email && <div className="error-msg">{errors.email}</div>}
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input type="password" className="field-input" value={form.password} onChange={set("password")} />
          </div>

          <div className="field-group">
            <label className="field-label">Confirm Password</label>
            <input type="password" className="field-input" value={form.confirm} onChange={set("confirm")} />
            {errors.confirm && <div className="error-msg">{errors.confirm}</div>}
          </div>

          <div className="terms-row">
            <input type="checkbox" />
            <span>I agree to Terms & Conditions</span>
          </div>

          <button className="btn-register" onClick={handleSubmit}>
            Create Account
          </button>

          <div className="login-row">
            Already have an account?
            <button 
                 className="login-link"
                onClick={() => navigate("/login")}
             >
                 Sign in
            </button>
          </div>

        </div>
      </div>
    </>
  );
}