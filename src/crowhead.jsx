/* ============================================================================
   CROW HEAD — standalone preview page (/crowhead.html).
   A single, centred faceted crow head that watches the cursor: it banks in 3D
   toward the pointer and follows it with its eyes. Move the mouse anywhere on
   screen. Same global styles + brand backdrop as the site.
   ========================================================================== */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import CrowHead from "./components/CrowHead.jsx";

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

function CrowHeadPage() {
  return (
    <main style={page}>
      <p style={label}>Crow Song · the crow watches</p>
      <div style={{ position: "relative" }}>
        <CrowHead />
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
    <CrowHeadPage />
  </StrictMode>
);
