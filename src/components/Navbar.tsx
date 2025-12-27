"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { Sun } from "lucide-react";
import { useActiveSection } from "../hooks/useActiveSection";
import { chatbotOpenAtom, chatbotMessageAtom } from "../atoms/chatbotAtom";

export function Navbar() {
  const activeSection = useActiveSection();
  const [, setChatbotOpen] = useAtom(chatbotOpenAtom);
  const [, setChatbotMessage] = useAtom(chatbotMessageAtom);
  const navItems = [
    { name: "HOME", href: "#home", id: "home" },
    { name: "Skills", href: "#skills", id: "skills" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Connect", href: "#connect", id: "connect" },
  ];

  const handleSunClick = () => {
    const funMessages = [
      "C'mon, the color palette is already nice! 😊",
      "Why change perfection? The current colors are beautiful! ✨",
      "Nah, let's keep these gorgeous colors! They're already perfect! 🎨",
      "The color scheme is fire already! No need to switch! 🔥"
    ];
    const randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];
    setChatbotMessage(randomMessage);
    setChatbotOpen(true);
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    const targetId = href.replace("#", "");

    if (targetId === "home") {
       window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (targetId === "connect") {
       // Scroll to the very bottom of the page
       window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    } else {
       const element = document.getElementById(targetId);
       if (element) {
         const isMobile = window.innerWidth < 768;
         let y = element.getBoundingClientRect().top + window.scrollY;

         if (isMobile && targetId === "skills") {
           y = window.innerHeight * 1.1;
         }

         window.scrollTo({ top: y, behavior: "smooth" });
       }
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`${isMobile ? 'fixed top-0 left-0 right-0 z-50 bg-[#FFF1EB]/95 backdrop-blur-sm ' : 'fixed top-1 left-0 right-0 z-50'}`}>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ type: "spring", stiffness: 20, damping: 10, duration: 3 }}
        className={`${isMobile ? 'max-w-full px-2 py-2' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}
      >
        <div className={`flex items-center justify-between h-10 whitespace-nowrap ${isMobile ? 'px-2 pointer-events-auto' : 'pointer-events-auto'}`}>
          <NavItem
            item={navItems[0]}
            handleScroll={handleScrollTo}
            isHome={true}
            isActive={activeSection === navItems[0].id}
          />
          <div className="flex items-center space-x-6">
            {navItems.slice(1).map((item) => (
              <NavItem
                key={item.name}
                item={item}
                handleScroll={handleScrollTo}
                isActive={activeSection === item.id}
              />
            ))}
            <motion.button
              onClick={handleSunClick}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Sun icon"
            >
              <Sun size={18} className="text-gray-700" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function NavItem({ item, handleScroll, isHome, isActive }: any) {
  return (
    <motion.a
      href={item.href}
      onClick={(e) => handleScroll(e, item.href)}
      className={`relative group transition-colors duration-200 p-1 ${
        isHome ? "font-bold text-xl text-gray-800" : "text-sm font-medium text-gray-700"
      } hover:text-black`}
      initial="initial"
      whileHover="hover"
    >
      <span className="relative z-10">{item.name}</span>
      <motion.span
        animate={{ scaleX: isActive ? 1 : 0, originX: 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
      />
      <motion.span
        variants={{
          initial: { scaleX: 0, originX: 0.5 },
          hover: { scaleX: isActive ? 0 : 1, originX: 0.5 }
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black opacity-60"
      />
    </motion.a>
  );
}

