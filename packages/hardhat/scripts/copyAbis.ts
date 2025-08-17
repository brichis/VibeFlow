import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("📋 Copying contract ABIs to frontend...");

  // Read the contract artifacts
  const friendshipArtifact = JSON.parse(
    fs.readFileSync("./artifacts/contracts/FriendshipBraceletNFT.sol/FriendshipBraceletNFT.json", "utf8")
  );
  
  const anewFriendshipArtifact = JSON.parse(
    fs.readFileSync("./artifacts/contracts/ANewFriendship.sol/ANewFriendship.json", "utf8")
  );

  // Create the contractsData.ts content
  const contractsDataContent = `import { Address } from "viem";

export const deployedContracts = {
  localhost: {
    FriendshipBraceletNFT: {
      address: "0xFE5f411481565fbF70D8D33D992C78196E014b90" as Address,
      abi: ${JSON.stringify(friendshipArtifact.abi, null, 2)} as const,
    },
    ANewFriendship: {
      address: "0xD6b040736e948621c5b6E0a494473c47a6113eA8" as Address,
      abi: ${JSON.stringify(anewFriendshipArtifact.abi, null, 2)} as const,
    },
  },
} as const;

export type DeployedContracts = typeof deployedContracts;
export type DeployedContractsByChainId<TChainId extends keyof DeployedContracts> = DeployedContracts[TChainId];

export const useAllContracts = () => {
  return deployedContracts.localhost;
};
`;

  // Write to the frontend
  const frontendPath = path.join(__dirname, "../../nextjs/utils/scaffold-eth/contractsData.ts");
  fs.writeFileSync(frontendPath, contractsDataContent);
  
  console.log("✅ ABIs copied to frontend!");
  console.log("📁 Location:", frontendPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
