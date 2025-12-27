"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { StackingCard } from "./StackingCard";

export interface CardData {
  id: string;
  title: string;
  titleColor?: string;
  logo?: string;
  text: string | string[];
  textMobile?: string | string[];
  imgs: string[];
  links?: Array<{ href: string; label: string }>;
}

const cardsData: CardData[] = [
  {
    id: "card-1",
    title: "Docent AI",
    titleColor: "#4D2D9A", // Adjusted to match your theme
    text: [
      "RAG-based documentation assistant built with Next.js 15 and Python (FastAPI) to eliminate 'knowledge cutoffs' by fetching live documentation URLs in real-time.",
      "Designed a responsive 'Titanium' themed interface with Tailwind CSS and Framer Motion, featuring smooth transitions and a 'thinking' state visualization.",
      "Implemented atomic global state management using Jotai and local chat persistence via IndexedDB to ensure privacy and high performance without server overhead.",
      "Developed a backend system to scrape and parse documentation on-demand, streaming up-to-date syntax context to the LLM for accurate code generation.",
      "Tech Stack: Next.js 15, Python (FastAPI), TypeScript, Tailwind CSS, Jotai, IndexedDB",
    ],
    textMobile: [
      "RAG-based assistant fetching live docs to eliminate knowledge cutoffs.",
      "Responsive 'Titanium' themed interface with 'thinking' visualization.",
      "Privacy-focused local chat persistence via IndexedDB and Jotai state management.",
      "Tech Stack: Next.js 15, Python (FastAPI), TypeScript, Tailwind.",
    ],
    imgs: ["/Docentai.png"],
    links: [
      // Placeholder links - please update if you have a live link
      { href: "#", label: "Live Demo" }, 
      { href: "https://github.com/tushar-404/docent-ai", label: "GitHub" },
    ],
  },
  {
    id: "card-2",
    title: "Caelivisio",
    text: [
      "Real-time astronomical dashboard monitoring Near-Earth Objects (NEOs) with accessible celestial data visualization.",
      "Direct NASA NeoWs API integration for fetching, filtering, and normalizing asteroid velocity, diameter, and miss distance data.",
      "Dynamic classification system flagging 'Potentially Hazardous Asteroids' using NASA's collision probability algorithms.",
      "Frontend: Next.js, React, Tailwind with dark-mode space aesthetic.",
      "Data handling: Efficient Next.js API routes with rate limiting and caching.",
    ],
    textMobile: [
      "Real-time astronomical dashboard for NEO monitoring.",
      "NASA NeoWs API integration for asteroid data.",
      "Hazardous asteroid classification system.",
      "Frontend: Next.js, React, Tailwind with space theme.",
      "Efficient API routes with rate limiting and caching.",
    ],
    imgs: ["/caelivisio.png"],
    links: [
      { href: "https://webcaelivisio.vercel.app/", label: "Live Demo" },
      { href: "https://github.com/tushar-404/webcaelivisio", label: "GitHub" },
    ],
  },
];

export function PortfolioDeck() {
  const containerRef = useRef(null);
  const totalCards = cardsData.length;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    mass: 0.3,
    restDelta: 0.001,
  });
  const headerRange = [0, 0.2];

  const cardsAppearRange = [0.25, 0.45];
  const cardStackRange = [0.45, 0.9];
  const cardsExitRange = [0.9, 1];
  const textScale = useTransform(smoothProgress, headerRange, [1, 0.8]);
  const textOpacity = useTransform(smoothProgress, headerRange, [1, 0]);
  const headerPointerEvents = useTransform(smoothProgress, (val) =>
    val > 0.2 ? "none" : "auto",
  );
  const cardsY = useTransform(
    smoothProgress,
    [0.25, 0.45, 0.9, 1],
    ["100%", "0%", "0%", "-100%"],
  );
  const cardsOpacity = useTransform(smoothProgress, [0.24, 0.25], [0, 1]);
  const cardStackProgress = useTransform(
    smoothProgress,
    cardStackRange,
    [0, 1],
  );

  return (
    <div id="projects" className="font-sans antialiased">
      <main
        ref={containerRef}
        className="relative"
        // Dynamic height calculation ensures the scroll length is correct for just 2 cards
        style={{ height: `${Math.max(250, totalCards * (isMobile ? 80 : 120))}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            style={{
              y: cardsY,
              opacity: cardsOpacity,
            }}
            className="absolute inset-0 z-20"
          >
            {cardsData.map((card, idx) => (
              <StackingCard
                key={card.id}
                card={card}
                index={idx}
                totalCards={totalCards}
                scrollYProgress={cardStackProgress}
                isMobile={isMobile}
              />
            ))}
          </motion.div>

          <motion.header
            style={{
              pointerEvents: headerPointerEvents as any,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center bg-[#FFF1EB] z-10 px-4"
          >
            <motion.div
              style={{ scale: textScale, opacity: textOpacity }}
              className="w-full max-w-4xl"
            >
              <h1 className="text-6xl md:text-7xl font-extrabold mb-4 tracking-tight leading-tight text-[#131212]">
                Featured Projects
              </h1>
              <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed text-slate-700">
                A curated selection of my work. Scroll down to see the details
                of each project.
              </p>
              <div className="mt-12 text-sm uppercase tracking-widest text-slate-500">
                Scroll <span className="text-2xl block mt-2">↓</span>
              </div>
            </motion.div>
          </motion.header>
        </div>
      </main>
    </div>
  );
}