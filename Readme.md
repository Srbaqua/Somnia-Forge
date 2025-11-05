🌌 Somnia Chronicles — The On-Chain AI Memory World

Somnia Chronicles is a Web3 AI RPG interaction experience where players can speak with AI-driven NPCs — and those NPCs remember past conversations using on-chain storage.
Your words literally shape the world, permanently written to the Somnia Blockchain.

This project was built for the Somnia AI Hackathon under the Gaming Track.

🎮 Core Idea

In most games, NPCs forget conversations instantly.
In Somnia Chronicles:

NPCs remember what you say

These memories are stored on-chain

Future NPC responses adapt based on memories

Each player builds their own narrative history

This turns NPCs into evolving story companions — not static dialogue bots.

✨ Features
Feature	Description
🧠 AI NPC Dialogues	NPC replies are generated using an LLM with personality & emotion.
🔗 On-Chain Memories	Every meaningful dialogue generates a memory stored in a smart contract.
👤 Player-Unique Storylines	Each wallet address has its own memory arc.
💬 Clean Chat UI	Simple chat interface for real-time play.
🌐 Works on Somnia Testnet	Live contract deployment ready for verification.
🧱 Tech Stack
Layer	Technology
Smart Contract	Solidity (Hardhat)
Blockchain	Somnia Testnet
AI Model	OpenAI / Gemini (configurable)
Backend	Node.js + Express
Frontend	React + Vite + Ethers v6
UI Styling	(Ready for Tailwind / Framer Motion enhancement)
🏗 Architecture
Player → Frontend Chat UI
       → Backend (dialogue request)
       → LLM generates NPC reply + memory snippet
       → Smart Contract stores memory
       → NPC references past memories to respond meaningfully

🚀 Local Setup
1) Clone Repo
git clone (https://github.com/Srbaqua/Somnia-Forge/new/master)
cd somnia-chronicles

2) Install Dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

🔐 Environment Variables

Create .env files in both project root and backend:

.env (root for contract deployment)
SOMNIA_RPC_URL=https://dream-rpc.somnia.network/
DEPLOYER_PRIVATE_KEY=0xYourPrivateKeyHere

/backend/.env
SOMNIA_RPC_URL=https://dream-rpc.somnia.network/
DEPLOYER_PRIVATE_KEY=0xYourPrivateKeyHere
OPENAI_API_KEY=your-ai-key-here
CONTRACT_ADDR=0xYourDeployedContractAddress

/frontend/.env
VITE_CONTRACT_ADDR=0xYourDeployedContractAddress
VITE_BACKEND_URL=http://localhost:8080

🧾 Deploy Smart Contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network somnia


Copy the contract address printed to console → paste into .env.

▶️ Run Application
Start backend:
cd backend
node index.js

Start frontend:
cd frontend
npm run dev


Open:

http://localhost:5173

📦 Smart Contract

SomniaMemory.sol

createMemory(string npcName, string memoryText)

getMemoriesForPlayer(address player)

🎯 Future Enhancements (Open for Expansion)

Multi-NPC world with persistent relationships

Player inventory + AI quest generation

Marketplace for shared stories / lore NFTs

World memory graph visualization

Fully animated neon cyberpunk UI

🤝 Contribution

Contributions welcome — open issues, propose features, or fork and build!

🏆 Hackathon Notes

Built for Somnia AI Hackathon Gaming Track

Focused on narrative-driven gameplay + AI memory

Demonstrates real agentic behavior persistence on-chain
