/* ============================================================================
   LOTUS — standalone preview page (/lotus.html).
   The Lotus is a scroll-choreographed overlay: full in the "hero", contracts to
   a seed as it scrolls away, blooms again at #lotus-bloom, then fades. This page
   recreates just enough scroll scaffolding (a hero band, a bloom band keyed with
   id="lotus-bloom", and trailing space) so the full bloom is visible on its own,
   off the home page. Same global styles + brand backdrop as the site.
   ========================================================================== */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import Lotus from "./sections/Lotus/Lotus.jsx";

const band = {
  minHeight: "100svh",
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  padding: "0 var(--container-pad, 24px)",
};
const label = {
  margin: 0,
  color: "var(--lavender, #9B8BB8)",
  fontSize: "0.78rem",
  letterSpacing: "0.32em",
  textTransform: "uppercase",
};

function LotusPage() {
  return (
    <main style={{ background: "var(--crow, #2E2633)", color: "var(--haze, #E8E1EE)" }}>
      <section style={band}>
        <p style={label}>Crow Song · the lotus of life</p>
      </section>

      {/* the overlay + its hero-end anchor live here, right after the hero band */}
      <Lotus />

      <section style={band}>
        <p style={label}>Scroll — the flower draws into its seed</p>
      </section>

      {/* the bloom re-trigger the Lotus looks for by id */}
      <section id="lotus-bloom" style={band}>
        <p style={label}>The lotus blooms</p>
      </section>

      <section style={band}>
        <p style={label}>…and settles</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LotusPage />
  </StrictMode>
);
