import { Canvas, useFrame } from "@react-three/fiber"; // React Three Fiber for 3D rendering
import { Html, OrbitControls } from "@react-three/drei"; // Drei helpers for HTML in 3D and camera controls
import { useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react"; // Icons
import { Button } from "@/components/ui/button"; // Button component

// --------------------- Floating Card Component ---------------------
interface FloatingCardProps {
  icon: React.ReactNode; // Icon element
  title: string; // Title of contact method
  value: string; // Value (email, phone, location)
  href?: string; // Optional link
  index: number; // Index for animation offsets
}

const FloatingCard = ({
  icon,
  title,
  value,
  href,
  index,
}: FloatingCardProps) => {
  const ref = useRef<any>(null); // Reference to the 3D group
  const radius = 2 + index; // Orbit radius based on index
  const speed = 0.5 + index * 0.2; // Orbit speed for each card

  // --------------------- 3D Animation Loop ---------------------
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed; // Time-based animation

      // Set position for smooth orbital movement
      ref.current.position.x = radius * Math.cos(t + index);
      ref.current.position.y = Math.sin(t * 1.3 + index) * 0.5; // Vertical oscillation
      ref.current.position.z = radius * Math.sin(t + index);

      // Subtle rotation for 3D floating effect
      ref.current.rotation.y = Math.sin(t) * 0.15;
      ref.current.rotation.x = Math.cos(t) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {/* 3D Card Mesh */}
      <mesh>
        <boxGeometry args={[2, 2.5, 0.2]} /> {/* Width, Height, Depth */}
        <meshStandardMaterial
          color="#0ff" // Neon cyan color
          transparent
          opacity={0.15} // Semi-transparent background
          emissive="#0ff" // Glow effect
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* HTML Overlay on 3D Mesh */}
      <Html center>
        <div className="flex flex-col items-center text-center p-4 w-48 cursor-pointer hover:scale-105 transition-transform duration-300">
          {/* Icon Circle */}
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 shadow-neon">
            {icon}
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg text-white mb-1">{title}</h3>

          {/* Value / Link */}
          {href ? (
            <a
              href={href}
              className="text-muted-foreground hover:text-accent transition-colors text-sm"
            >
              {value}
            </a>
          ) : (
            <p className="text-muted-foreground text-sm">{value}</p>
          )}
        </div>
      </Html>
    </group>
  );
};

// --------------------- Main Contact Component ---------------------
export const Contact = () => {
  // Define contact methods
  const contacts = [
    {
      icon: <Mail className="w-6 h-6 text-accent" />,
      title: "Email",
      value: "mikiasgsilasie1920@gmail.com",
      href: "mailto:mikiasgsilasie1920@gmail.com",
    },
    {
      icon: <Phone className="w-6 h-6 text-accent" />,
      title: "Phone",
      value: "+251 94 641 2143",
      href: "tel:+251946412143",
    },
    {
      icon: <MapPin className="w-6 h-6 text-accent" />,
      title: "Location",
      value: "Addis Ababa, Ethiopia",
    },
  ];

  return (
    <section className="w-full h-screen flex flex-col items-center justify-center relative bg-transparent">
      {/* --------------------- Clear Header --------------------- */}
      <div className="text-center mb-12 z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Get In Touch
        </h2>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Reach out via email, phone, or visit our location. Let's start your
          next project together.
        </p>
      </div>

      {/* --------------------- 3D Canvas --------------------- */}
      <Canvas
        gl={{ alpha: true }} // Transparent background
        camera={{ position: [0, 2, 10], fov: 50 }}
      >
        <ambientLight intensity={0.5} /> {/* Soft global light */}
        <directionalLight position={[5, 5, 5]} intensity={1} />{" "}
        {/* Directional light for highlights */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />{" "}
        {/* Static camera */}
        {/* Map each contact to a FloatingCard */}
        {contacts.map((c, i) => (
          <FloatingCard
            key={i}
            index={i}
            icon={c.icon}
            title={c.title}
            value={c.value}
            href={c.href}
          />
        ))}
      </Canvas>

      {/* --------------------- Contact Button --------------------- */}
      <div className="absolute bottom-10 w-full flex justify-center z-10">
        <Button
          size="lg"
          className="gradient-neon shadow-neon hover:scale-105 transition-transform"
          asChild
        >
          <a href="mailto:mikiasgsilasie1920@gmail.com">Send Message</a>
        </Button>
      </div>
    </section>
  );
};
