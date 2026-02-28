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
import {
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

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

// Color scheme
const COLORS = {
  primary: "#00ffff",
  darkBackground: "#100c1f",
};

// Optimized mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkDevice = () => {
      if (!mounted) return;
      const mobile =
        window.innerWidth <= 768 ||
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      setIsMobile(mobile);
    };

    checkDevice();

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

// Project Card Component
const ProjectCard3D: React.FC<{ project: Project; isMobile: boolean }> = memo(
  ({ project, isMobile }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const rotationSpeedRef = useRef(isMobile ? 0.6 : 0.3);

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();

      if (meshRef.current) {
        const speedFactor = rotationSpeedRef.current;
        meshRef.current.rotation.y =
          Math.sin(t * speedFactor) * (isMobile ? 0.08 : 0.05);
        meshRef.current.rotation.x =
          Math.sin(t * (speedFactor * 0.7)) * (isMobile ? 0.05 : 0.03);

        if (hovered) {
          meshRef.current.position.y =
            Math.sin(t * (speedFactor * 6)) * (isMobile ? 0.15 : 0.1);
        }
      }

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
          scale={isMobile ? [6, 8, 0.5] : [6, 5, 1]}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <boxGeometry args={isMobile ? [6, 8, 0.1] : [6, 5, 0.1]} />
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
              width: isMobile ? "90vw" : "80vw",
              height: isMobile ? "auto" : "90vh",
              pointerEvents: "auto",
              overflow: "visible",
            }}
          >
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-gray-900/95 via-[#100c1f]/95 to-gray-900/95 border border-white/20 shadow-2xl w-auto max-w-[90vw] h-auto p-6 sm:p-8 md:p-12 mx-auto text-center rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-cyan-400/20 to-cyan-500/30 opacity-60 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute inset-[1px] rounded-3xl bg-[#100c1f]/95 backdrop-blur-2xl" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/15 to-cyan-400/10 animate-pulse-slow opacity-30" />

              <CardHeader className="relative z-10">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-cyan-50 bg-clip-text text-transparent mb-4 sm:mb-6 drop-shadow-2xl relative">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-lg sm:text-xl md:text-2xl text-cyan-100/90 leading-relaxed font-light relative">
                    {project.description}
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="mt-6 sm:mt-8 text-center relative z-10 flex flex-col items-center justify-center gap-6">
                {/* Tech Stack */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex flex-wrap justify-center gap-2 sm:gap-3"
                >
                  {project.tech.map((t, i) => (
                    <motion.span
                      key={t}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                      className="text-sm sm:text-lg px-3 py-1 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-100 shadow-lg backdrop-blur-sm font-medium"
                    >
                      {t}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="group relative overflow-hidden bg-cyan-700/70 border border-cyan-400/20 text-cyan-100/90 hover:bg-cyan-400/30 hover:border-cyan-300 hover:text-cyan-50 backdrop-blur-sm transition-all duration-300 hover:scale-105 font-semibold px-6 py-3 rounded-2xl"
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 justify-center"
                    >
                      <Github className="w-5 sm:w-6 relative z-10" />
                      <span className="relative z-10">View Code</span>
                    </a>
                  </Button>

                  <Button
                    size="lg"
                    asChild
                    className="group relative overflow-hidden bg-cyan-700/70 border border-cyan-400/20 text-cyan-100/90 hover:bg-cyan-400/30 hover:border-cyan-300 hover:text-cyan-50 backdrop-blur-sm transition-all duration-300 hover:scale-105 font-semibold px-6 py-3 rounded-2xl"
                  >
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 justify-center"
                    >
                      <ExternalLink className="w-5 sm:w-6 relative z-10" />
                      <span className="relative z-10">Live Demo</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Html>
        </mesh>
      </Float>
    );
  },
);

ProjectCard3D.displayName = "ProjectCard3D";

// ELEGANT MOBILE NAVIGATION - Perfectly integrated with card
const MobileNavigation = memo(
  ({
    onPrev,
    onNext,
    currentIndex,
    totalProjects,
    onDotClick,
  }: {
    onPrev: () => void;
    onNext: () => void;
    currentIndex: number;
    totalProjects: number;
    onDotClick: (index: number) => void;
  }) => {
    return (
      <>
        {/* SIDE BUTTONS - Positioned at card edges */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left Button - Attached to card's left side */}
          <motion.button
            onClick={onPrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 pointer-events-auto z-50"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              {/* Main button with gradient and glow */}
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-4 shadow-2xl border-2 border-white/80">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <ArrowLeft
                  className="w-7 h-7 text-white relative z-10"
                  strokeWidth={2.5}
                />
              </div>
              {/* Subtle outer glow */}
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-30 -z-10" />
            </div>
          </motion.button>

          {/* Right Button - Attached to card's right side */}
          <motion.button
            onClick={onNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 pointer-events-auto z-50"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <div className="relative">
              {/* Main button with gradient and glow */}
              <div className="relative bg-gradient-to-l from-cyan-500 to-blue-600 rounded-full p-4 shadow-2xl border-2 border-white/80">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-l from-cyan-400 to-blue-500 rounded-full blur-lg"
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <ArrowRight
                  className="w-7 h-7 text-white relative z-10"
                  strokeWidth={2.5}
                />
              </div>
              {/* Subtle outer glow */}
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-30 -z-10" />
            </div>
          </motion.button>
        </div>

        {/* PAGINATION - At the bottom of card, always visible */}
        <div className="absolute -bottom-16 left-0 right-0 z-50 flex justify-center">
          <motion.div
            className="flex gap-3 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-cyan-400/60 shadow-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {Array.from({ length: totalProjects }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => onDotClick(index)}
                className="relative"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {index === currentIndex ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                      {index + 1}
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-cyan-400 blur-md -z-10"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white/80 font-bold text-lg hover:bg-white/20 transition-all duration-300">
                    {index + 1}
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* SWIPE HINT - Subtle indicator at very bottom */}
        <motion.div
          className="absolute -bottom-28 left-0 right-0 z-50 flex justify-center"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <ChevronLeft className="w-3 h-3" />
            <span>swipe to navigate</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </motion.div>
      </>
    );
  },
);

MobileNavigation.displayName = "MobileNavigation";

// Desktop Navigation Arrows - Matching the elegant design
const NavigationArrows = memo(
  ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
    return (
      <>
        <Html position={[-8, 0, 0]}>
          <motion.button
            className="relative"
            onClick={onPrev}
            whileHover={{ scale: 1.15, x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-5 shadow-2xl border-2 border-white/80">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <ChevronLeft
                className="w-6 h-6 text-white relative z-10"
                strokeWidth={2.5}
              />
            </div>
          </motion.button>
        </Html>
        <Html position={[8, 0, 0]}>
          <motion.button
            className="relative"
            onClick={onNext}
            whileHover={{ scale: 1.15, x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative bg-gradient-to-l from-cyan-500 to-blue-600 rounded-full p-5 shadow-2xl border-2 border-white/80">
              <motion.div
                className="absolute inset-0 bg-gradient-to-l from-cyan-400 to-blue-500 rounded-full blur-lg"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <ChevronRight
                className="w-6 h-6 text-white relative z-10"
                strokeWidth={2.5}
              />
            </div>
          </motion.button>
        </Html>
      </>
    );
  },
);

NavigationArrows.displayName = "NavigationArrows";

// Main Projects Component
export const Projects: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStart = useRef<number>(0);
  const touchEnd = useRef<number>(0);
  const autoRotateTimer = useRef<NodeJS.Timeout>();

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, []);

  const handleDotClick = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex],
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchEnd.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchEnd.current - touchStart.current;
      if (Math.abs(delta) > 30) {
        if (delta > 0) handlePrev();
        else handleNext();
      }
    },
    [handlePrev, handleNext],
  );

  useEffect(() => {
    if (!isMobile) {
      autoRotateTimer.current = setInterval(handleNext, 6000);
      return () => {
        if (autoRotateTimer.current) {
          clearInterval(autoRotateTimer.current);
        }
      };
    }
  }, [isMobile, handleNext]);

  const getCanvasSettings = useCallback(() => {
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      isMobile ? 1.5 : 2,
    );
    return {
      dpr: [1, pixelRatio],
      gl: {
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile
          ? "low-power"
          : ("high-performance" as WebGLPowerPreference),
        stencil: false,
        depth: true,
        preserveDrawingBuffer: false,
      },
      performance: {
        min: isMobile ? 0.5 : 0.4,
        max: isMobile ? 0.8 : 1,
      },
    };
  }, [isMobile]);

  return (
    <section
      id="projects"
      className="py-16 px-4 w-full relative min-h-screen bg-transparent"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-400/5 rounded-full blur-3xl" />
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12 w-full relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-50 via-cyan-100 to-cyan-50 bg-clip-text text-transparent mb-4">
          Featured Projects
        </h1>
        <div className="text-xl md:text-2xl text-cyan-100/80">
          <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent font-semibold">
            {currentIndex + 1}
          </span>
          <span className="text-cyan-200/60"> / {projects.length}</span>
        </div>
      </motion.div>

      {/* Canvas Container */}
      <div
        className="w-full relative"
        style={{
          height: isMobile ? "calc(100vh - 250px)" : "calc(100vh - 200px)",
          minHeight: "500px",
        }}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchMove={isMobile ? handleTouchMove : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        <Canvas
          camera={{ position: [0, 0, isMobile ? 8 : 12], fov: 45 }}
          {...getCanvasSettings()}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} />
          <pointLight
            position={[-5, -5, -5]}
            intensity={0.3}
            color={COLORS.primary}
          />

          <Sparkles
            count={isMobile ? 30 : 80}
            size={isMobile ? 0.6 : 0.8}
            scale={isMobile ? [14, 7, 14] : [20, 10, 20]}
            speed={isMobile ? 0.5 : 0.3}
            color={COLORS.primary}
          />

          {!isMobile && (
            <NavigationArrows onPrev={handlePrev} onNext={handleNext} />
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.group
              key={currentIndex}
              custom={direction}
              initial={{ x: direction > 0 ? 50 : -50, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: direction > 0 ? -50 : 50, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
            >
              <ProjectCard3D
                project={projects[currentIndex]}
                isMobile={isMobile}
              />
            </motion.group>
          </AnimatePresence>
        </Canvas>

        {/* ELEGANT MOBILE CONTROLS */}
        {isMobile && (
          <MobileNavigation
            onPrev={handlePrev}
            onNext={handleNext}
            currentIndex={currentIndex}
            totalProjects={projects.length}
            onDotClick={handleDotClick}
          />
        )}
      </div>
    </section>
  );
};

export default Projects;
