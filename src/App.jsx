/* ============================================================================
   App — full page: our original sections + every section imported from the
   Claude Design project, woven into a dark / light / lavender rhythm.

   Hero(D) → Insight(D→L) → IntroBand(LAV) → Approach(L) → Practice(LAV)
   → About(D) → Process(charcoal) → VideoTestimonials(LAV)
   → WrittenTestimonials(D) → Courses+Membership(LAV) → Pricing(D)
   → FAQ(LAV) → CTA(D) → Footer(near-black)
   ========================================================================== */

import Intro from "./components/Intro.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";
import Cursor from "./components/Cursor.jsx";
import Nav from "./components/Nav.jsx";
import MobileBar from "./components/MobileBar.jsx";
import Hero from "./sections/Hero/Hero.jsx";
import Insight from "./sections/Insight/Insight.jsx";
import IntroBand from "./sections/IntroBand/IntroBand.jsx";
import Approach from "./sections/Approach/Approach.jsx";
import Practice from "./sections/Practice/Practice.jsx";
import About from "./sections/About/About.jsx";
import Process from "./sections/Process/Process.jsx";
import VideoTestimonials from "./sections/VideoTestimonials/VideoTestimonials.jsx";
import WrittenTestimonials from "./sections/WrittenTestimonials/WrittenTestimonials.jsx";
import Courses from "./sections/Courses/Courses.jsx";
import Pricing from "./sections/Pricing/Pricing.jsx";
import FAQ from "./sections/FAQ/FAQ.jsx";
import CTA from "./sections/CTA/CTA.jsx";
import Footer from "./sections/Footer/Footer.jsx";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Intro />
      <SmoothScroll />
      <Cursor />
      <Nav />

      <main id="main">
        <Hero />
        <Insight />
        <IntroBand />
        <Approach />
        <Practice />
        <About />
        <Process />
        <VideoTestimonials />
        <WrittenTestimonials />
        <Courses />
        <Pricing />
        <FAQ />
        <CTA />
      </main>

      <Footer />

      {/* docked primary action for mobile / standalone (native-app feel) */}
      <MobileBar />

      {/* reserved mount point for future cursor / particle FX — intentionally empty */}
      <div id="fx-layer" aria-hidden="true" />
    </>
  );
}
