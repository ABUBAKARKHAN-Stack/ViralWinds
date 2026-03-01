"use client"

import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  //* Dot & Ring Config
  // const dotSpringConfig = { damping: 30, stiffness: 500, mass: 0.5 };
  // const ringSpringConfig = { damping: 20, stiffness: 150, mass: 0.8 };
  const dotSpringConfig = { damping: 38, stiffness: 900, mass: 0.4 };
  const ringSpringConfig = { damping: 32, stiffness: 360, mass: 0.7 };

  const dotXSpring = useSpring(cursorX, dotSpringConfig);
  const dotYSpring = useSpring(cursorY, dotSpringConfig);
  const ringXSpring = useSpring(cursorX, ringSpringConfig);
  const ringYSpring = useSpring(cursorY, ringSpringConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [data-cursor="pointer"], input, textarea, [role="button"]');

      if (interactive) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [data-cursor="pointer"], input, textarea, [role="button"]');

      if (interactive) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorX, cursorY]);

  //* Hide on touch devices
  const isTouchDevice = useIsTouchDevice()
 

  
  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor dot - follows closely */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-999 custom-cursor"
        style={{
          x: dotXSpring,
          y: dotYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          animate={{
            width: isClicking ? 6 : 8,
            height: isClicking ? 6 : 8,
            opacity: isHovering ? 0 : 1,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
        />
      </motion.div>

      {/* Outer ring - trails behind with delay */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-9998 mix-blend-difference custom-cursor"
        style={{
          x: ringXSpring,
          y: ringYSpring,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          animate={{
            width: isHovering ? 50 : isClicking ? 24 : 32,
            height: isHovering ? 50 : isClicking ? 24 : 32,
            borderWidth: isHovering ? 2 : 1,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
