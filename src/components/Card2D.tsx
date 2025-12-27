"use client";
import Image from "next/image";
import React from "react";

interface Card2DProps {
  imageUrl: string;
  onClick?: () => void;
  projectTitle?: string;
}

export const Card2D = ({ imageUrl, onClick }: Card2DProps) => {
  return (
    <div
      className="relative w-full flex items-center justify-center cursor-pointer group will-change-transform isolation-isolate"
      onClick={onClick}
      onMouseEnter={() => (document.body.style.cursor = "pointer")}
      onMouseLeave={() => (document.body.style.cursor = "default")}
      style={{ transform: "translateZ(0)" }}
    >
      <Image
        src={imageUrl}
        alt="Project screenshot"
        width={0}
        height={0}
        sizes="100vw"
        className="w-auto h-auto max-h-[500px] max-w-full rounded-2xl object-contain shadow-sm"
        style={{ transform: "translateZ(0)" }}
      />
    </div>
  );
};
