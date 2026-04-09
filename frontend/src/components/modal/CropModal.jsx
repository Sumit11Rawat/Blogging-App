// src/components/modal/CropModal.jsx
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import AnimatedModal from "./AnimatedModal";

// Utility: Convert URL to Image object
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

// Utility: Get cropped canvas area as Blob
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
  });
};

const CropModal = ({ 
  imageSrc, 
  onClose, 
  onCropComplete,
  aspect = 1,           // 1 for square (profile), 16/9 for background
  cropShape = "round",  // 'round' or 'rect'
  title = "Adjust Image"
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropCompleteCb = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      await onCropComplete(croppedBlob, croppedUrl);
    } catch (err) {
      console.error("Crop error:", err);
      alert("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedModal onClose={onClose}>
      {({ close }) => (
        <div style={{ padding: "24px" }}>
          <div style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "20px", 
            fontWeight: "700", 
            marginBottom: "8px",
            color: "#111827"
          }}>
            {title}
          </div>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
            Drag to reposition • Scroll or pinch to zoom • {cropShape === "round" ? "Square crop" : "16:9 crop"} for best results
          </p>

          <div style={{ 
            position: "relative", 
            width: "100%", 
            height: "400px", 
            background: "#f3f4f6", 
            borderRadius: "16px", 
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropCompleteCb}
              onZoomChange={setZoom}
              objectFit="contain"
            />
          </div>

          {/* Zoom Slider */}
          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>🔍</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ flex: 1, accentColor: "#B22222" }}
            />
            <span style={{ fontSize: "12px", color: "#6b7280", minWidth: "30px" }}>
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
            <button
              onClick={close}
              disabled={loading}
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                border: "1.5px solid #e5e7eb",
                background: "#fff",
                fontSize: "14px",
                color: "#6b7280",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s"
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                padding: "10px 28px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #B22222, #8b0000)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 18px rgba(178,34,34,.35)",
                transition: "transform 0.15s, box-shadow 0.2s",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Processing..." : "✅ Save Cropped Image"}
            </button>
          </div>
        </div>
      )}
    </AnimatedModal>
  );
};

export default CropModal;