import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add("show");
      }, i * 200);
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        body {
          background: #000;
          color: white;
        }

        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          background: url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
        }

        .container::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(4px);
          z-index: 0;
        }

        .container > * {
          position: relative;
          z-index: 1;
        }

        @keyframes bgPulse {
          0% { filter: brightness(0.9); }
          100% { filter: brightness(1.2); }
        }

        .title {
          font-size: 3rem;
          font-weight: 600;
          margin-bottom: 10px;
          text-align: center;
          background: linear-gradient(90deg, #e8c97a, #e8c97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: fadeDown 1s ease;
          color: #e8c97a;
        }

        .subtitle {
          font-size: 1.2rem;
          opacity: 0.8;
          margin-bottom: 40px;
          text-align: center;
          animation: fadeDown 1.2s ease;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 800px;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          padding: 25px;
          border-radius: 20px;
          transition: all 0.4s ease;
          transform: translateY(40px);
          opacity: 0;
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: rotate(25deg);
          top: -100%;
          left: -100%;
          transition: 0.6s;
        }

        .card:hover::before {
          top: 100%;
          left: 100%;
        }

        .card.show {
          transform: translateY(0);
          opacity: 1;
        }

        .card:hover {
          transform: translateY(-12px) scale(1.04);
          box-shadow: 0 20px 60px rgba(255,255,255,0.15);
        }

        .card h3 {
          margin-bottom: 10px;
          font-size: 1.4rem;
          background: linear-gradient(90deg, #00ff99, #00e5ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .card p {
          font-size: 0.95rem;
          opacity: 0.8;
        }

        .cta {
          margin-top: 50px;
          padding: 12px 30px;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          cursor: pointer;
          background: linear-gradient(135deg, #00ff99, #00e5ff);
          color: black;
          font-weight: 600;
          transition: 0.3s ease;
        }

        .cta:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 30px rgba(0,255,150,0.5);
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="container">
        <h1 className="title">About Our Blog</h1>
        <p className="subtitle">
          A place where ideas, stories, and creativity come together ✨
        </p>

        <div className="grid">
          <div className="card">
            <h3>📝 What We Do</h3>
            <p>
              We provide a platform where you can share your thoughts, write blogs,
              and express your ideas with the world.
            </p>
          </div>

          <div className="card">
            <h3>🚀 Our Mission</h3>
            <p>
              Our mission is to empower writers and readers by creating a simple,
              fast, and engaging blogging experience.
            </p>
          </div>

          <div className="card">
            <h3>🌍 Community</h3>
            <p>
              Join a growing community of creators, developers, and thinkers who
              love to share knowledge.
            </p>
          </div>

          <div className="card">
            <h3>💡 Why Choose Us</h3>
            <p>
              Clean UI, fast performance, and a distraction-free writing
              experience — everything you need in one place.
            </p>
          </div>
        </div>

        <button
          className="cta"
          onClick={() => alert("Start writing your first blog today!")}
        >
          Get Started
        </button>
      </div>
    </>
  );
}
