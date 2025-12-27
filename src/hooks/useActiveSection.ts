import { useState, useEffect } from "react";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollY < windowHeight * 1.5) {
        setActiveSection("home");
      } else if (scrollY < windowHeight * 3.5) {
        setActiveSection("skills");
      } else if (scrollY < windowHeight * 7.5) {
        setActiveSection("projects");
      } else {
        setActiveSection("connect");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return activeSection;
}
