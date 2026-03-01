"use client"
import { motion, MotionValue, useTransform } from "motion/react"

type Props = {
  y: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}
const DecorativeElements = ({
  y,
  scrollYProgress
}:Props) => {
  return (
    <>
      {/* Decorative elements */}
      <motion.div
        style={{ y }}
        className="absolute -left-40 top-0 w-150 h-150 bg-accent/10 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
        className="absolute -right-20 bottom-0 w-100 h-100 bg-accent/5 rounded-full blur-3xl"
      />

      {/* Floating accent shapes */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-[20%] w-20 h-20 border border-accent/20 rounded-full"
      />
      <motion.div
        animate={{
          rotate: [360, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-32 left-[15%] w-12 h-12 border border-accent/5 z-0 rounded-lg"
      />
      </>

  )
}

export default DecorativeElements