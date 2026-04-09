import { useState } from "react";

const AnimatedModal = ({ onClose, children }) => {
  const [phase, setPhase] = useState("entering");

  const close = () => {
    setPhase("leaving");
    setTimeout(onClose, 210);
  };

  return (
    <div
      className={`modal-overlay ${phase}`}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className={`modal-card ${phase}`}>

        {/* Header */}
        <div className="modal-header">
          <button className="modal-close-btn" onClick={close}>✕</button>
          <div className="modal-header-icon">✍️</div>
          <div className="modal-header-title">Create a new post</div>
          <div className="modal-header-sub">
            Share your thoughts with the world
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {typeof children === "function"
            ? children({ close })
            : children}
        </div>

      </div>
    </div>
  );
};

export default AnimatedModal;