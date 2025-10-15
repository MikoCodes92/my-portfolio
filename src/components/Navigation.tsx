import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  // keep original scroll logic but stable
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // close on Escape + focus management (trap focus in mobile menu)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }

      if (e.key === "Tab" && isMobileMenuOpen && mobileMenuRef.current) {
        const focusable = Array.from(
          mobileMenuRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter(Boolean);

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  // active-section highlighting via IntersectionObserver
  useEffect(() => {
    const sections = navItems
      .map((i) => document.querySelector(i.href))
      .filter(Boolean) as Element[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -40% 0px", threshold: 0.25 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // mobile menu motion variants
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.25 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.nav
      role="navigation"
      aria-label="Primary"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-card" : ""
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo — visible gradient text with fallback */}
          <a href="#home" className="text-2xl font-bold relative inline-flex items-center gap-2">
            <span
              className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
              aria-hidden="true"
            >
              &lt;Miko's Portfolio/&gt;
            </span>
            <span className="sr-only">Home — Portfolio</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-foreground hover:text-accent transition-colors relative group ${isActive ? "text-accent" : ""
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                </a>
              );
            })}
            <Button
              size="sm"
              className="gradient-neon shadow-neon hover:scale-105 transition-transform"
              asChild
            >
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                Resume
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={toggleButtonRef}
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden text-foreground p-2 rounded-md hover:bg-primary/10 transition"
            onClick={() => {
              setIsMobileMenuOpen((s) => !s);
              // focus first link on open — handled via ref in AnimatePresence render
            }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation (animated & accessible) */}
        <AnimatePresence initial={false}>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              key="mobile"
              ref={mobileMenuRef}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className="md:hidden mt-4 pt-4 border-t border-border"
            >
              <div className="flex flex-col gap-4 px-2 pb-4">
                {navItems.map((item, idx) => (
                  <a
                    key={item.label}
                    href={item.href}
                    ref={idx === 0 ? firstFocusableRef : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-foreground hover:text-accent transition-colors px-3 py-2 rounded-md ${active === item.href ? "bg-accent/10" : ""
                      }`}
                  >
                    {item.label}
                  </a>
                ))}

                <Button
                  size="sm"
                  className="gradient-neon shadow-neon w-full hover:scale-105 transition-transform"
                  asChild
                >
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    Resume
                  </a>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* keep small utility styles if you rely on them; nothing here mutates logic */}
    </motion.nav>
  );
};
