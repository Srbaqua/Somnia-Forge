import React, { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import { BrowserProvider } from "ethers";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
     if (window.ethereum) {
    const prov = new BrowserProvider(window.ethereum);
    setProvider(prov);
  }
  }, []);

  async function connect() {
    const [acc] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(acc);
  }

  return (
    <div>
      <header style={{ padding: 12 }}>
        <h1>Somnia Chronicles — Memory World</h1>
        {!account ? <button onClick={connect}>Connect Wallet</button> : <div>Connected: {account}</div>}
      </header>
      {provider && account && <ChatBox provider={provider} account={account} />}
    </div>
  );
}
