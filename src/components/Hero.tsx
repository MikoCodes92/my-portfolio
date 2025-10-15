import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  MeshDistortMaterial,
  Sphere,
  Torus,
} from "@react-three/drei";
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
} from "lucide-react";
import { useRef } from "react";
import * as THREE from "three";
import defaultAvatar from "@/assets/miko_image.jpg";

function AnimatedSphere() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#00ffff"
          attach="material"
          distort={0.5}
          speed={3}
          roughness={0}
          metalness={1}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Second ring */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.2, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

function FloatingCode() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[3, 1, -2]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  );
}

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-70">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <pointLight position={[-10, -10, -5]} intensity={1} color="#00ffff" />
          <pointLight position={[10, -10, -5]} intensity={1} color="#a855f7" />
          <spotLight position={[0, 10, 0]} intensity={0.5} color="#ff00ff" />
          <AnimatedSphere />
          <FloatingCode />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Canvas>
      </div>

      {/* Tech elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Code2 className="w-12 h-12 text-accent opacity-20" />
      </div>
      <div
        className="absolute bottom-32 right-20 animate-float"
        style={{ animationDelay: "1s" }}
      >
        <Terminal className="w-16 h-16 text-primary opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Profile Photo with Advanced Effects */}
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

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 relative text-white">
              <span className="transition-all duration-500 animate-text-glow hover:animate-text-glow-hover">
                Full-Stack Expert | Constant Learner
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-10 blur-xl -z-10"></div>
            </h2>
            <div className="absolute -inset-1 gradient-neon opacity-20 blur-2xl -z-10"></div>
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
                className="gradient-neon shadow-neon font-semibold hover:scale-105 transition-transform"
              >
                View My Work
              </Button>
            </a>

            {/* Open default mail client */}
            <a href="mailto:mikiasgsilasie1920@gmail.com">
              <Button
                size="lg"
                variant="outline"
                className="glass-strong tech-border hover:scale-105 transition-transform"
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

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <ArrowDown className="w-6 h-6 text-accent animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};
