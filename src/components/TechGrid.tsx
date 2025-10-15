export const TechGrid = () => {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-20" style={{ zIndex: 0 }}>
      {/* Vertical lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(0, 255, 255, 0.3)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated scan lines */}
      <div className="absolute inset-0">
        <div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse"
          style={{
            top: "20%",
            animation: "scan 8s linear infinite",
          }}
        />
        <div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"
          style={{
            top: "60%",
            animation: "scan 10s linear infinite",
            animationDelay: "2s",
          }}
        />
      </div>

      <style>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
