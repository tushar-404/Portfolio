"use client";
import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

interface HeroContentProps {
  scrollYProgress: MotionValue<number>;
}

export const HeroContent = ({ scrollYProgress }: HeroContentProps) => {
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.7]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
      style={{ scale: heroScale, opacity: heroOpacity }}
    >
      <h1
        className="font-anton text-[10vw] md:text-8xl lg:text-9xl tracking-tighter text-[#4D2D9A]"
        style={{ lineHeight: "0.85" }}
      >
        <p>WELCOME !</p>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-2xl px-4 md:px-0">
        I'm Tushar, a software engineer trying to be part of the ideas and
        projects that actually matter, learning and building along the way.
      </p>

      <motion.div
        className="mt-12 text-sm uppercase tracking-widest text-slate-500"
        animate={{ y: ["40px", "50px"] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        Know Me ↓
      </motion.div>
    </motion.div>
  );
};

