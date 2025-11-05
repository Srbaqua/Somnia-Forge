require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateNPCReply, buildLLMPrompt } = require('./aiPrompts');
const { JsonRpcProvider, Wallet, Contract } = require('ethers');   // ✅ v6 import
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Load ABI safely
let CONTRACT_ADDR = process.env.CONTRACT_ADDR || "";
let ABI = [];
try {
  ABI = JSON.parse(fs.readFileSync('../frontend/src/abi/somniaMemory.json', 'utf8'));
} catch (e) {
  console.warn('Warning: could not read ABI at ../frontend/src/abi/somniaMemory.json — on-chain reads/writes disabled until ABI is available.', e.message);
}

// Require RPC URL
if (!process.env.SOMNIA_RPC_URL) {
  console.warn('Warning: SOMNIA_RPC_URL not set — provider will fail on on-chain operations.');
}

const provider = process.env.SOMNIA_RPC_URL ? new JsonRpcProvider(process.env.SOMNIA_RPC_URL) : null;
const wallet   = (process.env.DEPLOYER_PRIVATE_KEY && provider) ? new Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider) : null;
const contract = (CONTRACT_ADDR && ABI && ABI.length && wallet) ? new Contract(CONTRACT_ADDR, ABI, wallet) : null;

// Endpoint to generate NPC reply
app.post('/generateReply', async (req, res) => {
  try {
    const { playerAddress, npcName, playerMessage } = req.body || {};
    if (!playerAddress || !npcName || !playerMessage) {
      return res.status(400).json({ error: 'playerAddress, npcName and playerMessage are required' });
    }

    // fetch player's on-chain memories (via contract view) if available
    let memories = [];
    try {
      if (contract && typeof contract.getMemoriesForPlayer === 'function') {
        const onChain = await contract.getMemoriesForPlayer(playerAddress);
        // onChain may be an array-like of tuples; normalize to plain objects
        memories = (onChain || []).map(m => ({
          player: m.player ?? m[0],
          npcName: m.npcName ?? m[1],
          memoryText: m.memoryText ?? m[2],
          timestamp: m.timestamp ? Number(m.timestamp) : (m[3] ? Number(m[3]) : 0)
        }));
      }
    } catch (e) {
      console.warn('Could not fetch on-chain memories (continuing without them):', e.message || e);
    }

    const memoryTexts = (memories.length)
      ? memories.map(m => `${m.npcName} @ ${new Date(m.timestamp * 1000).toISOString()}: ${m.memoryText}`).join('\n')
      : "No past memories.";

    const prompt = buildLLMPrompt({ npcName, playerAddress, playerMessage, memoryTexts });
    const generated = await generateNPCReply(prompt);

    // generated may be { reply, memory } or raw string
    let replyText = "";
    let memorySnippet = "";
    if (generated && typeof generated === 'object') {
      replyText = (generated.reply || "").toString().trim();
      memorySnippet = (generated.memory || "").toString().trim().slice(0, 140);
    } else {
      replyText = generated ? String(generated) : "";
      memorySnippet = "";
    }

    // sanitize reply and memory
    replyText = replyText.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 3000);
    memorySnippet = memorySnippet.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 140);

    return res.json({ reply: replyText, memory: memorySnippet });
  } catch (err) {
    console.error('/generateReply error:', err.response?.data || err.message || err);
    return res.status(500).json({ error: 'generateReply error', details: err.response?.data || err.message });
  }
});

// Endpoint to record a memory (writes to chain)
app.post('/recordMemory', async (req, res) => {
  try {
    const { npcName, memoryText } = req.body || {};
    if (!npcName || !memoryText) return res.status(400).json({ error: 'npcName and memoryText required' });
    if (!contract) return res.status(500).json({ error: 'Contract not configured on backend' });

    // sanitize memoryText before writing on-chain
    const sanitized = memoryText.toString().replace(/[\x00-\x1F\x7F]/g, "").slice(0, 1000);

    const tx = await contract.createMemory(npcName, sanitized);
    const rc = await tx.wait();
    res.json({ success: true, txHash: rc.transactionHash });
  } catch (err) {
    console.error('/recordMemory error:', err);
    res.status(500).json({ error: 'recordMemory error', details: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
