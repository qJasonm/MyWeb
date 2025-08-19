import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());

// ---- Config via env (sane defaults for Docker) ----
// If Ollama runs in Docker as service "ollama", use that.
// If Ollama runs on the host, set OLLAMA_BASE_URL=http://host.docker.internal:11434
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://host.docker.internal:11434";
const PORT = Number(process.env.PORT || 3001);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN; // e.g. https://app.example.com

// CORS: if you route API under the same hostname (/api) you can skip cors() entirely.
// If you have a separate origin, set FRONTEND_ORIGIN and uncomment below:
if (FRONTEND_ORIGIN) {
  app.use(
    cors({
      origin: FRONTEND_ORIGIN,
      credentials: true,
    })
  );
}

// Health check (useful from the cloudflared container)
app.get("/health", (_req, res) => res.json({ ok: true }));

// Chat endpoint: browser -> backend -> Ollama
app.post("/api/chat", async (req, res) => {
  const { model = "llama3.2", messages, stream = false } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid messages array" });
  }

  try {
    const response = await axios.post(
      `${OLLAMA_BASE_URL}/api/chat`,
      { model, messages, stream },
      { timeout: 120_000 }
    );

    // Non-streaming response shape: { message: { content: "..." }, ... }
    const lastMessage = response.data?.message?.content ?? "No response.";
    res.json({ response: lastMessage });
  } catch (err: any) {
    const status = err.response?.status || 500;
    const payload = err.response?.data || { message: err.message };
    console.error("Ollama error:", payload);
    res.status(status).json({ error: "Ollama request failed", details: payload });
  }
});

// Bind to 0.0.0.0 so other containers (cloudflared) can reach it
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Backend running at http://0.0.0.0:${PORT}`);
  console.log(`→ Talking to Ollama at ${OLLAMA_BASE_URL}`);
});
