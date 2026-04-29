// src/routes/Dashboard.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedModal from "../components/modal/AnimatedModal";
import CreatePostForm from "../components/modal/CreatePostForm";
import CropModal from "../components/modal/CropModal";
import API_BASE_URL from "../config/apiConfig";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { 
    font-family: 'DM Sans', sans-serif; 
    background: linear-gradient(180deg, #fffef9 0%, #fdf6e3 35%, #f4f6f8 100%); 
    min-height: 100vh;
    color: #111827;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .dash-root { min-height: 100vh; padding: 20px 24px 36px; max-width: 1100px; margin: 0 auto; }

  .dashboard-title { 
    font-family: 'Playfair Display', serif; 
    font-size: 40px; 
    font-weight: 700; 
    color: #111827; 
    margin: 0 0 6px 0;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #111827 0%, #5d4037 50%, #8b0000 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0,0,0,0.04);
    position: relative;
    width: fit-content;
  }
  .dashboard-title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #B22222, #ff6b6b);
    border-radius: 2px;
  }

  .welcome-title { margin: 20px 0 4px 0; font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 100; color: #111827; }
  .welcome-sub { margin: 0 0 12px 0; font-size: 13px; color: #6b7280; }
  .span { font-weight: 700; color: #B22222; }
  .span1 { color: #B22222; }

  /* ── PROFILE STATE BOX ── */
  .profile-state {
    background: #ffffff;
    border-radius: 32px;
    padding: 20px 24px;
    margin: 0 16px 24px; 
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 12px 40px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 95%;
    position: relative;
  }

  .profile-edit-btn {
    position: absolute;
    top: calc(60% - 7px);
    right: 24px;
    left: auto;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: rgba(178, 34, 34, 0.06);
    border: 1px solid rgba(178, 34, 34, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;
    transform: translateY(-50%);
  }
  .profile-edit-btn:hover {
    background: rgba(178, 34, 34, 0.12);
    border-color: rgba(178, 34, 34, 0.3);
    transform: scale(1.05) translateY(-52%);
    box-shadow: 0 6px 16px rgba(178, 34, 34, 0.18);
  }
  .profile-edit-btn:active { transform: scale(0.95) translateY(-50%); }

  /* ── BACKGROUND IMAGE CONTAINER ── */
  .profile-bg-container {
    position: relative;
    width: calc(100% + 48px);
    height: 140px;
    border-radius: 24px 24px 0 0;
    overflow: hidden;
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    margin: -20px -24px 0 -24px;
    cursor: pointer;
  }

  .profile-bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .profile-bg-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
  }

  .profile-bg-container:hover .profile-bg-overlay { opacity: 1; }
  .profile-bg-container:hover .profile-bg-image { transform: scale(1.03); }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: -40px;
    position: relative;
    z-index: 2;
  }

  .avatar-container {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    border: 3px solid #fff;
    box-shadow: 0 3px 10px rgba(0,0,0,0.08);
    cursor: pointer;
    flex-shrink: 0;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    color: #6b7280;
    background: #f3f4f6;
  }

  .avatar-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: 0.2s;
    color: #fff;
    font-size: 18px;
  }

  .avatar-container:hover .avatar-overlay { opacity: 1; }

  .user-info-dash {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  .dash-user-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: #B22222;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dash-user-email {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── COMPACT STATS ── */
  .stats-row { 
    display: flex; 
    gap: 14px; 
    flex-wrap: wrap; 
    padding-top: 18px;
    border-top: 1px solid rgba(0,0,0,0.04);
  }

  .stat-card { 
    background: #f9fafb; 
    flex: 1; 
    min-width: 120px; 
    border-radius: 20px;
    padding: 14px 16px; 
    border: 1px solid rgba(0,0,0,0.03); 
    transition: 0.2s; 
    display: flex; 
    align-items: center;
    gap: 12px;
  }
  .stat-card:hover { 
    background: #fff;
    transform: translateY(-2px); 
    box-shadow: 0 8px 16px rgba(0,0,0,0.05);
    border-color: rgba(178,34,34,0.2);
  }

  .stat-icon { 
    width: 30px; 
    height: 30px; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    font-size: 14px; 
    border-radius: 10px;
    flex-shrink: 0;
  }
  
  .stat-content { display: flex; flex-direction: column; }

  .stat-label { 
    font-size: 9px; 
    font-weight: 700; 
    color: #9ca3af; 
    text-transform: uppercase; 
    letter-spacing: .05em; 
  }

  .stat-value { 
    font-size: 18px; 
    font-weight: 700; 
    color: #111827; 
  }

  /* ✨ Section hover effect ✨ */
  .section { 
    border-radius: 16px; 
    padding: 28px; 
    border: 1.4px solid #5d4037; 
    background: #ffffff; 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(93,64,55,0.06);
    position: relative;
    overflow: hidden;
    margin: 0 0 24px 0;
  }
  .section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #B22222, #ff6b6b, #B22222, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .section:hover { 
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(93,64,55,0.15);
    border-color: #8b0000;
  }
  .section:hover::before { opacity: 1; }

  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #111827; }
  .post-list { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); 
    gap: 24px; 
  }

  /* ── MODERN POST CARD ── */
  @keyframes cardFadeIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .post-card {
    position: relative;
    border-radius: 20px;
    background: #ffffff;
    border: 1.5px solid rgba(93,64,55,0.12);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: cardFadeIn 0.5s cubic-bezier(.22,.68,0,1.15) both;
    transition: transform 0.35s cubic-bezier(.22,.68,0,1.15),
                box-shadow 0.35s ease,
                border-color 0.3s ease;
    cursor: pointer;
  }
  .post-card:nth-child(1) { animation-delay: 0.05s; }
  .post-card:nth-child(2) { animation-delay: 0.12s; }
  .post-card:nth-child(3) { animation-delay: 0.19s; }
  .post-card:nth-child(4) { animation-delay: 0.26s; }
  .post-card:nth-child(5) { animation-delay: 0.33s; }
  .post-card:nth-child(6) { animation-delay: 0.40s; }

  .post-card:hover {
    transform: translateY(-8px) scale(1.015);
    box-shadow: 0 20px 50px rgba(178,34,34,0.12), 0 8px 24px rgba(0,0,0,0.08);
    border-color: rgba(178,34,34,0.35);
  }

  .post-card-accent {
    height: 4px;
    background: linear-gradient(90deg, #B22222 0%, #ff6b6b 40%, #c9a84c 100%);
    flex-shrink: 0;
  }
 
  .post-card-body {
    padding: 22px 24px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .post-card-top {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }
  .post-num {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, #B22222, #8b0000);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(178,34,34,0.25);
  }
  .post-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .post-card-content {
    font-size: 13.5px;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  .post-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
  }
  .post-card-tag {
    font-size: 11px;
    font-weight: 500;
    color: #B22222;
    background: rgba(178,34,34,0.08);
    border: 1px solid rgba(178,34,34,0.15);
    padding: 3px 10px;
    border-radius: 20px;
    transition: background 0.2s, color 0.2s;
  }
  .post-card:hover .post-card-tag {
    background: rgba(178,34,34,0.12);
  }

  .post-card-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 24px;
    background: #fafaf8;
    border-top: 1px solid rgba(0,0,0,0.05);
  }

  .post-status-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .post-status-badge.published {
    background: #ecfdf5;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }
  .post-status-badge.draft {
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
  }

  .post-card-spacer { flex: 1; }

  .btn-update {
    padding: 7px 16px;
    border-radius: 8px;
    background: linear-gradient(135deg, #B22222, #8b0000);
    color: #fff;
    border: none;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: transform .2s, box-shadow .2s;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 3px 10px rgba(178,34,34,0.2);
  }
  .btn-update:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(178,34,34,.35);
  }
  .btn-update:active { transform: translateY(0) scale(.97); }

  .btn-delete {
    padding: 7px 16px;
    border-radius: 8px;
    background: #fff;
    color: #dc2626;
    border: 1.5px solid #fecaca;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-delete:hover {
    background: #fef2f2;
    border-color: #f87171;
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(220,38,38,.15);
  }
  .btn-delete:active { transform: translateY(0) scale(.97); }

  .empty-state { text-align: center; padding: 48px 0; color: #9ca3af; }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-title { font-size: 15px; font-weight: 500; color: #6b7280; margin-bottom: 6px; }
  .empty-sub { font-size: 13px; }

  @media (max-width: 768px) {
    .dash-root { padding: 16px 16px 40px; }
    .dashboard-title { font-size: 32px; }
    .welcome-title { font-size: 24px; }
    
    .profile-state { margin: 0 0 24px 0; width: 100%; padding: 12px 16px 20px; border-radius: 20px; }
    .profile-bg-container { width: calc(100% + 32px); height: 110px; margin: -12px -16px 0 -16px; border-radius: 20px 20px 0 0; }
    .profile-header { margin-top: -28px; gap: 12px; }
    .avatar-container { width: 52px; height: 52px; border-width: 2px; }
    .dash-user-name { font-size: 16px; }
    .profile-edit-btn { top: 112px; right: 20px; transform: none; width: 34px; height: 34px; font-size: 14px; }
    
    .stat-card { min-width: 100%; padding: 12px; }
    .stat-value { font-size: 16px; }
    
    .section { padding: 20px 16px; margin: 0 0 24px 0; }
    .section-title { font-size: 22px; }
    .post-list { grid-template-columns: 1fr; gap: 16px; }
    
    .post-card-body { padding: 16px 18px 14px; }
    .post-card-title { font-size: 16px; }
    .post-card-footer { padding: 12px 18px; flex-wrap: wrap; gap: 10px; }
    .btn-update, .btn-delete { flex: 1; text-align: center; justify-content: center; min-width: 80px; }
    
    .modal-card { border-radius: 0; height: 100vh; max-height: 100vh; }
    .modal-header { padding: 20px 24px; }
    .modal-header-icon { width: 40px; height: 40px; font-size: 18px; }
    .modal-body { padding: 20px 24px; }
    .fields-row { grid-template-columns: 1fr; }
  }

  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes overlayOut { from { opacity: 1; } to { opacity: 0; } }
  @keyframes modalIn { from { opacity: 0; transform: translateY(28px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes modalOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(28px) scale(0.96); } }
  @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
  @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(178,34,34,.35); } 70% { box-shadow: 0 0 0 10px rgba(178,34,34,0); } 100% { box-shadow: 0 0 0 0 rgba(178,34,34,0); } }

  .modal-overlay { position: fixed; inset: 0; background: rgba(10,10,20,0.35); backdrop-filter: blur(3px) saturate(110%); display: flex; justify-content: center; align-items: center; z-index: 999; padding: 20px; }
  .modal-overlay.entering { animation: overlayIn .28s ease forwards; }
  .modal-overlay.leaving  { animation: overlayOut .22s ease forwards; }

  .modal-card { background: #fff; border-radius: 20px; width: 680px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,.22), 0 4px 16px rgba(0,0,0,.10), 0 0 0 1px rgba(255,255,255,.8) inset; }
  .modal-card.entering { animation: modalIn .32s cubic-bezier(.34,1.3,.64,1) forwards; }
  .modal-card.leaving  { animation: modalOut .22s ease forwards; }

  .modal-header { position: relative; padding: 28px 32px 24px; background: linear-gradient(135deg, #111827 0%, #1f2f4a 60%, #3b0a0a 100%); overflow: hidden; }
  .modal-header::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,transparent 0%,rgba(255,255,255,.06) 50%,transparent 100%); background-size: 400px 100%; animation: shimmer 3.5s linear infinite; }
  .modal-close-btn { position: absolute; top: 12px; right: 16px; width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); color: rgba(255,255,255,.7); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .18s, color .18s, transform .15s; line-height: 1; }
  .modal-close-btn:hover { background: rgba(255,255,255,.18); color: #fff; transform: scale(1.1); }

  .modal-header-icon { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #B22222, #ff6b6b); display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 12px; box-shadow: 0 4px 16px rgba(178,34,34,.45); animation: pulse-ring 2.4s ease infinite; }
  .modal-header-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .modal-header-sub { font-size: 13px; color: rgba(255,255,255,.5); }

  .modal-body { padding: 28px 32px 32px; overflow-y: auto; flex: 1; }
  .field-group { display: flex; flex-direction: column; gap: 18px; }
  .field-wrap { position: relative; }
  .field-label { position: absolute; left: 14px; top: 13px; font-size: 13px; color: #9ca3af; pointer-events: none; transition: top .18s, font-size .18s, color .18s; background: #fff; padding: 0 4px; }
  .field-input, .field-textarea { width: 100%; padding: 13px 14px 13px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111827; background: #fafafa; outline: none; transition: border-color .2s, background .2s, box-shadow .2s; resize: none; }
  .field-input:focus, .field-textarea:focus { border-color: #B22222; background: #fff; box-shadow: 0 0 0 3.5px rgba(178,34,34,.1); }
  .field-input:focus + .field-label, .field-input:not(:placeholder-shown) + .field-label, .field-textarea:focus + .field-label, .field-textarea:not(:placeholder-shown) + .field-label { top: -8px; font-size: 11px; color: #B22222; }
  .field-textarea { min-height: 110px; padding-top: 14px; }
  .fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .char-counter { font-size: 11px; color: #d1d5db; text-align: right; margin-top: 4px; }
  .tags-preview { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .tag-pill { font-size: 11px; padding: 3px 10px; background: #fef2f2; color: #B22222; border: 1px solid #fecaca; border-radius: 20px; animation: modalIn .18s ease; }

  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
  .btn-cancel { padding: 11px 22px; border-radius: 10px; border: 1.5px solid #e5e7eb; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #6b7280; cursor: pointer; transition: background .18s, border-color .18s, color .18s; }
  .btn-cancel:hover { background: #f9fafb; border-color: #d1d5db; color: #374151; }

  .btn-submit { padding: 11px 28px; border-radius: 10px; background: linear-gradient(135deg, #B22222, #8b0000); color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: transform .15s, box-shadow .2s, opacity .15s; box-shadow: 0 4px 18px rgba(178,34,34,.35); }
  .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 26px rgba(178,34,34,.45); }
  .btn-submit:active { transform: translateY(0) scale(.97); }
  .btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  @keyframes successBounce { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
  .success-flash { text-align: center; padding: 24px 0 8px; }
  .success-icon { font-size: 48px; display: block; margin: 0 auto 12px; animation: successBounce .45s cubic-bezier(.34,1.6,.64,1) forwards; }
  .success-msg { font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 4px; }
  .success-sub { font-size: 13px; color: #9ca3af; }
`;

const initials = (name = "") =>
  (name?.split(" ").map((w) => w[0]).join("") || "U").toUpperCase().slice(0, 2);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  // Image upload states
  const [uploading, setUploading] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewBgUrl, setPreviewBgUrl] = useState(null);

  // Crop modal states
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropType, setCropType] = useState('profile'); // 'profile' or 'background'
  const [originalFile, setOriginalFile] = useState(null);

  const fileInputRef = useRef(null);
  const bgInputRef = useRef(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user || {});
      setPosts(res.data.posts || []);

      if (res.data.user?.profilePic) {
        const pic = res.data.user.profilePic;
        setPreviewUrl(pic.startsWith("http") || pic.startsWith("data:") ? pic : `${API_BASE_URL}${pic.startsWith("/") ? pic : `/${pic}`}`);
      }
      if (res.data.user?.backgroundImage) {
        const bg = res.data.user.backgroundImage;
        setPreviewBgUrl(bg.startsWith("http") || bg.startsWith("data:") ? bg : `${API_BASE_URL}${bg.startsWith("/") ? bg : `/${bg}`}`);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      if (previewBgUrl?.startsWith('blob:')) URL.revokeObjectURL(previewBgUrl);
      if (cropImageSrc?.startsWith('blob:')) URL.revokeObjectURL(cropImageSrc);
    };
  }, [previewUrl, previewBgUrl, cropImageSrc]);

  // Handle file selection for both profile and background
  const handleFileSelect = useCallback((e, type) => {
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
      setOriginalFile(file);
      setCropType(type);
      setCropImageSrc(reader.result);
    };
    reader.onerror = () => alert('Failed to read image. Please try again.');
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  // Handle crop completion and upload
  const handleCropComplete = useCallback(async (croppedBlob, croppedUrl) => {
    const type = cropType;
    setCropImageSrc(null);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    const apiPath = type === 'profile' ? 'profile-pic' : 'background-image';
    const fieldName = type === 'profile' ? 'profilePic' : 'backgroundImage';
    const previewSetter = type === 'profile' ? setPreviewUrl : setPreviewBgUrl;
    const uploadingSetter = type === 'profile' ? setUploading : setUploadingBg;

    formData.append(fieldName, croppedBlob, `${fieldName}-${Date.now()}.jpg`);

    try {
      uploadingSetter(true);
      previewSetter(croppedUrl); // Show preview immediately

      const res = await axios.post(`${API_BASE_URL}/auth/${apiPath}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      alert(`✅ ${type === 'profile' ? 'Profile picture' : 'Cover photo'} updated!`);
      setUser(prev => ({ ...prev, [fieldName]: res.data[fieldName] }));
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert(`❌ Failed to upload ${type}. Please try again.`);
      // Revert preview on error
      if (type === 'profile' && user?.profilePic) {
        const pic = user.profilePic;
        setPreviewUrl(pic.startsWith("http") || pic.startsWith("data:") ? pic : `${API_BASE_URL}${pic.startsWith("/") ? pic : `/${pic}`}`);
      } else if (type === 'background' && user?.backgroundImage) {
        const bg = user.backgroundImage;
        setPreviewBgUrl(bg.startsWith("http") || bg.startsWith("data:") ? bg : `${API_BASE_URL}${bg.startsWith("/") ? bg : `/${bg}`}`);
      } else {
        previewSetter(null);
      }
    } finally {
      uploadingSetter(false);
      setOriginalFile(null);
      setTimeout(() => {
        if (croppedUrl?.startsWith('blob:')) URL.revokeObjectURL(croppedUrl);
      }, 1000);
    }
  }, [cropType, navigate, user?.profilePic, user?.backgroundImage]);

  if (!user) return <div style={{ padding: "50px", textAlign: "center" }}>Loading…</div>;

  const stats = [
    { icon: "📝", bg: "#ecfdf5", label: "Total Posts", value: posts.length },
    { icon: "✅", bg: "#eff6ff", label: "Published", value: posts.filter(p => p.status === "published").length },
    { icon: "📬", bg: "#fdf4ff", label: "Drafts", value: posts.filter(p => p.status === "draft").length },
  ];

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
      alert("Failed to delete post. Please try again.");
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="dash-root">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="welcome">
          <div className="welcome-title">
            Welcome back, <span className="span">{user?.name?.split(" ")[0] || "there"}</span> 👋
          </div>
          <div className="welcome-sub">
            <span className="span1">{user?.email || "No email"}</span> · Here's your content overview
          </div>
        </div>

        <div className="profile-state">
          {/* ✏️ Top-Right Edit Button */}
          <button
            className="profile-edit-btn"
            onClick={() => navigate("/profile/edit")}
            aria-label="Edit profile details"
            title="Edit profile"
          >
            ✏️
          </button>

          {/* 🖼️ Background Image Section */}
          <div
            className="profile-bg-container"
            onClick={() => bgInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                bgInputRef.current?.click();
              }
            }}
            aria-label="Change cover photo"
          >
            {previewBgUrl || user?.backgroundImage ? (
              <img
                src={previewBgUrl ? previewBgUrl : (user.backgroundImage.startsWith("http") || user.backgroundImage.startsWith("data:") ? user.backgroundImage : `${API_BASE_URL}${user.backgroundImage.startsWith("/") ? user.backgroundImage : `/${user.backgroundImage}`}`)}
                className="profile-bg-image"
                alt="Background"
              />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontSize: "13px"
              }}>
                + Add Cover Photo
              </div>
            )}
            <div className="profile-bg-overlay">
              {uploadingBg ? "⏳" : "📸 Change Cover"}
            </div>
            <input
              type="file"
              ref={bgInputRef}
              onChange={(e) => handleFileSelect(e, 'background')}
              className="hidden"
              style={{ display: "none" }}
              accept="image/*"
              aria-hidden="true"
            />
          </div>

          <div className="profile-header">
            <div
              className="avatar-container"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              aria-label="Change profile picture"
            >
              {previewUrl ? (
                <img src={previewUrl} className="avatar-img" alt="Profile" />
              ) : (
                <div className="avatar-initials">{initials(user?.name)}</div>
              )}
              <div className="avatar-overlay">
                {uploading ? "⏳" : "📸 Crop"}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e, 'profile')}
                className="hidden"
                style={{ display: "none" }}
                accept="image/*"
                aria-hidden="true"
              />
            </div>
            <div className="user-info-dash">
              <div className="dash-user-name">{user?.name || "Member"}</div>
              <div className="dash-user-email">{user?.email || "No email provided"}</div>
            </div>
          </div>

          <div className="stats-row">
            {stats.map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div className="stat-content">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "10px 16px",
              background: "#111827",
              color: "#fff",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: "500",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(17,24,39,.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            + Create Post
          </button>
        </div>

        <div className="section">
          <div className="section-header">
            <div className="section-title">Your Posts</div>
            <span className="post-count">
              {posts.length} post{posts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-title">No posts yet</div>
              <div className="empty-sub">Your posts will appear here once created.</div>
            </div>
          ) : (
            <div className="post-list">
              {posts.map((p, i) => (
                <div className="post-card" key={p._id} onClick={() => navigate(`/post/${p._id}`)}>
                  <div className="post-card-accent" />
                  <div className="post-card-body">
                    <div className="post-card-top">
                      <div className="post-num">{i + 1}</div>
                      <div className="post-card-title">{p.title}</div>
                    </div>
                    <div className="post-card-content">{p.content}</div>
                    {p.tags && p.tags.length > 0 && (
                      <div className="post-card-tags">
                        {p.tags.map((t) => (
                          <span className="post-card-tag" key={t}>#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="post-card-footer">
                    <span className={`post-status-badge ${p.status === "published" ? "published" : "draft"}`}>
                      {p.status === "published" ? "Published" : "Draft"}
                    </span>
                    <span className="post-card-spacer" />
                    <button
                      className="btn-update"
                      onClick={(e) => { e.stopPropagation(); navigate(`/edit/${p._id}`); }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreate && (
        <AnimatedModal onClose={() => setShowCreate(false)}>
          {({ close }) => (
            <CreatePostForm
              onClose={close}
              onPostCreated={() => fetchData()}
            />
          )}
        </AnimatedModal>
      )}

      {/* 🔥 Crop Modal */}
      {cropImageSrc && (
        <CropModal
          imageSrc={cropImageSrc}
          aspect={cropType === 'profile' ? 1 : 16 / 9}
          cropShape={cropType === 'profile' ? 'round' : 'rect'}
          title={cropType === 'profile' ? 'Adjust Profile Picture' : 'Adjust Cover Photo'}
          onClose={() => {
            setCropImageSrc(null);
            setOriginalFile(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
};

export default Dashboard;