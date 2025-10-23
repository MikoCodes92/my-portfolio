import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mobile detection
function useIsMobile() {
  if (typeof window === "undefined") return false;
  return (
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
    window.innerWidth <= 768
  );
}

// Neon ring decoration
function NeonRing({ color = "#06b6d4", radius = 1.7, speed = 0.5 }) {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.03, 8, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
    </mesh>
  );
}

// Floating card
const FloatingCard = ({ icon, title, value, href, index }) => {
  const ref = useRef<THREE.Group | null>(null);
  const isMobile = useIsMobile();

  const radius = (isMobile ? 1.8 : 2.8) + index * (isMobile ? 0.8 : 1.1);
  const speed = (isMobile ? 0.18 : 0.4) + index * (isMobile ? 0.05 : 0.12);

  const accRef = useRef(0);
  useFrame(({ clock }, delta) => {
    if (isMobile) {
      accRef.current += delta;
      if (accRef.current < 1 / 30) return;
      accRef.current = 0;
    }
    if (ref.current) {
      const t = clock.elapsedTime * speed;
      ref.current.position.x = radius * Math.cos(t + index);
      ref.current.position.y =
        Math.sin(t * 1.25 + index) * (isMobile ? 0.36 : 0.6) + (isMobile ? 1 : 1.2);
      ref.current.position.z = radius * Math.sin(t + index) * (isMobile ? 0.8 : 0.9);
      ref.current.rotation.y = Math.sin(t) * (isMobile ? 0.05 : 0.12);
      ref.current.rotation.x = Math.cos(t) * (isMobile ? 0.03 : 0.08);
      const pulse = 0.9 + 0.1 * Math.sin(t * 2 + index);
      ref.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[isMobile ? 1.6 : 2.2, isMobile ? 2 : 2.6, 0.2]} />
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.3}
          emissive="#06b6d4"
          emissiveIntensity={0.6}
        />
      </mesh>

      <NeonRing color="#06b6d4" radius={isMobile ? 1.2 : 2.0} speed={0.5 + index * 0.05} />

      <Html
        center
        distanceFactor={isMobile ? 5.5 : 4.5}
        style={{ pointerEvents: "auto", cursor: href ? "pointer" : "default" }}
      >
        <a
          href={href ?? "#"}
          target={href ? "_blank" : "_self"}
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <div
            className="flex flex-col items-center text-center p-4 rounded-2xl transition-transform hover:scale-105 duration-300 shadow-neon-glow"
            style={{
              width: isMobile ? 150 : 200,
              background: "rgba(255,255,255,0.08)",
              boxShadow: "0 10px 30px rgba(2,6,23,0.55)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              {icon}
            </div>
            <h3
              style={{
                margin: 0,
                fontWeight: 700,
                color: "white",
                fontSize: isMobile ? 14 : 16,
              }}
            >
              {title}
            </h3>
            <p className="text-sm text-muted-foreground" style={{ marginTop: 6, fontSize: isMobile ? 12 : 14 }}>
              {value}
            </p>
          </div>
        </a>
      </Html>
    </group>
  );
};

// Main Contact Section
export const Contact = () => {
  const isMobile = useIsMobile();

  const contacts = [
    { icon: <Mail className="w-6 h-6 text-accent" />, title: "Email", value: "mikiasgsilasie1920@gmail.com", href: "mailto:mikiasgsilasie1920@gmail.com" },
    { icon: <Phone className="w-6 h-6 text-accent" />, title: "Phone", value: "+251 94 641 2143", href: "tel:+251946412143" },
    { icon: <MapPin className="w-6 h-6 text-accent" />, title: "Location", value: "Addis Ababa, Ethiopia" },
  ];

  const dprMax = isMobile ? 1 : Math.min(typeof window !== "undefined" ? window.devicePixelRatio ?? 1 : 1, 1.5);

  const headerVariants = {
    container: { transition: { staggerChildren: 0.18 } },
    title: { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } },
    subtitle: { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.18 } } },
  };

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start relative overflow-hidden bg-transparent">
      <motion.div className="relative z-30 text-center pt-16 px-4" variants={headerVariants.container} initial="hidden" animate="show">
        <motion.h2 className="text-3xl md:text-4xl font-bold text-white mb-3" variants={headerVariants.title}>Get In Touch</motion.h2>
        <motion.p className="text-lg text-muted-foreground max-w-xl mx-auto" variants={headerVariants.subtitle}>
          Reach out me via email, phone, and others. Let's start your next project together.
        </motion.p>
      </motion.div>

      <div className="absolute inset-0 z-10">
        <Canvas gl={{ alpha: true, antialias: !isMobile }} dpr={[1, dprMax]} camera={{ position: [0, 2, 10], fov: 50 }} style={{ width: "100%", height: "100%", pointerEvents: isMobile ? "none" : "auto", background: "transparent" }}>
          <ambientLight intensity={isMobile ? 0.42 : 0.6} />
          <directionalLight position={[5, 6, 5]} intensity={0.9} />

          <Sparkles count={isMobile ? 15 : 40} size={isMobile ? 0.35 : 0.7} scale={isMobile ? [6, 3, 6] : [10, 5, 10]} speed={0.18} />

          {contacts.map((c, i) => (
            <Float key={i} floatIntensity={isMobile ? 0.22 : 0.8} rotationIntensity={isMobile ? 0.06 : 0.2}>
              <FloatingCard index={i} icon={c.icon} title={c.title} value={c.value} href={c.href} />
            </Float>
          ))}
        </Canvas>
      </div>

      <div className="absolute bottom-10 w-full flex justify-center z-20 px-4">
        <Button size="lg" className="gradient-neon shadow-neon hover:scale-105 transition-transform" asChild>
          <a href="mailto:mikiasgsilasie1920@gmail.com">Send Message</a>
        </Button>
      </div>
    </section>
  );
};

export default Contact;
