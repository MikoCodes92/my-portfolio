import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Float, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

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
      "Pygame robot vacuum simulation using Dijkstra's algorithm and realistic laser targeting",
    tech: ["Python", "Pygame", "Algorithms"],
    github: "https://github.com/MikoCodes92/LaserVacBot",
    demo: "#",
  },
  {
    title: "AAU Multimedia Booking System",
    description:
      "Full-stack booking system using Django REST Framework, React, WebSockets, and Postgres",
    tech: ["Django", "React", "PostgreSQL", "WebSocket"],
    github: "https://github.com/MikoCodes92/AAU-Multimedia-Booking-System",
    demo: "#",
  },
  {
    title: "Pneumonia Detection with CNN",
    description:
      "Deep learning model for detecting pneumonia from chest X-ray images",
    tech: ["Python", "TensorFlow", "Keras", "CNN"],
    github: "https://github.com/MikoCodes92/pnemonia-detection-with-cnn",
    demo: "#",
  },
  {
    title: "Traffic Flow Prediction",
    description:
      "Predictive analysis of traffic flow using machine learning techniques",
    tech: ["Python", "Pandas", "Scikit-learn", "Jupyter Notebook"],
    github: "https://github.com/MikoCodes92/Traffic-flow-predition-",
    demo: "#",
  },
];

interface ProjectCard3DProps {
  project: Project;
  index: number;
}

const ProjectCard3D: React.FC<ProjectCard3DProps> = ({ project, index }) => {
  const ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Rotate the entire group (mesh + HTML overlay)
    if (groupRef.current) {
      groupRef.current.rotation.y = 0.2 * Math.sin(t + index);
      groupRef.current.rotation.x = 0.1 * Math.cos(t + index);
    }

    // Animate particles if hovered
    if (particlesRef.current && hovered) {
      particlesRef.current.rotation.y += 0.01;
      particlesRef.current.position.y = Math.sin(t * 2 + index) * 0.2;
    }
  });

  const xPos = (index - (projects.length - 1) / 2) * 6;
  const yPos = 2.5;
  const zPos = -2;

  return (
    <Float floatIntensity={0.9} rotationIntensity={0.3}>
      <group ref={groupRef} position={[xPos, yPos, zPos]}>
        {/* Card Mesh */}
        <mesh
          ref={ref}
          scale={
            hovered
              ? clicked
                ? [3, 3.2, 0.7] // bigger when clicked
                : [2.5, 2.8, 0.7]
              : [2.2, 2.5, 0.6]
          }
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setClicked(!clicked)}
        >
          <boxGeometry args={[2, 3, 0.5]} />
          <meshStandardMaterial
            color={hovered ? "#0ff" : "#ff00ff"}
            emissive={hovered ? "#0ff" : "#ff00ff"}
            emissiveIntensity={0.6}
            metalness={0.5}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Particles */}
        {hovered && (
          <points ref={particlesRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={150}
                array={
                  new Float32Array(
                    Array.from({ length: 150 }, () => [
                      (Math.random() - 0.5) * 4,
                      (Math.random() - 0.5) * 5,
                      (Math.random() - 0.5) * 1,
                    ]).flat()
                  )
                }
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              color="#0ff"
              size={0.06}
              transparent
              opacity={0.85}
              sizeAttenuation
            />
          </points>
        )}

        {/* HTML Card overlay */}
        <Html
          distanceFactor={5}
          style={{
            pointerEvents: "auto",
            width: clicked ? "550px" : "450px",
            height: clicked ? "650px" : "550px",
            transform: "translate3d(-50%, -50%, 0)",
            transition: "all 0.3s ease",
          }}
        >
          <Card className="glass-strong shadow-card w-full h-full p-6">
            <CardHeader>
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              <CardDescription className="text-base">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded-md bg-secondary/50 text-foreground border border-transparent hover:border-accent transition-all"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Code
                  </a>
                </Button>
                <Button size="sm" className="gradient-neon" asChild>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Demo
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Html>
      </group>
    </Float>
  );
};

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20 px-0 w-full">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16 w-full"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 relative text-white">
          Featured Projects
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A selection of projects showcasing my technical capabilities
        </p>
      </motion.div>

      {/* 3D Canvas */}
      <div className="w-full h-[90vh] md:h-[80vh] relative">
        <Canvas camera={{ position: [0, 2.5, 10], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <OrbitControls enablePan enableZoom enableRotate />
          <Sparkles count={200} size={1} scale={[15, 8, 15]} />
          {projects.map((project, index) => (
            <ProjectCard3D key={index} project={project} index={index} />
          ))}
        </Canvas>
      </div>
    </section>
  );
};
