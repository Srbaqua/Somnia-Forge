const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const SomniaMemory = await ethers.getContractFactory("SomniaMemory");
  const sm = await SomniaMemory.deploy();

  await sm.waitForDeployment(); // ✅ new in Ethers v6
  console.log("SomniaMemory deployed to:", await sm.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
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