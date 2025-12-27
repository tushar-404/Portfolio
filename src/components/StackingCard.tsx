"use client";
import React, { useState } from "react";
import { motion, useTransform, MotionValue, AnimatePresence } from "framer-motion";
import { Card2D } from "./Card2D";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CardData } from "./PortfolioDeck";
import { Lightbox } from "./Lightbox";
import { useFullScreen } from "../context/FullScreenContext";

interface StackingCardProps {
  card: CardData;
  index: number;
  totalCards: number;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
}

const crossfadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const StackingCard = ({
  card,
  index,
  totalCards,
  scrollYProgress,
  isMobile,
}: StackingCardProps) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { setFullScreen } = useFullScreen();

  const handleOpenLightbox = () => {
    setIsLightboxOpen(true);
    setFullScreen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
    setFullScreen(false);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setImgIndex((prev) => (prev + 1) % card.imgs.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setImgIndex((prev) => (prev - 1 + card.imgs.length) % card.imgs.length);
  };

  const y = useTransform(scrollYProgress, (progress) => {
    const activeCardIndex = progress * (totalCards - 1);
    const distance = index - activeCardIndex;
    const offset = 45;
    return `${distance * offset}%`;
  });

  const scale = useTransform(scrollYProgress, (progress) => {
    const activeCardIndex = progress * (totalCards - 1);
    const distance = Math.abs(index - activeCardIndex);
    // Reduce scale variation for better mobile performance
    return Math.max(1 - distance * 0.05, 0.85);
  });

  const zIndex = useTransform(scrollYProgress, (progress) => {
    const activeCardIndex = progress * (totalCards - 1);
    const distance = Math.abs(index - activeCardIndex);
    return totalCards - distance + 20;
  });

  return (
    <>
      <motion.div
        className="absolute w-full h-full flex items-center justify-center p-4 md:p-8 will-change-transform will-change-z-index"
        style={{ zIndex, y, scale }}
      >
        <div className="w-full max-w-lg md:max-w-3xl lg:max-w-5xl bg-white rounded-3xl shadow-2xl shadow-slate-900/10 ring-1 ring-gray-900/5 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-6 md:px-12 md:py-8 h-full">
            {/* Left Column: Text */}
            <div className="flex flex-col justify-center items-start text-left">
              <div className="flex items-center gap-1 mb-6">
                {card.logo && (
                  <img
                    src={card.logo}
                    alt={`${card.title} logo`}
                    className="w-15 h-15 rounded-xl object-cover"
                  />
                )}
                <h2
                  className="text-4xl lg:text-5xl font-extrabold tracking-tight"
                  style={{ color: card.titleColor || "#0f172a" }}
                >
                  {card.title}
                </h2>
              </div>

              <div className="w-full">
                {(() => {
                  const displayText = isMobile && card.textMobile ? card.textMobile : card.text;
                  return Array.isArray(displayText) ? (
                    <>
                      <p className="text-lg text-slate-700 font-light leading-relaxed mb-4">
                        {displayText[0]}
                      </p>
                      {displayText.length > 1 && (
                        <ul className="space-y-3">
                          {displayText.slice(1).map((point, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-[9px] min-w-1.5 h-1.5 rounded-full bg-slate-800 shadow-sm" />
                              <span className="text-base text-zinc-600 font-medium leading-relaxed">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <p className="text-lg text-slate-700 font-light leading-relaxed">
                      {displayText}
                    </p>
                  );
                })()}
              </div>

              {card.links && (
                <div className="mt-8 flex items-center gap-4">
                  {card.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Image */}
            <div className="hidden md:flex flex-col items-center justify-start pt-10 w-full h-full relative">
              <div className="w-full relative group flex flex-col items-center">
                
                {/* FIX: Added min-h-[300px]. 
                  This forces the container to stay open even when the image unmounts 
                  during the animation, preventing the arrows from jumping.
                */}
                <div className="w-full relative overflow-visible flex justify-center min-h-[400px] items-center">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={imgIndex}
                      variants={crossfadeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeOut" }} // Smoother transition for better performance
                      className="w-full flex justify-center"
                    >
                      <Card2D
                        imageUrl={card.imgs[imgIndex]}
                        onClick={handleOpenLightbox}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {card.imgs.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        // Added z-30 to ensure arrows stay on top of the animation
                        className="absolute top-1/2 -translate-y-1/2 -left-4 z-30 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-slate-800 hover:bg-white transition-all scale-75 hover:scale-100"
                      >
                        <FaChevronLeft size={14} />
                      </button>

                      <button
                        onClick={handleNext}
                        // Added z-30
                        className="absolute top-1/2 -translate-y-1/2 -right-4 z-30 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-slate-800 hover:bg-white transition-all scale-75 hover:scale-100"
                      >
                        <FaChevronRight size={14} />
                      </button>
                    </>
                  )}
                </div>

                {/* Dots Indicator */}
                {card.imgs.length > 1 && (
                  <div className="flex gap-2 mt-4 z-20">
                    {card.imgs.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setImgIndex(idx);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${
                          idx === imgIndex
                            ? "bg-slate-900 scale-125"
                            : "bg-slate-300 hover:bg-slate-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Lightbox
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        images={card.imgs}
        currentIndex={imgIndex}
        setIndex={setImgIndex}
      />
    </>
  );
};
