/* ==========================================================================
   Clear Path Snow Co. — fills printable pages from ../config.js
   ========================================================================== */

(function () {
  const seasonAddon = (key) => PRICES.addon[key] * PRICES.stormsPerSeason;

  const text = {
    owner: CONFIG.ownerName,
    "owner-full": CONFIG.ownerFullName,
    phone: CONFIG.phone,
    email: CONFIG.email,
    "season-start": CONFIG.seasonStart,
    "season-end": CONFIG.seasonEnd,
    "early-bird": CONFIG.earlyBirdDeadline,
    spots: CONFIG.seasonSpotsTotal,
  };
  for (const [key, value] of Object.entries(text)) {
    document.querySelectorAll(`[data-${key}]`).forEach((el) => { el.textContent = value; });
  }

  // data-price="season.small" → $300, data-price="earlyBirdDiscount" → $25
  document.querySelectorAll("[data-price]").forEach((el) => {
    const value = el.dataset.price.split(".").reduce((o, k) => o[k], PRICES);
    el.textContent = `$${value}`;
  });

  // data-season-addon="walk" → the add-on's per-visit price over a full season
  document.querySelectorAll("[data-season-addon]").forEach((el) => {
    el.textContent = `$${seasonAddon(el.dataset.seasonAddon)}`;
  });

  // QR code to the website, only once a site URL is set in config.js
  const qr = document.getElementById("qr");
  if (qr && CONFIG.siteUrl && typeof qrcode === "function") {
    const code = qrcode(0, "M");
    code.addData(CONFIG.siteUrl);
    code.make();
    qr.querySelector(".qr-code").innerHTML = code.createSvgTag({ scalable: true, margin: 0 });
    qr.querySelector(".qr-url").textContent = CONFIG.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
    qr.hidden = false;
  }

  document.querySelectorAll("[data-print]").forEach((btn) =>
    btn.addEventListener("click", () => window.print())
  );
})();
