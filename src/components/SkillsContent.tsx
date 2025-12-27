"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

interface SkillsContentProps {
  scrollYProgress: MotionValue<number>;
}

const SkillItem = ({
  skill,
  categoryIndex,
  skillIndex,
  scrollYProgress,
  isMobile,
}: {
  skill: string;
  categoryIndex: number;
  skillIndex: number;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
}) => {
  const globalIndex = categoryIndex * 5 + skillIndex;
  const startProgress = 0.15 + globalIndex * 0.02;
  const endProgress = startProgress + 0.02;

  const textColor = isMobile
    ? "rgb(17 24 39)"
    : useTransform(
        scrollYProgress,
        [startProgress, endProgress],
        ["rgb(156 163 175)", "rgb(17 24 39)"],
      );

  return (
    <motion.li
      initial={{ opacity: isMobile ? 1 : 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: isMobile ? 0.0 : 0.4, delay: skillIndex * 0.05 }}
      className="text-lg md:text-4xl font-medium"
      style={{ color: textColor }}
    >
      {skill}
    </motion.li>
  );
};

const skills = {
  Languages: ["TypeScript", "JavaScript", "C++", "Python"],
  Frontend: ["React", "Next.js", "React Three Fiber", "Tailwind CSS", "Jotai"],
  "Backend & DB": ["Node.js", "Express.js", "MongoDB", "PostgreSQL"],
  "My Tools": ["Git & GitHub", "VSCode", "Docker"],
};

export const SkillsContent = ({ scrollYProgress }: SkillsContentProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const skillsContainerOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.25],
    [0, 1],
  );
  const yDesktop = useTransform(scrollYProgress, [0.15, 0.25], ["50px", "0px"]);
  const yMobile = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.6],
    ["50px", "0px", "-300px"],
  );

  const skillsContainerY = isMobile ? yMobile : yDesktop;

  const pointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.15 ? "auto" : "none",
  );

  return (
    <motion.div
      className="max-w-5xl w-full p-4 md:p-8 pt-24 md:pt-24 pb-96 md:pb-24 mt-48 md:mt-0"
      style={{
        opacity: skillsContainerOpacity,
        y: skillsContainerY,
        pointerEvents,
      }}
    >
      <div className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap gap-4 md:gap-x-12 md:gap-y-10 ">
        {Object.entries(skills).map(([category, items], categoryIndex) => {
          const isLastCategory =
            categoryIndex === Object.keys(skills).length - 1;
          return (
            <div
              key={category}
              className="w-full md:w-auto md:min-w-[200px] text-left"
            >
              <h3 className="text-xl font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 md:pb-0">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((skill, skillIndex) => (
                  <SkillItem
                    key={skill}
                    skill={skill}
                    categoryIndex={categoryIndex}
                    skillIndex={skillIndex}
                    scrollYProgress={scrollYProgress}
                    isMobile={isMobile}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
