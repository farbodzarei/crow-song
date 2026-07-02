/* ============================================================================
   CROW HEAD III — standalone preview page (/crowheadgl.html).
   The crow head as a real 3D model (Three.js/WebGL): flat-shaded low-poly
   under lavender studio lights, true eyeballs, 3D eyelids. It turns toward
   the cursor and follows it with its eyes. Companions: /crowhead.html (I,
   stylized geometric) and /crowhead3d.html (II, canvas low-poly).
   ========================================================================== */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import CrowHeadGL from "./components/CrowHeadGL.jsx";

const page = {
  minHeight: "100svh",
  display: "grid",
  placeItems: "center",
  background: "radial-gradient(circle at 50% 38%, #362d3d 0%, var(--crow, #2E2633) 62%)",
  color: "var(--haze, #E8E1EE)",
  overflow: "hidden",
};

const label = {
  position: "fixed",
  top: "max(2rem, env(safe-area-inset-top))",
  left: 0,
  right: 0,
  textAlign: "center",
  margin: 0,
  color: "var(--lavender, #9B8BB8)",
  fontSize: "0.76rem",
  letterSpacing: "0.32em",
  textTransform: "uppercase",
};

const cross = {
  position: "fixed",
  bottom: "max(2rem, env(safe-area-inset-bottom))",
  right: "max(2rem, env(safe-area-inset-right))",
  display: "flex",
  gap: "1.4rem",
};

const crossLink = {
  color: "rgba(232,225,238,0.55)",
  fontSize: "0.72rem",
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  textDecoration: "none",
};

function CrowHeadGLPage() {
  return (
    <main style={page}>
      <p style={label}>Crow Song · the crow watches · III</p>
      <nav style={cross}>
        <a style={crossLink} href="/crowhead.html">
          I · geometric
        </a>
        <a style={crossLink} href="/crowhead3d.html">
          II · low-poly
        </a>
      </nav>
      <div style={{ position: "relative" }}>
        <CrowHeadGL />
        <p
          style={{
            position: "absolute",
            left: "50%",
            bottom: "-3.4rem",
            transform: "translateX(-50%)",
            margin: 0,
            whiteSpace: "nowrap",
            color: "rgba(232,225,238,0.5)",
            fontSize: "0.72rem",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
          }}
        >
          move your cursor — it follows
        </p>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CrowHeadGLPage />
  </StrictMode>
);
