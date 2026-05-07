(function () {
  const script = document.currentScript;
  const apiUrl = script?.dataset?.apiUrl || `${window.location.origin}/chat`;
  const title = script?.dataset?.title || "Senátor Pub asistent";
  const greeting = script?.dataset?.greeting || "Dobrý deň, ako vám môžeme pomôcť?";

  const style = document.createElement("style");
  style.textContent = `
Rozmýšľal som 9s

Áno, pokazil sa len CSS selector — vložil sa dizajn pre iné názvy prvkov.

V public/widget.js nahraď celý obsah medzi:

style.textContent = `

a

`;

týmto CSS:

#sp-chat-button{
  position:fixed;
  right:24px;
  bottom:24px;
  width:68px;
  height:68px;
  border-radius:50%;
  border:0;
  background:linear-gradient(135deg,#111,#2a2a2a);
  color:#fff;
  font-size:28px;
  cursor:pointer;
  box-shadow:0 12px 35px rgba(0,0,0,.35);
  z-index:999999;
}

#sp-chat-window{
  position:fixed;
  right:24px;
  bottom:110px;
  width:390px;
  max-width:calc(100vw - 32px);
  height:640px;
  max-height:calc(100vh - 140px);
  background:#f6f3f0;
  border-radius:28px;
  box-shadow:0 24px 70px rgba(0,0,0,.32);
  display:none;
  flex-direction:column;
  overflow:hidden;
  font-family:Arial,sans-serif;
  z-index:999999;
}

#sp-chat-header{
  background:linear-gradient(135deg,#111,#1d1d1d);
  color:#fff;
  padding:22px;
  font-size:22px;
  font-weight:800;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

#sp-chat-close{
  background:transparent;
  border:0;
  color:#fff;
  font-size:26px;
  cursor:pointer;
}

#sp-chat-messages{
  flex:1;
  padding:22px;
  overflow-y:auto;
  background:#f6f3f0;
}

.sp-msg{
  padding:16px 18px;
  margin:0 0 16px;
  border-radius:22px;
  line-height:1.5;
  font-size:16px;
  max-width:85%;
  white-space:pre-wrap;
}

.sp-bot{
  background:#fff;
  color:#1a1a1a;
  border:1px solid rgba(0,0,0,.08);
  margin-right:auto;
  border-bottom-left-radius:8px;
}

.sp-user{
  background:linear-gradient(135deg,#111,#2b2b2b);
  color:#fff;
  margin-left:auto;
  border-bottom-right-radius:8px;
}

#sp-chat-form{
  display:flex;
  gap:12px;
  padding:18px;
  border-top:1px solid rgba(0,0,0,.08);
  background:#f1ece8;
}

#sp-chat-input{
  flex:1;
  border:1px solid #d7d0ca;
  border-radius:18px;
  padding:14px 16px;
  font-size:16px;
  outline:none;
  background:#fff;
}

#sp-chat-send{
  border:0;
  border-radius:18px;
  background:#111;
  color:#fff;
  padding:0 22px;
  cursor:pointer;
  font-weight:800;
  font-size:15px;
}

#sp-chat-send:disabled{
  opacity:.55;
  cursor:not-allowed;
}

@media(max-width:640px){
  #sp-chat-window{
    right:12px;
    left:12px;
    width:auto;
    height:82vh;
    bottom:96px;
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
