/* ============================================================
   North Scape Services — main.js
   ============================================================ */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Nav: scrolled state + mobile toggle ---------- */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navLinks = $('.nav-links');

  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 0.05 + 's';
    io.observe(el);
  });

  /* ---------- Falling leaves on hero ---------- */
  const leavesRoot = $('#leaves');
  if (leavesRoot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const leafColors = ['#c25e2a', '#e5a54b', '#8a6b2a', '#23c552', '#4a8259'];
    const leafSVG = (fill) => `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="${fill}"
              d="M12 2 C7 6 4 10 4 15 C4 19 7 22 12 22 C17 22 20 19 20 15 C20 10 17 6 12 2 Z" />
        <path stroke="rgba(0,0,0,0.35)" stroke-width="0.8" fill="none"
              d="M12 3 L12 21 M12 8 L8 12 M12 8 L16 12 M12 14 L9 17 M12 14 L15 17" />
      </svg>`;
    const count = 22;
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      const color = leafColors[Math.floor(Math.random() * leafColors.length)];
      leaf.innerHTML = leafSVG(color);
      const size = 14 + Math.random() * 20;
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.width = size + 'px';
      leaf.style.height = size + 'px';
      leaf.style.animationDuration = 9 + Math.random() * 12 + 's';
      leaf.style.animationDelay = -Math.random() * 12 + 's';
      leaf.style.setProperty('--drift', (Math.random() * 240 - 120) + 'px');
      leaf.style.opacity = 0.35 + Math.random() * 0.35;
      leavesRoot.appendChild(leaf);
    }
  }

  /* ---------- Contact form (client-only friendly stub) ---------- */
  const form = $('#quoteForm');
  const note = $('#formNote');
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const service = (data.get('service') || '').toString().trim();
      if (!name || !phone || !service) {
        note.textContent = 'Please fill in your name, phone, and the service you need.';
        note.style.color = '#e58a3d';
        return;
      }
      const address = (data.get('address') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const notes = (data.get('notes') || '').toString().trim();

      // Open a pre-filled email to Chance
      const subj = `Quote request — ${service} — ${name}`;
      const body = [
        `Name: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : null,
        address ? `Address: ${address}` : null,
        `Service: ${service}`,
        notes ? `\nNotes:\n${notes}` : null,
        `\n— Sent from northscapeservices site`
      ].filter(Boolean).join('\n');
      const mailto = `mailto:servicenorthscape@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;

      note.style.color = '#23c552';
      note.textContent = 'Thanks — opening your email so you can send this to Chance…';
      window.setTimeout(() => { window.location.href = mailto; }, 350);
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth focus after in-page nav ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    // let the browser scroll, then focus for accessibility
    window.setTimeout(() => {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }, 500);
  });
})();
