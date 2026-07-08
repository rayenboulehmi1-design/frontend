import { createContext, useContext } from "react";

const DemoModeContext = createContext(false);

export const DemoModeProvider = DemoModeContext.Provider;

export function useDemoMode() {
  return useContext(DemoModeContext);
}

export function useDemoLink() {
  const isDemo = useContext(DemoModeContext);
  return (path) => (isDemo ? path.replace(/^\//, "/demo-") : path);
}