import * as chains from "viem/chains";

export type BaseConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
};

export type ScaffoldConfig = BaseConfig;

export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

const scaffoldConfig = {
  // The networks on which your DApp is live - Flow EVM Mainnet
  targetNetworks: [chains.mainnet], // Using mainnet for Flow EVM compatibility
  // The interval at which your front-end polls the RPC servers for new data (it has no effect if you only target the local network (default is 4000))
  pollingInterval: 30000,
  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // You can also set your own key at https://app.dynamic.xyz/dashboard/developer
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,
  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // You can also set your own key at https://app.dynamic.xyz/dashboard/developer
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "c4f79cc821944d9680842e34466bfbd9",
  // RPC Overrides for Flow EVM
  rpcOverrides: {
    747: "https://mainnet.evm.nodes.onflow.org", // Flow EVM Mainnet
  },
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;