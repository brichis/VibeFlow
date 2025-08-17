import { useState, useEffect } from "react";

export const useFetchBlocks = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // This is a simplified version - in a real app you'd fetch from your RPC
      setBlocks([]);
    } catch (err) {
      setError("Failed to fetch blocks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  return { blocks, isLoading, error, refetch: fetchBlocks };
};
