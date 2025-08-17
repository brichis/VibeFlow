import { useMemo } from "react";

/**
 * Simplified target network hook for Dynamic SDK integration
 */
export function useTargetNetwork(): { targetNetwork: any } {
  const targetNetwork = useMemo(() => ({
    id: 747, // Flow EVM testnet
    name: "Flow EVM Testnet",
    network: "flowTestnet",
    nativeCurrency: {
      name: "Flow",
      symbol: "FLOW",
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ["https://testnet.evm.nodes.onflow.org"] },
      public: { http: ["https://testnet.evm.nodes.onflow.org"] },
    },
    blockExplorerUrls: ["https://testnet.flowscan.io"],
  }), []);

  return { targetNetwork };
}