(function () {
  const script = document.currentScript;
  const apiUrl = script?.dataset?.apiUrl || `${window.location.origin}/chat`;
  const title = script?.dataset?.title || "Senátor Pub asistent";
  const greeting = script?.dataset?.greeting || "Dobrý deň, ako vám môžeme pomôcť?";

  const style = document.createElement("style");
  style.textContent = `
#senator-chat-toggle {
  letter-spacing: -0.5px;
}

#senator-chat-close {
  cursor: pointer;
  font-size: 34px;
  opacity: 0.85;
}

#senator-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 22px;
  background: #f6f3f0;
}

.senator-message {
  margin-bottom: 18px;
  line-height: 1.6;
  font-size: 17px;
  padding: 18px 20px;
  border-radius: 22px;
  max-width: 85%;
  word-wrap: break-word;
}

.senator-user {
  background: linear-gradient(135deg, #111111, #2b2b2b);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 8px;
}

.senator-bot {
  background: white;
  color: #1a1a1a;
  border: 1px solid rgba(0,0,0,0.08);
  border-bottom-left-radius: 8px;
}

#senator-chat-input-wrap {
  padding: 18px;
  background: #f1ece8;
  border-top: 1px solid rgba(0,0,0,0.06);
  display: flex;
  gap: 12px;
}

#senator-chat-input {
  flex: 1;
  border: 1px solid #d7d0ca;
  border-radius: 18px;
  padding: 16px 18px;
  font-size: 16px;
  outline: none;
  background: white;
}

#senator-chat-send {
  border: none;
  border-radius: 18px;
  padding: 0 24px;
  background: linear-gradient(135deg, #111111, #2b2b2b);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

#senator-chat-send:hover {
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  #senator-chat-window {
    right: 12px;
    left: 12px;
    width: auto;
    height: 82vh;
    bottom: 92px;
    border-radius: 24px;
  }

  #senator-chat-header {
    font-size: 24px;
    padding: 20px;
  }

  .senator-message {
    font-size: 16px;
  }
}
  `;
  document.head.appendChild(style);

  const button = document.createElement("button");
  button.id = "sp-chat-button";
  button.innerHTML = "💬";
  button.setAttribute("aria-label", "Otvoriť chat");

  const windowEl = document.createElement("div");
  windowEl.id = "sp-chat-window";
  windowEl.innerHTML = `
    <div id="sp-chat-header"><span>${title}</span><button id="sp-chat-close">×</button></div>
    <div id="sp-chat-messages"></div>
    <form id="sp-chat-form">
      <input id="sp-chat-input" type="text" placeholder="Napíšte otázku..." autocomplete="off" />
      <button id="sp-chat-send" type="submit">Poslať</button>
    </form>
  `;

  document.body.appendChild(button);
  document.body.appendChild(windowEl);

  const messages = windowEl.querySelector("#sp-chat-messages");
  const form = windowEl.querySelector("#sp-chat-form");
  const input = windowEl.querySelector("#sp-chat-input");
  const send = windowEl.querySelector("#sp-chat-send");
  const close = windowEl.querySelector("#sp-chat-close");

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = `sp-msg ${type === "user" ? "sp-user" : "sp-bot"}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  addMessage(greeting, "bot");

  button.addEventListener("click", () => {
    windowEl.style.display = windowEl.style.display === "flex" ? "none" : "flex";
    setTimeout(() => input.focus(), 50);
  });

  close.addEventListener("click", () => {
    windowEl.style.display = "none";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    send.disabled = true;
    addMessage("Píšem odpoveď...", "bot");
    const loadingMsg = messages.lastChild;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      loadingMsg.textContent = data.answer || data.error || "Nepodarilo sa získať odpoveď.";
    } catch (error) {
      loadingMsg.textContent = "Prepáčte, momentálne sa nepodarilo odpovedať. Skúste zavolať na 0915 914 876.";
    } finally {
      send.disabled = false;
      input.focus();
    }
  });
})();
