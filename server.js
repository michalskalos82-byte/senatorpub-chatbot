import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow local tools / curl with no origin, and configured domains.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false
});
app.use("/chat", limiter);

if (!process.env.OPENAI_API_KEY) {
  console.warn("Missing OPENAI_API_KEY. Create .env from .env.example.");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
Si AI asistent pre Senátor Pub & Restaurant v Tvrdošíne.

Odpovedaj vždy po slovensky, stručne, priateľsky a profesionálne.
Používaj iba informácie z knowledge base.
Ak odpoveď nevieš, odporuč zákazníkovi kontaktovať reštauráciu telefonicky na čísle 0915 914 876.

KNOWLEDGE_BASE:
${getKnowledgeBase()}
`;

function getKnowledgeBase() {
  return fs.readFileSync("./knowledge.txt", "utf8");
}
app.post("/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ error: "Chýba otázka." });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: "Otázka je príliš dlhá." });
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: SYSTEM_PROMPT,
      input: message,
      temperature: 0.2,
      max_output_tokens: 350
    });

    res.json({ answer: response.output_text || "Prepáčte, odpoveď sa nepodarilo vygenerovať." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Prepáčte, momentálne sa nepodarilo odpovedať. Skúste kontaktovať reštauráciu telefonicky na čísle 0915 914 876."
    });
  }
});

app.listen(port, () => {
  console.log(`Senator Pub AI chatbot server running on http://localhost:${port}`);
});
