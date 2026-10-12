(function () {
  "use strict";

  const script = document.currentScript;

  const config = {
    apiUrl: script?.dataset?.apiUrl || `${window.location.origin}/chat`,
    title: script?.dataset?.title || "Senator Pub",
    greeting:
      script?.dataset?.greeting ||
      "Vitajte v Senator Pub! Ako vám môžeme pomôcť?",
    phone: "+421915914876",
    phoneDisplay: "0915 914 876",
    email: "senator.tvrdosin@gmail.com",
    address: "Trojičné námestie 189/7, Tvrdošín"
  };

  // Zabezpečíme, aby sa widget nenačítal dvakrát.
  if (document.getElementById("tb-care-button")) return;

  const style = document.createElement("style");

  style.textContent = `
    #tb-care-button,
    #tb-care-window {
      font-family: Arial, Helvetica, sans-serif;
      box-sizing: border-box;
    }

    #tb-care-window *,
    #tb-care-window *::before,
    #tb-care-window *::after {
      box-sizing: border-box;
    }

    #tb-care-button {
      position: fixed;
      right: 22px;
      bottom: 22px;
      width: 64px;
      height: 64px;
      border: 0;
      border-radius: 50%;
      background: #17110d;
      color: white;
      font-size: 27px;
      cursor: pointer;
      box-shadow: 0 8px 25px rgba(0,0,0,.25);
      z-index: 2147483646;
    }

    #tb-care-window {
      position: fixed;
      right: 22px;
      bottom: 98px;
      width: 390px;
      max-width: calc(100vw - 32px);
      height: 600px;
      max-height: calc(100dvh - 120px);
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 16px 55px rgba(0,0,0,.25);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 2147483646;
      color: #17110d;
    }

    #tb-care-header {
      background: #17110d;
      color: #fff;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    #tb-care-header-title {
      font-size: 18px;
      font-weight: 700;
    }

    #tb-care-header-subtitle {
      font-size: 12px;
      opacity: .75;
      margin-top: 5px;
    }

    #tb-care-close {
      border: 0;
      background: transparent;
      color: white;
      font-size: 28px;
      cursor: pointer;
      padding: 0 4px;
    }

    #tb-care-content {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      background: #f8f6f3;
    }

    .tb-care-page {
      display: none;
      height: 100%;
      overflow-y: auto;
      padding: 20px;
    }

    .tb-care-page.active {
      display: block;
    }

    .tb-care-card {
      background: white;
      border: 1px solid #ece7e1;
      border-radius: 16px;
      padding: 18px;
      margin-bottom: 14px;
    }

    .tb-care-card h3 {
      margin: 0 0 10px;
      font-size: 17px;
    }

    .tb-care-card p {
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 10px;
      color: #554e48;
    }

    .tb-care-card p:last-child {
      margin-bottom: 0;
    }

    .tb-care-primary {
      display: block;
      width: 100%;
      padding: 13px;
      border: 0;
      border-radius: 12px;
      background: #17110d;
      color: white;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
    }

    .tb-care-question {
      display: block;
      width: 100%;
      padding: 12px 14px;
      margin-top: 9px;
      border: 1px solid #e7e0d8;
      border-radius: 12px;
      background: #fff;
      color: #17110d;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
    }

    .tb-care-question:hover {
      background: #f3eee8;
    }

    #tb-care-chat {
      padding: 0;
      overflow: hidden;
    }

    #tb-care-chat.active {
      display: flex;
      flex-direction: column;
    }

    #tb-care-messages {
      flex: 1;
      min-height: 0;
      padding: 16px;
      overflow-y: auto;
    }

    .tb-care-message {
      padding: 11px 13px;
      margin-bottom: 12px;
      border-radius: 14px;
      max-width: 87%;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .tb-care-bot {
      background: white;
      border: 1px solid #e8e2db;
      margin-right: auto;
    }

    .tb-care-user {
      background: #17110d;
      color: white;
      margin-left: auto;
    }

    #tb-care-form {
      display: flex;
      gap: 8px;
      padding: 12px;
      background: white;
      border-top: 1px solid #eee;
      flex-shrink: 0;
    }

    #tb-care-input {
      flex: 1;
      min-width: 0;
      border: 1px solid #ddd;
      border-radius: 25px;
      padding: 11px 13px;
      font-size: 14px;
      outline: none;
    }

    #tb-care-send {
      border: 0;
      border-radius: 25px;
      background: #17110d;
      color: white;
      padding: 0 16px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    #tb-care-send:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    #tb-care-nav {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      background: #fff;
      border-top: 1px solid #eee;
      flex-shrink: 0;
    }

    .tb-care-tab {
      border: 0;
      background: white;
      padding: 11px 3px 12px;
      color: #777;
      font-size: 11px;
      cursor: pointer;
    }

    .tb-care-tab span {
      display: block;
      font-size: 21px;
      margin-bottom: 5px;
    }

    .tb-care-tab.active {
      color: #17110d;
      font-weight: 700;
      background: #f5f0ea;
    }

    .tb-care-info-row {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      font-size: 13px;
      line-height: 1.6;
    }

    .tb-care-info-row:last-child {
      border-bottom: 0;
    }

    .tb-care-info-row strong {
      display: block;
      margin-bottom: 3px;
    }

    #tb-care-window a {
      color: #76502d;
      overflow-wrap: anywhere;
    }
    /* TOPBOT CARE – JEDÁLNY LÍSTOK */

    .tb-menu-switcher {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 18px;
      padding: 5px;
      background: #eee8e1;
      border-radius: 14px;
    }

    .tb-menu-switch {
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: #665d54;
      padding: 12px 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .tb-menu-switch.active {
      background: #17110d;
      color: white;
      box-shadow: 0 3px 10px rgba(0,0,0,.12);
    }

    .tb-menu-category {
      background: white;
      border: 1px solid #ece7e1;
      border-radius: 13px;
      margin-bottom: 10px;
      overflow: hidden;
    }

    .tb-menu-category summary {
      padding: 16px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      list-style-position: inside;
    }

    .tb-menu-category[open] summary {
      border-bottom: 1px solid #eee;
      background: #faf8f5;
    }

    .tb-menu-item {
      padding: 13px 16px;
      border-bottom: 1px solid #f0ece7;
      font-size: 13px;
      line-height: 1.5;
    }

    .tb-menu-item:last-child {
      border-bottom: 0;
    }

    .tb-menu-item-name {
      display: block;
      font-size: 14px;
      margin-bottom: 3px;
    }

    .tb-menu-portion {
      display: inline-block;
      color: #777;
      margin-right: 10px;
    }

    .tb-menu-price {
      display: inline-block;
      color: #17110d;
      font-weight: 700;
    }

    .tb-menu-variant {
      margin-top: 5px;
      color: #554e48;
    }

    .tb-menu-allergens {
      display: block;
      color: #777;
      margin-top: 5px;
    }

    .tb-menu-note {
      display: block;
      padding: 8px 16px;
      margin: 0;
      color: #76502d;
      font-size: 12px;
      line-height: 1.5;
    }

    .tb-menu-footer {
      margin: 16px 0 8px;
      color: #777;
      font-size: 11px;
      line-height: 1.6;
      text-align: center;
    }
    @media (max-width: 480px) {
      #tb-care-button {
        right: 15px;
        bottom: 15px;
      }

      #tb-care-window {
        right: 8px;
        bottom: 88px;
        width: calc(100vw - 16px);
        max-width: none;
        height: min(650px, calc(100dvh - 104px));
        border-radius: 17px;
      }

      .tb-care-page {
        padding: 15px;
      }
    }
  `;

  document.head.appendChild(style);

  const button = document.createElement("button");
  button.id = "tb-care-button";
  button.type = "button";
  button.textContent = "💬";
  button.setAttribute("aria-label", "Otvoriť asistenta");
  button.setAttribute("aria-expanded", "false");

  const windowEl = document.createElement("div");
  windowEl.id = "tb-care-window";
  windowEl.setAttribute("role", "dialog");
  windowEl.setAttribute("aria-label", "Senator Pub asistent");

  windowEl.innerHTML = `
    <div id="tb-care-header">
      <div>
        <div id="tb-care-header-title"></div>
        <div id="tb-care-header-subtitle">Váš digitálny asistent</div>
      </div>
      <button id="tb-care-close" type="button" aria-label="Zavrieť">×</button>
    </div>

    <div id="tb-care-content">

      <section class="tb-care-page active" data-page="home">
        <div class="tb-care-card">
          <h3>👋 Vitajte v Senator Pub!</h3>
          <p>
            Radi vám pomôžeme s informáciami o našej
            reštaurácii, jedálnom lístku či otváracích hodinách.
          </p>
          <button class="tb-care-primary" type="button" data-go="chat">
            Opýtať sa asistenta →
          </button>
        </div>

        <div class="tb-care-card">
          <h3>💬 Časté otázky</h3>

          <button class="tb-care-question" type="button"
            data-question="Aké máte otváracie hodiny?">
            🕒 Aké máte otváracie hodiny?
          </button>

          <button class="tb-care-question" type="button"
            data-question="Do koľkej je otvorená kuchyňa?">
            🍽️ Do koľkej je otvorená kuchyňa?
          </button>

          <button class="tb-care-question" type="button"
            data-question="Je možné objednať jedlo na osobný odber?">
            🥡 Je možný osobný odber?
          </button>
        </div>
      </section>

      <section class="tb-care-page" id="tb-care-chat" data-page="chat">
        <div id="tb-care-messages" aria-live="polite"></div>

        <form id="tb-care-form">
          <input
            id="tb-care-input"
            type="text"
            placeholder="Napíšte otázku..."
            autocomplete="off"
            maxlength="1000"
            aria-label="Vaša otázka"
          />
          <button id="tb-care-send" type="submit">Poslať</button>
        </form>
      </section>

      <section class="tb-care-page" data-page="menu">
        <div class="tb-care-card">
          <h3>📖 Jedálny lístok</h3>
          <p>
            Prezrite si našu stálu ponuku jedál.
          </p>
          <p>
            Jedálny lístok sem čoskoro doplníme.
          </p>
        </div>

        <div class="tb-care-card">
          <h3>Potrebujete poradiť?</h3>
          <p>
            Náš AI asistent vám pomôže s otázkami
            o jedlách a ponuke reštaurácie.
          </p>
          <button class="tb-care-primary" type="button" data-go="chat">
            Spýtať sa na jedlo →
          </button>
        </div>
      </section>

      <section class="tb-care-page" data-page="info">
        <div class="tb-care-card">
          <h3>📍 Kontakt</h3>

          <div class="tb-care-info-row">
            <strong>Adresa</strong>
            Trojičné námestie 189/7<br>
            027 44 Tvrdošín
          </div>

          <div class="tb-care-info-row">
            <strong>Telefón</strong>
            <a href="tel:+421915914876">0915 914 876</a>
          </div>

          <div class="tb-care-info-row">
            <strong>E-mail</strong>
            <a href="mailto:senator.tvrdosin@gmail.com">
              senator.tvrdosin@gmail.com
            </a>
          </div>
        </div>

        <div class="tb-care-card">
          <h3>🕒 Otváracie hodiny</h3>

          <div class="tb-care-info-row">
            <strong>Pondelok</strong>
            Zatvorené
          </div>

          <div class="tb-care-info-row">
            <strong>Utorok – štvrtok</strong>
            9:00 – 21:00<br>
            Kuchyňa: 10:00 – 20:00
          </div>

          <div class="tb-care-info-row">
            <strong>Piatok</strong>
            9:00 – 24:00<br>
            Kuchyňa: 10:00 – 22:00
          </div>

          <div class="tb-care-info-row">
            <strong>Sobota</strong>
            11:00 – 24:00<br>
            Kuchyňa: 11:00 – 22:00
          </div>

          <div class="tb-care-info-row">
            <strong>Nedeľa</strong>
            11:00 – 20:00<br>
            Kuchyňa: 11:00 – 20:00
          </div>
        </div>
      </section>

    </div>

    <nav id="tb-care-nav" aria-label="Navigácia asistenta">
      <button class="tb-care-tab active" type="button" data-tab="home">
        <span>🏠</span>Domov
      </button>

      <button class="tb-care-tab" type="button" data-tab="chat">
        <span>💬</span>Chat
      </button>

      <button class="tb-care-tab" type="button" data-tab="menu">
        <span>📖</span>Jedálny lístok
      </button>

      <button class="tb-care-tab" type="button" data-tab="info">
        <span>ℹ️</span>Info
      </button>
    </nav>
  `;

  document.body.appendChild(button);
  document.body.appendChild(windowEl);

  windowEl.querySelector("#tb-care-header-title").textContent = config.title;
  // TOPBOT CARE – JEDÁLNY A NÁPOJOVÝ LÍSTOK

  const menuPage = windowEl.querySelector('[data-page="menu"]');

  const menuContainer = document.createElement("div");
  menuContainer.id = "tb-care-menu-container";

  menuPage.replaceChildren(menuContainer);

  function formatPrice(price) {
    return Number(price).toFixed(2).replace(".", ",") + " €";
  }

  function createMenuElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  async function loadMenu() {
    menuContainer.textContent = "Načítavam jedálny lístok...";

    try {
      const menuUrl = new URL(
        "menu.json",
        new URL(script.src).href
      );

      const response = await fetch(menuUrl);

      if (!response.ok) {
        throw new Error("Nepodarilo sa načítať menu.");
      }

      const menuData = await response.json();

      menuContainer.replaceChildren();

      const switcher = createMenuElement("div", "tb-menu-switcher");

      const foodButton = createMenuElement(
        "button",
        "tb-menu-switch active",
        "🍽️ Jedlá"
      );

      const drinkButton = createMenuElement(
        "button",
        "tb-menu-switch",
        "🥤 Nápoje"
      );

      foodButton.type = "button";
      drinkButton.type = "button";

      switcher.append(foodButton, drinkButton);
      menuContainer.appendChild(switcher);

      const categoryContainer = createMenuElement(
        "div",
        "tb-menu-categories"
      );

      menuContainer.appendChild(categoryContainer);

      function renderCategories(type) {
        categoryContainer.replaceChildren();

        foodButton.classList.toggle("active", type === "food");
        drinkButton.classList.toggle("active", type === "drink");

        const categories = menuData.categories.filter(
          category => category.type === type
        );

        categories.forEach(category => {
          const details = createMenuElement("details", "tb-menu-category");

          const summary = createMenuElement(
            "summary",
            "",
            category.name
          );

          details.appendChild(summary);

          if (category.note) {
            details.appendChild(
              createMenuElement("p", "tb-menu-note", category.note)
            );
          }

          category.items.forEach(item => {
            const row = createMenuElement("div", "tb-menu-item");

            const name = createMenuElement(
              "strong",
              "tb-menu-item-name",
              item.name
            );

            row.appendChild(name);

            if (item.portion) {
              row.appendChild(
                createMenuElement("span", "tb-menu-portion", item.portion)
              );
            }

            if (item.price !== undefined) {
              row.appendChild(
                createMenuElement(
                  "span",
                  "tb-menu-price",
                  formatPrice(item.price)
                )
              );
            }

            if (item.variants) {
              item.variants.forEach(variant => {
                row.appendChild(
                  createMenuElement(
                    "div",
                    "tb-menu-variant",
                    variant.portion + " – " + formatPrice(variant.price)
                  )
                );
              });
            }

            if (item.allergens?.length) {
              row.appendChild(
                createMenuElement(
                  "small",
                  "tb-menu-allergens",
                  "Alergény: " + item.allergens.join(", ")
                )
              );
            }

            if (item.note) {
              row.appendChild(
                createMenuElement("small", "tb-menu-note", item.note)
              );
            }

            details.appendChild(row);
          });

          categoryContainer.appendChild(details);
        });
      }

      foodButton.addEventListener("click", () => {
        renderCategories("food");
      });

      drinkButton.addEventListener("click", () => {
        renderCategories("drink");
      });

      renderCategories("food");

      const footer = createMenuElement("div", "tb-menu-footer");

      footer.textContent =
        "Ceny sú vrátane DPH. Dostupnosť jedál a informácie " +
        "o alergénoch si, prosím, overte s obsluhou.";

      menuContainer.appendChild(footer);

    } catch (error) {
      menuContainer.textContent =
        "Jedálny lístok sa momentálne nepodarilo načítať.";
    }
  }

  loadMenu();
  const closeButton = windowEl.querySelector("#tb-care-close");
  const messages = windowEl.querySelector("#tb-care-messages");
  const form = windowEl.querySelector("#tb-care-form");
  const input = windowEl.querySelector("#tb-care-input");
  const send = windowEl.querySelector("#tb-care-send");

  let isSending = false;

  function addMessage(text, type) {
    const message = document.createElement("div");

    message.className =
      "tb-care-message " +
      (type === "user" ? "tb-care-user" : "tb-care-bot");

    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;

    return message;
  }

  addMessage(config.greeting, "bot");

  function openTab(name) {
    windowEl.querySelectorAll(".tb-care-page").forEach((page) => {
      page.classList.toggle("active", page.dataset.page === name);
    });

    windowEl.querySelectorAll(".tb-care-tab").forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("active", active);

      if (active) {
        tab.setAttribute("aria-current", "page");
      } else {
        tab.removeAttribute("aria-current");
      }
    });

    if (name === "chat") {
      setTimeout(() => input.focus(), 50);
    }
  }

  function setOpen(open) {
    windowEl.style.display = open ? "flex" : "none";
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "×" : "💬";
    button.setAttribute(
      "aria-label",
      open ? "Zavrieť asistenta" : "Otvoriť asistenta"
    );
  }

  button.addEventListener("click", () => {
    setOpen(windowEl.style.display !== "flex");
  });

  closeButton.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && windowEl.style.display === "flex") {
      setOpen(false);
      button.focus();
    }
  });

  windowEl.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.addEventListener("click", () => openTab(tab.dataset.tab));
  });

  windowEl.querySelectorAll("[data-go]").forEach((element) => {
    element.addEventListener("click", () => openTab(element.dataset.go));
  });

  windowEl.querySelectorAll("[data-question]").forEach((element) => {
    element.addEventListener("click", () => {
      openTab("chat");
      input.value = element.dataset.question;
      input.focus();
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text || isSending) return;

    isSending = true;
    send.disabled = true;

    addMessage(text, "user");
    input.value = "";

    const loadingMessage = addMessage("Píšem odpoveď...", "bot");

    try {
      const response = await fetch(config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text
        })
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const data = await response.json();

      loadingMessage.textContent =
        data.answer ||
        data.error ||
        "Nepodarilo sa získať odpoveď.";

    } catch (error) {
      loadingMessage.textContent =
        "Prepáčte, momentálne sa nepodarilo odpovedať. " +
        "Kontaktujte nás na čísle 0915 914 876.";

    } finally {
      isSending = false;
      send.disabled = false;
      messages.scrollTop = messages.scrollHeight;
    }
  });
})();
