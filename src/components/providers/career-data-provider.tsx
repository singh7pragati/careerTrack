"use client";

import React, { createContext, useContext } from "react";
import { useCareerData } from "@/hooks/use-career-data";

type CareerDataContextType = ReturnType<typeof useCareerData>;

const CareerDataContext = createContext<CareerDataContextType | null>(null);

export function CareerDataProvider({ children }: { children: React.ReactNode }) {
  const data = useCareerData();
  return (
    <CareerDataContext.Provider value={data}>
      {children}
    </CareerDataContext.Provider>
  );
}

export function useCareerContext() {
  const context = useContext(CareerDataContext);
  if (!context) {
    throw new Error("useCareerContext must be used within CareerDataProvider");
  }
  return context;
}
