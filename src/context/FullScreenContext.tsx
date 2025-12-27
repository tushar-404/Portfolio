"use client";
import React, { createContext, useContext, useState } from "react";

interface FullScreenContextType {
  isFullScreen: boolean;
  setFullScreen: (value: boolean) => void;
}

const FullScreenContext = createContext<FullScreenContextType>({
  isFullScreen: false,
  setFullScreen: () => {},
});

export const FullScreenProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFullScreen, setFullScreen] = useState(false);
  return (
    <FullScreenContext.Provider value={{ isFullScreen, setFullScreen }}>
      {children}
    </FullScreenContext.Provider>
  );
};

export const useFullScreen = () => useContext(FullScreenContext);
