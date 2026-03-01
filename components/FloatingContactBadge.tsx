"use client"

import { motion } from "motion/react";
import { Phone } from "lucide-react";
import Link from "next/link";

const FloatingContactBadge = () => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
    >
      <Link
        href="/contact"
        className="group flex flex-col items-center gap-3 hover:bg-foreground hover:text-background px-3 py-6 shadow-lg bg-accent text-accent-foreground transition-colors duration-300"
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Phone className="h-5 w-5" />
        </motion.div>
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Get in Touch
        </span>
      </Link>
    </motion.div>
  );
};

export default FloatingContactBadge;
