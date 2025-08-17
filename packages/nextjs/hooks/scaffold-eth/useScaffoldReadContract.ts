import { useState } from "react";

export const useScaffoldReadContract = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  return { data, isLoading };
};
