import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    // Log for analytics / debugging
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative max-w-4xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        role="article"
        aria-labelledby="notfound-heading"
      >
        {/* Decorative top wave */}
        <div className="absolute -top-20 right-0 w-80 h-80 pointer-events-none opacity-40">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <motion.path
              d="M41.6,-3.6C52.6,27.1,54.9,68.7,34.7,84.1C14.6,99.6,-26.8,88.9,-50.1,63.7C-73.4,38.5,-78.6,-4.1,-60.8,-32.9C-43,-61.7,-1.2,-76.8,28.9,-69.9C59,-63,70.5,-29.3,41.6,-3.6Z"
              transform="translate(100 100)"
              fill="url(#g1)"
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1, 0.95] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left: Illustration */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <motion.div
              initial={{ rotate: -6, scale: 0.95 }}
              animate={{ rotate: [-6, 6, -6], scale: [0.95, 1.03, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
              className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center"
            >
              {/* Simple rocket illustration */}
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <g transform="translate(0,0)">
                  <motion.ellipse
                    cx="32"
                    cy="44"
                    rx="12"
                    ry="6"
                    fill="#fef3c7"
                    opacity="0.9"
                  />
                  <motion.path
                    d="M20 44c0-8 12-20 12-20s12 12 12 20v6H20v-6z"
                    fill="#60a5fa"
                  />
                  <motion.circle cx="32" cy="34" r="4" fill="#fff" />
                  <motion.path
                    d="M18 50c0 4 14 6 14 6s14-2 14-6v2c0 4-14 8-14 8s-14-4-14-8v-2z"
                    fill="#a78bfa"
                    opacity="0.85"
                  />
                </g>
              </svg>
            </motion.div>

            <div className="text-center md:text-left">
              <h1
                id="notfound-heading"
                className="text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-violet-600"
              >
                404
              </h1>
              <p className="mt-2 text-xl md:text-2xl font-semibold text-gray-700">
                We can’t find that page.
              </p>
              <p className="mt-2 text-gray-500 max-w-xs">
                It looks like the page you’re trying to reach doesn’t exist or
                has been moved. Try returning home or contact support if you
                think this is a mistake.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 shadow-sm bg-sky-600 text-white hover:bg-sky-700"
                >
                  Go to Home
                </Link>

                <a
                  href="/support"
                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400"
                >
                  Contact Support
                </a>

                <button
                  type="button"
                  onClick={() => {
                    // lightweight client-side report for debugging, replace with real telemetry
                    console.info(
                      "User reported missing page:",
                      location.pathname
                    );
                    alert("Thanks — we've logged this and will investigate.");
                  }}
                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none"
                >
                  Report
                </button>
              </div>
            </div>
          </div>

          {/* Right: Card with helpful links */}
          {/* Right: Card with helpful links */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Helpful links
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                {["home", "projects", "about", "tech-stack", "contact"].map(
                  (section) => (
                    <li key={section}>
                      <a
                        href={`${window.location.origin}/#${section}`}
                        className="underline hover:text-gray-800"
                      >
                        {section
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </a>
                    </li>
                  )
                )}
              </ul>

              <div className="mt-6 text-xs text-gray-500">
                <p>
                  If you arrived here from an internal link, consider reporting
                  it so we can fix it.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          Requested path:{" "}
          <span className="font-mono text-gray-700">{location.pathname}</span>
        </div>
      </motion.div>
    </div>
  );
}
