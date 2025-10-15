import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { ParticleBackground } from "@/components/ParticleBackground";
import { TechGrid } from "@/components/TechGrid";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Smooth scroll for hash navigation
    const scrollToHash = () => {
      if (location.hash) {
        const el = document.querySelector(location.hash);
        if (el) {
          // Offset for sticky nav (adjust if needed)
          const yOffset = -70;
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    // Use requestAnimationFrame for smooth initial scroll
    requestAnimationFrame(scrollToHash);

    // Retry in case mobile renders slower
    const retries = [1, 2];
    retries.forEach((i) => setTimeout(scrollToHash, i * 100));
  }, [location]);

  return (
    <div
      className="relative scroll-smooth" // Enable smooth scroll on mobile/desktop
      style={{ scrollBehavior: "smooth" }} // Fallback for older browsers
    >
      <TechGrid />
      <ParticleBackground />
      <Navigation />
      <main className="relative z-10">
        <div id="home">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="tech-stack">
          <TechStack />
        </div>
        <div id="projects">
          <Projects />
        </div>
        <div id="contact">
          <Contact />
        </div>
      </main>

      <footer className="relative z-10 py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
