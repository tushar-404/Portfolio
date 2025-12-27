"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  setIndex: (index: number) => void;
}

export const Lightbox = ({ isOpen, onClose, images, currentIndex, setIndex }: LightboxProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "unset"; 
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((currentIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((currentIndex + 1) % images.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, setIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={onClose} 
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
          >
            <FaTimes size={30} />
          </button>

          <div 
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
          >
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setIndex((currentIndex - 1 + images.length) % images.length); }}
                className="absolute left-2 md:left-8 p-4 text-white hover:scale-110 transition-transform pointer-events-auto"
              >
                <FaChevronLeft size={40} />
              </button>
            )}

            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt="Project Screenshot"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setIndex((currentIndex + 1) % images.length); }}
                className="absolute right-2 md:right-8 p-4 text-white hover:scale-110 transition-transform pointer-events-auto"
              >
                <FaChevronRight size={40} />
              </button>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
