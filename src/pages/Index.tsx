import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { ParticleBackground } from "@/components/ParticleBackground";
import { TechGrid } from "@/components/TechGrid";
import { useEffect, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";

const LazyTechStack = lazy(() => import("@/components/TechStack"));
const LazyProjects = lazy(() => import("@/components/Projects"));

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollToHash = () => {
      if (location.hash) {
        const el = document.querySelector(location.hash);
        if (el) {
          const yOffset = -70;
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    requestAnimationFrame(scrollToHash);
    [1, 2].forEach((i) => setTimeout(scrollToHash, i * 100));
  }, [location]);

  return (
    <div
      className="relative scroll-smooth"
      style={{ scrollBehavior: "smooth" }}
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
          <Suspense
            fallback={
              <div className="text-center py-20">Loading Tech Stack...</div>
            }
          >
            <LazyTechStack />
          </Suspense>
        </div>
        <div id="projects">
          <Suspense
            fallback={
              <div className="text-center py-20">Loading Projects...</div>
            }
          >
            <LazyProjects />
          </Suspense>
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
