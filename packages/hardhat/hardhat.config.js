/** @type {import('hardhat/config').HardhatUserConfig} */

// Only build sepolia when an RPC URL is provided.
// This prevents HHE15 during `hardhat node` if envs are missing.
const networks = {};
if (process.env.SEPOLIA_RPC_URL) {
  networks.sepolia = {
    type: "http",
    url: process.env.SEPOLIA_RPC_URL,
    accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  };
}

const config = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  // The in-process Hardhat network exists by default (type: 'edr-simulated')
  networks,
  mocha: { timeout: 60_000 },
};

export default config;
