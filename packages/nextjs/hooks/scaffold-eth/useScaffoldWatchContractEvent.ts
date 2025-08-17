import { useState } from "react";

export const useScaffoldWatchContractEvent = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  return { data, isLoading };
};
