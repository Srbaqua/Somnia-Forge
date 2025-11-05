<div align="center">

# 🌌 Somnia Chronicles — Memory World

### **AI NPCs with blockchain-backed long-term memory.**

<img src="https://github.com/Srbaqua/somnia-chronicles/assets/banner-placeholder" width="700"/>

<br/>

[![Made with Solidity](https://img.shields.io/badge/Solidity-0.8.18-363636?logo=solidity)](#)
[![React](https://img.shields.io/badge/Frontend-React-61dafb?logo=react&logoColor=000)](#)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-3C873A?logo=node.js&logoColor=white)](#)
[![Somnia Network](https://img.shields.io/badge/Blockchain-Somnia-blueviolet)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

</div>

---

## 🎮 Introduction

**Somnia Chronicles** is an AI-powered RPG world where NPCs **remember your conversations**, permanently stored on-chain using the Somnia Blockchain.

Your companion NPC **Lyra**:
- Talks naturally using AI
- Remembers what you said in previous sessions
- Adjusts personality and responses over time
- Stores key memory fragments on-chain, tied to your wallet

This creates **persistent, evolving character relationships** — not just chat.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🧠 AI NPC Dialogues | Dynamic conversation powered by OpenAI / Gemini |
| 🧾 Permanent Memories | Player interactions stored in Somnia blockchain contract |
| 💼 Wallet Identity | Each player's memory belongs to their wallet |
| 💬 Web-based Chat Interface | Clean UI built in React + Vite |
| ⚙️ Smart Contract Logic | `SomniaMemory.sol` stores and retrieves memories |

---

## 🏗️ Architecture

Player ↔ Frontend UI ↔ Backend AI Service ↔ Smart Contract ↔ Somnia Network

yaml
Copy code

---

## 🧱 Tech Stack

| Layer | Tools |
|------|------|
| **Frontend** | React, Vite, Ethers.js, TailwindCSS |
| **Backend** | Node.js, Express, Axios |
| **Blockchain** | Somnia Testnet, Hardhat, Solidity |
| **AI** | OpenAI / Gemini Large Language Models |

---

## 📦 Project Structure

somnia-chronicles/

├── contracts/

│ └── SomniaMemory.sol

├── scripts/

│ └── deploy.js

├── backend/

│ ├── index.js

│ ├── aiPrompts.js

│ └── .env

├── frontend/

│ ├── src/

│ │ ├── components/

│ │ │ └── ChatBox.jsx

│ │ ├── abi/

│ │ │ └── somniaMemory.json

│ │ └── App.jsx

└── hardhat.config.js



---

## ⚙️ Setup & Run

### 1) Clone Repository
```bash
git clone https://github.com/Srbaqua/somnia-chronicles.git
cd somnia-chronicles/somnia-chronicles
2) Deploy Contract to Somnia Testnet
arduino
Copy code
npx hardhat compile
npx hardhat run scripts/deploy.js --network somnia
Copy the deployed contract address.

3) Configure Backend
Create backend/.env:

ini
Copy code
SOMNIA_RPC_URL=https://dream-rpc.somnia.network/
DEPLOYER_PRIVATE_KEY=0xYOUR_KEY
OPENAI_API_KEY=YOUR_AI_KEY
CONTRACT_ADDR=0xDEPLOYED_CONTRACT
Run backend:

bash
Copy code
cd backend
npm install
node index.js
4) Configure Frontend
Create frontend/.env:

ini
Copy code
VITE_CONTRACT_ADDR=0xDEPLOYED_CONTRACT
VITE_BACKEND_URL=http://localhost:8080
Run UI:

bash
Copy code
cd frontend
npm install
npm run dev
Open browser → http://localhost:5173

🧪 Demo Flow
Connect MetaMask wallet

Say something to Lyra

AI generates reply + memory

Confirm transaction in wallet

Memory is stored on-chain ✅

Next time → Lyra remembers you 🧠

🚀 Future Improvements
Multiple NPC personalities

3D world interaction (Three.js)

Player-to-player shared memory space

Memory NFTs to trade stories

🤝 Contributing
PRs welcome.
Ideas welcome.
Conversations with Lyra encouraged.

📜 License
MIT — free to fork, remix, and build upon.

<div align="center">
“Memories fade. Blockchains don’t.”

✨ Somnia Chronicles — 2025

</div> ```
