/* Standalone preview for the Lotus scroll bloom. Not part of the site build —
   kept separate so App.jsx stays untouched. Served at /lotus.html in dev. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import Lotus from "./sections/Lotus/Lotus.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div style={{ background: "var(--bg-dark)" }}>
      {/* a little lead-in so you scroll INTO the bloom, and room after it */}
      <div style={{ height: "60vh" }} />
      <Lotus />
      <div style={{ height: "60vh" }} />
    </div>
  </StrictMode>
);
