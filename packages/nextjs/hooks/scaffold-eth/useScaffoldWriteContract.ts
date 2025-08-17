import { useState } from "react";

export const useScaffoldWriteContract = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  return { data, isLoading };
};
