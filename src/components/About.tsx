// src/components/About.tsx
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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

// --- Skills data (static) ---
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

// --- Mobile detection hook ---
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      const mobile =
        (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
        window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

// --- Lissajous position calculation ---
function getLissajousPosition(
  t: number,
  idx: number,
  total: number,
): THREE.Vector3 {
  const a = 5,
    b = 3.5,
    delta = (idx / total) * Math.PI * 2;
  return new THREE.Vector3(
    a * Math.sin(0.1 * t + delta),
    b * Math.sin(0.08 * t + delta * 2),
    a * Math.cos(0.1 * t + delta),
  );
}

// --- 3D sphere component with unified drag/rotation ---
function AlgorithmicSphere({
  activeIndex,
  manualRotation,
  isDragging,
}: {
  activeIndex: number;
  manualRotation: [number, number];
  isDragging: boolean;
}) {
  const isMobile = useIsMobile();
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Object3D | null)[]>([]);
  const acc = useRef(0);
  const tempScale = useMemo(() => new THREE.Vector3(), []);
  const autoRotY = useRef(0);
  const autoRotX = useRef(0);

  if (meshRefs.current.length !== skills.length) {
    meshRefs.current = Array(skills.length).fill(null);
  }

  useFrame((state, delta) => {
    if (isMobile) {
      acc.current += delta;
      if (acc.current < 1 / 30) return; // throttle on mobile
      acc.current = 0;
    }
    const t = state.clock.elapsedTime;

    // Update positions of skill icons
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

    // Update group rotation: auto + manual
    if (groupRef.current) {
      if (!isDragging) {
        // Auto‑rotate accumulates over time (scaled to match original speed)
        autoRotY.current += (isMobile ? 0.005 : 0.01) * delta * 30;
        autoRotX.current =
          Math.sin(t * (isMobile ? 0.02 : 0.05)) * (isMobile ? 0.02 : 0.05);
      }

      groupRef.current.rotation.y = autoRotY.current + manualRotation[1];
      groupRef.current.rotation.x = autoRotX.current + manualRotation[0];
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
                  size={idx === activeIndex ? 140 : 60}
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

// --- Typewriter effect (memoized) ---
const TypewriterText = React.memo(
  ({ text, speed = 75 }: { text: string; speed?: number }) => {
    const [displayed, setDisplayed] = useState("");
    const indexRef = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
      setDisplayed("");
      indexRef.current = 0;

      const type = () => {
        if (indexRef.current < text.length) {
          setDisplayed(text.slice(0, indexRef.current + 1));
          indexRef.current += 1;
          timeoutRef.current = setTimeout(type, speed);
        }
      };

      timeoutRef.current = setTimeout(type, speed);
      return () => clearTimeout(timeoutRef.current);
    }, [text, speed]);

    return <span>{displayed}</span>;
  },
);

// --- Main About component with unified pointer handling ---
export const About: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState(0);
  const isMobile = useIsMobile();

  // Drag state (works for both mouse and touch)
  const [isDragging, setIsDragging] = useState(false);
  const [manualRotation, setManualRotation] = useState<[number, number]>([
    0, 0,
  ]);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine if a pointer event should be considered a drag (movement > 5px)
  const startDrag = useCallback((x: number, y: number) => {
    pointerStartRef.current = { x, y };
    lastPointerRef.current = { x, y };
    setIsDragging(false); // will become true on move if threshold exceeded
  }, []);

  const moveDrag = useCallback(
    (x: number, y: number) => {
      if (!pointerStartRef.current || !lastPointerRef.current) return;

      const deltaX = x - lastPointerRef.current.x;
      const deltaY = y - lastPointerRef.current.y;

      // If moved beyond threshold, mark as dragging
      const dist = Math.hypot(
        x - pointerStartRef.current.x,
        y - pointerStartRef.current.y,
      );
      if (dist > 5) {
        setIsDragging(true);
      }

      if (isDragging) {
        // Convert screen delta to rotation (sensitivity factor)
        const rotSensitivity = 0.005;
        setManualRotation(([rx, ry]) => [
          rx + deltaY * rotSensitivity,
          ry + deltaX * rotSensitivity,
        ]);
      }

      lastPointerRef.current = { x, y };
    },
    [isDragging],
  );

  const endDrag = useCallback(() => {
    pointerStartRef.current = null;
    lastPointerRef.current = null;
    setIsDragging(false);
  }, []);

  // --- Event handlers (unified for mouse and touch) ---

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Only handle primary button (left click/touch)
      if (e.button !== 0) return;

      // Store the target to check later if needed
      const target = e.target;

      // Start tracking potential drag
      startDrag(e.clientX, e.clientY);

      // Don't prevent default on pointer down - this allows the click to eventually fire
      // We'll handle it in pointer up
    },
    [startDrag],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointerStartRef.current) return; // not dragging

      // Only prevent default if we're actually dragging
      if (isDragging) {
        e.preventDefault();
      }

      moveDrag(e.clientX, e.clientY);
    },
    [moveDrag, isDragging],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointerStartRef.current) return;

      const wasDragging = isDragging;
      const startPoint = { ...pointerStartRef.current };
      endDrag();

      // If it was a quick tap/click (not dragging), scroll to about
      if (!wasDragging) {
        // Calculate total movement
        const totalMovement = Math.hypot(
          e.clientX - startPoint.x,
          e.clientY - startPoint.y,
        );

        // Only scroll if movement was minimal (less than 10px)
        if (totalMovement < 10) {
          const el = document.getElementById("about");
          if (el) {
            const yOffset = -70;
            const y =
              el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }
      }
    },
    [isDragging, endDrag],
  );

  const handlePointerCancel = useCallback(() => {
    endDrag();
  }, [endDrag]);

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerStartRef.current) {
        endDrag();
      }
    },
    [endDrag],
  );

  // Also add a click handler as a fallback
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only handle if we're not dragging and it's a direct click on the container/canvas
      if (!isDragging) {
        const el = document.getElementById("about");
        if (el) {
          const yOffset = -70;
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    },
    [isDragging],
  );

  // Skill cycling
  useEffect(() => {
    const id = setInterval(
      () => setActiveSkill((s) => (s + 1) % skills.length),
      6000,
    );
    return () => clearInterval(id);
  }, []);

  const dprMax = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

  return (
    <section
      id="about"
      className="relative flex flex-col items-center justify-center py-16 px-6 min-h-screen text-center"
    >
      <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center gap-16">
        {/* Text Section (unchanged) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 text-white">
          <motion.h2
            className="text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-[#00f0ff] to-[#8d3cff] bg-clip-text text-transparent">
              About Me
            </span>
          </motion.h2>

          <motion.p
            className="text-lg leading-relaxed text-white/90"
            style={{ textAlign: "justify" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            I am a <b>Senior Full-Stack Developer</b> building secure, scalable,
            and high-performance solutions. I craft robust APIs, efficient
            systems, and responsive interfaces with precision. Each project
            reflects my commitment to{" "}
            <b>security, performance, and client satisfaction</b>, delivering
            impactful digital products.
          </motion.p>

          <motion.div
            key={skills[activeSkill].name}
            className="bg-gradient-to-r from-white/5 to-white/2 p-6 rounded-2xl shadow-2xl mt-6 mx-auto max-w-md"
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
              <button
                onClick={() =>
                  setActiveSkill((s) => (s - 1 + skills.length) % skills.length)
                }
                className="px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/8 hover:bg-white/6 transition"
              >
                Prev
              </button>
              <button
                onClick={() => setActiveSkill((s) => (s + 1) % skills.length)}
                className="px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-[#00f0ff] to-[#8d3cff] text-black font-semibold hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </motion.div>
        </div>

        {/* 3D Sphere Section with unified pointer handlers */}
        <div
          ref={containerRef}
          className="w-full lg:w-1/2 h-[44rem] rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        >
          <Canvas
            camera={{ position: [0, 0, 16], fov: 50 }}
            dpr={[1, dprMax]}
            gl={{
              antialias: !isMobile,
              powerPreference: "low-power",
              alpha: true,
            }}
            style={{ width: "100%", height: "100%", background: "transparent" }}
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
            <AlgorithmicSphere
              activeIndex={activeSkill}
              manualRotation={manualRotation}
              isDragging={isDragging}
            />
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default About;
