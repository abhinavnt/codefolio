import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Code, Home } from "lucide-react";

export default function NotFound() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev + 1) % 100);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Replace useRouter with window.history
  const goBack = () => {
    window.history.back();
  };

  // Replace Link with regular anchor tag
  const HomeButton = () => (
    <button
      className="flex items-center bg-emerald-500 text-xs text-white hover:bg-emerald-600 px-3 py-1 rounded"
      onClick={() => window.location.href = "/"}
    >
      <Home className="mr-1 h-3 w-3" />
      Home
    </button>
  );

  const BackButton = () => (
    <button
      className="flex items-center border-emerald-500 text-xs text-emerald-500 hover:bg-emerald-950 hover:text-emerald-400 border px-3 py-1 rounded"
      onClick={goBack}
    >
      <ArrowLeft className="mr-1 h-3 w-3" />
      Back
    </button>
  );

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-gray-950 text-white">
      {/* Background grid */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg className="h-full w-full">
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xs font-mono text-emerald-500/60"
          initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%` }}
          animate={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%` }}
          transition={{ duration: Math.random() * 15 + 10, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          {getRandomSymbol()}
        </motion.div>
      ))}

      {/* Logo */}
      <div className="absolute top-4 left-4 flex items-center">
        <Code className="mr-1 h-5 w-5 text-emerald-500" />
        <span className="text-lg font-bold">Codefolio</span>
      </div>

      {/* Main content */}
      <div className="z-10 flex w-full max-w-3xl flex-col items-center px-4">
        {/* Error code */}
        <motion.div
          className="relative mb-4 text-7xl font-bold tracking-tighter"
          animate={{
            textShadow: [
              "0 0 5px rgba(16, 185, 129, 0.5)",
              "0 0 10px rgba(16, 185, 129, 0.8)",
              "0 0 5px rgba(16, 185, 129, 0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <span className="text-emerald-500">4</span>
          <motion.span
            className="text-white"
            animate={{ x: [0, -2, 3, -1, 0], y: [0, 1, -2, 0, 0], opacity: [1, 0.8, 1] }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
          >
            0
          </motion.span>
          <span className="text-emerald-500">4</span>
        </motion.div>

        {/* Code block */}
        <motion.div
          className="mb-4 w-full max-w-md rounded-lg border border-emerald-500/30 bg-gray-900 shadow-lg"
          animate={{
            boxShadow: [
              "0 0 10px rgba(16, 185, 129, 0.2)",
              "0 0 20px rgba(16, 185, 129, 0.4)",
              "0 0 10px rgba(16, 185, 129, 0.2)",
            ],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-2 py-1">
            <div className="flex space-x-1">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[10px] text-gray-400">{counter}%</div>
          </div>
          <div className="p-2 text-xs font-mono">
            <div className="flex">
              <div className="mr-2 text-gray-600">{[1, 2, 3, 4, 5].map((n) => <div key={n}>{n}</div>)}</div>
              <div>
                <div className="text-blue-400">
                  import <span className="text-yellow-300">{"{ useState }"}</span> from{" "}
                  <span className="text-emerald-300">'react'</span>;
                </div>
                <motion.div
                  className="text-red-400"
                  animate={{ opacity: [1, 0.7, 1], x: [0, 1, 0] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                >
                  // Error: Route not found
                </motion.div>
                <div className="text-red-400">
                  throw new Error(<span className="text-emerald-300">'404'</span>);
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Message and buttons */}
        <div className="text-center">
          <motion.h2
            className="mb-2 text-xl font-bold"
            animate={{ color: ["#f9fafb", "#10b981", "#f9fafb"] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          >
            Page Not Found
          </motion.h2>
          <p className="mb-3 text-sm text-gray-400">
            The resource you're looking for doesn't exist.
          </p>
          <div className="flex space-x-2">
            <HomeButton />
            <BackButton />
          </div>
        </div>

        {/* Terminal */}
        <motion.div
          className="absolute bottom-4 w-full max-w-xs rounded-lg border border-emerald-500/30 bg-black/80 p-2 text-[10px] font-mono"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="text-emerald-500">$ find "page"</div>
          <motion.div
            className="text-red-400"
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", repeatDelay: 2 }}
          >
            No such file
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function getRandomSymbol() {
  const symbols = ["{}", "[]", "()", "</>", "=>", "&&", "||", "404"];
  return symbols[Math.floor(Math.random() * symbols.length)];
}