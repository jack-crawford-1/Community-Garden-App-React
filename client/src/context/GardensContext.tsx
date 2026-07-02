import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import type { GardenSummary } from "../types/garden";
import { fetchGardens } from "../api/gardens";

type GardensState = {
  gardens: GardenSummary[];
  loading: boolean;
  error: string | null;
  retry: () => void;
};

const GardensContext = createContext<GardensState | undefined>(undefined);

export function GardensProvider({ children }: { children: React.ReactNode }) {
  const [gardens, setGardens] = useState<GardenSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchGardens()
      .then((data) => {
        if (!cancelled) setGardens(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load gardens");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setAttempt((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({ gardens, loading, error, retry }),
    [gardens, loading, error, retry],
  );

  return <GardensContext value={value}>{children}</GardensContext>;
}

export function useGardens(): GardensState {
  const ctx = use(GardensContext);
  if (!ctx) throw new Error("useGardens must be used within a GardensProvider");
  return ctx;
}
