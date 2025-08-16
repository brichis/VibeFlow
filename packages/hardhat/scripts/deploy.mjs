import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JsonRpcProvider, Wallet, ContractFactory } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const pk = process.env.PRIVATE_KEY;
  if (!rpcUrl || !pk) throw new Error("Missing SEPOLIA_RPC_URL or PRIVATE_KEY");

  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/EventMatcher.sol/EventMatcher.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(pk, provider);

  const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();
  const tx = contract.deploymentTransaction();
  console.log("Deploy tx:", tx?.hash);
  const receipt = await tx.wait();
  console.log("Deployed at:", contract.target, "block:", receipt.blockNumber);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
