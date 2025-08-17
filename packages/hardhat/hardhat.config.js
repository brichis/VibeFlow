import * as dotenv from "dotenv";
dotenv.config();

const deployerPrivateKey =
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const config = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: false,
    },
  },
  networks: {
    flowMainnet: {
      url: "https://mainnet.evm.nodes.onflow.org",
      accounts: [deployerPrivateKey],
    },
    flowTestnet: {
      url: "https://testnet.evm.nodes.onflow.org",
      accounts: [deployerPrivateKey],
    },
  },
};

export default config;