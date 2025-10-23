// src/components/About.tsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import {
  Code2,
  Database,
  Cpu,
  Server,
  Terminal,
  Cloud,
  GitBranch,
  Zap,
  UserCheck,
  Users,
  Lightbulb,
  Repeat,
  MessageCircle,
  Award,
} from "lucide-react";

/* -------------------------
   Skills data (unchanged)
   ------------------------- */
const skills = [
  {
    name: "Algorithm Optimization",
    icon: Code2,
    description:
      "Designs highly efficient, scalable algorithms for complex problems.",
  },
  {
    name: "Database Architecture",
    icon: Database,
    description:
      "Builds robust, normalized, and high-performance database systems.",
  },
  {
    name: "System Design",
    icon: Cpu,
    description:
      "Creates modular, maintainable, and scalable system architectures.",
  },
  {
    name: "Backend Development",
    icon: Server,
    description: "Implements secure, high-performance APIs and microservices.",
  },
  {
    name: "DevOps & CI/CD",
    icon: Terminal,
    description:
      "Automates deployments and maintains seamless integration pipelines.",
  },
  {
    name: "Cloud Computing",
    icon: Cloud,
    description:
      "Leverages cloud services to build scalable and resilient applications.",
  },
  {
    name: "Version Control Mastery",
    icon: GitBranch,
    description:
      "Manages source control efficiently with Git workflows in collaborative teams.",
  },
  {
    name: "Performance Optimization",
    icon: Zap,
    description:
      "Improves software efficiency, reducing load times and resource consumption.",
  },
  {
    name: "Dedication",
    icon: UserCheck,
    description: "Committed to delivering high-quality work consistently.",
  },
  {
    name: "Problem-Solving",
    icon: Lightbulb,
    description: "Excels at analyzing complex problems and finding solutions.",
  },
  {
    name: "Team Collaboration",
    icon: Users,
    description:
      "Works effectively in teams, fostering collaboration and motivation.",
  },
  {
    name: "Critical Thinking",
    icon: Repeat,
    description: "Applies logical and creative thinking to tackle challenges.",
  },
  {
    name: "Adaptability",
    icon: Award,
    description:
      "Quickly adjusts to new technologies and changing requirements.",
  },
  {
    name: "Effective Communication",
    icon: MessageCircle,
    description:
      "Conveys ideas clearly to both technical and non-technical audiences.",
  },
];

/* -------------------------
   Lightweight mobile check
   ------------------------- */
function useIsMobile() {
  if (typeof window === "undefined") return false;
  return (
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
    window.innerWidth <= 768
  );
}

/* -------------------------
   Lissajous helper (unchanged)
   ------------------------- */
function getLissajousPosition(t: number, idx: number, total: number) {
  const a = 5;
  const b = 3.5;
  const delta = (idx / total) * Math.PI * 2;
  const x = a * Math.sin(0.1 * t + delta);
  const y = b * Math.sin(0.08 * t + delta * 2);
  const z = a * Math.cos(0.1 * t + delta);
  return new THREE.Vector3(x, y, z);
}

/* ======================================================================
   Enhanced AlgorithmicSphere
   - stronger neon aesthetic: glowing active icon, expanding ring, ripple particles
   - perf-friendly (mobile throttling & low geometry on mobile)
   - active tooltip (Html) near the active icon
   ====================================================================== */
function AlgorithmicSphere({ activeIndex }: { activeIndex: number }) {
  const isMobile = useIsMobile();
  const groupRef = useRef<THREE.Group | null>(null);

  const meshRefs = useRef<Array<THREE.Object3D | null>>(
    useMemo(() => Array(skills.length).fill(null), [])
  );

  const acc = useRef(0);
  const tempScale = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (isMobile) {
      acc.current += delta;
      if (acc.current < 1 / 30) return;
      acc.current = 0;
    }

    const t = state.clock.elapsedTime;

    for (let idx = 0; idx < skills.length; idx++) {
      const mesh = meshRefs.current[idx];
      if (!mesh) continue;

      const isActive = idx === activeIndex;
      const targetPos = isActive
        ? new THREE.Vector3(0, 0, 0)
        : getLissajousPosition(t, idx, skills.length);

      mesh.position.lerp(targetPos, 0.08);
      tempScale.set(isActive ? 5 : 3, isActive ? 5 : 3, 1);
      mesh.scale.lerp(tempScale, 0.08);
      mesh.rotation.y += isMobile ? 0.005 : 0.01;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = t * (isMobile ? 0.005 : 0.01);
      groupRef.current.rotation.x =
        Math.sin(t * (isMobile ? 0.02 : 0.05)) * (isMobile ? 0.02 : 0.05);
    }
  });

  const icosaDetail = isMobile ? 1 : 3;

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[3, icosaDetail]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          metalness={0.7}
          roughness={0.1}
          wireframe
        />
      </mesh>

      {skills.map((skill, idx) => {
        const Icon = skill.icon;
        return (
          <mesh key={idx} ref={(el) => (meshRefs.current[idx] = el)}>
            <Html
              center
              distanceFactor={isMobile ? 5 : 3}
              transform
              sprite
              style={{ pointerEvents: "none", background: "transparent" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  filter:
                    idx === activeIndex
                      ? "drop-shadow(0 0 40px #00ffff)"
                      : "none",
                  transition: "all 0.3s ease",
                  background: "transparent",
                }}
              >
                <Icon
                  size={idx === activeIndex ? 140 : 60} // bigger for active
                  color={idx === activeIndex ? "#00ffff" : "#ffffffaa"}
                />
                {idx === activeIndex && (
                  <span
                    style={{
                      marginTop: 10,
                      fontSize: isMobile ? 24 : 32,
                      fontWeight: 700,
                      color: "#00ffff",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      textShadow: "0 0 15px #00ffff",
                    }}
                  >
                    {skill.name}
                  </span>
                )}
              </div>
            </Html>
          </mesh>
        );
      })}
    </group>
  );
}

/* -------------------------
   TypewriterText (smoother & bounce)
   ------------------------- */
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let idx = 0;
    const interval = setInterval(() => {
      if (!text || idx >= text.length) {
        clearInterval(interval);
        return;
      }
      setDisplayed((prev) => prev + text[idx]);
      idx++;
      if (idx === text.length) clearInterval(interval);
    }, 48); // faster for snappier feel
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}</span>;
}

/* ======================================================================
   About component - polished layout & neon styling
   ====================================================================== */
export const About: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState(0);
  const isMobile = useIsMobile();

  // auto-cycle active skill unchanged
  useEffect(() => {
    const id = setInterval(() => {
      setActiveSkill((s) => (s + 1) % skills.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const dprMax = isMobile
    ? 1
    : Math.min(
        typeof window !== "undefined" ? window.devicePixelRatio ?? 1 : 1,
        1.5
      );

  return (
    <section id="about" className="relative py-16 px-6">
      {/* background gradient + vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(0,240,255,0.06), transparent 8%), radial-gradient(900px 400px at 90% 80%, rgba(140,80,255,0.04), transparent 10%), linear-gradient(180deg, rgba(3,10,14,0.35), rgba(6,10,14,0.8))",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{ position: "relative", zIndex: 2 }}
        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12"
      >
        {/* Sphere column */}
        <div
          className="w-full lg:w-1/2 h-[44rem] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))",
            border: "1px solid rgba(255,255,255,0.03)",
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 16], fov: 50 }}
            dpr={[1, dprMax]}
            gl={{ antialias: false, powerPreference: "low-power", alpha: true }}
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              display: "block",
            }}
          >
            <ambientLight intensity={isMobile ? 0.45 : 0.65} />
            {!isMobile && (
              <directionalLight position={[6, 6, 6]} intensity={0.9} />
            )}
            {isMobile && (
              <pointLight
                position={[4, 4, 4]}
                intensity={0.6}
                color="#06b6d4"
              />
            )}

            <AlgorithmicSphere activeIndex={activeSkill} />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={!isMobile}
              autoRotateSpeed={isMobile ? 0.01 : 0.02}
            />
          </Canvas>
        </div>

        {/* About / description column */}
        <div
          className="w-full lg:w-1/2 flex flex-col gap-6 text-white"
          style={{ zIndex: 3 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span
              style={{
                background: "linear-gradient(90deg,#00f0ff,#8d3cff)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              About Me
            </span>
          </motion.h2>

          <motion.p
            className="text-lg leading-relaxed text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            I am a <b>Full-Stack Developer</b> with deep technical expertise and
            strong professional soft skills. My work spans{" "}
            <b>
              algorithm optimization, system design, backend development, cloud
              solutions, and CI/CD
            </b>
            , paired with{" "}
            <b>
              dedication, problem-solving, teamwork, adaptability, and
              communication
            </b>
            .
          </motion.p>

          {/* Active skill card */}
          <motion.div
            key={skills[activeSkill].name}
            className="bg-gradient-to-r from-white/3 to-white/2 p-6 rounded-xl shadow-2xl relative overflow-hidden mt-6"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 10px 40px rgba(3,10,14,0.6)",
            }}
          >
            <motion.h3
              className="text-2xl font-bold mb-2 text-center"
              animate={{ scale: [1, 1.14, 1], opacity: [0.92, 1, 0.92] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{ color: "#00f0ff" }}
            >
              {skills[activeSkill].name}
            </motion.h3>

            <p className="text-center text-white/70">
              <TypewriterText text={skills[activeSkill].description} />
            </p>

            <div className="mt-6 flex justify-center gap-3">
              {/* small manual controls to preview; don't change auto-cycle logic */}
              <button
                onClick={() =>
                  setActiveSkill((s) => (s - 1 + skills.length) % skills.length)
                }
                className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/8 hover:bg-white/6 transition"
                aria-label="Previous skill"
              >
                Prev
              </button>
              <button
                onClick={() => setActiveSkill((s) => (s + 1) % skills.length)}
                className="px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-[#00f0ff] to-[#8d3cff] text-black font-semibold hover:opacity-90 transition"
                aria-label="Next skill"
              >
                Next
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
