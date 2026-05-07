# Senator Pub AI chatbot MVP

Jednoduchý vlastný web chatbot cez OpenAI API.

## 1. Inštalácia

```bash
npm install
cp .env.example .env
```

Do `.env` vlož svoj OpenAI API kľúč:

```bash
OPENAI_API_KEY=sk-proj-...
```

## 2. Spustenie lokálne

```bash
npm run dev
```

Potom otvor:

```text
http://localhost:3000/test.html
```

## 3. Testovacie otázky

- Kedy máte otvorené?
- Dá sa rezervovať stôl?
- Do koľkej je otvorená kuchyňa?
- Kde sa nachádzate?
- Máte otvorené v pondelok?

## 4. Nasadenie na web klienta

Po deploynutí servera napr. na Render/Railway/Vercel vloží klient na web:

```html
<script src="https://tvoja-domena.sk/widget.js"
        data-api-url="https://tvoja-domena.sk/chat"
        data-title="Senátor Pub asistent"
        data-greeting="Dobrý deň, ako vám môžeme pomôcť?"></script>
```

## 5. Dôležité

OpenAI API kľúč nikdy nevkladaj priamo do webovej stránky. Musí byť iba na backende v `.env`.
