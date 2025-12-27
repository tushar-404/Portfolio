"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { SiGithub, SiLinkedin, SiLeetcode, SiCodeforces } from "react-icons/si";
import { ConnectCard } from "./ConnectCard";

export function ConnectSection() {
  const targetRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- Title Animations ---
  // Mobile: Fades out and shrinks quickly to make room for cards
  const mobileTitleOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const mobileTitleScale = useTransform(smoothProgress, [0, 0.15], [1, 0.8]);
  
  // Desktop: Stays visible but shrinks slightly and moves up
  const desktopTitleScale = useTransform(smoothProgress, [0, 0.3], [1, 0.8]);
  const desktopTitleY = useTransform(smoothProgress, [0, 0.3], [0, -50]);

  // --- Card Animations (Overlapping for smooth flow) ---
  // Card 1: GitHub
  const githubScale = useTransform(smoothProgress, [0, 0.25], [0.8, 1]);
  const githubOpacity = useTransform(smoothProgress, [0, 0.20], [0, 1]);
  const githubY = useTransform(smoothProgress, [0, 0.25], [100, 0]);

  // Card 2: LinkedIn
  const linkedinScale = useTransform(smoothProgress, [0.15, 0.40], [0.8, 1]);
  const linkedinOpacity = useTransform(smoothProgress, [0.15, 0.35], [0, 1]);
  const linkedinY = useTransform(smoothProgress, [0.15, 0.40], [100, 0]);

  // Card 3: LeetCode
  const leetcodeScale = useTransform(smoothProgress, [0.30, 0.55], [0.8, 1]);
  const leetcodeOpacity = useTransform(smoothProgress, [0.30, 0.50], [0, 1]);
  const leetcodeY = useTransform(smoothProgress, [0.30, 0.55], [100, 0]);

  // Card 4: Codeforces
  const codeforcesScale = useTransform(smoothProgress, [0.45, 0.70], [0.8, 1]);
  const codeforcesOpacity = useTransform(smoothProgress, [0.45, 0.65], [0, 1]);
  const codeforcesY = useTransform(smoothProgress, [0.45, 0.70], [100, 0]);

  const scrollDownOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  return (
    <section
      ref={targetRef}
      id="connect"
      className="relative h-[300vh] bg-[#FFF1EB]"
    >
      <div className={`sticky top-0 h-screen ${isMobile ? 'flex items-start justify-center pt-28' : 'flex items-center justify-center'} overflow-hidden`}>
        <div className={`${isMobile ? 'w-full max-w-sm px-4' : 'w-full max-w-4xl px-4 pt-16'} relative z-20`}>
            <div className="w-full text-center mb-10">
              {/* Changed from h2 to motion.h2 and applied styles */}
              <motion.h2 
                style={{
                  opacity: isMobile ? mobileTitleOpacity : 1,
                  scale: isMobile ? mobileTitleScale : desktopTitleScale,
                  y: isMobile ? 0 : desktopTitleY
                }}
                className={`font-anton ${isMobile ? 'text-5xl' : 'text-9xl'} text-[#4D2D9A] tracking-tighter`}
              >
                LETS CONNECT!
              </motion.h2>
              
              <motion.div
                className="text-sm uppercase tracking-widest text-slate-500"
                style={{
                  opacity: scrollDownOpacity
                }}
              >
                Scroll <span className="text-xl block mt-1">↓</span>
              </motion.div>
            </div>

            <div className={`grid grid-cols-2 ${isMobile ? 'gap-4 gap-y-2 pr-4 max-w-xs' : 'gap-8 gap-y-8 px-4 max-w-4xl'}`}>
              {/* GitHub Card */}
              <motion.div
                style={{
                  scale: githubScale,
                  opacity: githubOpacity,
                  y: githubY
                }}
              >
                {isMobile ? (
                  <a
                    href="https://github.com/tushar-404"
                    className="w-full h-16 bg-gray-50 rounded-2xl border border-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <SiGithub size={28} className="text-gray-800" />
                  </a>
                ) : (
                  <ConnectCard
                    title="GitHub"
                    id="@tushar-404"
                    link="https://github.com/tushar-404"
                    className="w-full h-24 bg-gray-50 rounded-2xl border border-white"
                    textColor="text-gray-900"
                    subTextColor="text-gray-600"
                    icon={<SiGithub size={32} />}
                    iconColor="text-gray-800"
                    motionStyle={{}}
                    benchmark={["Active", "Dev"]}
                  />
                )}
              </motion.div>

              {/* LinkedIn Card */}
              <motion.div
                style={{
                  scale: linkedinScale,
                  opacity: linkedinOpacity,
                  y: linkedinY
                }}
              >
                {isMobile ? (
                  <a
                    href="https://www.linkedin.com/in/tushar-kumar-singh-79663434b"
                    className="w-full h-16 bg-blue-50 rounded-2xl border border-white shadow-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                  >
                    <SiLinkedin size={28} className="text-blue-600" />
                  </a>
                ) : (
                  <ConnectCard
                    title="LinkedIn"
                    id="Tushar Kumar Singh"
                    link="https://www.linkedin.com/in/tushar-kumar-singh-79663434b"
                    className="w-full h-24 bg-blue-50 rounded-2xl border border-white"
                    textColor="text-gray-900"
                    subTextColor="text-gray-600"
                    icon={<SiLinkedin size={32} />}
                    iconColor="text-blue-600"
                    motionStyle={{}}
                  />
                )}
              </motion.div>

              {/* LeetCode Card */}
              <motion.div
                style={{
                  scale: leetcodeScale,
                  opacity: leetcodeOpacity,
                  y: leetcodeY
                }}
              >
                {isMobile ? (
                  <a
                    href="https://leetcode.com/u/QuantumFlash/"
                    className="w-full h-16 bg-orange-50 rounded-2xl border border-white shadow-lg flex items-center justify-center hover:bg-orange-100 transition-colors"
                  >
                    <SiLeetcode size={28} className="text-[#F89F1B]" />
                  </a>
                ) : (
                  <ConnectCard
                    title="LeetCode"
                    id="QuantumFlash"
                    link="https://leetcode.com/u/QuantumFlash/"
                    className="w-full h-24 bg-orange-50 rounded-2xl border border-white"
                    textColor="text-gray-900"
                    subTextColor="text-gray-600"
                    icon={<SiLeetcode size={32} />}
                    iconColor="text-[#F89F1B]"
                    motionStyle={{}}
                    benchmark={["150+", "Questions"]}
                  />
                )}
              </motion.div>

              {/* Codeforces Card */}
              <motion.div
                style={{
                  scale: codeforcesScale,
                  opacity: codeforcesOpacity,
                  y: codeforcesY
                }}
              >
                {isMobile ? (
                  <a
                    href="https://codeforces.com/profile/flash_vortex_12"
                    className="w-full h-16 bg-red-50 rounded-2xl border border-white shadow-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <SiCodeforces size={28} className="text-red-600" />
                  </a>
                ) : (
                  <ConnectCard
                    title="Codeforces"
                    id="flash_vortex_12"
                    link="https://codeforces.com/profile/flash_vortex_12"
                    className="w-full h-24 bg-red-50 rounded-2xl border border-white"
                    textColor="text-gray-900"
                    subTextColor="text-gray-600"
                    icon={<SiCodeforces size={32} />}
                    iconColor="text-red-600"
                    motionStyle={{}}
                    benchmark={["Rating", "848"]}
                  />
                )}
              </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
}