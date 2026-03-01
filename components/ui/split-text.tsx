"use client"

import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  splitBy?: "words" | "chars";
  animation?: "slide" | "fade" | "scale" | "blur-sm";
}

const SplitText = ({ 
  children, 
  className = "", 
  delay = 0,
  staggerChildren = 0.02,
  splitBy = "words",
  animation = "slide",
}: SplitTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Split text into words or characters
  const elements = splitBy === "words" 
    ? children.split(" ") 
    : children.split("");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const getAnimationVariants = () => {
    switch (animation) {
      case "fade":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1] as const,
            },
          },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1] as const,
            },
          },
        };
      case "blur-sm":
        return {
          hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
          visible: { 
            opacity: 1, 
            filter: "blur(0px)",
            y: 0,
            transition: {
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1] as const,
            },
          },
        };
      case "slide":
      default:
        return {
          hidden: { 
            y: "110%",
            rotateX: -80,
            opacity: 0,
          },
          visible: { 
            y: "0%",
            rotateX: 0,
            opacity: 1,
            transition: {
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1] as const,
            },
          },
        };
    }
  };

  const elementVariants = getAnimationVariants();

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ perspective: "1000px" }}
    >
      {elements.map((element, i) => (
        <span 
          key={i} 
          className={`inline-block overflow-hidden ${splitBy === "words" ? "mr-[0.25em]" : ""}`}
          style={{ perspective: "1000px" }}
        >
          <motion.span
            variants={elementVariants}
            className="inline-block"
            style={{ 
              transformOrigin: "center bottom",
              backfaceVisibility: "hidden",
            }}
          >
            {element === " " ? "\u00A0" : element}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

export default SplitText;
