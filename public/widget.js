(function () {
  const script = document.currentScript;
  const apiUrl = script?.dataset?.apiUrl || `${window.location.origin}/chat`;
  const title = script?.dataset?.title || "Senátor Pub asistent";
  const greeting = script?.dataset?.greeting || "Dobrý deň, ako vám môžeme pomôcť?";

  const style = document.createElement("style");
  style.textContent = `
    #sp-chat-button{position:fixed;right:22px;bottom:22px;width:62px;height:62px;border-radius:50%;border:0;background:#111;color:#fff;font-size:26px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.25);z-index:999999}
    #sp-chat-window{position:fixed;right:22px;bottom:96px;width:360px;max-width:calc(100vw - 44px);height:520px;max-height:calc(100vh - 130px);background:#fff;border-radius:18px;box-shadow:0 14px 40px rgba(0,0,0,.25);display:none;flex-direction:column;overflow:hidden;font-family:Arial, sans-serif;z-index:999999}
    #sp-chat-header{background:#111;color:#fff;padding:15px 16px;font-weight:700;display:flex;justify-content:space-between;align-items:center}
    #sp-chat-close{background:transparent;border:0;color:#fff;font-size:22px;cursor:pointer}
    #sp-chat-messages{flex:1;padding:14px;overflow-y:auto;background:#fafafa}
    .sp-msg{padding:10px 12px;margin:8px 0;border-radius:14px;line-height:1.35;font-size:14px;max-width:86%;white-space:pre-wrap}
    .sp-bot{background:#fff;border:1px solid #e7e7e7;margin-right:auto}
    .sp-user{background:#111;color:#fff;margin-left:auto}
    #sp-chat-form{display:flex;gap:8px;padding:12px;border-top:1px solid #eee;background:#fff}
    #sp-chat-input{flex:1;border:1px solid #ddd;border-radius:999px;padding:11px 13px;font-size:14px;outline:none}
    #sp-chat-send{border:0;border-radius:999px;background:#111;color:#fff;padding:0 16px;cursor:pointer;font-weight:700}
    #sp-chat-send:disabled{opacity:.55;cursor:not-allowed}
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
