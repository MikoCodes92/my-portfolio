// src/components/Projects.tsx
import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float, Sparkles } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
}

const projects: Project[] = [
  {
    title: "LaserVacBot",
    description:
      "Advanced robot vacuum simulation with Dijkstra's pathfinding algorithm for optimal cleaning routes",
    tech: ["Python", "Pygame", "Algorithms", "Pathfinding"],
    github: "https://github.com/MikoCodes92/LaserVacBot",
    demo: "#",
  },
  {
    title: "AAU Multimedia Booking System",
    description:
      "Full-stack booking platform with real-time availability and WebSocket notifications",
    tech: ["Django", "React", "PostgreSQL", "WebSocket", "REST API"],
    github: "https://github.com/MikoCodes92/AAU-Multimedia-Booking-System",
    demo: "#",
  },
  {
    title: "Pneumonia Detection AI",
    description:
      "Medical AI system for detecting pneumonia from chest X-ray images using convolutional neural networks",
    tech: ["Python", "TensorFlow", "Keras", "CNN", "Medical AI"],
    github: "https://github.com/MikoCodes92/pnemonia-detection-with-cnn",
    demo: "#",
  },
  {
    title: "Traffic Flow Prediction",
    description:
      "Machine learning model for predictive analysis and optimization of urban traffic flow patterns",
    tech: ["Python", "Pandas", "Scikit-learn", "Jupyter", "ML Models"],
    github: "https://github.com/MikoCodes92/Traffic-flow-predition-",
    demo: "#",
  },
  {
    title: "Auto University Scheduler",
    description:
      "Intelligent university course scheduling system using genetic algorithms for optimal resource allocation",
    tech: ["ASP.NET", "MSSQL", "Genetic Algorithms", "jQuery", "SSRS"],
    github:
      "https://github.com/MikoCodes92/Automatic-University-Scheduling-System",
    demo: "#",
  },
];

// Color scheme extracted from ParticleBackground
const COLORS = {
  // Primary cyan from particle fill: rgba(0,255,255,0.85)
  primary: "#00ffff",
  primaryRGB: "0, 255, 255",

  // Background colors from particle background: rgba(16, 12, 31, 0.06)
  darkBackground: "#100c1f",
  darkBackgroundRGB: "16, 12, 31",

  // Connection line color: rgba(0,255,255,${opacity * 0.28})
  connection: "#00ffff",
  connectionAlpha: 0.28,

  // Particle background trail: rgba(16, 12, 31, 0.06)
  backgroundTrail: "rgba(16, 12, 31, 0.06)",
};

// Optimized mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile =
        window.innerWidth <= 768 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      setIsMobile(mobile);
    };

    checkDevice();
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(checkDevice, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return isMobile;
};

// Memoized Project Card with ParticleBackground color scheme
const ProjectCard3D: React.FC<{ project: Project; isMobile: boolean }> = memo(
  ({ project, isMobile }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      if (meshRef.current) {
        const speedFactor = isMobile ? 0.6 : 0.3;
        meshRef.current.rotation.y =
          Math.sin(t * speedFactor) * (isMobile ? 0.08 : 0.05);
        meshRef.current.rotation.x =
          Math.sin(t * (speedFactor * 0.7)) * (isMobile ? 0.05 : 0.03);

        if (hovered) {
          meshRef.current.position.y =
            Math.sin(t * (speedFactor * 6)) * (isMobile ? 0.15 : 0.1);
        }
      }

      // Dynamic glow intensity matching particle effects
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = hovered
          ? 0.4 + Math.sin(t * 3) * 0.1
          : 0.2 + Math.sin(t * 2) * 0.05;
      }
    });

    return (
      <Float
        floatIntensity={hovered ? 0.4 : isMobile ? 0.3 : 0.15}
        rotationIntensity={hovered ? 0.15 : isMobile ? 0.08 : 0.05}
        speed={isMobile ? 3 : 2}
      >
        <mesh
          ref={meshRef}
          scale={isMobile ? [6, 8, 0.5] : [6, 5, 1]} // reduce depth on mobile
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <boxGeometry args={isMobile ? [6, 8, 0.1] : [6, 5, 0.1]} /> // matches
          the scale
          <meshStandardMaterial
            ref={materialRef}
            color={COLORS.darkBackground}
            emissive={COLORS.primary}
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.05}
            transparent
            opacity={0.02}
          />
          <Html
            center
            distanceFactor={5}
            style={{
              width: isMobile ? "90vw" : "80vw", // slightly smaller on mobile
              height: isMobile ? "auto" : "90vh", // let height adjust automatically
              pointerEvents: "auto",
              overflow: "visible", // important to prevent clipping
            }}
          >
            {/* Enhanced Card with ParticleBackground Color Scheme */}
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-gray-900/95 via-[#100c1f]/95 to-gray-900/95 border border-white/20 shadow-2xl w-auto max-w-[90vw] h-auto p-6 sm:p-8 md:p-12 mx-auto text-center rounded-3xl overflow-hidden group">
              {/* Animated Glow Border matching particle colors */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-cyan-400/20 to-cyan-500/30 opacity-60 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute inset-[1px] rounded-3xl bg-[#100c1f]/95 backdrop-blur-2xl" />

              {/* Pulsing Glow Effect matching particle trail */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/15 to-cyan-400/10 animate-pulse-slow opacity-30" />

              {/* Interactive Glow Overlay */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/40 via-transparent to-cyan-400/40 opacity-0 group-hover:opacity-80 transition-all duration-700 blur-xl`}
              />

              <CardHeader className="relative z-10">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-cyan-50 bg-clip-text text-transparent mb-4 sm:mb-6 drop-shadow-2xl relative">
                    {project.title}
                    {/* Text Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-cyan-100 to-cyan-50 bg-clip-text text-transparent blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                  </CardTitle>
                  <CardDescription className="text-lg sm:text-xl md:text-2xl text-cyan-100/90 leading-relaxed font-light relative">
                    {project.description}
                    {/* Description Glow */}
                    <div className="absolute inset-0 text-cyan-100 blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="mt-6 sm:mt-8 text-center relative z-10">
                {/* Tech Stack */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-3 sm:mb-4 drop-shadow-lg relative">
                    Tech Stack
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent blur-sm opacity-50" />
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {project.tech.map((t, i) => (
                      <motion.span
                        key={t}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                        whileHover={{
                          scale: 1.1,
                          y: -2,
                          transition: { type: "spring", stiffness: 400 },
                        }}
                        className="text-sm sm:text-lg px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-100 shadow-lg backdrop-blur-sm font-medium hover:shadow-cyan-500/30 hover:border-cyan-300 transition-all duration-300 relative overflow-hidden group/tech"
                      >
                        {/* Tech Item Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-400/0 opacity-0 group-hover/tech:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10">{t}</span>
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-3 sm:mb-4 drop-shadow-lg relative">
                    Explore Project
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent blur-sm opacity-50" />
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="group relative overflow-hidden bg-transparent border-2 border-cyan-400/60 hover:border-cyan-300 text-cyan-100 hover:text-cyan-50 backdrop-blur-sm transition-all duration-300 hover:scale-105 font-semibold text-base sm:text-lg md:text-xl px-8 py-6 rounded-2xl hover:shadow-cyan-500/25"
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3"
                      >
                        {/* Button Glow Effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/15 to-cyan-500/0 group-hover:via-cyan-500/25 transition-all duration-500" />
                        <div className="absolute inset-0 bg-cyan-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Github className="w-5 sm:w-6 relative z-10" />
                        <span className="relative z-10">View Code</span>
                      </a>
                    </Button>
                    <Button
                      size="lg"
                      className="group relative overflow-hidden bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 font-semibold text-base sm:text-lg md:text-xl px-8 py-6 rounded-2xl"
                      asChild
                    >
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3"
                      >
                        {/* Demo Button Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition-opacity duration-300" />
                        <ExternalLink className="w-5 sm:w-6 relative z-10" />
                        <span className="relative z-10">Live Demo</span>
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </Html>
        </mesh>
      </Float>
    );
  }
);

ProjectCard3D.displayName = "ProjectCard3D";

// Optimized Navigation Arrows
const NavigationArrows = memo(
  ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
    return (
      <>
        <Html position={[-8, 0, 0]}>
          <motion.button
            className="p-5 rounded-2xl backdrop-blur-xl bg-[#100c1f]/60 border border-cyan-400/30 hover:border-cyan-400/70 text-cyan-100 hover:text-cyan-50 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/30 group"
            onClick={onPrev}
            whileHover={{ scale: 1.15, x: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative">
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              {/* Arrow Glow */}
              <div className="absolute inset-0 text-cyan-400 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
            </div>
          </motion.button>
        </Html>
        <Html position={[8, 0, 0]}>
          <motion.button
            className="p-5 rounded-2xl backdrop-blur-xl bg-[#100c1f]/60 border border-cyan-400/30 hover:border-cyan-400/70 text-cyan-100 hover:text-cyan-50 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/30 group"
            onClick={onNext}
            whileHover={{ scale: 1.15, x: 3 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative">
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              {/* Arrow Glow */}
              <div className="absolute inset-0 text-cyan-400 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
            </div>
          </motion.button>
        </Html>
      </>
    );
  }
);

NavigationArrows.displayName = "NavigationArrows";

// Optimized Projects Component
export const Projects: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStart = useRef<number>(0);

  // Memoized navigation handlers
  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touchEnd = e.changedTouches[0].clientX;
      const delta = touchEnd - touchStart.current;

      if (Math.abs(delta) > 50) {
        if (delta > 0) handlePrev();
        else handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  // Optimized auto-rotation
  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isMobile]);

  return (
    <section
      id="projects"
      className="py-16 px-4 w-full relative min-h-screen bg-transparent"
    >
      {/* Background Elements matching ParticleBackground */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-400/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-50px" }}
        className="text-center mb-12 w-full relative z-10"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-50 via-cyan-100 to-cyan-50 bg-clip-text text-transparent mb-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Featured Projects
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-cyan-100/80"
        >
          <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent font-semibold">
            {currentIndex + 1}
          </span>
          <span className="text-cyan-200/60"> / {projects.length}</span>
        </motion.div>
      </motion.div>

      <div
        className="w-full relative"
        style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}
        {...(isMobile && {
          onTouchStart: handleTouchStart,
          onTouchEnd: handleTouchEnd,
        })}
      >
        <Canvas
          camera={{ position: [0, 0, isMobile ? 8 : 12], fov: 45 }}
          dpr={Math.min(2, window.devicePixelRatio)}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          <pointLight
            position={[-5, -5, -5]}
            intensity={0.3}
            color={COLORS.primary}
          />

          {/* Optimized Sparkles with cyan color */}
          <Sparkles
            count={isMobile ? 20 : 80}
            size={isMobile ? 0.5 : 0.8}
            scale={isMobile ? [14, 7, 14] : [20, 10, 20]}
            speed={isMobile ? 0.5 : 0.3}
            color={COLORS.primary}
          />

          {/* Navigation Arrows */}
          {!isMobile && (
            <NavigationArrows onPrev={handlePrev} onNext={handleNext} />
          )}

          {/* Project Card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.group
              key={currentIndex}
              custom={direction}
              initial={{
                x: direction > 0 ? 50 : -50,
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                x: 0,
                opacity: 1,
                scale: 1,
              }}
              exit={{
                x: direction > 0 ? -50 : 50,
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15,
                duration: 0.4,
              }}
            >
              <ProjectCard3D
                project={projects[currentIndex]}
                isMobile={isMobile}
              />
            </motion.group>
          </AnimatePresence>
        </Canvas>

        {/* Mobile Navigation Dots */}
        {isMobile && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-cyan-400 to-cyan-300 scale-125"
                    : "bg-cyan-200/40 scale-100"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
