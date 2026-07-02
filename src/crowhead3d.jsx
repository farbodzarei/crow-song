/* ============================================================================
   CROW HEAD II — standalone preview page (/crowhead3d.html).
   The realistic low-poly crow head: a true 3D mesh that turns toward the
   cursor and follows it with its eyes. Move the mouse anywhere on screen.
   Companion to /crowhead.html (the stylized geometric head).
   ========================================================================== */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import CrowHead3D from "./components/CrowHead3D.jsx";

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

const cross2 = {
  color: "rgba(232,225,238,0.55)",
  fontSize: "0.72rem",
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  textDecoration: "none",
};

function CrowHead3DPage() {
  return (
    <main style={page}>
      <p style={label}>Crow Song · the crow watches · II</p>
      <nav style={cross}>
        {[
          ["/crowhead.html", "I · geometric"],
          ["/crowheadgl.html", "III · 3D model"],
        ].map(([href, text]) => (
          <a key={href} style={cross2} href={href}>
            {text}
          </a>
        ))}
      </nav>
      <div style={{ position: "relative" }}>
        <CrowHead3D />
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
    <CrowHead3DPage />
  </StrictMode>
);
