import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ethers } from "ethers";
import ABI from "../abi/somniaMemory.json";

export default function ChatBox({ provider, account, npcName = "Lyra" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  function pushMsg(from, text) {
    setMessages(prev => [...prev, { from, text }]);
  }

  async function sendMessage() {
    if (!input.trim() || sending) return;
    const userText = input.trim();
    pushMsg("You", userText);
    setInput("");
    setSending(true);

    // Call backend to generate reply + memory
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    let replyText = "";
    let memorySnippet = "";

    try {
      const resp = await axios.post(`${backendUrl}/generateReply`, {
        playerAddress: account,
        npcName,
        playerMessage: userText
      }, { timeout: 20000 });

      const data = resp.data || {};
      if (typeof data.reply === "string") {
        replyText = data.reply;
        memorySnippet = data.memory || "";
      } else if (data.reply && typeof data.reply === "object") {
        replyText = data.reply.reply || JSON.stringify(data.reply);
        memorySnippet = data.reply.memory || data.memory || "";
      } else {
        replyText = String(data || "");
      }
    } catch (err) {
      console.error("generateReply error", err);
      pushMsg("system", `AI generation failed: ${err?.message || String(err)}`);
      setSending(false);
      return;
    }

    // sanitize reply
    replyText = replyText.replace(/[\x00-\x1F\x7F]/g, "").trim();
    pushMsg(npcName, replyText);

    // Prepare memory to write on-chain
    const rawMemory = (memorySnippet && String(memorySnippet)) || replyText.substring(0, 120);
    const sanitizedMemory = rawMemory.replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, 1000);

    // Write memory on-chain with user's MetaMask signer
    if (!window.ethereum) {
      pushMsg("system", "No wallet found — cannot write on-chain");
      setSending(false);
      return;
    }

    try {
      const signer = provider?.getSigner ? await provider.getSigner() : null;
      if (!signer) throw new Error("No signer available from provider");

      // debug: signer address and network
      try {
        const signerAddr = await signer.getAddress();
        pushMsg("system", `Using signer: ${signerAddr}`);
      } catch (e) {
        pushMsg("system", `Unable to read signer address: ${e.message || e}`);
      }

      const contractAddr = import.meta.env.VITE_CONTRACT_ADDR;
      if (!contractAddr) throw new Error("VITE_CONTRACT_ADDR not set in frontend environment");

      pushMsg("system", `Contract: ${contractAddr}`);

      // Optional: show network chain id
      try {
        const network = await provider.getNetwork();
        pushMsg("system", `Network: ${network?.name || network?.chainId || "unknown"}`);
      } catch (e) {
        // ignore
      }

      const contract = new ethers.Contract(contractAddr, ABI, signer);
      pushMsg("system", "Submitting memory transaction...");
      const tx = await contract.createMemory(npcName, sanitizedMemory);
      pushMsg("system", `Tx submitted: ${tx.hash}`);
      const receipt = await tx.wait();
      pushMsg("system", `Memory stored on-chain (confirmed)`);
    } catch (err) {
      console.error("on-chain memory error", err);
      // Show error details in UI for debugging (trim)
      const msg = (err?.message || String(err)).toString().slice(0, 300);
      pushMsg("system", `Failed to record memory on-chain: ${msg}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h2>Talk to {npcName}</h2>
      <div ref={listRef} style={{ minHeight: 240, maxHeight: 360, overflowY: "auto", border: "1px solid #ddd", padding: 12, background: "#fafafa" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <strong>{m.from}:</strong> <span style={{ marginLeft: 8 }}>{m.text}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, padding: 8 }}
          placeholder="Say something to the NPC..."
          onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
          disabled={sending}
        />
        <button onClick={sendMessage} style={{ padding: '8px 12px' }} disabled={sending}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
