/* ==========================================================================
   Clear Path Snow Co. — site behavior
   Business info and prices live in config.js.
   ========================================================================== */

/* ---- Fill in contact details ------------------------------------------ */
const digits = CONFIG.phone.replace(/\D/g, "");
document.querySelectorAll("[data-phone]").forEach((a) => {
  a.textContent = CONFIG.phone;
  a.href = `sms:+1${digits}`;
});
document.querySelectorAll("[data-email]").forEach((a) => {
  a.textContent = CONFIG.email;
  a.href = `mailto:${CONFIG.email}`;
});
document.querySelectorAll("[data-owner]").forEach((el) => {
  el.textContent = CONFIG.ownerName;
});
document.getElementById("year").textContent = new Date().getFullYear();

/* ---- Season spots meter ------------------------------------------------ */
const left = Math.max(0, CONFIG.seasonSpotsTotal - CONFIG.seasonSpotsTaken);
document.getElementById("spotsLeft").textContent = left;
document.getElementById("spotsTotal").textContent = CONFIG.seasonSpotsTotal;
requestAnimationFrame(() => {
  const pct = (CONFIG.seasonSpotsTaken / CONFIG.seasonSpotsTotal) * 100;
  document.getElementById("spotsFill").style.width = `${Math.max(4, pct)}%`;
});

/* ---- Mobile nav -------------------------------------------------------- */
const nav = document.getElementById("nav");
const toggle = document.getElementById("navToggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav-links a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

/* ---- Estimator --------------------------------------------------------- */
const est = document.getElementById("estimator");
let lastEstimate = "";

function updateEstimate() {
  const size = est.querySelector('input[name="size"]:checked').value;
  const plan = est.querySelector('input[name="plan"]:checked').value;
  const addons = [...est.querySelectorAll('input[name="addon"]:checked')].map((i) => i.value);
  const perVisitAddons = addons.reduce((sum, a) => sum + PRICES.addon[a], 0);

  let price, label, note;
  if (plan === "season") {
    price = PRICES.season[size] + perVisitAddons * PRICES.stormsPerSeason;
    label = "Estimated season total";
    note = `Nov 15 – Apr 1, every storm of 2"+. About $${Math.round(price / PRICES.stormsPerSeason)} per storm over a typical season.`;
  } else {
    price = PRICES.storm[size] + perVisitAddons;
    label = "Estimated per storm";
    note = `Based on a typical Auburn storm under 8". Storms over 12" are +50%.`;
  }
  const plus = size === "large" ? "+" : "";
  document.getElementById("estimateLabel").textContent = label;
  document.getElementById("estimatePrice").textContent = `$${price}${plus}`;
  document.getElementById("estimateNote").textContent = note;

  const sizeName = { small: "1-car", medium: "2-car", large: "large/long" }[size];
  lastEstimate = `Estimate: ${sizeName} driveway, ${plan === "season" ? "season plan" : "per storm"}` +
    (addons.length ? ` + ${addons.join(", ")}` : "") + ` = $${price}${plus}`;
}
est.addEventListener("change", updateEstimate);
updateEstimate();

document.getElementById("estimateCta").addEventListener("click", () => {
  const notes = document.querySelector('#contactForm [name="notes"]');
  if (!notes.value.includes("Estimate:")) {
    notes.value = (notes.value ? notes.value + "\n" : "") + lastEstimate;
  }
  const plan = est.querySelector('input[name="plan"]:checked').value;
  document.querySelector('#contactForm [name="interest"]').value =
    plan === "season" ? "Season plan" : "Per-storm service";
});

/* ---- Contact form → prefilled email ------------------------------------ */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const subject = `Snow removal request: ${f.get("name")} (${f.get("interest")})`;
  const body = [
    `Name: ${f.get("name")}`,
    `Phone: ${f.get("phone")}`,
    `Address: ${f.get("address")}`,
    `Interested in: ${f.get("interest")}`,
    "",
    f.get("notes") || "",
  ].join("\n");
  window.location.href =
    `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.getElementById("formStatus").textContent =
    `Your email app should open with the request filled in. If it doesn't, text ${CONFIG.phone}.`;
});

/* ---- Snowfall ---------------------------------------------------------- */
(function snow() {
  const canvas = document.getElementById("snow");
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, flakes;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(160, (w * h) / 9000));
    flakes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.6,
      s: Math.random() * 0.8 + 0.35,
      d: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(234, 246, 255, 0.85)";
    for (const f of flakes) {
      ctx.globalAlpha = 0.35 + f.r / 4;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function step() {
    for (const f of flakes) {
      f.d += 0.01;
      f.y += f.s + f.r * 0.15;
      f.x += Math.sin(f.d) * 0.35;
      if (f.y > h + 4) { f.y = -4; f.x = Math.random() * w; }
      if (f.x > w + 4) f.x = -4;
      if (f.x < -4) f.x = w + 4;
    }
    draw();
    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener("resize", resize);
  if (reduce) draw(); else step();
})();
