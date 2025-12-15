import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setLoadingHandler } from "../services/api";

interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Đăng ký handler để API interceptor có thể update loading state
    setLoadingHandler(setLoading);
    
    return () => {
      // Cleanup khi unmount
      setLoadingHandler(() => {});
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

