"use client";
import React, { createContext, useContext, useState } from "react";

interface SidebarVisibilityContextType {
  visible: boolean;
  toggle: () => void;
  setVisible: (v: boolean) => void;
}

const SidebarVisibilityContext = createContext<SidebarVisibilityContextType | undefined>(undefined);

export function SidebarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  const toggle = () => setVisible((v) => !v);
  return (
    <SidebarVisibilityContext.Provider value={{ visible, toggle, setVisible }}>
      {children}
    </SidebarVisibilityContext.Provider>
  );
}

export function useSidebarVisibility() {
  const ctx = useContext(SidebarVisibilityContext);
  if (!ctx) throw new Error("useSidebarVisibility must be used within SidebarVisibilityProvider");
  return ctx;
}
