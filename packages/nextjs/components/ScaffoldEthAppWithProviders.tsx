"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { FlowWalletConnectors } from "@dynamic-labs/flow";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={`flex flex-col min-h-screen `}>
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add error handling for Dynamic SDK
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.message && event.reason.message.includes('Failed to fetch')) {
        console.warn('Dynamic SDK fetch error caught:', event.reason);
        // Prevent the error from showing in console
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  return (
    <DynamicContextProvider
      settings={{
        // Get your environment ID from https://app.dynamic.xyz/dashboard/developer
        environmentId: "533d6656-deb7-490a-8306-37615b2c8163",
        walletConnectors: [FlowWalletConnectors, EthereumWalletConnectors],
        
        // Flow EVM network configuration
        overrides: {
          evmNetworks: [
            {
              chainId: 747,
              chainName: "Flow EVM Mainnet",
              name: "Flow EVM",
              networkId: 747,
              nativeCurrency: {
                name: "Flow",
                symbol: "FLOW",
                decimals: 18,
              },
              rpcUrls: ["https://mainnet.evm.nodes.onflow.org"],
              blockExplorerUrls: ["https://evm.flowscan.io"],
              iconUrls: ["https://flow.com/favicon.ico"],
            },
            {
              chainId: 545,
              chainName: "Flow EVM Testnet",
              name: "Flow EVM Testnet",
              networkId: 545,
              nativeCurrency: {
                name: "Flow",
                symbol: "FLOW",
                decimals: 18,
              },
              rpcUrls: ["https://testnet.evm.nodes.onflow.org"],
              blockExplorerUrls: ["https://testnet.flowscan.io"],
              iconUrls: ["https://flow.com/favicon.ico"],
            },
          ],
        },
        
        // Flow network configuration
        walletConnectPreferredChains: ["eip155:545"], // Flow EVM Chain ID
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ProgressBar height="3px" color="#2299dd" />
        <ScaffoldEthApp>{children}</ScaffoldEthApp>
      </QueryClientProvider>
    </DynamicContextProvider>
  );
};
