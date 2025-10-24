// src/components/TechStack.tsx
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Float, Sparkles, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import * as THREE from "three";

// Ant Design Icons
import {
  CodeOutlined,
  RocketOutlined,
  DatabaseOutlined,
  RobotOutlined,
  SettingOutlined,
  ToolOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  CloudServerOutlined,
  ApiOutlined,
  ExperimentOutlined,
  BulbOutlined,
  SafetyCertificateOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

/* ===========================
   OPTIMIZED MOBILE DETECTION
   =========================== */
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

/* ========================================================================
   INTERFACES
   ======================================================================== */
interface TechCategory {
  title: string;
  icon: React.ReactNode;
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
  isZoomed: boolean;
}

/* ========================================================================
   DATA WITH ANT DESIGN ICONS AND COLOR COORDINATION
   ======================================================================== */
const techCategories: TechCategory[] = [
  {
    title: "Programming Languages",
    icon: <CodeOutlined style={{ color: "#06b6d4" }} />,
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
    model: "tetrahedron",
    proficiency: 98,
    frequency: 0.8,
  },
  {
    title: "Frameworks & Libraries",
    icon: <RocketOutlined style={{ color: "#8b5cf6" }} />,
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
    model: "icosahedron",
    proficiency: 96,
    frequency: 0.6,
  },
  {
    title: "Databases & ORM",
    icon: <DatabaseOutlined style={{ color: "#10b981" }} />,
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
    model: "torusKnot",
    proficiency: 97,
    frequency: 0.7,
  },
  {
    title: "Machine Learning & AI",
    icon: <RobotOutlined style={{ color: "#f97316" }} />,
    skills: ["CNN", "RNN", "LSTM", "NLP", "LangChain", "Deep Learning"],
    color: "#f97316",
    description: "Intelligent systems and artificial intelligence",
    model: "octahedron",
    proficiency: 95,
    frequency: 0.5,
  },
  {
    title: "DevOps & Deployment",
    icon: <DeploymentUnitOutlined style={{ color: "#6b7280" }} />,
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
    icon: <ToolOutlined style={{ color: "#eab308" }} />,
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
    model: "dodecahedron",
    proficiency: 97,
    frequency: 0.9,
  },
  {
    title: "Collaboration",
    icon: <TeamOutlined style={{ color: "#6366f1" }} />,
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
    model: "sphere",
    proficiency: 96,
    frequency: 0.8,
  },
];

/* ========================================================================
   LAYOUT HELPERS - SEPARATE FOR MOBILE AND DESKTOP
   ======================================================================== */
const generateDesktopHoneycombPositions = (): [number, number, number][] => {
  const positions: [number, number, number][] = [];
  const radius = 1.8;
  const angleStep = (2 * Math.PI) / 6;

  positions.push([0, 0, 0]);
  for (let i = 0; i < 6; i++) {
    const angle = i * angleStep;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    positions.push([x, y, 0]);
  }
  return positions;
};

const generateMobileHoneycombPositions = (): [number, number, number][] => {
  const positions: [number, number, number][] = [];
  const radius = 2.2;
  const angleStep = (2 * Math.PI) / 6;

  positions.push([0, 0, 0]);
  for (let i = 0; i < 6; i++) {
    const angle = i * angleStep;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    positions.push([x, y, 0]);
  }
  return positions;
};

const DESKTOP_POSITIONS = generateDesktopHoneycombPositions();
const MOBILE_POSITIONS = generateMobileHoneycombPositions();

/* ============================
   MOBILE PARTICLE FIELD
   ============================ */
const MobileParticleField = React.memo(
  ({ count = 20, speed = 1 }: { count?: number; speed?: number }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const particleData = useRef<
      Array<{
        position: [number, number, number];
        velocity: [number, number, number];
      }>
    >([]);

    const particles = useMemo(() => {
      const data = Array.from({ length: count }).map(() => ({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4,
        ] as [number, number, number],
        velocity: [
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.003,
        ] as [number, number, number],
      }));
      particleData.current = data;
      return data;
    }, [count]);

    useFrame((state) => {
      if (pointsRef.current) {
        const positions = pointsRef.current.geometry.attributes.position
          .array as Float32Array;

        particleData.current.forEach((p, i) => {
          for (let j = 0; j < 3; j++) {
            p.position[j] += p.velocity[j] * speed;
            if (p.position[j] > 4 || p.position[j] < -4) {
              p.velocity[j] *= -0.9;
              p.position[j] = Math.max(-4, Math.min(4, p.position[j]));
            }
            positions[i * 3 + j] = p.position[j];
          }
        });

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.rotation.y += 0.001 * speed;
      }
    });

    return (
      <points ref={pointsRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={new Float32Array(particles.flatMap((p) => p.position))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.25}
          sizeAttenuation
        />
      </points>
    );
  }
);

/* ============================
   MOBILE HONEYCOMB CELL (ICON ONLY)
   ============================ */
const MobileHoneycombCell = React.memo(
  React.forwardRef<THREE.Group, HoneycombCellProps>(
    ({ category, position, isActive, onHover, animationSpeed }, ref) => {
      const meshRef = useRef<THREE.Mesh>(null);
      const groupRef = useRef<THREE.Group>(null);

      useFrame((state) => {
        if (!meshRef.current || !groupRef.current) return;

        const time = state.clock.elapsedTime;

        const floatY = Math.sin(time * 2 + position[0]) * 0.15;
        const floatX = Math.cos(time * 1.5 + position[1]) * 0.1;

        groupRef.current.position.x = position[0] + floatX;
        groupRef.current.position.y = position[1] + floatY;

        meshRef.current.rotation.y = time * 0.3 * animationSpeed;
        meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;

        const pulse = isActive ? 1 + Math.sin(time * 3) * 0.1 : 1;
        meshRef.current.scale.set(pulse, pulse, pulse);
      });

      return (
        <group ref={groupRef} position={position}>
          <mesh onPointerEnter={onHover}>
            <cylinderGeometry args={[1.0, 1.0, 0.12, 6]} />
            <meshStandardMaterial
              color={category.color}
              transparent
              opacity={isActive ? 0.6 : 0.25}
              emissive={category.color}
              emissiveIntensity={isActive ? 0.3 : 0.1}
            />
          </mesh>

          <Float
            speed={1.5 * animationSpeed}
            rotationIntensity={0.7}
            floatIntensity={0.2}
          >
            <mesh ref={meshRef} position={[0, 0.3, 0]}>
              {getMobileGeometry(category.model)}
              <meshPhysicalMaterial
                color={category.color}
                metalness={0.7}
                roughness={0.2}
                emissive={category.color}
                emissiveIntensity={isActive ? 0.4 : 0.15}
              />
            </mesh>
          </Float>

          {/* ICON ONLY - NO TEXT */}
          <Html position={[0, 0.8, 0]} center>
            <motion.div
              className="text-center"
              animate={{
                scale: isActive ? 1.3 : 1,
                y: isActive ? -2 : 0,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="text-xl mb-1 flex justify-center">
                {category.icon}
              </div>
            </motion.div>
          </Html>
        </group>
      );
    }
  )
);

/* ========================================================================
   SIMPLIFIED MOBILE GEOMETRY
   ======================================================================== */
const getMobileGeometry = (type: string) => {
  switch (type) {
    case "sphere":
      return <sphereGeometry args={[0.4, 12, 12]} />;
    case "cylinder":
      return <cylinderGeometry args={[0.3, 0.3, 0.6, 12]} />;
    case "pyramid":
      return <coneGeometry args={[0.4, 0.7, 4]} />;
    case "gear":
      return <torusGeometry args={[0.4, 0.1, 6, 12]} />;
    case "octahedron":
      return <octahedronGeometry args={[0.4, 0]} />;
    case "dodecahedron":
      return <dodecahedronGeometry args={[0.4, 0]} />;
    default:
      return <boxGeometry args={[0.55, 0.55, 0.55]} />;
  }
};

/* ========================================================================
   DESKTOP-SPECIFIC ADVANCED 3D GEOMETRIES
   ======================================================================== */
const getDesktopGeometry = (type: string) => {
  switch (type) {
    case "tetrahedron":
      return <tetrahedronGeometry args={[0.5, 0]} />;
    case "icosahedron":
      return <icosahedronGeometry args={[0.45, 0]} />;
    case "torusKnot":
      return <torusKnotGeometry args={[0.3, 0.1, 128, 16]} />;
    case "octahedron":
      return <octahedronGeometry args={[0.5, 2]} />;
    case "gear":
      return <torusGeometry args={[0.45, 0.15, 12, 24]} />;
    case "dodecahedron":
      return <dodecahedronGeometry args={[0.45, 0]} />;
    case "sphere":
      return <sphereGeometry args={[0.5, 24, 24]} />;
    default:
      return <boxGeometry args={[0.65, 0.65, 0.65]} />;
  }
};

/* ========================================================================
   MOBILE CONNECTING LINES
   ======================================================================== */
const MobileConnectingLines = React.memo(
  ({ activeIndex }: { activeIndex: number }) => {
    return (
      <group>
        {MOBILE_POSITIONS.map((startPos, startIndex) => {
          return MOBILE_POSITIONS.map((endPos, endIndex) => {
            if (startIndex >= endIndex) return null;

            const isActiveConnection =
              startIndex === activeIndex || endIndex === activeIndex;
            if (!isActiveConnection) return null;

            return (
              <line key={`${startIndex}-${endIndex}`}>
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
                  color={techCategories[activeIndex].color}
                  transparent
                  opacity={0.3}
                  linewidth={1}
                />
              </line>
            );
          });
        })}
      </group>
    );
  }
);

/* ========================================================================
   MOBILE STRUCTURE
   ======================================================================== */
const MobileHoneycombStructure = React.memo(
  ({
    activeIndex,
    autoRotate,
    onCellHover,
    animationSpeed,
  }: {
    activeIndex: number;
    autoRotate: boolean;
    onCellHover: (index: number) => void;
    animationSpeed: number;
  }) => {
    const groupRef = useRef<THREE.Group>(null);
    const cellsRef = useRef<THREE.Group[]>([]);

    useFrame((state) => {
      const time = state.clock.elapsedTime;

      if (groupRef.current && autoRotate) {
        groupRef.current.rotation.y = time * 0.04 * animationSpeed;
      }

      cellsRef.current.forEach((cell, index) => {
        if (!cell) return;
        const isActive = index === activeIndex;

        if (isActive) {
          const pulse = 1 + Math.sin(time * 3) * 0.1;
          cell.scale.set(pulse, pulse, pulse);
        }
      });
    });

    return (
      <group ref={groupRef}>
        <MobileParticleField count={15} speed={animationSpeed} />
        {techCategories.slice(0, 7).map((category, index) => (
          <MobileHoneycombCell
            key={index}
            ref={(el) => {
              if (el) cellsRef.current[index] = el;
            }}
            category={category}
            position={MOBILE_POSITIONS[index]}
            isActive={index === activeIndex}
            onHover={() => onCellHover(index)}
            index={index}
            animationSpeed={animationSpeed}
            isZoomed={false}
          />
        ))}
        <MobileConnectingLines activeIndex={activeIndex} />

        <Sparkles
          count={6}
          scale={8}
          size={0.4}
          speed={0.1 * animationSpeed}
          color="#ffffff"
          opacity={0.1}
        />
      </group>
    );
  }
);

/* ========================================================================
   DESKTOP VERSION WITH ADVANCED 3D SHAPES (ICON ONLY)
   ======================================================================== */
const ParticleField = React.memo(
  ({ count = 100, speed = 1 }: { count?: number; speed?: number }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const isMobile = useIsMobile();

    const actualCount = isMobile ? Math.min(count, 30) : count;

    const positions = useMemo(() => {
      const a = new Float32Array(actualCount * 3);
      for (let i = 0; i < actualCount * 3; i += 3) {
        a[i] = (Math.random() - 0.5) * 15;
        a[i + 1] = (Math.random() - 0.5) * 15;
        a[i + 2] = (Math.random() - 0.5) * 8;
      }
      return a;
    }, [actualCount]);

    useFrame((state) => {
      if (pointsRef.current) {
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02 * speed;
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
          size={0.04}
          color="#ffffff"
          transparent
          opacity={0.25}
          sizeAttenuation
        />
      </points>
    );
  }
);

const AdvancedHoneycombCell = React.memo(
  React.forwardRef<THREE.Group, HoneycombCellProps>(
    (
      {
        category,
        position,
        isActive,
        onHover,
        index,
        animationSpeed,
        isZoomed,
      },
      ref
    ) => {
      const meshRef = useRef<THREE.Mesh>(null);

      useFrame((state) => {
        if (meshRef.current) {
          if (isZoomed && isActive) {
            meshRef.current.rotation.y =
              state.clock.elapsedTime * 0.3 * animationSpeed;
            meshRef.current.rotation.x =
              state.clock.elapsedTime * 0.2 * animationSpeed;
          } else {
            meshRef.current.rotation.y =
              state.clock.elapsedTime * (0.15 + index * 0.02) * animationSpeed;
            meshRef.current.rotation.x =
              Math.sin(state.clock.elapsedTime * 0.2 * animationSpeed + index) *
              0.06;
          }
        }
      });

      return (
        <group ref={ref} position={position}>
          <mesh onPointerEnter={onHover}>
            <cylinderGeometry args={[1.1, 1.1, 0.18, 6]} />
            <meshStandardMaterial
              color={category.color}
              transparent
              opacity={isZoomed && isActive ? 0.6 : 0.3}
              emissive={category.color}
              emissiveIntensity={isActive ? (isZoomed ? 1.2 : 0.4) : 0.08}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>

          <Float
            speed={
              isZoomed && isActive ? 3 * animationSpeed : 1.5 * animationSpeed
            }
            rotationIntensity={
              isZoomed && isActive ? 1.5 * animationSpeed : 0.8 * animationSpeed
            }
            floatIntensity={
              isZoomed && isActive ? 0.6 * animationSpeed : 0.3 * animationSpeed
            }
            floatingRange={[-0.03, 0.03]}
          >
            <mesh position={[0, 0.5, 0]} ref={meshRef}>
              {getDesktopGeometry(category.model)}
              <meshPhysicalMaterial
                color={category.color}
                metalness={0.8}
                roughness={0.15}
                emissive={category.color}
                emissiveIntensity={isActive ? (isZoomed ? 1.5 : 0.6) : 0.2}
                clearcoat={0.8}
                clearcoatRoughness={0.1}
              />
            </mesh>
          </Float>

          {/* ICON ONLY - NO TEXT */}
          <Html position={[0, 1.1, 0]} center>
            <motion.div
              className="text-center cursor-pointer"
              animate={{
                scale: isActive ? (isZoomed ? 1.8 : 1.3) : 1,
                y: isActive ? (isZoomed ? -6 : -2) : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <motion.div
                className="text-3xl mb-1 filter drop-shadow-lg flex justify-center"
                animate={
                  isActive
                    ? {
                        rotateY: 360,
                        transition: {
                          duration: isZoomed
                            ? 1.5 / animationSpeed
                            : 3 / animationSpeed,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }
                    : {}
                }
              >
                {category.icon}
              </motion.div>
            </motion.div>
          </Html>
        </group>
      );
    }
  )
);

const AdvancedConnectingLines = React.memo(
  ({
    activeIndex,
    speed,
    isZoomed,
  }: {
    activeIndex: number;
    speed: number;
    isZoomed: boolean;
  }) => {
    const linesRef = useRef<{ [key: string]: THREE.Line }>({});

    useFrame((state) => {
      const time = state.clock.elapsedTime;
      Object.values(linesRef.current).forEach((line, index) => {
        if (!line) return;
        const isActiveLine = Object.keys(linesRef.current)[index].includes(
          activeIndex.toString()
        );
        const opacity = isActiveLine
          ? (isZoomed ? 0.8 : 0.4) + Math.sin(time * 3 * speed) * 0.15
          : isZoomed
          ? 0.02
          : 0.06;
        (line.material as THREE.LineBasicMaterial).opacity = opacity;
      });
    });

    return (
      <group>
        {DESKTOP_POSITIONS.map((startPos, startIndex) => {
          return DESKTOP_POSITIONS.map((endPos, endIndex) => {
            if (startIndex >= endIndex) return null;
            const key = `${startIndex}-${endIndex}`;

            return (
              <line
                key={key}
                ref={(el) => {
                  if (el) linesRef.current[key] = el;
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
                    startIndex === activeIndex || endIndex === activeIndex
                      ? techCategories[activeIndex].color
                      : "#ffffff"
                  }
                  transparent
                  opacity={0.1}
                  linewidth={1}
                />
              </line>
            );
          });
        })}
      </group>
    );
  }
);

const DesktopHoneycombStructure = React.memo(
  ({
    activeIndex,
    autoRotate,
    onCellHover,
    animationSpeed,
    isZoomed,
  }: {
    activeIndex: number;
    autoRotate: boolean;
    onCellHover: (index: number) => void;
    animationSpeed: number;
    isZoomed: boolean;
  }) => {
    const groupRef = useRef<THREE.Group>(null);
    const cellsRef = useRef<THREE.Group[]>([]);

    useFrame((state) => {
      const time = state.clock.elapsedTime;

      if (groupRef.current && autoRotate && !isZoomed) {
        groupRef.current.rotation.y = time * 0.05 * animationSpeed;
      }

      cellsRef.current.forEach((cell, index) => {
        if (!cell) return;
        const isActive = index === activeIndex;

        if (isZoomed && isActive) {
          cell.position.z = 2;
          const pulse = 1 + Math.sin(time * 4) * 0.1;
          cell.scale.set(pulse, pulse, pulse);
        } else {
          cell.position.z = 0;
          cell.position.y =
            DESKTOP_POSITIONS[index][1] + Math.sin(time * 0.3 + index) * 0.05;

          if (isActive && !isZoomed) {
            const pulse = 1 + Math.sin(time * 2) * 0.05;
            cell.scale.set(pulse, pulse, pulse);
          } else {
            cell.scale.set(1, 1, 1);
          }
        }
      });
    });

    return (
      <group ref={groupRef}>
        <ParticleField count={60} speed={animationSpeed} />
        {techCategories.slice(0, 7).map((category, index) => (
          <AdvancedHoneycombCell
            key={index}
            ref={(el) => {
              if (el) cellsRef.current[index] = el;
            }}
            category={category}
            position={DESKTOP_POSITIONS[index]}
            isActive={index === activeIndex}
            onHover={() => onCellHover(index)}
            index={index}
            animationSpeed={animationSpeed}
            isZoomed={isZoomed}
          />
        ))}
        <AdvancedConnectingLines
          activeIndex={activeIndex}
          speed={animationSpeed}
          isZoomed={isZoomed}
        />

        <Sparkles
          count={20}
          scale={12}
          size={1}
          speed={0.2 * animationSpeed}
          color="#ffffff"
          opacity={0.15}
        />
      </group>
    );
  }
);

/* ========================================================================
   MAIN SCENE COMPONENT
   ======================================================================== */
const HoneycombScene = React.memo(
  ({
    activeIndex,
    autoRotate,
    onCellHover,
    animationSpeed,
    isZoomed,
  }: {
    activeIndex: number;
    autoRotate: boolean;
    onCellHover: (index: number) => void;
    animationSpeed: number;
    isZoomed: boolean;
  }) => {
    const { camera, scene } = useThree();
    const isMobile = useIsMobile();

    useEffect(() => {
      camera.position.set(0, 0, isMobile ? 10 : 10);
      camera.fov = isMobile ? 45 : 45;
      camera.updateProjectionMatrix();
      scene.background = null;
    }, [camera, scene, isMobile]);

    return (
      <>
        <ambientLight intensity={isMobile ? 0.4 : 0.4} />
        <directionalLight position={[3, 3, 3]} intensity={isMobile ? 0.8 : 1} />

        {isMobile ? (
          <MobileHoneycombStructure
            activeIndex={activeIndex}
            autoRotate={autoRotate}
            onCellHover={onCellHover}
            animationSpeed={animationSpeed}
          />
        ) : (
          <DesktopHoneycombStructure
            activeIndex={activeIndex}
            autoRotate={autoRotate}
            onCellHover={onCellHover}
            animationSpeed={animationSpeed}
            isZoomed={isZoomed}
          />
        )}
      </>
    );
  }
);

/* ========================================================================
   CANVAS COMPONENT
   ======================================================================== */
const HoneycombCanvas = React.memo(
  ({
    activeIndex,
    autoRotate,
    onCellHover,
    animationSpeed,
    isZoomed,
  }: {
    activeIndex: number;
    autoRotate: boolean;
    onCellHover: (index: number) => void;
    animationSpeed: number;
    isZoomed: boolean;
  }) => {
    const isMobile = useIsMobile();
    const dprMax = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    return (
      <Canvas
        camera={{
          position: [0, 0, isMobile ? 10 : 10],
          fov: isMobile ? 45 : 45,
        }}
        dpr={[1, dprMax]}
        style={{
          position: "absolute",
          inset: 0,
          background: "transparent",
          width: "100%",
          height: "100%",
        }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? "low-power" : "default",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <HoneycombScene
          activeIndex={activeIndex}
          autoRotate={autoRotate}
          onCellHover={onCellHover}
          animationSpeed={animationSpeed}
          isZoomed={isZoomed}
        />
        {!isMobile && (
          <OrbitControls
            enableZoom={!isZoomed}
            enablePan={!isZoomed}
            autoRotate={autoRotate && !isZoomed}
            autoRotateSpeed={0.8 * animationSpeed}
            maxPolarAngle={Math.PI}
            minDistance={6}
            maxDistance={15}
            enableDamping
            dampingFactor={0.05}
          />
        )}
      </Canvas>
    );
  }
);

/* ========================================================================
   ENHANCED MOBILE DETAIL PANEL
   ======================================================================== */
const MobileDetailPanel = React.memo(
  ({ category, isActive }: { category: TechCategory; isActive: boolean }) => {
    if (!isActive || !category) return null;

    return (
      <motion.div
        className="w-full max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20 shadow-lg relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${category.color}20, ${category.color}08)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              className="text-3xl flex-shrink-0 mt-1"
              animate={{ rotateY: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              {category.icon}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-xl font-bold text-white mb-1 pr-8"
                style={{ color: category.color }}
              >
                {category.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white/80">Mastery</span>
              <span
                className="text-sm font-bold"
                style={{ color: category.color }}
              >
                {category.proficiency}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: category.color }}
                initial={{ width: 0 }}
                animate={{ width: `${category.proficiency}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {category.skills.slice(0, 4).map((skill, index) => (
              <motion.span
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: `${category.color}40` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
);

/* ========================================================================
   DESKTOP DETAIL PANEL
   ======================================================================== */
const DesktopDetailPanel = React.memo(
  ({
    category,
    isActive,
    isZoomed,
    onZoomToggle,
  }: {
    category: TechCategory;
    isActive: boolean;
    isZoomed: boolean;
    onZoomToggle: () => void;
  }) => {
    if (!isActive || !category) return null;

    return (
      <motion.div
        className="w-full max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20 shadow-lg relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${category.color}22, ${category.color}08)`,
          }}
        />

        <div className="relative z-10">
          <motion.button
            onClick={onZoomToggle}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.span
              animate={{ rotate: isZoomed ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-white text-lg"
            >
              {isZoomed ? "−" : "+"}
            </motion.span>
          </motion.button>

          <motion.div
            className="text-5xl mb-4 text-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
          >
            {category.icon}
          </motion.div>

          <motion.h3
            className="text-2xl font-bold text-center mb-4"
            style={{ color: category.color }}
          >
            {category.title}
          </motion.h3>

          <AnimatePresence mode="wait">
            <motion.div
              key={isZoomed ? "zoomed" : "normal"}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isZoomed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.p
                    className="text-center text-white/90 mb-4 text-sm leading-relaxed"
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                  >
                    {category.description}
                  </motion.p>

                  <motion.div
                    className="mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-white/80">
                        Mastery
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: category.color }}
                      >
                        {category.proficiency}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${category.proficiency}%` }}
                        transition={{
                          delay: 0.4,
                          duration: 1,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-2 gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, staggerChildren: 0.05 }}
                  >
                    {category.skills.slice(0, 6).map((skill, index) => (
                      <motion.div
                        key={index}
                        className="text-center p-2 rounded-lg"
                        style={{
                          background: `linear-gradient(135deg, ${category.color}33, ${category.color}11)`,
                        }}
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                      >
                        <span className="text-white font-medium text-xs">
                          {skill}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <motion.p
                    className="text-white/80 text-sm mb-3"
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                  >
                    {category.description}
                  </motion.p>
                  <motion.div
                    className="flex justify-center items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-16 bg-white/10 rounded-full h-1 overflow-hidden">
                      <motion.div
                        className="h-1 rounded-full"
                        style={{ backgroundColor: category.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${category.proficiency}%` }}
                        transition={{ delay: 0.4, duration: 1 }}
                      />
                    </div>
                    <span className="text-xs text-white/60">
                      {category.proficiency}% mastery
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
);

/* ========================================================================
   MAIN COMPONENT
   ======================================================================== */
export const TechStack: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!autoRotate || !mounted || isZoomed) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % techCategories.length);
    }, 6000 / animationSpeed);
    return () => clearInterval(interval);
  }, [autoRotate, mounted, animationSpeed, isZoomed]);

  const handleCellHover = useCallback(
    (index: number) => {
      if (!isZoomed) {
        setActiveIndex(index);
        setAutoRotate(false);
      }
    },
    [isZoomed]
  );

  const handleZoomToggle = useCallback(() => {
    if (!isMobile) {
      setIsZoomed(!isZoomed);
      if (!isZoomed) {
        setAutoRotate(false);
      }
    }
  }, [isZoomed, isMobile]);

  const handleCategorySelect = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setAutoRotate(false);
      if (!isMobile) {
        setIsZoomed(true);
      }
    },
    [isMobile]
  );

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          className="text-white text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <section id="tech-stack" className="relative py-8 lg:py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-6 lg:mb-12">
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4"
          animate={{ backgroundPosition: ["0%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
          style={{
            background:
              "linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899, #f97316)",
            backgroundSize: "300% 300%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {isZoomed && !isMobile
            ? techCategories[activeIndex]?.title
            : "TECH STACK"}
        </motion.h1>

        {!isZoomed && !isMobile && (
          <motion.p
            className="text-white/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Click on any technology category to zoom and explore
          </motion.p>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        {!isZoomed && (
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              onClick={() => setAutoRotate(!autoRotate)}
              className="border-white/30 text-white hover:bg-white/10 text-sm"
              size="sm"
            >
              {autoRotate ? "⏸️ Pause" : "▶️ Play"}
            </Button>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">🐢</span>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={animationSpeed}
                  onChange={(e) =>
                    setAnimationSpeed(parseFloat(e.target.value))
                  }
                  className="w-20 accent-cyan-400"
                />
                <span className="text-white/80 text-sm">🚀</span>
              </div>
              <div className="text-white text-xs">
                Speed: {animationSpeed.toFixed(1)}x
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <div className="w-full lg:w-1/2">
            <div
              className={`relative ${
                isMobile ? "h-80" : "h-80"
              } lg:h-96 bg-transparent overflow-hidden`}
            >
              <HoneycombCanvas
                activeIndex={activeIndex}
                autoRotate={autoRotate}
                onCellHover={handleCellHover}
                animationSpeed={animationSpeed}
                isZoomed={isZoomed}
              />
            </div>

            {!isZoomed && (
              <div className="flex justify-center gap-2 mt-4">
                {techCategories.slice(0, 7).map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategorySelect(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeIndex === index ? "scale-125" : "scale-100"
                    }`}
                    style={{
                      backgroundColor:
                        activeIndex === index
                          ? category.color
                          : `${category.color}60`,
                    }}
                  />
                ))}
              </div>
            )}

            {isZoomed && !isMobile && (
              <motion.div
                className="flex justify-center mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setIsZoomed(false)}
                  className="border-white/30 text-white hover:bg-white/10 text-sm"
                  size="sm"
                >
                  ← Back to Overview
                </Button>
              </motion.div>
            )}
          </div>

          <div className="w-full lg:w-1/2">
            {isMobile ? (
              <MobileDetailPanel
                category={techCategories[activeIndex]}
                isActive={true}
              />
            ) : (
              <DesktopDetailPanel
                category={techCategories[activeIndex]}
                isActive={true}
                isZoomed={isZoomed}
                onZoomToggle={handleZoomToggle}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
