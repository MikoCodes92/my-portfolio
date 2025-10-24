// src/components/Hero.tsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  Code2,
  Terminal,
  User,
  Smartphone,
} from "lucide-react";
import defaultAvatar from "@/assets/miko_image.jpg";

// Import Three.js components only if needed (they'll be tree-shaken for mobile)
let Canvas, useFrame, OrbitControls, Float, MeshDistortMaterial;
if (typeof window !== "undefined") {
  // Dynamic imports to avoid SSR issues
  import("@react-three/fiber").then((module) => {
    Canvas = module.Canvas;
    useFrame = module.useFrame;
  });
  import("@react-three/drei").then((module) => {
    OrbitControls = module.OrbitControls;
    Float = module.Float;
    MeshDistortMaterial = module.MeshDistortMaterial;
  });
}

/**
 * Lightweight mobile detection helper
 */
function useIsMobile() {
  if (typeof window === "undefined") return false;
  return (
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
    window.innerWidth <= 768
  );
}

/**
 * Static Geometric Background for mobile/low-power devices
 */
function StaticBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-40">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>

      {/* Static Geometric Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-cyan-400/30 rounded-full"></div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 border-2 border-purple-400/30 rotate-45"></div>
      <div className="absolute top-1/3 right-1/3 w-32 h-32 border-2 border-blue-400/30 rounded-full"></div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 100, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 100, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>
    </div>
  );
}

/**
 * 3D Background for desktop devices
 */
function ThreeDBackground() {
  const isMobile = useIsMobile();
  const dprMax = isMobile ? 1 : Math.min(window.devicePixelRatio ?? 1, 1.5);

  // Don't render if Canvas isn't loaded yet
  if (!Canvas) return <StaticBackground />;

  return (
    <div className="absolute inset-0 opacity-70 pointer-events-none">
      <Canvas
        dpr={[1, dprMax]}
        gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#00ffff" />
        <pointLight position={[10, -10, -5]} intensity={1} color="#a855f7" />
        <spotLight position={[0, 10, 0]} intensity={0.5} color="#ff00ff" />

        {/* Simple sphere as placeholder - you can add your 3D components here */}
        <mesh>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#00ffff" wireframe />
        </mesh>

        {OrbitControls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={1}
          />
        )}
      </Canvas>
    </div>
  );
}

/**
 * Simplified Avatar for mobile
 */
function MobileAvatar() {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        {/* Simple gradient ring */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-60 blur-xl"></div>

        {/* Static border */}
        <div className="absolute -inset-2 border-2 border-cyan-400/50 rounded-full"></div>

        <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white/20 shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl relative z-10">
          <AvatarImage
            src={defaultAvatar}
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white">
            <User className="w-16 h-16" />
          </AvatarFallback>
        </Avatar>

        {/* Simple corner accents */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-purple-400"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-purple-400"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400"></div>
      </div>
    </div>
  );
}

/**
 * Enhanced Avatar for desktop with animations
 */
function DesktopAvatar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className="flex justify-center mb-8"
    >
      <div className="relative group">
        {/* Outermost energy field */}
        <div className="absolute -inset-8 gradient-neon rounded-full opacity-30 blur-3xl animate-pulse-slow"></div>

        {/* Multiple rotating rings */}
        <div className="absolute -inset-6 border-2 border-accent/30 rounded-full animate-spin-slow"></div>
        <div
          className="absolute -inset-5 border-2 border-primary/40 rounded-full animate-spin-reverse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div className="absolute -inset-4 gradient-neon rounded-full opacity-75 blur-xl animate-pulse-slow"></div>
        <div className="absolute -inset-2 gradient-secondary rounded-full animate-spin-slow opacity-50"></div>

        {/* Hexagonal tech frame */}
        <div className="absolute -inset-3 opacity-40 group-hover:opacity-70 transition-opacity duration-500">
          <svg
            className="w-full h-full animate-spin-slow"
            viewBox="0 0 100 100"
          >
            <polygon
              points="50,5 90,25 90,75 50,95 10,75 10,25"
              fill="none"
              stroke="url(#hexGradient)"
              strokeWidth="0.5"
            />
            <defs>
              <linearGradient
                id="hexGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{
                    stopColor: "hsl(180 100% 50%)",
                    stopOpacity: 1,
                  }}
                />
                <stop
                  offset="50%"
                  style={{
                    stopColor: "hsl(270 100% 65%)",
                    stopOpacity: 1,
                  }}
                />
                <stop
                  offset="100%"
                  style={{
                    stopColor: "hsl(330 100% 60%)",
                    stopOpacity: 1,
                  }}
                />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Avatar container with enhanced effects */}
        <div className="relative">
          {/* Inner glow pulse */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse-slow"></div>

          <Avatar className="w-40 h-40 md:w-48 md:h-48 border-4 border-white/10 shadow-neon glass-strong backdrop-blur-xl ring-2 ring-primary/50 group-hover:ring-accent/70 transition-all duration-500 group-hover:scale-105 relative z-10">
            <AvatarImage
              src={defaultAvatar}
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-primary text-4xl">
              <User className="w-20 h-20" />
            </AvatarFallback>
          </Avatar>

          {/* Enhanced orbiting particles system */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-accent rounded-full shadow-glow animate-orbit"></div>
          <div
            className="absolute bottom-0 left-0 w-3 h-3 bg-primary rounded-full shadow-glow animate-orbit"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute top-1/2 right-0 w-2 h-2 gradient-neon rounded-full shadow-glow animate-orbit"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/4 left-0 w-3 h-3 bg-accent/80 rounded-full shadow-glow animate-orbit"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-primary/80 rounded-full shadow-glow animate-orbit"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Corner tech indicators */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-accent animate-pulse"></div>
          <div
            className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-primary animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-primary animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-accent animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        {/* Holographic scan lines */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/30 to-transparent animate-scan-vertical"></div>
        </div>

        {/* Energy pulse waves */}
        <div className="absolute inset-0 rounded-full border-2 border-accent/0 group-hover:border-accent/50 animate-pulse-wave"></div>
        <div
          className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/50 animate-pulse-wave"
          style={{ animationDelay: "0.3s" }}
        ></div>

        {/* Data stream effect */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-8 bg-gradient-to-b from-transparent via-accent to-transparent animate-float"></div>
          <div
            className="w-1 h-6 bg-gradient-to-b from-transparent via-primary to-transparent animate-float"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="w-1 h-10 bg-gradient-to-b from-transparent via-accent to-transparent animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-6 bg-gradient-to-b from-transparent via-primary to-transparent animate-float"></div>
          <div
            className="w-1 h-10 bg-gradient-to-b from-transparent via-accent to-transparent animate-float"
            style={{ animationDelay: "0.7s" }}
          ></div>
          <div
            className="w-1 h-8 bg-gradient-to-b from-transparent via-primary to-transparent animate-float"
            style={{ animationDelay: "1.2s" }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
}

export const Hero: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background - Static for mobile, 3D for desktop */}
      {isMobile ? <StaticBackground /> : <ThreeDBackground />}

      {/* Tech elements - Only show on desktop */}
      {!isMobile && (
        <>
          <div className="absolute top-20 left-10 animate-float">
            <Code2 className="w-12 h-12 text-accent opacity-20" />
          </div>
          <div
            className="absolute bottom-32 right-20 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <Terminal className="w-16 h-16 text-primary opacity-20" />
          </div>
        </>
      )}

      {/* Mobile-optimized indicator */}
      {/* {isMobile && (
        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-muted-foreground bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
          <Smartphone className="w-3 h-3" />
          <span>Mobile Optimized</span>
        </div>
      )} */}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Profile Photo - Different versions for mobile/desktop */}
          {isMobile ? <MobileAvatar /> : <DesktopAvatar />}

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 relative text-white">
              <span
                className={`transition-all duration-500 ${
                  !isMobile
                    ? "animate-text-glow hover:animate-text-glow-hover"
                    : "text-white"
                }`}
              >
                Full-Stack Expert | Constant Learner
              </span>
              {!isMobile && (
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-10 blur-xl -z-10"></div>
              )}
            </h2>
            {!isMobile && (
              <div className="absolute -inset-1 gradient-neon opacity-20 blur-2xl -z-10"></div>
            )}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Crafting Innovative, High-Impact Software Solutions with
            Cutting-Edge Technologies, Designed to Drive Growth and Transform
            Ideas into Reality.
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center items-center flex-wrap mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Link to GitHub */}
            <a
              href="https://github.com/MikoCodes92"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className={`font-semibold hover:scale-105 transition-transform ${
                  isMobile
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg"
                    : "gradient-neon shadow-neon"
                }`}
              >
                View My Work
              </Button>
            </a>

            {/* Open default mail client */}
            <a href="mailto:mikiasgsilasie1920@gmail.com">
              <Button
                size="lg"
                variant="outline"
                className={`hover:scale-105 transition-transform ${
                  isMobile
                    ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                    : "glass-strong tech-border"
                }`}
              >
                Contact Me
              </Button>
            </a>
          </motion.div>

          <motion.div
            className="flex gap-6 justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="https://github.com/MikoCodes92"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/mikias-gebresilasie-616569384"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:mikiasgsilasie1920@gmail.com"
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - Only show bounce animation on desktop */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <ArrowDown
            className={`w-6 h-6 text-accent ${
              !isMobile ? "animate-bounce" : ""
            }`}
          />
        </motion.div>
      </div>
    </section>
  );
};
