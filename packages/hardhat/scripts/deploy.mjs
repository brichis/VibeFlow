import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { JsonRpcProvider, Wallet, ContractFactory } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Get network from command line arguments
  const network = process.argv[2] || "localhost";
  
  // Use Flow testnet RPC and deployer private key from hardhat config
  const rpcUrl = "https://testnet.evm.nodes.onflow.org";
  const pk = process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  console.log(`🚀 Deploying to ${network}...`);
  console.log(`📡 RPC URL: ${rpcUrl}`);

  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/MatchNFT.sol/MatchNFT.json"
  );
  
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Contract artifact not found at ${artifactPath}. Run 'yarn compile' first.`);
  }
  
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(pk, provider);

  console.log(`👤 Deployer address: ${wallet.address}`);

  const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log("📦 Deploying MatchNFT contract...");
  
  const contract = await factory.deploy();
  const tx = contract.deploymentTransaction();
  console.log("🔗 Deploy tx:", tx?.hash);
  
  const receipt = await tx.wait();
  console.log("✅ Deployed at:", contract.target);
  console.log("📊 Block:", receipt.blockNumber);
  console.log("🌐 Network:", network);
  
  // Save deployment info
  const deploymentInfo = {
    contract: "MatchNFT",
    address: contract.target,
    network: network,
    blockNumber: receipt.blockNumber,
    deployer: wallet.address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(__dirname, `../deployments/${network}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("💾 Deployment info saved to deployments/");
}

main().catch((e) => {
  console.error("❌ Deployment failed:", e);
  process.exit(1);
});
