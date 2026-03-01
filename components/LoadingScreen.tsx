"use client"

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Logo from "./ui/logo";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const { settings } = useSiteSettings()


  useEffect(() => {
    setTimeout(() => setShowLogo(true), 200);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 600);
          return 100;
        }
        return prev + Math.random() * 12 + 4;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-100 bg-background flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 40px,
            currentColor 40px,
            currentColor 41px
          )`
        }} />
      </div>

      {/* Animated circles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-70 h-70 sm:w-100 sm:h-100 md:w-150 md:h-150 border border-border/30 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-100 h-100 sm:w-137.5 sm:h-137.5 md:w-200 md:h-200 border border-border/20 rounded-full"
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
        animate={showLogo ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-8 sm:mb-12 md:mb-16"
      >
        <Logo className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 drop-shadow-2xl" />
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10 w-48 sm:w-60 md:w-72 px-4 sm:px-0"
      >
        <div className="flex justify-between mb-2 sm:mb-3 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-muted-foreground">
          <span>Loading</span>
          <span className="font-mono">{Math.min(Math.round(progress), 100)}%</span>
        </div>
        <div className="h-px bg-border overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 sm:bottom-8 md:bottom-12 flex flex-col items-center gap-2 px-4"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-4 sm:w-6 md:w-8 h-px bg-accent" />
          <span className="text-[10px]  max-w-md sm:text-xs tracking-[0.2em] sm:tracking-[0.4em] uppercase text-muted-foreground text-center">
            {settings?.tagline || "Creative Design Agency"}
          </span>
          <div className="w-4 sm:w-6 md:w-8 h-px bg-accent" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;