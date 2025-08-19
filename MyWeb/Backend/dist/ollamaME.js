"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ---- Config via env (sane defaults for Docker) ----
// If Ollama runs in Docker as service "ollama", use that.
// If Ollama runs on the host, set OLLAMA_BASE_URL=http://host.docker.internal:11434
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://host.docker.internal:11434";
const PORT = Number(process.env.PORT || 3001);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN; // e.g. https://app.example.com
// CORS: if you route API under the same hostname (/api) you can skip cors() entirely.
// If you have a separate origin, set FRONTEND_ORIGIN and uncomment below:
if (FRONTEND_ORIGIN) {
    app.use((0, cors_1.default)({
        origin: FRONTEND_ORIGIN,
        credentials: true,
    }));
}
// Health check (useful from the cloudflared container)
app.get("/health", (_req, res) => res.json({ ok: true }));
// Chat endpoint: browser -> backend -> Ollama
app.post("/api/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { model = "llama3.2", messages, stream = false } = req.body || {};
    if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "Missing or invalid messages array" });
    }
    try {
        const response = yield axios_1.default.post(`${OLLAMA_BASE_URL}/api/chat`, { model, messages, stream }, { timeout: 120000 });
        // Non-streaming response shape: { message: { content: "..." }, ... }
        const lastMessage = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : "No response.";
        res.json({ response: lastMessage });
    }
    catch (err) {
        const status = ((_d = err.response) === null || _d === void 0 ? void 0 : _d.status) || 500;
        const payload = ((_e = err.response) === null || _e === void 0 ? void 0 : _e.data) || { message: err.message };
        console.error("Ollama error:", payload);
        res.status(status).json({ error: "Ollama request failed", details: payload });
    }
}));
// Bind to 0.0.0.0 so other containers (cloudflared) can reach it
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Backend running at http://0.0.0.0:${PORT}`);
    console.log(`→ Talking to Ollama at ${OLLAMA_BASE_URL}`);
});
