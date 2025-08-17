import { useState, useEffect } from "react";

export const useScaffoldEventHistory = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simplified version - no actual event fetching
    setEvents([]);
  }, []);

  return { events, isLoading };
};
