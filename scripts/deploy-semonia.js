const hre = require("hardhat");

async function main() {
  try {
    const Somnia = await hre.ethers.getContractFactory("SomniaMemory");
    console.log("Deploying SomniaMemory...");
    const somnia = await Somnia.deploy();
    await somnia.deployed();
    console.log("SomniaMemory deployed to:", somnia.address);
  } catch (err) {
    console.error("Deployment failed:", err && err.message ? err.message : err);
    process.exitCode = 1;
  }
}

main();