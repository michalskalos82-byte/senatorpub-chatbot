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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY?.trim() });

const SYSTEM_PROMPT = `
Si AI asistent pre Senátor Pub & Restaurant v Tvrdošíne.

Odpovedaj vždy po slovensky, stručne, priateľsky a profesionálne.

Používaj výhradne informácie uvedené v KNOWLEDGE_BASE nižšie.
Nevymýšľaj si žiadne informácie, časy, ceny, jedlá, akcie ani dostupnosť.

Ak sa používateľ pýta na niečo, čo nie je jasne uvedené v KNOWLEDGE_BASE, odpovedz:
"Prepáčte, túto informáciu momentálne nemám k dispozícii. Prosím kontaktujte reštauráciu telefonicky na čísle 0915 914 876."

Ak je v KNOWLEDGE_BASE uvedené, že niečo platí iba v pracovné dni, nesmieš tvrdiť, že to platí aj cez víkend.

Pri otázkach na denné menu vždy rešpektuj, že denné menu je dostupné iba vtedy, keď je to tak uvedené v KNOWLEDGE_BASE.

KNOWLEDGE_BASE:
${getKnowledgeBase()}
`;
function getKnowledgeBase() {
  const generalKnowledge = fs.readFileSync("./knowledge.txt", "utf8");
  const menuKnowledge = fs.readFileSync("./menu_knowledge.txt", "utf8");

  return `
${generalKnowledge}

${menuKnowledge}
`;
}app.post("/chat", async (req, res) => {
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
      input: `
Aktuálny dátum a čas na Slovensku:
${new Date().toLocaleString("sk-SK", { timeZone: "Europe/Bratislava", weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}

Otázka zákazníka:
${message}
`,
      temperature: 0.2,
      max_output_tokens: 350
    });

   let answer =
  response.output_text ||
  "Prepáčte, odpoveď sa nepodarilo vygenerovať.";


const startsWithYes = /^\s*áno(?:\s|,|\.|!|\?|:|;|-)/i.test(answer);

const saysClosed =
  /zatvorené|zatvorená|zatvorený|zatvorení|neotvárame/i.test(answer);

if (startsWithYes && saysClosed) {
  answer = answer.replace(
    /^\s*áno(?:\s|,|\.|!|\?|:|;|-)*/i,
    "Nie, "
  );
}

const asksForTime =
  /^\s*(kedy|dokedy|od koľkej|do koľkej|aké sú otváracie hodiny)/i.test(message);

if (asksForTime) {
  answer = answer.replace(/^\s*(áno|nie)[,.:;!?\s-]*/i, "");
  answer = answer.charAt(0).toUpperCase() + answer.slice(1);
}


res.json({ answer });
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
