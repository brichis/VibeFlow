import { useMemo } from "react";

export const useSelectedNetwork = () => {
  const selectedNetwork = useMemo(() => ({
    id: 31337,
    name: "Hardhat Local",
    network: "localhost",
  }), []);

  return selectedNetwork;
};
