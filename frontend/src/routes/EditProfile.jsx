// src/routes/EditProfile.jsx
import { useState, useEffect, useRef, useCallback } from "react"; // ✅ Added useCallback
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import CropModal from "../components/modal/CropModal";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { 
    font-family: 'DM Sans', sans-serif; 
    background: linear-gradient(180deg, #fffef9 0%, #fdf6e3 35%, #f4f6f8 100%); 
    min-height: 100vh;
    color: #111827;
  }

  .edit-root { 
    min-height: 100vh; 
    padding: 40px 24px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
  }

  .edit-card {
    background: #ffffff;
    border-radius: 24px;
    padding: 40px;
    width: 100%;
    max-width: 520px;
    border: 1.5px solid #5d4037;
    box-shadow: 0 20px 60px rgba(93,64,55,0.12);
    animation: slideUp 0.4s cubic-bezier(.22,.68,0,1.15);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .edit-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }

  .edit-back-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .edit-back-btn:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    transform: translateX(-2px);
  }

  .edit-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: #111827;
  }

  .edit-subtitle {
    font-size: 13px;
    color: #6b7280;
    margin-top: 2px;
  }

  .form-group { margin-bottom: 24px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; }

  .form-input {
    width: 100%;
    padding: 14px 16px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #111827;
    background: #fafafa;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .form-input:focus {
    outline: none;
    border-color: #B22222;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(178,34,34,0.1);
  }
  .form-input:disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }
  .form-hint { font-size: 12px; color: #9ca3af; margin-top: 6px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .btn-group {
    display: flex;
    gap: 12px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(0,0,0,0.06);
  }

  .btn-cancel {
    flex: 1;
    padding: 14px;
    border-radius: 12px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-cancel:hover { background: #f9fafb; border-color: #d1d5db; color: #374151; }

  .btn-save {
    flex: 1;
    padding: 14px;
    border-radius: 12px;
    background: linear-gradient(135deg, #B22222, #8b0000);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 18px rgba(178,34,34,0.35);
  }
  .btn-save:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(178,34,34,0.45); }
  .btn-save:active { transform: translateY(0) scale(0.98); }
  .btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

  .success-toast {
    position: fixed;
    top: 24px;
    right: 24px;
    background: #ecfdf5;
    border: 1px solid #bbf7d0;
    color: #16a34a;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 24px rgba(22,163,74,0.15);
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
    z-index: 1000;
  }
  @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes fadeOut { to { opacity: 0; transform: translateX(20px); } }

  /* Image Upload Section */
  .image-upload-group {
    margin-bottom: 28px;
    padding: 16px;
    background: #fafafa;
    border-radius: 16px;
    border: 1.5px dashed #e5e7eb;
    transition: border-color 0.2s, background 0.2s;
  }
  .image-upload-group:hover { border-color: #B22222; background: #fef2f2; }

  .image-upload-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .image-upload-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #B22222, #8b0000);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .image-upload-title { font-weight: 600; font-size: 14px; color: #111827; }
  .image-upload-sub { font-size: 12px; color: #6b7280; margin-top: 2px; }
  .image-preview-row { display: flex; gap: 16px; margin-top: 12px; flex-wrap: wrap; }

  .image-preview-item {
    position: relative; border-radius: 12px; overflow: hidden;
    background: #fff; border: 2px solid #e5e7eb;
    cursor: pointer; transition: border-color 0.2s, transform 0.2s;
  }
  .image-preview-item:hover { border-color: #B22222; transform: scale(1.03); }
  .image-preview-item.profile { border-radius: 50%; width: 80px; height: 80px; }
  .image-preview-item.background { border-radius: 12px; width: 140px; height: 60px; }
  .image-preview-img { width: 100%; height: 100%; object-fit: cover; }
  .image-preview-placeholder {
    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
    color: #9ca3af; font-size: 14px; background: #f3f4f6;
  }
  .image-preview-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 11px; opacity: 0; transition: opacity 0.2s;
  }
  .image-preview-item:hover .image-preview-overlay { opacity: 1; }
  .image-upload-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
  .btn-upload {
    padding: 8px 16px; border-radius: 8px; background: #fff;
    border: 1.5px solid #e5e7eb; color: #374151; font-size: 12px;
    font-weight: 500; cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-upload:hover { background: #f9fafb; border-color: #B22222; color: #B22222; }

  @media (max-width: 600px) {
    .edit-card { padding: 28px 24px; margin: 0 16px; }
    .form-row { grid-template-columns: 1fr; }
    .btn-group { flex-direction: column; }
    .image-preview-row { justify-content: center; }
  }
    /* ── MODAL OVERLAY STYLES (Required for CropModal) ── */
@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes overlayOut { from { opacity: 1; } to { opacity: 0; } }
@keyframes modalIn { from { opacity: 0; transform: translateY(28px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes modalOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(28px) scale(0.96); } }
@keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
@keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(178,34,34,.35); } 70% { box-shadow: 0 0 0 10px rgba(178,34,34,0); } 100% { box-shadow: 0 0 0 0 rgba(178,34,34,0); } }

.modal-overlay {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(10,10,20,0.35) !important;
  backdrop-filter: blur(3px) saturate(110%) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 9999 !important;
  padding: 20px !important;
}
.modal-overlay.entering { animation: overlayIn .28s ease forwards; }
.modal-overlay.leaving  { animation: overlayOut .22s ease forwards; }

.modal-card {
  background: #fff !important;
  border-radius: 20px !important;
  width: 680px !important;
  max-width: 95% !important;
  max-height: 90vh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  box-shadow: 0 32px 80px rgba(0,0,0,.22), 0 4px 16px rgba(0,0,0,.10), 0 0 0 1px rgba(255,255,255,.8) inset !important;
  position: relative !important;
  z-index: 10000 !important;
}
.modal-card.entering { animation: modalIn .32s cubic-bezier(.34,1.3,.64,1) forwards; }
.modal-card.leaving  { animation: modalOut .22s ease forwards; }

.modal-header {
  position: relative;
  padding: 28px 32px 24px;
  background: linear-gradient(135deg, #111827 0%, #1f2f4a 60%, #3b0a0a 100%);
  overflow: hidden;
}
.modal-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,transparent 0%,rgba(255,255,255,.06) 50%,transparent 100%);
  background-size: 400px 100%;
  animation: shimmer 3.5s linear infinite;
}
.modal-close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.7);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .18s, color .18s, transform .15s;
  line-height: 1;
}
.modal-close-btn:hover {
  background: rgba(255,255,255,.18);
  color: #fff;
  transform: scale(1.1);
}

.modal-header-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #B22222, #ff6b6b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 12px;
  box-shadow: 0 4px 16px rgba(178,34,34,.45);
  animation: pulse-ring 2.4s ease infinite;
}
.modal-header-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}
.modal-header-sub {
  font-size: 13px;
  color: rgba(255,255,255,.5);
}

.modal-body {
  padding: 28px 32px 32px;
  overflow-y: auto;
  flex: 1;
}
`;

const initials = (name = "") =>
  (name?.split(" ").map((w) => w[0]).join("") || "U").toUpperCase().slice(0, 2);

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: "", email: "", bio: "", location: "", website: "",
    profilePicFile: null, backgroundImageFile: null
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [profilePreview, setProfilePreview] = useState(null);
  const [bgPreview, setBgPreview] = useState(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropType, setCropType] = useState('profile');
  const [uploading, setUploading] = useState(false);
  
  const profileInputRef = useRef(null);
  const bgInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login", { state: { from: location.pathname } });
      try {
        const res = await axios.get("http://localhost:8001/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = res.data.user || {};
        setFormData({
          name: user.name || "", email: user.email || "", bio: user.bio || "",
          location: user.location || "", website: user.website || "",
          profilePicFile: null, backgroundImageFile: null
        });
        if (user.profilePic) setProfilePreview(`http://localhost:8001${user.profilePic}`);
        if (user.backgroundImage) setBgPreview(`http://localhost:8001${user.backgroundImage}`);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
  }, [navigate, location.pathname]);

  useEffect(() => {
    return () => {
      if (profilePreview?.startsWith('blob:')) URL.revokeObjectURL(profilePreview);
      if (bgPreview?.startsWith('blob:')) URL.revokeObjectURL(bgPreview);
      if (cropImageSrc?.startsWith('blob:')) URL.revokeObjectURL(cropImageSrc);
    };
  }, [profilePreview, bgPreview, cropImageSrc]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // ✅ FIX #1: Wrap in useCallback with empty deps for stable reference
  const handleImageSelect = useCallback((e, type) => {
    console.log(`[EditProfile] handleImageSelect called for ${type}`);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(`[EditProfile] FileReader loaded, setting cropType=${type}`);
      setCropType(type);
      setCropImageSrc(reader.result); // ✅ This triggers CropModal render
    };
    reader.onerror = () => alert('Failed to read image. Please try again.');
    reader.readAsDataURL(file);
    e.target.value = ""; // Reset to allow re-selecting same file
  }, []); // ✅ Empty deps = function never changes

  // ✅ FIX #2: Wrap in useCallback with cropType dependency
  const handleCropComplete = useCallback(async (croppedBlob, croppedUrl) => {
    console.log(`[EditProfile] handleCropComplete: type=${cropType}`);
    setCropImageSrc(null); // Close modal
    const type = cropType; // Capture current value
    const previewSetter = type === 'profile' ? setProfilePreview : setBgPreview;
    previewSetter(croppedUrl);
    setFormData(prev => ({
      ...prev,
      [type === 'profile' ? 'profilePicFile' : 'backgroundImageFile']: croppedBlob
    }));
  }, [cropType]); // ✅ Include cropType to avoid stale closure

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      let profilePicPath = formData.profilePicFile ? null : (JSON.parse(localStorage.getItem("user") || "{}")?.profilePic || "");
      let bgPath = formData.backgroundImageFile ? null : (JSON.parse(localStorage.getItem("user") || "{}")?.backgroundImage || "");
      if (formData.profilePicFile) {
        const imgForm = new FormData();
        imgForm.append('profilePic', formData.profilePicFile, 'avatar.jpg');
        const res = await axios.post("http://localhost:8001/auth/profile-pic", imgForm, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });
        profilePicPath = res.data.profilePic;
      }
      if (formData.backgroundImageFile) {
        const imgForm = new FormData();
        imgForm.append('backgroundImage', formData.backgroundImageFile, 'cover.jpg');
        const res = await axios.post("http://localhost:8001/auth/background-image", imgForm, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });
        bgPath = res.data.backgroundImage;
      }
      const updateData = {
        name: formData.name, bio: formData.bio, location: formData.location, website: formData.website,
        ...(profilePicPath && { profilePic: profilePicPath }),
        ...(bgPath && { backgroundImage: bgPath })
      };
      await axios.put("http://localhost:8001/auth/profile", updateData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      setSuccess(true);
      const cachedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (cachedUser) localStorage.setItem("user", JSON.stringify({ ...cachedUser, ...updateData }));
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="edit-root">
        <div className="edit-card">
          <div className="edit-header">
            <button className="edit-back-btn" onClick={() => navigate("/dashboard")} aria-label="Go back">←</button>
            <div>
              <div className="edit-title">Edit Profile</div>
              <div className="edit-subtitle">Update your personal information</div>
            </div>
          </div>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", marginBottom: "20px" }}>⚠️ {error}</div>
          )}
          <form onSubmit={handleSubmit}>
            {/* 🖼️ Image Upload Section */}
            <div className="image-upload-group">
              <div className="image-upload-header">
                <div className="image-upload-icon">🖼️</div>
                <div>
                  <div className="image-upload-title">Profile Images</div>
                  <div className="image-upload-sub">Click to upload or change images</div>
                </div>
              </div>
              <div className="image-preview-row">
                {/* Profile Picture */}
                <div 
                  className="image-preview-item profile"
                  onClick={() => {
                    console.log('[EditProfile] Profile preview clicked');
                    profileInputRef.current?.click();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      profileInputRef.current?.click();
                    }
                  }}
                  role="button" tabIndex={0} aria-label="Change profile picture"
                >
                  {profilePreview ? (
                    <img src={profilePreview} className="image-preview-img" alt="Profile preview" />
                  ) : (
                    <div className="image-preview-placeholder">{initials(formData.name)}</div>
                  )}
                  <div className="image-preview-overlay">✏️</div>
                  <input
                    type="file" ref={profileInputRef}
                    onChange={(e) => {
                      console.log('[EditProfile] Profile file input changed');
                      handleImageSelect(e, 'profile');
                    }}
                    style={{ display: 'none' }} accept="image/*"
                  />
                </div>
                {/* Background Image */}
                <div 
                  className="image-preview-item background"
                  onClick={() => {
                    console.log('[EditProfile] Background preview clicked');
                    bgInputRef.current?.click();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      bgInputRef.current?.click();
                    }
                  }}
                  role="button" tabIndex={0} aria-label="Change cover photo"
                >
                  {bgPreview ? (
                    <img src={bgPreview} className="image-preview-img" alt="Background preview" />
                  ) : (
                    <div className="image-preview-placeholder">+ Cover</div>
                  )}
                  <div className="image-preview-overlay">✏️</div>
                  <input
                    type="file" ref={bgInputRef}
                    onChange={(e) => {
                      console.log('[EditProfile] Background file input changed');
                      handleImageSelect(e, 'background');
                    }}
                    style={{ display: 'none' }} accept="image/*"
                  />
                </div>
              </div>
              <div className="image-upload-actions">
                <button type="button" className="btn-upload" onClick={() => profileInputRef.current?.click()}>Change Profile Pic</button>
                <button type="button" className="btn-upload" onClick={() => bgInputRef.current?.click()}>Change Cover Photo</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" className="form-input" value={formData.name} onChange={handleChange} placeholder="Enter your name" required minLength={2} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="you@example.com" required disabled />
              <div className="form-hint">Email cannot be changed. Contact support for assistance.</div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bio">Bio</label>
              <textarea id="bio" name="bio" className="form-input" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows={3} style={{ resize: "vertical", minHeight: "80px" }} maxLength={200} />
              <div className="form-hint">{formData.bio.length}/200 characters</div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="location">Location</label>
                <input type="text" id="location" name="location" className="form-input" value={formData.location} onChange={handleChange} placeholder="City, Country" maxLength={100} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="website">Website</label>
                <input type="url" id="website" name="website" className="form-input" value={formData.website} onChange={handleChange} placeholder="https://your-site.com" />
              </div>
            </div>
            <div className="btn-group">
              <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard")} disabled={loading}>Cancel</button>
              <button type="submit" className="btn-save" disabled={loading || uploading}>{loading ? "Saving..." : "💾 Save Changes"}</button>
            </div>
          </form>
        </div>
      </div>
      {success && (
        <div className="success-toast"><span>✅</span><span>Profile updated successfully!</span></div>
      )}
      {/* 🔥 Crop Modal - Now guaranteed to render when cropImageSrc is set */}
      {cropImageSrc && (
        <CropModal
          imageSrc={cropImageSrc}
          aspect={cropType === 'profile' ? 1 : 16/9}
          cropShape={cropType === 'profile' ? 'round' : 'rect'}
          title={cropType === 'profile' ? 'Adjust Profile Picture' : 'Adjust Cover Photo'}
          onClose={() => {
            console.log('[EditProfile] CropModal closed');
            setCropImageSrc(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
};

export default EditProfile;