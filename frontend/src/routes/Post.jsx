// pages/PostDetail.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const postDetailStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

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
    --comment-bg: #fafafa;
    --reply-bg: #f0ede8;
    --reply-bg-deep: #e8e4dc;
    --reply-indent: 56px;
    --box-shadow: 0 25px 80px rgba(13,13,15,0.25), 0 8px 30px rgba(178,34,34,0.15);
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f4f6f8;
    margin: 0;
  }

  .bg-canvas { 
    position: fixed; 
    inset: 0; 
    z-index: 0; 
    background: linear-gradient(135deg, #f4f6f8 0%, #e8ecf0 100%);
    overflow: hidden; 
    pointer-events: none;
  }
  
  .blob { 
    position: absolute; 
    border-radius: 50%; 
    filter: blur(90px); 
    animation: blobFloat var(--dur) ease-in-out var(--delay) infinite alternate; 
    opacity: 0.5; 
  }
  .blob-1 { width: 500px; height: 500px; background: radial-gradient(circle, #f9c0c0, #f4c2d8); top: -120px; left: -100px; --dur: 14s; --delay: 0s; }
  .blob-2 { width: 400px; height: 400px; background: radial-gradient(circle, #c2d4f9, #c9e8f5); bottom: -80px; right: -80px; --dur: 18s; --delay: -5s; }
  .blob-3 { width: 280px; height: 280px; background: radial-gradient(circle, #f9e6c0, #fde8d0); top: 40%; left: 60%; --dur: 11s; --delay: -3s; }
  .blob-4 { width: 200px; height: 200px; background: radial-gradient(circle, #d4f0c2, #c8f0e8); top: 60%; left: 10%; --dur: 15s; --delay: -8s; }
  
  @keyframes blobFloat { 
    0%{transform:translate(0,0) scale(1);} 
    50%{transform:translate(30px,-30px) scale(1.06);} 
    100%{transform:translate(-15px,20px) scale(0.96);} 
  }
  
  .dot-grid { 
    position: absolute; 
    inset: 0; 
    background-image: radial-gradient(circle, #b0b8c4 1.2px, transparent 1.2px); 
    background-size: 28px 28px; 
    opacity: 0.3; 
    mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%); 
    pointer-events: none;
  }
  
  .ring { 
    position: absolute; 
    border-radius: 50%; 
    border: 1.5px solid rgba(178,34,34,0.08); 
    animation: ringPulse var(--rdur) ease-in-out var(--rdelay) infinite; 
    pointer-events: none;
  }
  .ring-1 { width: 260px; height: 260px; top: 8%; left: 5%; --rdur: 8s; --rdelay: 0s; }
  .ring-2 { width: 160px; height: 160px; top: 20%; left: 12%; --rdur: 8s; --rdelay: 0s; }
  .ring-3 { width: 340px; height: 340px; bottom: 6%; right: 4%; --rdur: 10s; --rdelay: -3s; }
  .ring-4 { width: 200px; height: 200px; bottom: 14%; right: 11%; --rdur: 10s; --rdelay: -3s; }
  
  @keyframes ringPulse { 
    0%,100%{transform:scale(1);opacity:0.5} 
    50%{transform:scale(1.08);opacity:1} 
  }
  
  .streak { 
    position: absolute; 
    width: 1px; 
    background: linear-gradient(to bottom, transparent, rgba(178,34,34,0.1), transparent); 
    animation: streakFade var(--sdur) ease-in-out var(--sdelay) infinite; 
    opacity: 0; 
    transform: rotate(-30deg); 
    transform-origin: top center;
    pointer-events: none;
  }
  .streak-1 { height: 300px; top: 5%; left: 25%; --sdur: 7s; --sdelay: 0s; }
  .streak-2 { height: 200px; top: 30%; left: 70%; --sdur: 9s; --sdelay: -4s; }
  .streak-3 { height: 250px; top: 55%; left: 45%; --sdur: 6s; --sdelay: -2s; }
  
  @keyframes streakFade { 
    0%,100%{opacity:0} 
    40%,60%{opacity:1} 
  }

  .post-root { 
    position: relative; 
    z-index: 1; 
    min-height: 100vh; 
    font-family: 'Outfit', sans-serif;
    background: transparent;
    color: var(--ink);
    padding: 32px 24px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .post-box {
    width: 100%;
    max-width: 780px;
    background: var(--card-bg);
    border-radius: 24px;
    border: 2px solid rgba(139, 0, 0, 0.6);
    box-shadow: var(--box-shadow);
    overflow: hidden;
    position: relative;
    margin-top: -40px;
  }

  .post-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      rgba(178,34,34,0.9) 0%, 
      var(--gold) 30%, 
      rgba(178,34,34,0.9) 70%, 
      var(--gold-light) 100%
    );
    z-index: 2;
  }

  .post-box::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.03);
    pointer-events: none;
    z-index: 1;
  }

  .post-back-btn { 
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 0 20px;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s;
    margin-bottom: 16px;
  }
  .post-back-btn:hover { color: var(--ink); }

  .post-content-wrapper {
    padding: 32px 40px 40px;
    position: relative;
    z-index: 2;
  }
  .post-article {
    margin-top: -85px;
  }

  .post-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 600;
    line-height: 1.15;
    color: var(--ink);
    margin-bottom: 20px;
  }

  .post-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    padding: 2px 0;
  }
  
  .post-tag::before {
    content: '';
    display: block;
    width: 14px;
    height: 1px;
    background: var(--gold);
  }
  .post-meta {
    font-size: 13px;
    color: var(--muted);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    width: 100%;
  }

  .post-meta-main {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .post-author-name {
    color: var(--ink);
    font-size: 14px;
  }

  .meta-dot {
    color: var(--gold);
    font-weight: bold;
    opacity: 0.6;
  }

  .post-actions-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .post-intel {
    background: transparent;
    border-bottom: 1px solid var(--border);
    padding-bottom: 32px;
    margin-bottom: 32px;
    width: 100%;
  }

  .btn-like-post {
    background: white;
    border: 1px solid var(--border);
    padding: 8px 18px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Outfit', sans-serif;
    color: var(--ink);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .btn-like-post .heart-icon {
    font-size: 16px;
    filter: drop-shadow(0 2px 4px rgba(178,34,34,0.2));
  }

  .btn-like-post:hover {
    transform: translateY(-1px);
    border-color: var(--gold);
    box-shadow: 0 4px 12px rgba(201,168,76,0.15);
  }

  .btn-like-post.liked {
    background: rgba(178,34,34,0.05);
    border-color: rgba(178,34,34,0.3);
    color: #B22222;
  }

  .btn-like-post.liked .heart-icon {
    transform: scale(1.1);
  }

  .post-tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }


  .post-image {
    width: 100%;
    height: 360px;
    object-fit: cover;
    display: block;
    border-radius: 14px;
    margin: 24px 0 36px;
    background: linear-gradient(135deg, var(--cream) 0%, #e4ddd0 100%);
    border: 1px solid rgba(0,0,0,0.05);
  }

  .post-image-placeholder {
    width: 100%;
    height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    margin: 24px 0 36px;
    background: linear-gradient(135deg, var(--cream) 0%, #e4ddd0 100%);
    position: relative;
    border: 1px solid rgba(0,0,0,0.05);
  }
  .post-image-placeholder::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 18px,
      rgba(201,168,76,0.08) 18px,
      rgba(201,168,76,0.08) 19px
    );
    border-radius: 14px;
  }
  .placeholder-glyph {
    font-family: 'Cormorant Garamond', serif;
    font-size: 80px;
    font-style: italic;
    color: rgba(201,168,76,0.35);
    user-select: none;
  }

  .post-content {
    font-size: 18px;
    line-height: 1.9;
    color: var(--ink);
    white-space: pre-wrap;
    font-family: 'DM Sans', sans-serif;
  }

  .post-content p { margin-bottom: 1.2em; }
  .post-content h2 { 
    font-family: 'Cormorant Garamond', serif; 
    font-size: 28px; 
    margin: 1.5em 0 0.8em; 
    font-weight: 600;
    color: var(--ink);
  }
  .post-content blockquote {
    border-left: 3px solid var(--gold);
    padding-left: 20px;
    margin: 1.5em 0;
    font-style: italic;
    color: var(--muted);
    background: rgba(201,168,76,0.06);
    padding: 16px 20px;
    border-radius: 0 8px 8px 0;
  }

  .comments-section {
    border-top: 1px solid rgba(139, 0, 0, 0.4);
    padding-top: 48px;
    margin-top: 60px;
    position: relative;
    z-index: 2;
    background: rgba(201, 168, 76, 0.03);
    margin: 60px -40px -40px;
    padding: 48px 40px;
  }

  .community-header {
    border-bottom: 2px solid var(--gold);
    padding-bottom: 16px;
    margin-bottom: 32px;
  }


  .comments-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 24px;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .comments-title::before {
    content: '💬';
    font-size: 20px;
  }

  .comment-form {
    background: var(--comment-bg);
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 28px;
    border: 1px solid rgba(178,34,34,0.1);
    position: relative;
  }
  .comment-form::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
    border-radius: 14px 14px 0 0;
  }

  .comment-form.reply-form {
    margin: 12px 0 12px var(--reply-indent);
    background: #fff;
    border-color: rgba(201,168,76,0.25);
  }

  .form-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .form-input {
    flex: 1;
    padding: 12px 16px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
    font-size: 14px;
    outline: none;
    transition: 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .form-input:focus {
    border-color: #B22222;
    box-shadow: 0 0 0 3px rgba(178,34,34,0.12);
  }

  .form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
    font-size: 14px;
    outline: none;
    transition: 0.2s;
    font-family: 'DM Sans', sans-serif;
    min-height: 80px;
    resize: vertical;
  }
  .form-textarea:focus {
    border-color: #B22222;
    box-shadow: 0 0 0 3px rgba(178,34,34,0.12);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 8px;
  }

  .btn-cancel {
    padding: 10px 18px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #fff;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    transition: 0.2s;
  }
  .btn-cancel:hover { background: #f3f4f6; }

  .btn-submit {
    padding: 10px 22px;
    border-radius: 10px;
    background: linear-gradient(135deg, #B22222, #8b0000);
    color: #fff;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    box-shadow: 0 6px 18px rgba(178,34,34,.35);
    transition: 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(178,34,34,.45);
  }
  .btn-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .comment-item {
    padding: 18px 0;
    border-bottom: 1px solid rgba(0,0,0,0.04);
  }
  .comment-item:last-child { border-bottom: none; }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .comment-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    color: var(--ink);
    flex-shrink: 0;
    border: 2px solid rgba(255,255,255,0.9);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .comment-author {
    font-weight: 600;
    font-size: 14px;
    color: var(--ink);
  }

  .comment-date {
    font-size: 12px;
    color: var(--muted);
    margin-left: auto;
  }

  .comment-body {
    font-size: 14px;
    line-height: 1.6;
    color: var(--ink);
    margin-bottom: 10px;
    padding-left: 54px;
  }

  .comment-actions {
    display: flex;
    gap: 12px;
    padding-left: 54px;
    flex-wrap: wrap;
  }

  .comment-action {
    font-size: 12px;
    color: var(--muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    transition: color 0.2s, background 0.2s;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    gap: 4px;
    border-radius: 6px;
  }
  .comment-action:hover { 
    color: #B22222; 
    background: rgba(178,34,34,0.08);
  }
  .comment-action.liked { 
    color: #B22222; 
    font-weight: 600;
    background: rgba(178,34,34,0.12);
  }
  .comment-action.delete-btn {
    color: #8b0000;
  }
  .comment-action.delete-btn:hover {
    background: rgba(139,0,0,0.12);
  }

  .replies-list {
    margin-top: 16px;
    margin-left: var(--reply-indent);
    padding: 16px 16px 16px 24px;
    border-left: 3px solid var(--gold);
    background: var(--reply-bg);
    border-radius: 0 12px 12px 0;
    position: relative;
  }
  
  .replies-list .replies-list {
    background: var(--reply-bg-deep);
    border-left-color: var(--gold-light);
    margin-left: 24px;
  }
  
  .replies-list .replies-list .replies-list {
    background: #dcd8d0;
    border-left-color: var(--gold);
  }
  
  .replies-list .replies-list .replies-list .replies-list {
    border-left: 2px dashed rgba(201,168,76,0.4);
    background: #d4d0c8;
  }

  .reply-item {
    padding: 14px 0;
    border-bottom: 1px dashed rgba(0,0,0,0.06);
  }
  .reply-item:last-child { border-bottom: none; }

  .reply-item .comment-body,
  .reply-item .comment-actions {
    padding-left: 0;
  }

  .reply-item .comment-avatar {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }

  .reply-item .comment-author { font-size: 13px; }
  .reply-item .comment-body { font-size: 13px; margin-bottom: 8px; }
  .reply-item .comment-date { font-size: 11px; }

  .replies-list::before {
    content: '';
    position: absolute;
    left: -3px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    border-radius: 3px 0 0 3px;
  }

  .comments-empty {
    text-align: center;
    padding: 40px 20px;
    color: var(--muted);
    font-size: 14px;
    background: rgba(201,168,76,0.05);
    border-radius: 12px;
    border: 1px dashed rgba(201,168,76,0.3);
  }
  .comments-empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
    opacity: 0.6;
  }

  .login-prompt {
    background: linear-gradient(135deg, rgba(201,168,76,0.08), rgba(178,34,34,0.06));
    border: 1.5px dashed rgba(178,34,34,0.25);
    border-radius: 14px;
    padding: 28px 24px;
    text-align: center;
    margin-bottom: 28px;
  }
  .login-prompt-icon {
    font-size: 36px;
    margin-bottom: 10px;
    opacity: 0.7;
  }
  .login-prompt-text {
    font-size: 15px;
    color: var(--muted);
    margin-bottom: 14px;
    font-family: 'DM Sans', sans-serif;
  }
  .login-prompt-btn {
    padding: 10px 28px;
    border-radius: 10px;
    background: linear-gradient(135deg, #B22222, #8b0000);
    color: #fff;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    box-shadow: 0 6px 18px rgba(178,34,34,.3);
    transition: 0.2s;
  }
  .login-prompt-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(178,34,34,.45);
  }

  .commenting-as {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 12px;
    font-family: 'DM Sans', sans-serif;
  }
  .commenting-as strong {
    color: var(--ink);
    font-weight: 600;
  }

  .post-loading,
  .post-error {
    text-align: center;
    padding: 60px 24px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: var(--muted);
  }
  .post-error { color: #8b0000; }

  .corner-accent {
    position: absolute;
    width: 60px;
    height: 60px;
    pointer-events: none;
    opacity: 0.6;
  }
  .corner-accent.top-right {
    top: 20px;
    right: 20px;
    border-top: 2px solid var(--gold);
    border-right: 2px solid var(--gold);
    border-radius: 0 12px 0 0;
  }
  .corner-accent.bottom-left {
    bottom: 20px;
    left: 20px;
    border-bottom: 2px solid var(--gold);
    border-left: 2px solid var(--gold);
    border-radius: 0 0 0 12px;
  }

  .btn-delete-post {
    margin-left: auto;
    padding: 6px 14px;
    background: linear-gradient(135deg, #B22222, #8b0000);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: 0.2s;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(178,34,34,0.3);
  }
  .btn-delete-post:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(178,34,34,0.4);
  }

  @media (max-width: 768px) {
    .post-box { border-radius: 20px; }
    .post-content-wrapper { padding: 24px 28px 32px; }
    .post-image, .post-image-placeholder { height: 260px; }
    .post-content { font-size: 16px; }
    .form-row { flex-direction: column; }
    .corner-accent { width: 40px; height: 40px; }
    :root { --reply-indent: 40px; }
    .bg-canvas { display: none; }
    .comment-body { padding-left: 0; }
    .comment-actions { padding-left: 0; }
    .replies-list { margin-left: 24px; padding-left: 16px; }
    .post-meta { flex-wrap: wrap; gap: 8px; }
    .btn-delete-post { margin-left: 0; margin-top: 12px; width: 100%; justify-content: center; }
  }
`;

// ── Helper Functions ──
function formatDate(dateStr) {
  if (!dateStr) return "Recently";
  return new Date(dateStr).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  });
}

function wordCount(text) {
  return Math.ceil((text || "").split(/\s+/).filter(w => w).length / 200);
}

function getInitials(name) {
  return name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
}

// ✅ NEW: Robust user comparison helper (userId primary, name fallback)
const isSameUser = (commentUserId, commentAuthor, currentUserId, currentUserName) => {
  const cUserId = String(commentUserId || "").trim().toLowerCase();
  const curUserId = String(currentUserId || "").trim().toLowerCase();
  
  // Primary: Compare by userId if both exist
  if (cUserId && curUserId) {
    return cUserId === curUserId;
  }
  
  // Fallback: Compare by name only if userId is missing on either side
  // Also ignore "Guest" as a valid author for deletion
  if (!cUserId || !curUserId) {
    const cAuthor = (commentAuthor || "").trim().toLowerCase();
    const curName = (currentUserName || "").trim().toLowerCase();
    return cAuthor && curName && cAuthor === curName && curName !== "guest";
  }
  
  return false;
};

// ── Comment Schema Helper ──
const createComment = (content, author = "Guest", userId = null, parentId = null) => ({
  _id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
  author,
  userId, // ✅ Store userId with comment
  content,
  createdAt: new Date().toISOString(),
  parentId,
  replies: [],
  likes: 0,
  likedBy: [],
});

// ── Recursive Comment Component ──
const CommentItem = ({ 
  comment, 
  onLike, 
  onDelete,
  replyingTo, 
  setReplyingTo, 
  replyContent, 
  setReplyContent, 
  handleSubmitReply, 
  submitting,
  currentUserId,
  currentUserName,
  isLoggedIn,
  depth = 0 
}) => {
  const isReplying = replyingTo === comment._id;
  
  // ✅ Use robust userId-based authorization with name fallback
  const isAuthor = isSameUser(
    comment.userId, 
    comment.author, 
    currentUserId, 
    currentUserName
  );

  const userIdStr = String(currentUserId);
  const hasLiked = comment.likedBy?.some(uid => String(uid) === userIdStr);
  const replyValue = replyContent[comment._id] || "";

  return (
    <div className={depth > 0 ? "reply-item" : "comment-item"}>
      <div className="comment-header">
        <div className="comment-avatar">{getInitials(comment.author)}</div>
        <span className="comment-author">{comment.author}</span>
        <span className="comment-date">{formatDate(comment.createdAt)}</span>
      </div>
      
      <div className="comment-body" style={{ paddingLeft: depth === 0 ? "54px" : 0 }}>
        {comment.content}
      </div>
      
      <div className="comment-actions" style={{ paddingLeft: depth === 0 ? "54px" : 0 }}>
        {/* Reply Button - only for logged in users */}
        {isLoggedIn && (
          <button 
            className="comment-action"
            onClick={() => setReplyingTo(isReplying ? null : comment._id)}
            aria-label={isReplying ? "Cancel reply" : `Reply to ${comment.author}`}
            type="button"
          >
            ↩ {isReplying ? "Cancel" : "Reply"}
          </button>
        )}
        
        {/* Like Button - only for logged in users */}
        {isLoggedIn && (
          <button 
            className={`comment-action ${hasLiked ? 'liked' : ''}`}
            onClick={() => onLike(comment._id)}
            aria-label={hasLiked ? "Unlike comment" : "Like comment"}
            type="button"
          >
            👍 {typeof comment.likes === 'number' ? comment.likes : 0}
          </button>
        )}
        
        {/* Delete Button - Shows for comment author only */}
        {isAuthor && (
          <button 
            className="comment-action delete-btn"
            onClick={() => onDelete(comment._id, depth > 0)}
            aria-label="Delete comment"
            type="button"
          >
            🗑️ Delete
          </button>
        )}
      </div>

      {/* Reply Form */}
      {isReplying && (
        <form 
          className="comment-form reply-form"
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleSubmitReply(comment._id, depth + 1); 
          }}
          style={{ marginLeft: depth > 0 ? `${depth * 28}px` : "var(--reply-indent)" }}
        >
          <textarea
            className="form-textarea"
            placeholder="Write a reply..."
            value={replyValue}
            onChange={(e) => setReplyContent(prev => ({ ...prev, [comment._id]: e.target.value }))}
            required
            aria-label="Reply content"
          />
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => { 
                setReplyingTo(null); 
                setReplyContent(prev => ({ ...prev, [comment._id]: "" })); 
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={submitting || !replyValue.trim()}>
              {submitting && <span className="spinner" aria-hidden="true" />}
              Reply
            </button>
          </div>
        </form>
      )}

      {/* Recursively Render Nested Replies */}
      {comment.replies?.length > 0 && (
        <div className="replies-list">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onLike={onLike}
              onDelete={onDelete}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleSubmitReply={handleSubmitReply}
              submitting={submitting}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              isLoggedIn={isLoggedIn}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const currentUserId = localStorage.getItem("userId") || "guest-user";
  const currentUserName = localStorage.getItem("userName") || "Guest";

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isPostAuthor, setIsPostAuthor] = useState(false);

  const [newComment, setNewComment] = useState({ content: "" });
  const isLoggedIn = !!token;
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const findCommentInTree = useCallback((comments, commentId) => {
    for (let cmt of comments) {
      if (cmt._id === commentId) return cmt;
      if (cmt.replies?.length) {
        const found = findCommentInTree(cmt.replies, commentId);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const updateCommentInTree = useCallback((comments, commentId, updater) => {
    return comments.map(cmt => {
      if (cmt._id === commentId) {
        return updater({ ...cmt });
      }
      if (cmt.replies?.length) {
        return { ...cmt, replies: updateCommentInTree(cmt.replies, commentId, updater) };
      }
      return cmt;
    });
  }, []);

  const addReplyToTree = useCallback((comments, parentId, newReply) => {
    return comments.map(cmt => {
      if (cmt._id === parentId) {
        return { ...cmt, replies: [...(cmt.replies || []), newReply] };
      }
      if (cmt.replies?.length) {
        return { ...cmt, replies: addReplyToTree(cmt.replies, parentId, newReply) };
      }
      return cmt;
    });
  }, []);

  const removeCommentFromTree = useCallback((comments, commentId) => {
    return comments
      .filter(cmt => cmt._id !== commentId)
      .map(cmt => ({
        ...cmt,
        replies: cmt.replies ? removeCommentFromTree(cmt.replies, commentId) : []
      }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`http://localhost:8001/post/${id}`),
          axios.get(`http://localhost:8001/post/${id}/comments`).catch(() => ({ data: [] }))
        ]);

        if (postRes.data.status !== "published") {
          setError("This post is not available.");
        } else {
          const postData = postRes.data;
          if (!postData.likes) postData.likes = [];
          setPost(postData);
          
          // Check if current user is the post author
          const postAuthorId = String(postRes.data.author?._id || postRes.data.author || "");
          const currentId = String(currentUserId);
          setIsPostAuthor(postAuthorId && currentId && postAuthorId === currentId);
          
          // ✅ Format comments to preserve userId and normalize data
          const formatComments = (cmts) => cmts.map(cmt => ({
            ...cmt,
            _id: String(cmt._id),
            userId: cmt.userId ? String(cmt.userId) : null, // ✅ Preserve userId
            likes: typeof cmt.likes === 'number' ? cmt.likes : 0,
            likedBy: Array.isArray(cmt.likedBy) ? cmt.likedBy.map(String) : [],
            replies: cmt.replies ? formatComments(cmt.replies) : []
          }));
          const formattedComments = formatComments(commentsRes.data || []);
          setComments(formattedComments);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load this post.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUserId]);

  // ── Submit New Top-Level Comment ──
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.content.trim() || !isLoggedIn) return;

    setSubmitting(true);
    try {
      const payload = {
        content: newComment.content,
        parentId: null,
        userId: currentUserId,
      };

      const res = await axios.post(
        `http://localhost:8001/post/${id}/comments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCmt = res.data ? {
        ...res.data,
        _id: String(res.data._id),
        userId: res.data.userId ? String(res.data.userId) : null,
        likes: res.data.likes || 0,
        likedBy: Array.isArray(res.data.likedBy) ? res.data.likedBy.map(String) : [],
        replies: []
      } : createComment(newComment.content, currentUserName, currentUserId, null);
      
      setComments(prev => [newCmt, ...prev]);
      setNewComment({ content: "" });
    } catch (err) {
      console.error("Comment error:", err);
      const localComment = createComment(newComment.content, currentUserName, currentUserId, null);
      setComments(prev => [localComment, ...prev]);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit Reply ──
  const handleSubmitReply = async (parentId, depth) => {
    const content = replyContent[parentId]?.trim();
    if (!content) return;

    setSubmitting(true);
    try {
      const payload = {
        author: currentUserName || "Guest",
        content,
        parentId,
        userId: currentUserId, // ✅ Include userId in payload
      };

      const res = await axios.post(
        `http://localhost:8001/post/${id}/comments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newReply = res.data ? {
        ...res.data,
        _id: String(res.data._id),
        userId: res.data.userId ? String(res.data.userId) : null, // ✅ Preserve userId
        likes: res.data.likes || 0,
        likedBy: Array.isArray(res.data.likedBy) ? res.data.likedBy.map(String) : [],
        replies: []
      } : createComment(content, payload.author, currentUserId, parentId);
      
      setComments(prev => addReplyToTree(prev, parentId, newReply));
      setReplyContent(prev => ({ ...prev, [parentId]: "" }));
      setReplyingTo(null);
      
    } catch (err) {
      console.error("Reply error:", err);
      const localReply = createComment(content, currentUserName || "Guest", currentUserId, parentId);
      setComments(prev => addReplyToTree(prev, parentId, localReply));
      setReplyContent(prev => ({ ...prev, [parentId]: "" }));
      setReplyingTo(null);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Handle Post Like/Unlike ──
  const handleLikePost = async () => {
    if (!isLoggedIn) {
      alert("Please log in to like this post.");
      return;
    }

    const userIdStr = String(currentUserId);
    const currentlyLiked = post.likes?.some(uid => String(uid) === userIdStr);

    // Optimistic UI Update
    setPost(prev => ({
      ...prev,
      likes: currentlyLiked
        ? (prev.likes || []).filter(uid => String(uid) !== userIdStr)
        : [...(prev.likes || []), userIdStr]
    }));

    try {
      const res = await axios.post(
        `http://localhost:8001/post/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Sync with final server state
      if (res.data.likes) {
        setPost(prev => ({ ...prev, likes: res.data.likes }));
      }
    } catch (err) {
      console.error("Post Like error:", err);
      // Revert on error
      setPost(prev => ({
        ...prev,
        likes: currentlyLiked
          ? [...(prev.likes || []), userIdStr]
          : (prev.likes || []).filter(uid => String(uid) !== userIdStr)
      }));
    }
  };

  // ── Handle Like/Unlike ──
  const handleLikeComment = async (commentId) => {
    const userIdStr = String(currentUserId);
    
    const comment = findCommentInTree(comments, commentId);
    if (!comment) return;
    
    const currentLikedBy = Array.isArray(comment.likedBy) 
      ? comment.likedBy.map(String) 
      : [];
    const currentlyLiked = currentLikedBy.includes(userIdStr);
    const currentLikes = typeof comment.likes === 'number' ? comment.likes : 0;
  
    setComments(prev => updateCommentInTree(prev, commentId, (cmt) => {
      const likedBy = Array.isArray(cmt.likedBy) ? cmt.likedBy.map(String) : [];
      return {
        ...cmt,
        likes: currentlyLiked 
          ? Math.max(0, (typeof cmt.likes === 'number' ? cmt.likes : 0) - 1)
          : (typeof cmt.likes === 'number' ? cmt.likes : 0) + 1,
        likedBy: currentlyLiked
          ? likedBy.filter(uid => uid !== userIdStr)
          : [...likedBy, userIdStr]
      };
    }));
  
    try {
      await axios.post(
        `http://localhost:8001/post/comments/${commentId}/like`,
        { 
          userId: currentUserId, 
          action: currentlyLiked ? 'unlike' : 'like' 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Like API error:", err);
      setComments(prev => updateCommentInTree(prev, commentId, (cmt) => {
        const likedBy = Array.isArray(cmt.likedBy) ? cmt.likedBy.map(String) : [];
        return {
          ...cmt,
          likes: currentlyLiked 
            ? (typeof cmt.likes === 'number' ? cmt.likes : 0) + 1
            : Math.max(0, (typeof cmt.likes === 'number' ? cmt.likes : 0) - 1),
          likedBy: currentlyLiked
            ? [...likedBy, userIdStr]
            : likedBy.filter(uid => uid !== userIdStr)
        };
      }));
    }
  };

  // ── Handle Delete Comment/Reply ──
  const handleDeleteComment = async (commentId, isReply = false) => {
    if (!window.confirm("Delete this comment? This cannot be undone.")) {
      return;
    }

    try {
        await axios({
            method: "DELETE",
            url: `http://localhost:8001/post/comments/${commentId}`,
            headers: { Authorization: `Bearer ${token}` },
            data: { userId: currentUserId },
          });
      
      setComments(prev => removeCommentFromTree(prev, commentId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete comment. You may not have permission.");
    }
  };

  // ── Handle Delete Post ──
  const handleDeletePost = async () => {
    if (!window.confirm("⚠️ Delete this entire post? All comments will be lost. This cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8001/post/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Post deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Failed to delete post. You may not have permission.");
    }
  };

  // ── Loading State ──
  if (loading) {
    return (
      <>
        <style>{postDetailStyle}</style>
        <div className="bg-canvas">
          <div className="blob blob-1" /><div className="blob blob-2" />
          <div className="blob blob-3" /><div className="blob blob-4" />
          <div className="dot-grid" />
          <div className="ring ring-1" /><div className="ring ring-2" />
          <div className="ring ring-3" /><div className="ring ring-4" />
          <div className="streak streak-1" /><div className="streak streak-2" />
          <div className="streak streak-3" />
        </div>
        <div className="post-root">
          <div className="post-box">
            <div className="post-content-wrapper">
              <div className="post-loading">Loading story…</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Error State ──
  if (error || !post) {
    return (
      <>
        <style>{postDetailStyle}</style>
        <div className="bg-canvas">
          <div className="blob blob-1" /><div className="blob blob-2" />
          <div className="blob blob-3" /><div className="blob blob-4" />
          <div className="dot-grid" />
          <div className="ring ring-1" /><div className="ring ring-2" />
          <div className="ring ring-3" /><div className="ring ring-4" />
          <div className="streak streak-1" /><div className="streak streak-2" />
          <div className="streak streak-3" />
        </div>
        <div className="post-root">
          <div className="post-box">
            <div className="post-content-wrapper">
              <button className="post-back-btn" onClick={() => navigate("/")}>
                ← Back to Home
              </button>
              <div className="post-error">{error || "Post not found"}</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main Render ──
  return (
    <>
      <style>{postDetailStyle}</style>
      
      {/* Animated Background */}
      <div className="bg-canvas">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="blob blob-3" /><div className="blob blob-4" />
        <div className="dot-grid" />
        <div className="ring ring-1" /><div className="ring ring-2" />
        <div className="ring ring-3" /><div className="ring ring-4" />
        <div className="streak streak-1" /><div className="streak streak-2" />
        <div className="streak streak-3" />
      </div>

      <div className="post-root">
        <div className="post-box">
          <div className="corner-accent top-right" />
          <div className="corner-accent bottom-left" />

          <button className="post-back-btn" onClick={() => navigate("/")}>
            ← Back to Home
          </button>

          <div className="post-content-wrapper">
            <article className="post-article">
              {/* Title, Tags, and Meta are BACK at the TOP */}
              <div className="post-intel" style={{ marginBottom: '36px', marginTop: '60px' }}>
                <div className="post-tags-container">
                  {(post.tags && post.tags.length > 0) ? post.tags.map((tag, idx) => (
                    <span key={idx} className="post-tag">{tag}</span>
                  )) : (
                    <span className="post-tag">Essay</span>
                  )}
                </div>
                
                <h1 className="post-title" style={{ fontSize: '56px', marginBottom: '16px' }}>{post.title}</h1>
                
                <div className="post-meta">
                  <div className="post-meta-main">
                    <span className="post-author-name">By <strong>{post.author?.name || "Anonymous"}</strong></span>
                    <span className="meta-dot">·</span>
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="meta-dot">·</span>
                    <span>{wordCount(post.content)} min read</span>
                  </div>
                  
                  <div className="post-actions-meta">
                    <button 
                      className={`btn-like-post ${post.likes?.some(uid => String(uid) === String(currentUserId)) ? 'liked' : ''}`}
                      onClick={handleLikePost}
                      title="Like this post"
                    >
                      <span className="heart-icon">❤️</span> {post.likes?.length || 0}
                    </button>

                    {isPostAuthor && (
                      <button 
                        className="btn-delete-post"
                        onClick={handleDeletePost}
                        type="button"
                      >
                        🗑️ Delete Post
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {post.image ? (
                <img src={post.image} alt={post.title} className="post-image" style={{ marginBottom: '48px' }} />
              ) : (
                <div className="post-image-placeholder" style={{ marginBottom: '48px' }}>
                  <span className="placeholder-glyph">✦</span>
                </div>
              )}

              <div className="post-intel" style={{ border: 'none', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '40px' }}>
                <h2 className="post-content-title" style={{ 
                  fontFamily: 'Cormorant Garamond, serif', 
                  fontSize: '28px', 
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: 'var(--ink)',
                  marginBottom: '8px'
                }}>
                  Content
                </h2>
                <div style={{ width: '30px', height: '2px', background: 'var(--gold)', marginBottom: '20px' }} />
              </div>

              <div className="post-content">{post.content}</div>
            </article>

            <section className="comments-section">
              <div className="community-header">
                <h2 className="comments-title" style={{ margin: 0 }}>
                  Community Discussion <span style={{color:'var(--muted)',fontWeight:400,fontSize:'16px'}}>({comments.length})</span>
                </h2>
              </div>

              {isLoggedIn ? (
                <form className="comment-form" onSubmit={handleSubmitComment}>
                  <div className="commenting-as">
                    Commenting as <strong>{currentUserName}</strong>
                  </div>
                  <textarea
                    className="form-textarea"
                    placeholder="Share your thoughts..."
                    value={newComment.content}
                    onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                    required
                    aria-label="Comment content"
                  />
                  <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={submitting || !newComment.content.trim()}>
                      {submitting && <span className="spinner" aria-hidden="true" />}
                      Post Comment
                    </button>
                  </div>
                </form>
              ) : (
                <div className="login-prompt">
                  <div className="login-prompt-icon">🔒</div>
                  <div className="login-prompt-text">Log in to join the conversation</div>
                  <button className="login-prompt-btn" onClick={() => navigate("/login")}>
                    Sign In to Comment
                  </button>
                </div>
              )}

              {comments.length === 0 ? (
                <div className="comments-empty">
                  <div className="comments-empty-icon">💬</div>
                  No comments yet. Be the first to share your thoughts!
                </div>
              ) : (
                <div className="comments-list">
                  {comments.map(comment => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      onLike={handleLikeComment}
                      onDelete={handleDeleteComment}
                      replyingTo={replyingTo}
                      setReplyingTo={setReplyingTo}
                      replyContent={replyContent}
                      setReplyContent={setReplyContent}
                      handleSubmitReply={handleSubmitReply}
                      submitting={submitting}
                      currentUserId={currentUserId}
                      currentUserName={currentUserName}
                      isLoggedIn={isLoggedIn}
                      depth={0}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}