import { createContext, useContext, useState } from "react";

const ZenshinContext = createContext();

export function useZenshinContext() {
  const context = useContext(ZenshinContext);
  if (context === undefined) {
    throw new Error("useZenshinContext must be used within a ZenshinProvider");
  }
  return context;
}

export default function ZenshinProvider({ children }) {
  const [glow, setGlow] = useState(false);

  return (
    <ZenshinContext.Provider value={{ glow, setGlow }}>
      {children}
    </ZenshinContext.Provider>
  );
}
