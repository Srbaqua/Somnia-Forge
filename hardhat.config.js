require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SOMNIA_RPC_URL = process.env.SOMNIA_RPC_URL?.trim();
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY?.trim();

console.log("Using RPC:", SOMNIA_RPC_URL ? SOMNIA_RPC_URL.slice(0, 40) + "..." : " missing");
console.log("Using PK:", DEPLOYER_PRIVATE_KEY ? DEPLOYER_PRIVATE_KEY.slice(0, 10) + "..." : "❌ missing");

module.exports = {
  solidity: "0.8.18",
  networks: {
    somnia: {
      url: SOMNIA_RPC_URL || "https://rpc-testnet.somnia.network",
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};
