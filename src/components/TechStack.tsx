// src/components/TechStack.tsx
import React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Float, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import * as THREE from "three";

/* ===========================================================================
   INTERFACES
   - Define shapes for tech category, cell props, and particle props.
   =========================================================================== */

interface TechCategory {
  title: string;
  icon: string;
  skills: string[];
  color: string;
  description: string;
  model: string;
  proficiency: number;
  frequency: number;
}

interface HoneycombCellProps {
  category: TechCategory;
  position: [number, number, number];
  isActive: boolean;
  onHover: () => void;
  index: number;
  animationSpeed: number;
}

interface ParticleBurstProps {
  position: [number, number, number];
  color: string;
  count?: number;
  speed?: number;
}

interface AmbientParticlesProps {
  color: string;
  count: number;
  isActive: boolean;
  speed: number;
}

/* ===========================================================================
   DATA: techCategories
   - List of categories shown in the honeycomb.
   =========================================================================== */

const techCategories: TechCategory[] = [
  {
    title: "Programming Languages",
    icon: "💻",
    skills: [
      "Python",
      "Java",
      "C#",
      "C++",
      "PHP",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
    ],
    color: "#06b6d4",
    description: "Core programming foundations and syntax mastery",
    model: "cube",
    proficiency: 98,
    frequency: 0.8,
  },
  {
    title: "Frameworks & Libraries",
    icon: "🚀",
    skills: [
      "Django",
      "Flask",
      "Spring Boot",
      "Laravel",
      "ASP.NET",
      "React",
      "Vue",
      "jQuery",
      "TensorFlow",
    ],
    color: "#8b5cf6",
    description: "Modern development ecosystems and tools",
    model: "sphere",
    proficiency: 96,
    frequency: 0.6,
  },
  {
    title: "Databases & ORM",
    icon: "🗄️",
    skills: [
      "PostgreSQL",
      "MySQL",
      "MSSQL",
      "Entity Framework",
      "ADO.NET",
      "Stored Procedures",
    ],
    color: "#10b981",
    description: "Data persistence and management solutions",
    model: "cylinder",
    proficiency: 97,
    frequency: 0.7,
  },
  {
    title: "Machine Learning & AI",
    icon: "🤖",
    skills: ["CNN", "RNN", "LSTM", "NLP", "LangChain", "Deep Learning"],
    color: "#f97316",
    description: "Intelligent systems and artificial intelligence",
    model: "pyramid",
    proficiency: 95,
    frequency: 0.5,
  },
  {
    title: "DevOps & Deployment",
    icon: "⚙️",
    skills: [
      "Docker",
      "IIS",
      "Kestrel",
      "Swagger",
      "Postman",
      "CI/CD",
      "AWS EC2",
    ],
    color: "#6b7280",
    description: "Infrastructure and deployment automation",
    model: "gear",
    proficiency: 96,
    frequency: 0.4,
  },
  {
    title: "Tools & Design",
    icon: "🎨",
    skills: [
      "Git",
      "VS Code",
      "Visual Studio",
      "Figma",
      "Draw.io",
      "StarUML",
      "Visio",
    ],
    color: "#eab308",
    description: "Development tools and design systems",
    model: "octahedron",
    proficiency: 97,
    frequency: 0.9,
  },
  {
    title: "Collaboration",
    icon: "👥",
    skills: [
      "GitHub",
      "GitLab",
      "Jira",
      "Trello",
      "Slack",
      "Microsoft Teams",
      "Agile/Scrum",
    ],
    color: "#6366f1",
    description: "Team collaboration and project management",
    model: "dodecahedron",
    proficiency: 96,
    frequency: 0.8,
  },
];

/* ===========================================================================
   MATH / LAYOUT
   - generateHoneycombPositions creates a simple hex layout (center + 6 around).
   =========================================================================== */

const generateHoneycombPositions = (): [number, number, number][] => {
  const positions: [number, number, number][] = [];
  const radius = 1.8;
  const angleStep = (2 * Math.PI) / 6;

  // center
  positions.push([0, 0, 0]);

  // outer ring (hex)
  for (let i = 0; i < 6; i++) {
    const angle = i * angleStep;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    positions.push([x, y, 0]);
  }

  return positions;
};

const HONEYCOMB_POSITIONS = generateHoneycombPositions();

/* ===========================================================================
   PARTICLE SYSTEMS
   - ParticleField: decorative field of points behind the honeycomb
   - AmbientParticles: subtle orbiting points per cell
   - ParticleBurst: radial burst used on active cell
   =========================================================================== */

function ParticleField({
  count = 100,
  speed = 1,
}: {
  count?: number;
  speed?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  // precompute positions once (memoized)
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      a[i] = (Math.random() - 0.5) * 20;
      a[i + 1] = (Math.random() - 0.5) * 20;
      a[i + 2] = (Math.random() - 0.5) * 10;
    }
    return a;
  }, [count]);

  // rotate the whole field slowly for motion
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05 * speed;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function AmbientParticles({
  color,
  count,
  isActive,
  speed,
}: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      radius: 0.8 + Math.random() * 0.4,
      speed: (0.5 + Math.random() * 0.5) * speed,
      height: Math.random() * 0.3,
    }));
  }, [count, speed]);

  // animate particle positions around their orbit
  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime;
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;

      particles.forEach((particle, i) => {
        const x =
          Math.cos(particle.angle + time * particle.speed) * particle.radius;
        const z =
          Math.sin(particle.angle + time * particle.speed) * particle.radius;
        const y = Math.sin(time * particle.speed * 2) * particle.height;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      });

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particlePositions = useMemo(() => {
    const p = new Float32Array(count * 3);
    particles.forEach((particle, i) => {
      p[i * 3] = Math.cos(particle.angle) * particle.radius;
      p[i * 3 + 1] = 0;
      p[i * 3 + 2] = Math.sin(particle.angle) * particle.radius;
    });
    return p;
  }, [count, particles]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={isActive ? 0.6 : 0.2}
        sizeAttenuation
      />
    </points>
  );
}

function ParticleBurst({
  position,
  color,
  count = 12,
  speed = 1,
}: ParticleBurstProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // create particle objects (positions, velocities, life)
  const particles = useMemo(() => {
    const list: {
      position: number[];
      velocity: number[];
      life: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const particleSpeed = (0.5 + Math.random() * 0.5) * speed;
      list.push({
        position: [0, 0, 0],
        velocity: [
          Math.cos(angle) * particleSpeed,
          Math.sin(angle) * particleSpeed * 0.5,
          Math.sin(angle) * particleSpeed * 0.3,
        ],
        life: 1,
      });
    }
    return list;
  }, [count, speed]);

  // move particles each frame; reset on death
  useFrame(() => {
    if (pointsRef.current) {
      particles.forEach((particle) => {
        particle.position[0] += particle.velocity[0] * 0.05 * speed;
        particle.position[1] += particle.velocity[1] * 0.05 * speed;
        particle.position[2] += particle.velocity[2] * 0.05 * speed;
        particle.life -= 0.02 * speed;
      });

      particles.forEach((particle, i) => {
        if (particle.life <= 0) {
          const angle = (i / count) * Math.PI * 2;
          const particleSpeed = (0.5 + Math.random() * 0.5) * speed;
          particle.position = [0, 0, 0];
          particle.velocity = [
            Math.cos(angle) * particleSpeed,
            Math.sin(angle) * particleSpeed * 0.5,
            Math.sin(angle) * particleSpeed * 0.3,
          ];
          particle.life = 1;
        }
      });

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particlePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    particles.forEach((particle, i) => {
      arr[i * 3] = particle.position[0];
      arr[i * 3 + 1] = particle.position[1];
      arr[i * 3 + 2] = particle.position[2];
    });
    return arr;
  }, [count, particles]);

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

/* ===========================================================================
   GEOMETRY FACTORY
   - Returns slightly larger geometries than before (to make objects "bigger")
   - Changes here only affect the visual scale of the model shapes.
   =========================================================================== */

function getAdvancedGeometry(type: string, index: number) {
  switch (type) {
    case "sphere":
      // increased radius from 0.35 -> 0.5 for more presence
      return <sphereGeometry args={[0.5, 32, 32]} />;
    case "cylinder":
      // increased radius/height slightly from 0.25/0.5 -> 0.35/0.7
      return <cylinderGeometry args={[0.35, 0.35, 0.7, 32]} />;
    case "pyramid":
      // cone approximating a pyramid: bigger base & height
      return <coneGeometry args={[0.45, 0.8, 4]} />;
    case "gear":
      // larger torus (major radius increased)
      return <torusGeometry args={[0.5, 0.14, 16, 32]} />;
    case "octahedron":
      // increased size
      return <octahedronGeometry args={[0.5, 1]} />;
    case "dodecahedron":
      // increased size
      return <dodecahedronGeometry args={[0.45, 0]} />;
    default:
      // box made a bit larger
      return <boxGeometry args={[0.65, 0.65, 0.65]} />;
  }
}

/* ===========================================================================
   HONEYCOMB COMPONENTS
   - EnergyRings, AdvancedConnectingLines, AdvancedHoneycombCell are core pieces.
   - I increased ring radii slightly so rings still match larger objects visually.
   =========================================================================== */

function EnergyRings({
  activeIndex,
  speed,
}: {
  activeIndex: number;
  speed: number;
}) {
  const ringsRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    ringsRef.current.forEach((ring, index) => {
      if (ring) {
        const scale = 1 + Math.sin(time * 2 * speed + index) * 0.2;
        ring.scale.set(scale, scale, scale);
        ring.rotation.y = time * 0.5 * speed;
      }
    });
  });

  if (activeIndex === null) return null;

  const activeCategory = techCategories[activeIndex];
  const position = HONEYCOMB_POSITIONS[activeIndex];

  // slightly larger radii to match the bigger central objects
  return (
    <group position={position}>
      {[1.2, 1.7, 2.4].map((radius, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) ringsRef.current[index] = el;
          }}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[radius, 0.02, 8, 50]} />
          <meshBasicMaterial
            color={activeCategory.color}
            transparent
            opacity={0.2 - index * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function AdvancedConnectingLines({
  activeIndex,
  speed,
}: {
  activeIndex: number;
  speed: number;
}) {
  const linesRef = useRef<THREE.Line[]>([]);
  const timeRef = useRef(0);

  // animate opacity/line width to highlight connections
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;

    linesRef.current.forEach((line, index) => {
      if (line) {
        const isActiveLine = index === activeIndex;
        const pulseSpeed = isActiveLine ? 5 * speed : 1 * speed;
        const opacity = isActiveLine
          ? 0.6 + Math.sin(timeRef.current * pulseSpeed) * 0.2
          : 0.1;

        (line.material as THREE.LineBasicMaterial).opacity = opacity;
        (line.material as THREE.LineBasicMaterial).linewidth = isActiveLine
          ? 2
          : 1;
      }
    });
  });

  return (
    <group>
      {HONEYCOMB_POSITIONS.map((startPos, startIndex) => {
        return HONEYCOMB_POSITIONS.map((endPos, endIndex) => {
          if (startIndex >= endIndex) return null;

          const isActiveConnection =
            startIndex === activeIndex || endIndex === activeIndex;

          return (
            <line
              key={`${startIndex}-${endIndex}`}
              ref={(el) => {
                if (el) linesRef.current[startIndex * 7 + endIndex] = el;
              }}
            >
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={
                    new Float32Array([
                      startPos[0],
                      startPos[1],
                      startPos[2],
                      endPos[0],
                      endPos[1],
                      endPos[2],
                    ])
                  }
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color={
                  isActiveConnection
                    ? techCategories[activeIndex].color
                    : "#ffffff"
                }
                transparent
                opacity={0.15}
                linewidth={1}
              />
            </line>
          );
        });
      })}
    </group>
  );
}

/* AdvancedHoneycombCell
   - Each cell contains:
     - a hexagonal base (cylinder geometry),
     - a floating object (one of our geometries),
     - an HTML label (via <Html>),
     - and particle effects when active.
   - I increased the base radius and the floating object vertical offset slightly
     so the whole cell reads larger while preserving animations.
*/
const AdvancedHoneycombCell = React.forwardRef<THREE.Group, HoneycombCellProps>(
  ({ category, position, isActive, onHover, index, animationSpeed }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const timeRef = useRef(0);

    // rotate and bob the inner mesh for lively motion
    useFrame((state) => {
      timeRef.current = state.clock.elapsedTime;

      if (meshRef.current) {
        meshRef.current.rotation.y =
          timeRef.current * (0.2 + index * 0.05) * animationSpeed;
        meshRef.current.rotation.x =
          Math.sin(timeRef.current * 0.3 * animationSpeed + index) * 0.1;
      }
    });

    return (
      <group ref={ref} position={position}>
        {/* Hex base: slightly larger radius so it fits the larger floating object */}
        <mesh onPointerEnter={onHover}>
          <cylinderGeometry args={[1.1, 1.1, 0.18, 6]} />
          <meshStandardMaterial
            color={category.color}
            transparent
            opacity={0.3}
            emissive={category.color}
            emissiveIntensity={isActive ? 0.6 : 0.1}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Floating object: moved slightly higher (0.5) so it sits visually above the larger hex */}
        <Float
          speed={2 * animationSpeed}
          rotationIntensity={1 * animationSpeed}
          floatIntensity={0.5 * animationSpeed}
          floatingRange={[-0.05, 0.05]}
        >
          <mesh position={[0, 0.5, 0]} ref={meshRef}>
            {getAdvancedGeometry(category.model, index)}
            <meshPhysicalMaterial
              color={category.color}
              metalness={0.9}
              roughness={0.1}
              emissive={category.color}
              emissiveIntensity={isActive ? 0.8 : 0.3}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>
        </Float>

        {/* HTML label above the floating object (unchanged visual style) */}
        <Html position={[0, 1.3, 0]} center>
          <motion.div
            className="text-center cursor-pointer"
            animate={{
              scale: isActive ? 1.2 : 1,
              y: isActive ? -5 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <motion.div
              className="text-3xl mb-2 filter drop-shadow-lg"
              animate={
                isActive
                  ? {
                      rotateY: 360,
                      transition: {
                        duration: 2 / animationSpeed,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }
                  : {}
              }
            >
              {category.icon}
            </motion.div>

            <motion.div
              className="text-sm font-bold whitespace-nowrap text-white px-2 py-1"
              style={{
                textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {category.title.split(" ")[0]}
            </motion.div>
          </motion.div>
        </Html>

        {/* If active, show a burst */}
        {isActive && (
          <ParticleBurst
            position={[0, 0.3, 0]}
            color={category.color}
            count={12}
            speed={animationSpeed}
          />
        )}

        {/* Ambient orbiting points */}
        <AmbientParticles
          color={category.color}
          count={5}
          isActive={isActive}
          speed={animationSpeed}
        />
      </group>
    );
  }
);

AdvancedHoneycombCell.displayName = "AdvancedHoneycombCell";

/* HoneycombStructure
   - Groups all cells, a background particle field, connecting lines, and rings.
   - Handles auto-rotation and per-cell bobbing/pulsing.
*/
function HoneycombStructure({
  activeIndex,
  autoRotate,
  onCellHover,
  animationSpeed,
}: {
  activeIndex: number;
  autoRotate: boolean;
  onCellHover: (index: number) => void;
  animationSpeed: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cellsRef = useRef<THREE.Group[]>([]);
  const timeRef = useRef(0);

  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;

    // slowly rotate the whole honeycomb if autoRotate is enabled
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = timeRef.current * 0.1 * animationSpeed;
    }

    // per-cell vertical bob and pulsing for active cell
    cellsRef.current.forEach((cell, index) => {
      if (cell) {
        const isActive = index === activeIndex;
        const t = timeRef.current * animationSpeed;

        cell.position.y =
          HONEYCOMB_POSITIONS[index][1] + Math.sin(t * 0.5 + index) * 0.1;

        if (isActive) {
          const pulse = 1 + Math.sin(t * 3) * 0.1;
          cell.scale.set(pulse, pulse, pulse);
        } else {
          cell.scale.set(1, 1, 1);
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Background decorative field */}
      <ParticleField count={80} speed={animationSpeed} />

      {/* Render first 7 categories (center + 6) */}
      {techCategories.slice(0, 7).map((category, index) => (
        <AdvancedHoneycombCell
          key={index}
          ref={(el) => {
            if (el) cellsRef.current[index] = el;
          }}
          category={category}
          position={HONEYCOMB_POSITIONS[index]}
          isActive={index === activeIndex}
          onHover={() => onCellHover(index)}
          index={index}
          animationSpeed={animationSpeed}
        />
      ))}

      {/* Lines and rings */}
      <AdvancedConnectingLines
        activeIndex={activeIndex}
        speed={animationSpeed}
      />
      <EnergyRings activeIndex={activeIndex} speed={animationSpeed} />
    </group>
  );
}

/* ===========================================================================
   SCENE & CANVAS
   - AdvancedHoneycombScene sets camera and lighting and forces scene.background = null
     to guarantee transparency.
   - AdvancedHoneycombCanvas sets the WebGL context to alpha: true and setsClearColor(0,0)
     to avoid flashes of white.
   =========================================================================== */

function AdvancedHoneycombScene({
  activeIndex,
  autoRotate,
  onCellHover,
  animationSpeed,
}: {
  activeIndex: number;
  autoRotate: boolean;
  onCellHover: (index: number) => void;
  animationSpeed: number;
}) {
  const { camera, scene } = useThree();

  useEffect(() => {
    // camera setup
    camera.position.set(0, 0, 10);
    camera.fov = 45;
    camera.updateProjectionMatrix();

    // ensure scene background is null => truly transparent
    scene.background = null;
  }, [camera, scene]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#ffffff" />

      {/* Main honeycomb content */}
      <HoneycombStructure
        activeIndex={activeIndex}
        autoRotate={autoRotate}
        onCellHover={onCellHover}
        animationSpeed={animationSpeed}
      />

      {/* subtle sparkles for extra polish */}
      <Sparkles
        count={30}
        scale={15}
        size={1.5}
        speed={0.3 * animationSpeed}
        color="#ffffff"
        opacity={0.3}
      />
    </>
  );
}

function AdvancedHoneycombCanvas({
  activeIndex,
  autoRotate,
  onCellHover,
  animationSpeed,
}: {
  activeIndex: number;
  autoRotate: boolean;
  onCellHover: (index: number) => void;
  animationSpeed: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      // make the canvas fill parent and be transparent
      style={{
        position: "absolute",
        inset: 0,
        background: "transparent",
        width: "100%",
        height: "100%",
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        // ensure renderer clear alpha is 0 to avoid white flash / background
        try {
          gl.setClearColor(0x000000, 0);
        } catch (e) {
          gl.setClearColor(new THREE.Color(0, 0, 0), 0);
        }
      }}
    >
      <Suspense
        fallback={
          <Html center>
            <motion.div
              className="text-white text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              🚀
            </motion.div>
          </Html>
        }
      >
        <AdvancedHoneycombScene
          activeIndex={activeIndex}
          autoRotate={autoRotate}
          onCellHover={onCellHover}
          animationSpeed={animationSpeed}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate={autoRotate}
          autoRotateSpeed={1 * animationSpeed}
          maxPolarAngle={Math.PI}
          minDistance={6}
          maxDistance={15}
          enableDamping
          dampingFactor={0.05}
        />
      </Suspense>
    </Canvas>
  );
}

/* ===========================================================================
   UI: Speed Control
   - Small control for adjusting animation speed; purely UI code.
   =========================================================================== */

function SpeedControl({
  animationSpeed,
  setAnimationSpeed,
}: {
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-white/80 text-sm">🐢</span>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
          className="w-24 accent-cyan-400"
        />
        <span className="text-white/80 text-sm">🚀</span>
      </div>
      <div className="text-white text-xs">
        Speed: {animationSpeed.toFixed(1)}x
      </div>
    </motion.div>
  );
}

/* ===========================================================================
   ResponsiveDetailPanel
   - The right-side panel showing details for the selected category.
   - Kept unchanged visually — comments added for clarity.
   =========================================================================== */

function ResponsiveDetailPanel({
  category,
  isActive,
}: {
  category: TechCategory;
  isActive: boolean;
}) {
  if (!isActive || !category) return null;

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.03 }}
    >
      {/* Neon Glow Overlay */}
      <div
        className="absolute inset-0 rounded-3xl border-2 border-transparent bg-clip-padding animate-pulse"
        style={{
          background: `linear-gradient(135deg, ${category.color}33, ${category.color}11)`,
          boxShadow: `0 0 20px ${category.color}55, 0 0 40px ${category.color}33`,
        }}
      ></div>

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className="text-6xl mb-5 text-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 15,
            delay: 0.1,
          }}
        >
          {category.icon}
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-3xl lg:text-4xl font-extrabold text-center mb-5"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: category.color }}
        >
          {category.title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-center text-white/90 mb-6 text-base lg:text-lg leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {category.description}
        </motion.p>

        {/* Proficiency Bar */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-white/80">
              Mastery Level
            </span>
            <motion.span
              className="text-lg font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              style={{ color: category.color }}
            >
              {category.proficiency}%
            </motion.span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-3 rounded-full"
              style={{
                backgroundColor: category.color,
                boxShadow: `0 0 10px ${category.color}80`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${category.proficiency}%` }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, staggerChildren: 0.1 }}
        >
          {category.skills.map((skill, index) => (
            <motion.div
              key={index}
              className="text-center p-3 rounded-xl cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              whileHover={{ scale: 1.1 }}
            >
              {/* Neon border */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${category.color}55, ${category.color}22)`,
                  filter: "blur(6px)",
                  zIndex: -1,
                }}
              ></div>
              <span className="relative text-white font-semibold text-sm">
                {skill}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ===========================================================================
   EnhancedNavigation - small dots to pick each cell
   =========================================================================== */

function EnhancedNavigation({
  activeIndex,
  setActiveIndex,
  setAutoRotate,
}: {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  setAutoRotate: (autoRotate: boolean) => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className="flex gap-3 items-center flex-wrap justify-center">
        {techCategories.slice(0, 7).map((category, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setAutoRotate(false);
            }}
            className="relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={`w-3 h-3 rounded-full ${
                activeIndex === index ? "shadow-lg" : "shadow-md"
              }`}
              style={{
                backgroundColor:
                  activeIndex === index
                    ? category.color
                    : `${category.color}60`,
                boxShadow:
                  activeIndex === index
                    ? `0 0 15px ${category.color}`
                    : `0 0 8px ${category.color}40`,
              }}
              animate={
                activeIndex === index
                  ? {
                      scale: [1, 1.2, 1],
                      transition: { duration: 2, repeat: Infinity },
                    }
                  : {}
              }
            />
          </motion.button>
        ))}
      </div>

      <motion.div
        className="text-sm text-white/70 font-medium text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {activeIndex + 1} of {techCategories.length}
      </motion.div>
    </motion.div>
  );
}

/* ===========================================================================
   MAIN COMPONENT
   - Maintains activeIndex, autoplay (autoRotate), animationSpeed, mounted.
   - Renders the full layout: heading, canvas, navigation, detail panel.
   =========================================================================== */

export const TechStack = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [mounted, setMounted] = useState(false);

  // mounted flag to avoid SSR / hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // if autoRotate is on, rotate through categories every interval
  useEffect(() => {
    if (!autoRotate || !mounted) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % techCategories.length);
    }, 5000 / animationSpeed);

    return () => clearInterval(interval);
  }, [autoRotate, mounted, animationSpeed]);

  // when hovering a cell, set it active and stop auto rotate
  const handleCellHover = (index: number) => {
    setActiveIndex(index);
    setAutoRotate(false);
  };

  // during initial load show a loading placeholder
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-white text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  // ---------- JSX layout ----------
  return (
    <section id="tech-stack" className="relative py-12 lg:py-20 px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-8 lg:mb-16">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black mb-4 lg:mb-6"
          animate={{
            backgroundPosition: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          style={{
            background:
              "linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899, #f97316, #eab308, #06b6d4)",
            backgroundSize: "400% 400%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          TECH HIVE
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Interactive 3D visualization
        </motion.p>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8 px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => setAutoRotate(!autoRotate)}
            className="border-white/30 text-white hover:bg-white/10 transition-all duration-300 text-sm"
            size="sm"
          >
            <motion.span
              animate={autoRotate ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: autoRotate ? Infinity : 0 }}
              className="inline-block mr-2"
            >
              {autoRotate ? "⏸️" : "▶️"}
            </motion.span>
            {autoRotate ? "Pause" : "Play"}
          </Button>

          <SpeedControl
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
          />
        </motion.div>

        {/* Main content: left = canvas, right = details */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2">
            {/* Canvas wrapper: responsible for sizing/positioning; transparent background */}
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] bg-transparent overflow-hidden">
              <AdvancedHoneycombCanvas
                activeIndex={activeIndex}
                autoRotate={autoRotate}
                onCellHover={handleCellHover}
                animationSpeed={animationSpeed}
              />
            </div>

            {/* Navigation dots */}
            <EnhancedNavigation
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              setAutoRotate={setAutoRotate}
            />
          </div>

          {/* Right side: details */}
          <div className="w-full lg:w-1/2">
            <ResponsiveDetailPanel
              category={techCategories[activeIndex]}
              isActive={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
