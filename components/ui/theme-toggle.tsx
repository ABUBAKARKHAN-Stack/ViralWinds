"use client"

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/MagneticButton";
import { cn } from "@/lib/utils";


const ThemeToggle = ({ className = "" }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {

    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  };

  if (!mounted) {
    return <div className="w-10 h-10 border border-foreground/20" />;
  }

  return (
    <MagneticButton strength={0.2}>
      <motion.button
        onClick={toggleTheme}
        className={
          cn(
            "relative w-10 h-10 flex items-center justify-center border border-foreground/20 hover:border-accent hover:bg-accent/10 transition-colors duration-200",
            className
          )
        }
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </motion.button>
    </MagneticButton>
  );
};

export default ThemeToggle;
