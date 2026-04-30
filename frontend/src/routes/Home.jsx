import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";
import Sidebar from "../components/Sidebar";

const homeStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

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
  }

  .home-root {
    min-height: 100vh;
    font-family: 'Outfit', sans-serif;
    background: var(--paper);
    color: var(--ink);
    overflow-x: hidden;
    position: relative;
  }

  /* ── PAPER GRAIN TEXTURE OVERLAY ── */
  .home-root::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    background-repeat: repeat;
    opacity: 0.6;
  }

  /* ── WARM VIGNETTE ── */
  .home-root::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 100% 100%, rgba(178,34,34,0.04) 0%, transparent 50%),
                radial-gradient(ellipse at 0% 80%, rgba(201,168,76,0.04) 0%, transparent 50%);
  }

  /* ── DECORATIVE BG LAYER ── */
  .bg-deco {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
    background: #fdf8eb; /* Distinctly yellowish parchment color */
  }

  /* Giant watermark quote mark */
  .bg-deco-quote {
    position: absolute;
    font-family: 'Cormorant Garamond', serif;
    font-size: 600px;
    font-weight: 300;
    line-height: 1;
    color: rgba(201,168,76,0.045);
    top: -60px;
    right: -40px;
    user-select: none;
    letter-spacing: -0.05em;
  }

  /* Second quote mark bottom left */
  .bg-deco-quote-2 {
    position: absolute;
    font-family: 'Cormorant Garamond', serif;
    font-size: 400px;
    font-weight: 300;
    line-height: 1;
    color: rgba(178,34,34,0.03);
    bottom: 10%;
    left: -30px;
    user-select: none;
    transform: scaleX(-1);
  }

  /* Horizontal ruled lines like aged paper */
  .bg-deco-lines {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
  }

  .bg-deco-lines::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 47px,
      rgba(201,168,76,0.06) 47px,
      rgba(201,168,76,0.06) 48px
    );
  }

  /* Left vertical margin line */
  .bg-deco-lines::after {
    content: '';
    position: absolute;
    top: 0;
    left: 72px;
    width: 1.5px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(178,34,34,0.08) 10%,
      rgba(178,34,34,0.08) 90%,
      transparent 100%
    );
  }

  /* Floating ink-drop orbs */
  .bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
  }

  .bg-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%);
    top: -100px; right: 10%;
    animation: orb-drift-1 18s ease-in-out infinite alternate;
  }

  .bg-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(178,34,34,0.07) 0%, transparent 70%);
    bottom: 20%; left: -80px;
    animation: orb-drift-2 22s ease-in-out infinite alternate;
  }

  .bg-orb-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
    top: 50%; right: 5%;
    animation: orb-drift-3 15s ease-in-out infinite alternate;
  }

  @keyframes orb-drift-1 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(-40px, 60px) scale(1.1); }
  }
  @keyframes orb-drift-2 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(60px, -40px) scale(0.9); }
  }
  @keyframes orb-drift-3 {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(-30px, 50px) scale(1.05); }
  }

  /* Decorative diagonal band behind hero */
  .hero-band {
    position: absolute;
    top: 0; right: 0;
    width: 42%;
    height: 100%;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(201,168,76,0.055) 40%,
      rgba(201,168,76,0.03) 100%
    );
    border-left: 1px solid rgba(201,168,76,0.12);
    clip-path: polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%);
    pointer-events: none;
  }

  /* Tiny floating characters (decorative) */
  .float-char {
    position: absolute;
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px;
    color: rgba(201,168,76,0.25);
    font-weight: 300;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    user-select: none;
    writing-mode: vertical-rl;
    animation: float-fade 4s ease-in-out infinite alternate;
  }

  .float-char-1 { top: 18%; right: 3.5%; animation-delay: 0s; }
  .float-char-2 { top: 55%; right: 1.5%; animation-delay: 1.5s; font-size: 11px; color: rgba(178,34,34,0.18); }

  @keyframes float-fade {
    from { opacity: 0.5; transform: translateY(0px); }
    to   { opacity: 1;   transform: translateY(-12px); }
  }

  /* Corner ornaments */
  .corner-ornament {
    position: fixed;
    width: 80px; height: 80px;
    pointer-events: none;
    z-index: 1;
    opacity: 0.18;
  }

  .corner-ornament svg { width: 100%; height: 100%; }

  .corner-tl { top: 16px; left: 16px; }
  .corner-br { bottom: 16px; right: 16px; transform: rotate(180deg); }

  /* ── All original content positioned above deco ── */
  .hero,
  .post-count-row,
  .section-divider,
  .posts-grid {
    position: relative;
    z-index: 2;
  }

  /* ── HERO ── */
  .hero {
    position: relative;
    padding: 20px 60px 10px;
    display: flex;
    align-items: center;
    background: transparent;
    overflow: hidden;
    height: auto;
    min-height: 300px;
  }

  .hero-left { flex: 1; }

  .hero-eyebrow {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }

  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 300;
    line-height: 1.0;
    color: var(--ink);
    margin-bottom: 24px;
  }

  .hero-title em {
    font-style: italic;
    color: var(--gold);
  }

  .hero-sub {
    font-size: 17px;
    font-weight: 300;
    color: var(--muted);
    max-width: 480px;
    line-height: 1.7;
    margin-bottom: 32px;
  }

  .hero-cta {
    display: flex;
    gap: 24px;
    align-items: center;
  }

  .cta-primary {
    background: var(--ink);
    color: #fff;
    padding: 12px 28px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: 0.3s;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }
  .cta-primary:hover {
    background: var(--gold);
    color: var(--ink);
    transform: translateY(-2px);
  }

  .cta-link {
    font-size: 15px;
    color: var(--muted);
    text-decoration: underline;
    text-underline-offset: 4px;
    cursor: pointer;
    background: none;
    border: none;
    transition: color 0.2s;
  }
  .cta-link:hover { color: var(--ink); }

  /* ── DECORATIVE HERO ORNAMENT (right side) ── */
  .hero-right-deco {
    flex-shrink: 0;
    width: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    opacity: 0.55;
  }

  .hero-right-deco svg {
    width: 100%;
    height: auto;
  }

  /* ── DIVIDER ── */
  .section-divider {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 0 60px;
    margin-top: -20px; /* Shift divider up by approx 0.5cm */
    margin-bottom: 50px; /* 1.3cm gap between divider and posts */
  }
  .divider-line { flex: 1; height: 1.5px; background: rgba(0,0,0,0.8); }
  .divider-boxed {
    background: var(--ink);
    color: #fff;
    padding: 10px 24px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    border-radius: 0;
    position: relative;
    box-shadow: 8px 8px 0 var(--gold);
    border: 2px solid var(--ink);
  }
  .divider-label {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--gold);
  }

  /* ── POSTS GRID ── */
  /* (Consolidated below at line 601) */

  /* ── POST CARD ── */
  .post-card {
    position: relative;
    background: #fffdfd;
    border: 1px solid rgba(178,34,34,0.08);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    cursor: pointer;
    display: flex; /* Horizontal card */
    flex-direction: row;
    height: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  }

  .post-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 4px; height: 100%; /* Vertical accent instead of horizontal */
    background: linear-gradient(180deg, #B22222 0%, #ff6b6b 40%, #c9a84c 100%);
    z-index: 1;
  }

  .post-card:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 20px 40px rgba(178,34,34,0.08), 0 8px 24px rgba(0,0,0,0.04);
    border-color: var(--gold);
    background: #fff;
  }

  /* ── CARD IMAGE ── */
  .post-card-image {
    width: 450px;
    height: 100%;
    overflow: hidden;
    background: #ede9e0;
    flex-shrink: 0;
  }

  .post-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    display: block;
  }

  .post-card:hover .post-card-image img {
    transform: scale(1.06);
  }

  /* ── NO IMAGE PLACEHOLDER ── */
  .post-card-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ede9e0 0%, #e0dbd0 100%);
    gap: 10px;
    border-right: 1px solid rgba(0,0,0,0.05);
  }

  .placeholder-icon {
    font-size: 32px;
    opacity: 0.4;
  }

  .placeholder-text {
    font-size: 12px;
    color: var(--muted);
    font-weight: 500;
    letter-spacing: 0.05em;
    opacity: 0.6;
  }

  /* ── CARD BODY ── */
  .post-card-body {
    padding: 40px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 15px;
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .post-tag {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #B22222;
    background: rgba(178,34,34,0.07);
    padding: 4px 10px;
    border-radius: 6px;
  }

  .post-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.2;
    margin-bottom: 5px;
  }

  .post-excerpt {
    font-size: 16px;
    color: var(--muted);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(0,0,0,0.06);
    padding-top: 20px;
    margin-top: 10px;
    font-size: 13px;
    color: var(--muted);
  }

  .post-date {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .read-more {
    color: var(--gold);
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.03em;
    transition: color 0.2s;
  }

  .post-card:hover .read-more { color: #B22222; }

  /* ── EMPTY / LOADING ── */
  .state-box {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 40px;
    gap: 16px;
    color: var(--muted);
  }

  .state-icon { font-size: 40px; opacity: 0.4; }
  .state-title { font-size: 18px; font-weight: 500; color: var(--ink); }
  .state-sub { font-size: 14px; }

  /* ── SKELETON LOADER ── */
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }

  .skeleton {
    background: linear-gradient(90deg, #ede9e0 25%, #e5e0d6 50%, #ede9e0 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 6px;
  }

  .skeleton-card {
    background: #fffdfd;
    border: 1px solid rgba(178,34,34,0.06);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  .skeleton-img  { height: 220px; width: 100%; }
  .skeleton-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 12px; }
  .skeleton-tag  { height: 18px; width: 60px; border-radius: 4px; }
  .skeleton-title-1 { height: 22px; width: 90%; }
  .skeleton-title-2 { height: 22px; width: 65%; }
  .skeleton-line-1  { height: 14px; width: 100%; }
  .skeleton-line-2  { height: 14px; width: 85%; }
  .skeleton-line-3  { height: 14px; width: 70%; }
  .skeleton-footer  { height: 14px; width: 50%; margin-top: 10px; }

  /* ── HOME LAYOUT ── */
  .home-layout-wrapper {
    display: flex;
    flex-direction: column; /* Stack vertically: Hero Area, then Content Area */
    min-height: 100vh;
    position: relative;
    z-index: 2;
  }

  .home-hero-row {
    display: flex;
    gap: 0;
    padding: 0;
    background: transparent; /* Match the yellowish parchment bg-deco */
    border-bottom: 1px solid var(--border);
    position: relative;
    z-index: 5;
    /* Balanced vertical alignment */
  }

  .home-main-side {
    flex: 1;
    min-width: 0;
  }

  .home-container {
    padding: 0 60px 80px; /* Zero top padding */
    max-width: 1600px;
    margin: 0 auto;
  }

  /* ── POSTS GRID ── */
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    padding: 30px 0;
    width: 100% !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  /* ── THEMATIC DIVIDER ── */
  .thematic-divider {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    margin: 10px 0;
  }
  .divider-line-main {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    position: relative;
  }
  .divider-pulse {
    position: absolute;
    top: -1px;
    left: -100px;
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    filter: blur(1px);
    animation: flowPulse 6s infinite ease-in-out;
  }
  .divider-ornament {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    color: var(--gold);
    background: #fff;
    padding: 0 20px;
    position: absolute;
    z-index: 2;
    font-style: italic;
    opacity: 0.8;
  }

  @keyframes flowPulse {
    0% { left: -10%; opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { left: 110%; opacity: 0; }
  }

  .post-card {
    position: relative;
    background: #fffdfd;
    border: 1px solid rgba(178,34,34,0.08);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  }

  .post-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 4px;
    background: linear-gradient(90deg, #B22222 0%, #ff6b6b 40%, #c9a84c 100%);
    z-index: 1;
  }

  .post-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 30px rgba(178,34,34,0.1), 0 8px 24px rgba(0,0,0,0.04);
    border-color: var(--gold);
    background: #fff;
  }

  .post-card-image {
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: #ede9e0;
    flex-shrink: 0;
  }

  .post-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .post-card-body {
    padding: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .post-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.3;
  }

  .post-excerpt {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.7;
    flex: 1;
  }

  @media (max-width: 1200px) {
    .posts-grid   { grid-template-columns: repeat(2, 1fr); }
    .hero         { padding: 40px 40px; }
    .home-hero-row { flex-direction: column; }
  }

  @media (max-width: 768px) {
    .home-hero-row { flex-direction: column; }
    .hero         { 
       padding: 40px 24px; 
       flex-direction: column;
       text-align: center;
       min-height: auto;
    }
    .hero-left    { width: 100%; }
    .hero-title   { font-size: 32px; margin-bottom: 16px; color: var(--ink); line-height: 1.2; }
    .hero-sub     { font-size: 14px; margin: 0 auto 24px; max-width: 280px; }
    .hero-cta     { justify-content: center; flex-direction: column; width: 100%; gap: 12px; }
    .cta-primary  { width: fit-content; margin: 0 auto; padding: 12px 24px; }
    .hero-right-deco { display: none; }
    
    .home-container { padding: 0 16px 60px; }
    .main-content { padding-top: 0; }
    .post-count-row { padding-left: 10px !important; margin-top: 0 !important; margin-bottom: 10px !important; }
    .posts-grid   { grid-template-columns: 1fr; gap: 20px; }
    .post-card    { height: auto; border-radius: 12px; }
    .post-title   { font-size: 20px; margin-bottom: 4px; }
    .post-card-body { padding: 16px; }
    .post-card-image { height: 180px; }
    
    .section-divider { 
      display: flex; 
      padding: 0; 
      gap: 12px;
      margin: 20px 0 30px;
    }
    .divider-line { height: 1px; opacity: 0.2; }
    .divider-boxed { 
      font-size: 12px; 
      padding: 8px 16px; 
      white-space: nowrap;
      background: var(--ink);
      border: none;
      color: #fff;
      font-weight: 900;
      box-shadow: 4px 4px 0 var(--gold);
    }
    
    .corner-ornament { display: none; }
    .bg-deco-quote, .bg-deco-quote-2, .float-char-1, .float-char-2 { display: none !important; }
    .bg-deco-lines::after { display: none; }
  }
`;

/* ── SKELETON CARD ── */
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-tag" />
      <div className="skeleton skeleton-title-1" />
      <div className="skeleton skeleton-title-2" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
        <div className="skeleton skeleton-line-1" />
        <div className="skeleton skeleton-line-2" />
        <div className="skeleton skeleton-line-3" />
      </div>
      <div className="skeleton skeleton-footer" />
    </div>
  </div>
);

/* ── CORNER ORNAMENT SVG ── */
const CornerOrnament = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4 L4 76" stroke="#c9a84c" strokeWidth="1.5" />
    <path d="M4 4 L76 4" stroke="#c9a84c" strokeWidth="1.5" />
    <path d="M4 4 L22 4 L22 22 L4 22" stroke="#c9a84c" strokeWidth="1" fill="none" />
    <circle cx="4" cy="4" r="3" fill="#c9a84c" />
    <path d="M14 14 L14 36" stroke="#B22222" strokeWidth="0.75" strokeDasharray="2 3" />
    <path d="M14 14 L36 14" stroke="#B22222" strokeWidth="0.75" strokeDasharray="2 3" />
    <circle cx="14" cy="14" r="1.5" fill="#B22222" />
  </svg>
);

/* ── HERO DECORATIVE ILLUSTRATION ── */
const HeroDeco = () => (
  <svg viewBox="0 0 260 320" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer frame */}
    <rect x="10" y="10" width="240" height="300" rx="2" stroke="#c9a84c" strokeWidth="1" fill="none" />
    <rect x="18" y="18" width="224" height="284" rx="1" stroke="#c9a84c" strokeWidth="0.5" fill="none" strokeDasharray="4 6" />

    {/* Big italic serif letter watermark */}
    <text x="130" y="210" fontFamily="Georgia, serif" fontSize="220" fontStyle="italic"
      fill="rgba(201,168,76,0.10)" textAnchor="middle" dominantBaseline="middle">W</text>

    {/* Ruled lines */}
    {[70, 90, 110, 130, 150, 170, 190, 210, 230, 250].map((y, i) => (
      <line key={i} x1="30" y1={y} x2="230" y2={y} stroke="rgba(201,168,76,0.18)" strokeWidth="0.75" />
    ))}

    {/* Left margin line */}
    <line x1="58" y1="60" x2="58" y2="275" stroke="rgba(178,34,34,0.25)" strokeWidth="0.75" />

    {/* Nib / quill icon at top */}
    <g transform="translate(110, 28)">
      <path d="M20 0 C20 0 40 15 35 35 C30 55 10 50 5 35 C0 20 20 0 20 0Z"
        fill="none" stroke="#c9a84c" strokeWidth="1.2" />
      <path d="M20 0 L20 50" stroke="#c9a84c" strokeWidth="0.75" strokeDasharray="2 2" />
      <circle cx="20" cy="0" r="2" fill="#c9a84c" />
    </g>

    {/* Ink drop at bottom */}
    <g transform="translate(118, 268)">
      <ellipse cx="12" cy="16" rx="8" ry="10" fill="rgba(178,34,34,0.12)" />
      <path d="M12 0 C12 0 20 10 20 16 C20 20.4 16.4 24 12 24 C7.6 24 4 20.4 4 16 C4 10 12 0 12 0Z"
        fill="none" stroke="#B22222" strokeWidth="1" opacity="0.5" />
    </g>

    {/* Corner flourishes */}
    <path d="M10 10 Q30 10 30 30" stroke="#c9a84c" strokeWidth="1" fill="none" />
    <path d="M250 10 Q230 10 230 30" stroke="#c9a84c" strokeWidth="1" fill="none" />
    <path d="M10 310 Q30 310 30 290" stroke="#c9a84c" strokeWidth="1" fill="none" />
    <path d="M250 310 Q230 310 230 290" stroke="#c9a84c" strokeWidth="1" fill="none" />
  </svg>
);

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const navigate = useNavigate();

  /* ── auth check ── */
  useEffect(() => {
    const check = () => setIsAuthenticated(!!localStorage.getItem("token"));
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  /* ── fetch posts ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/post/`);
        const published = (res.data || []).filter(p => p.status === "published");
        setPosts(published);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── image helper: handles both URL and uploaded file paths ── */
  const getImageSrc = (image) => {
    if (!image) return null;
    if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
      return image;
    }
    const normalizedPath = image.startsWith("/") ? image : `/${image}`;
    return `${API_BASE_URL}${normalizedPath}`;
  };

  /* ── filtering logic ── */
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const handleStartWriting = () => navigate(isAuthenticated ? "/dashboard" : "/login");

  return (
    <>
      <style>{homeStyle}</style>
      <div className="home-root">

        {/* ── FIXED DECORATIVE BACKGROUND ── */}
        <div className="bg-deco" aria-hidden="true">
          {/* Ruled paper lines + margin */}
          <div className="bg-deco-lines" />
        </div>

        {/* ── CORNER ORNAMENTS ── */}
        <div className="corner-ornament corner-tl" aria-hidden="true">
          <CornerOrnament />
        </div>
        <div className="corner-ornament corner-br" aria-hidden="true">
          <CornerOrnament />
        </div>

        <div className="home-layout-wrapper">

          <div className="home-hero-row">
            <div className="home-main-side">
              <section className="hero">
                <div className="hero-band" aria-hidden="true" />
                <div className="hero-left">
                  {/* <p className="hero-eyebrow">A space for thinkers & writers</p> */}
                  <h1 className="hero-title">
                    <em>WRITE</em><br />
                    CONNECT<br />
                    <em>INSPIRE</em> THE <em>WORLD</em>.
                  </h1>
                  <p className="hero-sub">
                    Experience a  writing space designed for clarity and craft.<br />
                    Share your perspectives with a community of refined readers.
                  </p>
                  <div className="hero-cta">
                    <button className="cta-primary" onClick={handleStartWriting}>
                      Start Writing Today
                    </button>
                    <button className="cta-link" onClick={() => navigate("/about")}>
                      About our mission →
                    </button>
                  </div>
                </div>
                <div className="hero-right-deco" aria-hidden="true">
                  <HeroDeco />
                </div>
              </section>
            </div>

            <Sidebar
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              onSearchChange={setSearchQuery}
              onTagSelect={setSelectedTag}
              getImageSrc={getImageSrc}
              onPostClick={navigate}
            />
          </div>

          <div className="thematic-divider">
            <div className="divider-line-main">
              <div className="divider-pulse" />
            </div>
            <div className="divider-ornament">✧</div>
          </div>

          <div className="home-container">
            <main className="main-content">
              <div className="post-count-row" style={{ display: "flex", justifyContent: "flex-start", marginBottom: "5px", paddingLeft: "60px", marginTop: "-20px" }}>
                <span className="divider-label" style={{ color: "var(--ink)", fontWeight: 700, fontSize: 13, letterSpacing: "1px" }}>
                  {selectedTag ? `STORIES IN #${selectedTag}:` : searchQuery ? `RESULTS FOR "${searchQuery}":` : "TOTAL STORIES:"} {loading ? "—" : filteredPosts.length}
                </span>
              </div>

              <div className="section-divider" style={{ padding: 0 }}>
                <div className="divider-line" />
                <div className="divider-boxed">
                  {selectedTag ? `#${selectedTag}` : searchQuery ? "Search Results" : "Recent Stories"}
                </div>
                <div className="divider-line" />
              </div>

              <div className="posts-grid" style={{ padding: 0 }}>
                {loading && [1, 2, 3].map(n => <SkeletonCard key={n} />)}
                {!loading && filteredPosts.length === 0 && (
                  <div className="state-box">
                    <div className="state-icon">📭</div>
                    <div className="state-title">{searchQuery || selectedTag ? "No results found" : "No stories yet"}</div>
                    <div className="state-sub">Try a different search term or category.</div>
                  </div>
                )}
                {!loading && filteredPosts.map((post) => (
                  <div key={post._id} className="post-card" onClick={() => navigate(`/post/${post._id}`)}>
                    <div className="post-card-image">
                      {post.image ? (
                        <img src={getImageSrc(post.image)} alt={post.title} onError={(e) => { e.target.style.display = "none"; e.target.parentNode.innerHTML = '<div class="post-card-image-placeholder"><div class="placeholder-icon">🖼️</div><div class="placeholder-text">Image unavailable</div></div>'; }} />
                      ) : (
                        <div className="post-card-image-placeholder"><div className="placeholder-icon">✍️</div><div className="placeholder-text">No cover image</div></div>
                      )}
                    </div>
                    <div className="post-card-body">
                      {post.tags?.length > 0 && (
                        <div className="post-tags">
                          {post.tags.slice(0, 3).map(tag => <span key={tag} className="post-tag">#{tag}</span>)}
                        </div>
                      )}
                      <div className="post-title">{post.title}</div>
                      <div className="post-excerpt">{post.content?.slice(0, 130)}...</div>
                      <div className="post-footer">
                        <span className="post-date">🗓 {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                        <span className="read-more">Read Entry →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>

      </div>
    </>
  );
}