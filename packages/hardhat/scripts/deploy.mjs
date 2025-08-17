import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { JsonRpcProvider, Wallet, ContractFactory } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Get network from command line arguments
  const network = process.argv[2] || "flowTestnet";
  
  // Use Flow testnet RPC and deployer private key from .env
  const rpcUrl = "https://testnet.evm.nodes.onflow.org";
  const pk = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  console.log(`🚀 Deploying to ${network}...`);
  console.log(`📡 RPC URL: ${rpcUrl}`);

  // Initialize provider and wallet first
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(pk, provider);
  console.log(`👤 Deployer address: ${wallet.address}`);

  // Deploy FriendshipBraceletNFT first
  const nftArtifactPath = path.join(
    __dirname,
    "../artifacts/contracts/FriendshipBraceletNFT.sol/FriendshipBraceletNFT.json"
  );
  
  if (!fs.existsSync(nftArtifactPath)) {
    throw new Error(`NFT artifact not found at ${nftArtifactPath}. Run 'yarn compile' first.`);
  }
  
  const nftArtifact = JSON.parse(fs.readFileSync(nftArtifactPath, "utf8"));
  const nftFactory = new ContractFactory(nftArtifact.abi, nftArtifact.bytecode, wallet);
  
  console.log("📦 Deploying FriendshipBraceletNFT...");
  const nftContract = await nftFactory.deploy();
  await nftContract.waitForDeployment();
  console.log("✅ FriendshipBraceletNFT deployed at:", nftContract.target);

  // Deploy ANewFriendship with NFT contract address
  const friendshipArtifactPath = path.join(
    __dirname,
    "../artifacts/contracts/ANewFriendship.sol/ANewFriendship.json"
  );
  
  if (!fs.existsSync(friendshipArtifactPath)) {
    throw new Error(`Friendship artifact not found at ${friendshipArtifactPath}. Run 'yarn compile' first.`);
  }
  
  const friendshipArtifact = JSON.parse(fs.readFileSync(friendshipArtifactPath, "utf8"));
  const friendshipFactory = new ContractFactory(friendshipArtifact.abi, friendshipArtifact.bytecode, wallet);
  console.log("📦 Deploying ANewFriendship contract...");
  
  // Example friend addresses
  const firstFriend = wallet.address;
  const secondFriend = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  
  const friendshipContract = await friendshipFactory.deploy(firstFriend, secondFriend, nftContract.target);
  await friendshipContract.waitForDeployment();
  
  console.log("✅ ANewFriendship deployed at:", friendshipContract.target);
  console.log("🌐 Network:", network);
  
    // Save deployment info for both contracts
  const deploymentInfo = {
    contracts: {
      FriendshipBraceletNFT: {
        address: nftContract.target,
        blockNumber: 0, // We'll get this from the provider
      },
      ANewFriendship: {
        address: friendshipContract.target,
        blockNumber: 0, // We'll get this from the provider
      }
    },
    network: network,
    deployer: wallet.address,
    timestamp: new Date().toISOString()
  };

  // Get current block number
  try {
    const currentBlock = await provider.getBlockNumber();
    deploymentInfo.contracts.FriendshipBraceletNFT.blockNumber = currentBlock;
    deploymentInfo.contracts.ANewFriendship.blockNumber = currentBlock;
  } catch (error) {
    console.log("⚠️ Could not get block number, using 0");
  }

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
