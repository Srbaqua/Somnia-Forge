const axios = require('axios');

function buildLLMPrompt({ npcName, playerAddress, playerMessage, memoryTexts }) {
  return `
You are an NPC named ${npcName}. You have a personality: warm, curious, occasionally witty, remembers past interactions.
Player: ${playerAddress}
Player says: "${playerMessage}"

Past memories (from on-chain):
${memoryTexts}

Respond concisely as ${npcName}. Include one short line that references one past memory if there is one. Also produce a short "memory snippet" (1-2 sentences) that should be stored on-chain if the interaction is meaningful.

Return JSON with keys:
- "reply": "<what the NPC says to player>"
- "memory": "<short memory snippet for on-chain storage>"

Be concise and keep memory snippet under 140 characters.
`;
}

// async function generateNPCReply(prompt) {
//   // Example with OpenAI Chat completions V1 — replace with your chosen LLM call (Gemini or other)
//   const GROQ_API_KEY= process.env.GROQ_API_KEY;
//   if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY_API_KEY not set');

//   const res = await axios.post('https://api.groq.com/', {
//     model: "openai/gpt-oss-20b", // or whichever model you have access to
//     messages: [{ role: 'system', content: 'You are an NPC generator.' }, { role: 'user', content: prompt }],
//     max_tokens: 200,
//     temperature: 0.8
//   }, {
//     headers: { Authorization: `Bearer ${GROQ_API_KEY}` }
//   });

//   const content = res.data.choices[0].message.content;
//   // Expect JSON — try parse robustly
//   try {
//     const parsed = JSON.parse(content);
//     return parsed;
//   } catch (e) {
//     // If LLM returned text, attempt to extract reply and memory via heuristics
//     // Fallback: return whole text as reply and empty memory
//     return { reply: content, memory: "" };
//   }
// }

// module.exports = { buildLLMPrompt, generateNPCReply };
// const axios = require('axios');

async function generateNPCReply(prompt) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not set");

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant", // working Groq chat model
      messages: [
        { role: "system", content: "You are an NPC generator." },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.8
    },
    {
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const content = res.data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch {
    return { reply: content, memory: "" };
  }
}

module.exports = { buildLLMPrompt,generateNPCReply };
