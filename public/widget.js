(function () {
  "use strict";

  const oldScript = document.currentScript;

  const careScript = document.createElement("script");

  careScript.src = new URL("widget-care.js", oldScript.src).href;

  careScript.dataset.apiUrl =
    oldScript.dataset.apiUrl ||
    new URL("/chat", oldScript.src).href;

  careScript.dataset.title = "Senator Pub";

  careScript.dataset.greeting =
    oldScript.dataset.greeting ||
    "Vitajte v Senator Pub! Ako vám môžeme pomôcť?";

  document.head.appendChild(careScript);
})();
