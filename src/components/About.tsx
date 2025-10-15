import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
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

// Combined technical (hard) and soft skills
const skills = [
  // Technical skills
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
  // Soft skills
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

// Compute smooth Lissajous curve positions for orbiting icons
function getLissajousPosition(t: number, idx: number, total: number) {
  const a = 5;
  const b = 3.5;
  const delta = (idx / total) * Math.PI * 2;
  const x = a * Math.sin(0.1 * t + delta); // slower, smooth
  const y = b * Math.sin(0.08 * t + delta * 2);
  const z = a * Math.cos(0.1 * t + delta);
  return new THREE.Vector3(x, y, z);
}

// Sphere with orbiting skill icons
function AlgorithmicSphere({ activeIndex }: { activeIndex: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Object3D[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    meshRefs.current.forEach((mesh, idx) => {
      const isActive = idx === activeIndex;

      // Center active skill, others orbit
      const targetPos = isActive
        ? new THREE.Vector3(0, 0, 0)
        : getLissajousPosition(t, idx, skills.length);
      mesh.position.lerp(targetPos, 0.05); // smooth movement

      // Scale active skill bigger
      const targetScale = isActive ? 4 : 2;
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.05);

      // Slight rotation for effect
      mesh.rotation.y += 0.01;
    });

    // Slow group rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.01;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base wireframe sphere */}
      <mesh>
        <icosahedronGeometry args={[3, 4]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          metalness={0.7}
          roughness={0.1}
          wireframe
        />
      </mesh>

      {/* Skill icons */}
      {skills.map((skill, idx) => {
        const Icon = skill.icon;
        return (
          <mesh key={idx} ref={(el) => (meshRefs.current[idx] = el!)}>
            <Html center>
              <motion.div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  filter:
                    idx === activeIndex
                      ? "drop-shadow(0 0 15px #00ffff)"
                      : "none",
                  transition: "all 1.5s ease",
                }}
              >
                <Icon
                  size={idx === activeIndex ? 70 : 40} // bigger when active
                  color="#00ffff" // uniform color
                />
              </motion.div>
            </Html>
          </mesh>
        );
      })}
    </group>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed(""); // reset when text changes
    let idx = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[idx]);
      idx++;
      if (idx === text.length) clearInterval(interval);
    }, 80); // 80ms per character, adjust speed here

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
}

export const About = () => {
  const [activeSkill, setActiveSkill] = useState(0);

  // Switch skill every 6 seconds for smooth, slow transition
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkill((prev) => (prev + 1) % skills.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Sphere */}
        <div className="w-full lg:w-1/2 h-[44rem]">
          <Canvas
            camera={{ position: [0, 0, 16], fov: 50 }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <AlgorithmicSphere activeIndex={activeSkill} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.02}
            />
          </Canvas>
        </div>

        {/* About Text */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 text-white">
          <motion.h2
            className="text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Me
          </motion.h2>

          <motion.p
            className="text-lg leading-relaxed text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            I am a <b>Full-Stack Developer</b> with a combination of deep
            technical expertise and strong professional soft skills. My skills
            range from{" "}
            <b>
              algorithm optimization, system design, backend development, cloud
              solutions, and CI/CD
            </b>{" "}
            to
            <b>
              {" "}
              dedication, problem-solving, teamwork, adaptability, and effective
              communication
            </b>
            .
          </motion.p>

          {/* Current Active Skill */}
          <motion.div
            key={skills[activeSkill].name}
            className="bg-white/5 p-6 rounded-xl shadow-lg relative overflow-hidden mt-6 backdrop-blur-md border border-white/10"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }} // slower, smooth
          >
            <motion.h3
              className="text-2xl font-bold mb-2 text-center"
              animate={{ scale: [1, 1.3, 1], opacity: [0.85, 1, 0.85] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              style={{ color: "#00ffff" }} // same color as icons
            >
              {skills[activeSkill].name}
            </motion.h3>
            <p className="text-center text-white/70">
              {skills[activeSkill].description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
