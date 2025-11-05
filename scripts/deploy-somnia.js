const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Somnia = await hre.ethers.getContractFactory("SomniaMemory");
  console.log("Deploying SomniaMemory...");
  const somnia = await Somnia.deploy();
  await somnia.waitForDeployment();
  console.log("SomniaMemory deployed to:", somnia.address);

  // write VITE_CONTRACT_ADDR to .env.local at project root
  const address = somnia.address;
  const envPath = path.resolve(__dirname, "..", ".env.local");
  try {
    fs.writeFileSync(envPath, `VITE_CONTRACT_ADDR=${address}\n`, { encoding: "utf8" });
    console.log(`Wrote VITE_CONTRACT_ADDR to ${envPath}`);
  } catch (err) {
    console.error("Failed to write .env.local:", err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
