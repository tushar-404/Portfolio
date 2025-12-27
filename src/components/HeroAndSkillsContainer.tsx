import React, { useRef, useState, useEffect } from "react";
import { useScroll } from "framer-motion";
import { HeroContent } from "./HeroContent";
import { SkillsContent } from "./SkillsContent";

export function HeroAndSkillsContainer() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#FFF1EB]">
      <div id="home" className="absolute top-0 left-0 w-full h-1 pointer-events-none" />
      <div id="skills" className="absolute top-[300vh] left-0 w-full h-1 pointer-events-none" />
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <HeroContent scrollYProgress={scrollYProgress} />
        {isMobile && <div className="mt-8"></div>}
        <SkillsContent scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}
