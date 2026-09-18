/* ============================================================
   North Scape Services — main.js
   Interactive + 3D: Three.js leaf-swirl hero, tilt cards,
   scroll parallax, magnetic buttons, counters, ambient audio-ready.
   ============================================================ */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     NAV — scrolled state + mobile toggle
     ========================================================= */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navLinks  = $('.nav-links');

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

  /* =========================================================
     REVEAL on scroll
     ========================================================= */
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

  /* =========================================================
     3D INTERACTIVE HERO — Three.js
     - Instanced autumn leaves swirling in 3D
     - Grass-blade field on ground plane
     - Mouse parallax + scroll-driven camera
     - Center 3D logo card that reacts to pointer
     ========================================================= */
  const canvas = document.getElementById('three-canvas');
  const heroSection = document.querySelector('.hero');
  let renderer, scene, camera, clock, leafGroup, grassGroup, logoDisk;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const scrollProgress = { v: 0 };

  function init3D () {
    if (!canvas || !window.THREE) return;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e100e, 0.045);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.6, 8);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0x9dffb7, 1.15);
    key.position.set(4, 6, 5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x23c552, 0.85);
    rim.position.set(-6, 3, -4);
    scene.add(rim);

    const warm = new THREE.PointLight(0xffb066, 1.4, 30);
    warm.position.set(-3, 2, 4);
    scene.add(warm);

    /* ---- Ground plane with subtle grid glow ---- */
    const groundGeo = new THREE.PlaneGeometry(80, 80, 1, 1);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x121812,
      roughness: 0.95,
      metalness: 0,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.2;
    scene.add(ground);

    /* ---- Grass blade field ---- */
    grassGroup = new THREE.Group();
    const bladeGeom = new THREE.ConeGeometry(0.06, 0.55, 4);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x23c552, roughness: 0.7, metalness: 0.1,
      emissive: 0x0f7a37, emissiveIntensity: 0.15,
    });
    const bladeInstances = 380;
    const grass = new THREE.InstancedMesh(bladeGeom, bladeMat, bladeInstances);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < bladeInstances; i++) {
      const r = 3 + Math.random() * 18;
      const t = Math.random() * Math.PI * 2;
      dummy.position.set(Math.cos(t) * r, -2.1 + Math.random() * 0.05, Math.sin(t) * r);
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.4,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.35
      );
      const s = 0.7 + Math.random() * 1.6;
      dummy.scale.set(s * 0.9, s, s * 0.9);
      dummy.updateMatrix();
      grass.setMatrixAt(i, dummy.matrix);
    }
    grassGroup.add(grass);
    scene.add(grassGroup);

    /* ---- Autumn LEAVES (instanced) ---- */
    leafGroup = new THREE.Group();
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, -0.5);
    leafShape.bezierCurveTo(0.55, -0.15, 0.55, 0.35, 0, 0.6);
    leafShape.bezierCurveTo(-0.55, 0.35, -0.55, -0.15, 0, -0.5);
    const leafGeom = new THREE.ExtrudeGeometry(leafShape, {
      steps: 1, depth: 0.02, bevelEnabled: true, bevelThickness: 0.02,
      bevelSize: 0.02, bevelSegments: 2
    });
    leafGeom.center();
    leafGeom.scale(0.7, 0.7, 0.7);

    const palette = [0xc25e2a, 0xe5a54b, 0xd6873a, 0x8a6b2a, 0x23c552, 0x3f8b45];
    const leafCount = 90;
    const leafData = [];
    for (let i = 0; i < leafCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        roughness: 0.6,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });
      const m = new THREE.Mesh(leafGeom, mat);
      const r = 2 + Math.random() * 9;
      const a = Math.random() * Math.PI * 2;
      m.position.set(Math.cos(a) * r, 4 + Math.random() * 8, Math.sin(a) * r - 2);
      m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.6 + Math.random() * 0.8;
      m.scale.setScalar(s);
      leafGroup.add(m);
      leafData.push({
        mesh: m,
        base: m.position.clone(),
        speed: 0.15 + Math.random() * 0.35,
        wob: Math.random() * Math.PI * 2,
        spin: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.03,
          z: (Math.random() - 0.5) * 0.02,
        },
        drift: (Math.random() - 0.5) * 0.6,
      });
    }
    scene.add(leafGroup);

    /* ---- Central 3D "logo disk" (green ring + shield) ---- */
    logoDisk = new THREE.Group();
    logoDisk.position.set(0, 1.4, 1.4);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.045, 24, 128),
      new THREE.MeshStandardMaterial({
        color: 0x23c552, roughness: 0.35, metalness: 0.6,
        emissive: 0x117a35, emissiveIntensity: 0.55,
      })
    );
    ring.rotation.x = Math.PI / 2.3;
    logoDisk.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.012, 12, 128),
      new THREE.MeshStandardMaterial({
        color: 0x23c552, transparent: true, opacity: 0.6,
        emissive: 0x117a35, emissiveIntensity: 0.7,
      })
    );
    ring2.rotation.x = Math.PI / 2.3;
    logoDisk.add(ring2);

    // Shield-ish plate in center
    const shield = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, 0.06, 6),
      new THREE.MeshStandardMaterial({
        color: 0x1a1c1a, roughness: 0.35, metalness: 0.7,
        emissive: 0x0a0b0a, emissiveIntensity: 0.4,
      })
    );
    shield.rotation.x = Math.PI / 2;
    logoDisk.add(shield);

    // "N" mark using a simple extrusion
    const nShape = new THREE.Shape();
    nShape.moveTo(-0.42, -0.55);
    nShape.lineTo(-0.42, 0.55);
    nShape.lineTo(-0.2, 0.55);
    nShape.lineTo(0.2, -0.1);
    nShape.lineTo(0.2, 0.55);
    nShape.lineTo(0.42, 0.55);
    nShape.lineTo(0.42, -0.55);
    nShape.lineTo(0.2, -0.55);
    nShape.lineTo(-0.2, 0.1);
    nShape.lineTo(-0.2, -0.55);
    nShape.closePath();
    const nGeom = new THREE.ExtrudeGeometry(nShape, {
      depth: 0.12, bevelEnabled: true, bevelThickness: 0.03,
      bevelSize: 0.03, bevelSegments: 2
    });
    nGeom.center();
    const nMat = new THREE.MeshStandardMaterial({
      color: 0x23c552, roughness: 0.35, metalness: 0.5,
      emissive: 0x117a35, emissiveIntensity: 0.7,
    });
    const nMesh = new THREE.Mesh(nGeom, nMat);
    nMesh.position.z = 0.06;
    logoDisk.add(nMesh);

    scene.add(logoDisk);

    // Store leaves for animation loop
    scene.userData.leafData = leafData;

    clock = new THREE.Clock();
    animate();
  }

  function animate () {
    if (!renderer) return;
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth pointer
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    // Camera parallax + scroll
    const scrollY = window.scrollY;
    const heroH = heroSection ? heroSection.offsetHeight : window.innerHeight;
    scrollProgress.v = Math.min(1, scrollY / heroH);

    camera.position.x = pointer.x * 1.4;
    camera.position.y = 1.6 + pointer.y * 0.6 - scrollProgress.v * 1.2;
    camera.position.z = 8 - scrollProgress.v * 3;
    camera.lookAt(0, 1.2 - scrollProgress.v * 0.8, 0);

    // Logo disk spin + wobble
    if (logoDisk) {
      logoDisk.rotation.y = t * 0.35 + pointer.x * 0.6;
      logoDisk.rotation.x = Math.sin(t * 0.6) * 0.06 + pointer.y * 0.3;
      logoDisk.position.y = 1.4 + Math.sin(t * 1.1) * 0.12;
    }

    // Leaves
    const leafData = scene.userData.leafData || [];
    for (let i = 0; i < leafData.length; i++) {
      const L = leafData[i];
      const m = L.mesh;
      m.position.y = L.base.y - ((t * L.speed) % 12);
      if (m.position.y < -2) {
        L.base.y += 12;
      }
      m.position.x = L.base.x + Math.sin(t * 0.6 + L.wob) * (0.8 + L.drift);
      m.position.z = L.base.z + Math.cos(t * 0.5 + L.wob) * (0.8 + L.drift);
      m.rotation.x += L.spin.x;
      m.rotation.y += L.spin.y;
      m.rotation.z += L.spin.z;
    }

    // Grass sway
    if (grassGroup) {
      grassGroup.rotation.z = Math.sin(t * 0.6) * 0.008;
    }

    renderer.render(scene, camera);
  }

  function onResize () {
    if (!renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  window.addEventListener('mousemove', (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      pointer.tx = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.touches[0].clientY / window.innerHeight) * 2 - 1);
    }
  }, { passive: true });
  window.addEventListener('resize', onResize);

  // Try init after THREE loads
  function boot3D () {
    if (prefersReduced) return;
    if (window.THREE) init3D();
    else setTimeout(boot3D, 60);
  }
  boot3D();

  /* =========================================================
     TILT — cards react to pointer (3D transform)
     ========================================================= */
  const tiltEls = $$('[data-tilt], .service-card, .price-card, .business-card, .fall-card, .hero-logo-wrap');
  tiltEls.forEach(el => {
    let raf = null;
    let rectCache = null;
    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';

    const enter = () => { rectCache = el.getBoundingClientRect(); };
    const move = (e) => {
      if (!rectCache) rectCache = el.getBoundingClientRect();
      const x = (e.clientX - rectCache.left) / rectCache.width;
      const y = (e.clientY - rectCache.top) / rectCache.height;
      const rx = (0.5 - y) * 10;
      const ry = (x - 0.5) * 14;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const baseTransform = el.dataset.baseTransform || '';
        el.style.transform =
          `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px) ${baseTransform}`;
      });
    };
    const leave = () => {
      if (raf) cancelAnimationFrame(raf);
      rectCache = null;
      el.style.transform = '';
    };
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
  });

  /* =========================================================
     MAGNETIC BUTTONS
     ========================================================= */
  $$('.btn').forEach(btn => {
    let rect = null;
    btn.addEventListener('mouseenter', () => { rect = btn.getBoundingClientRect(); });
    btn.addEventListener('mousemove', (e) => {
      if (!rect) rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      rect = null;
      btn.style.transform = '';
    });
  });

  /* =========================================================
     Number counters
     ========================================================= */
  const counters = $$('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const to = parseFloat(el.dataset.count);
      const dur = 1200;
      const start = performance.now();
      const from = 0;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = from + (to - from) * eased;
        el.textContent = Number.isInteger(to) ? Math.round(val) : val.toFixed(1);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterIO.observe(c));

  /* =========================================================
     Contact form → mailto stub
     ========================================================= */
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
        note.style.color = '#e5a54b';
        return;
      }
      const address = (data.get('address') || '').toString().trim();
      const email   = (data.get('email') || '').toString().trim();
      const notes   = (data.get('notes') || '').toString().trim();

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
      const mailto = `mailto:servicesnorthscape@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;

      note.style.color = '#23c552';
      note.textContent = 'Thanks — opening your email so you can send this to Chance…';
      window.setTimeout(() => { window.location.href = mailto; }, 350);
      form.reset();
    });
  }


  /* =========================================================
     REVIEWS — star picker, submit, local persistence
     ========================================================= */
  const starPicker = document.querySelector('.star-picker');
  const starCaption = document.getElementById('starCaption');
  const reviewsGrid = document.getElementById('reviewsGrid');
  const reviewForm = document.getElementById('reviewForm');
  const reviewNote = document.getElementById('reviewNote');
  let starValue = 0;

  const captions = {
    0: 'Tap to rate',
    1: 'Rough — 1/5',
    2: 'Okay — 2/5',
    3: 'Good — 3/5',
    4: 'Great — 4/5',
    5: 'Excellent — 5/5',
  };

  function paintStars (val) {
    if (!starPicker) return;
    starPicker.querySelectorAll('.star').forEach(s => {
      const v = Number(s.dataset.value);
      s.classList.toggle('active', v <= val);
      s.setAttribute('aria-checked', String(v === val));
    });
  }

  if (starPicker) {
    const stars = starPicker.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('mouseenter', () => {
        const v = Number(star.dataset.value);
        stars.forEach(s => s.classList.toggle('hovered', Number(s.dataset.value) <= v));
        starCaption.textContent = captions[v];
      });
      star.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hovered'));
        starCaption.textContent = captions[starValue] || captions[0];
      });
      star.addEventListener('click', () => {
        starValue = Number(star.dataset.value);
        starPicker.classList.add('picked');
        starCaption.textContent = captions[starValue];
        paintStars(starValue);
      });
      star.addEventListener('keydown', (e) => {
        const cur = Number(star.dataset.value);
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          const next = Math.min(5, cur + 1);
          starPicker.querySelector(`.star[data-value="${next}"]`).focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          const prev = Math.max(1, cur - 1);
          starPicker.querySelector(`.star[data-value="${prev}"]`).focus();
        } else if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          star.click();
        }
      });
    });
  }

  function makeAvatar (name) {
    return (name || '?').trim().charAt(0).toUpperCase() || '?';
  }

  function escapeHTML (str) {
    return String(str).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function renderReview (review, prepend) {
    if (!reviewsGrid) return;
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const card = document.createElement('article');
    card.className = 'review-card you';
    card.innerHTML = `
      <span class="you-flag">Your review</span>
      <div class="review-stars" aria-label="${review.rating} out of 5 stars">
        ${stars.split('').map(c => `<span>${c === '★' ? '★' : '☆'}</span>`).join('')}
      </div>
      <p class="review-quote">${escapeHTML(review.text)}</p>
      <footer class="review-meta">
        <div class="review-avatar" aria-hidden="true">${escapeHTML(makeAvatar(review.name))}</div>
        <div>
          <p class="review-name">${escapeHTML(review.name)}</p>
          <p class="review-loc">${escapeHTML(review.service || 'Service')}${review.town ? ' · ' + escapeHTML(review.town) : ''}</p>
        </div>
      </footer>
    `;
    if (prepend) reviewsGrid.prepend(card);
    else reviewsGrid.appendChild(card);
  }

  // Load previously-submitted reviews from this browser
  try {
    const saved = JSON.parse(localStorage.getItem('northscape_reviews') || '[]');
    saved.forEach(r => renderReview(r, true));
  } catch (_) { /* ignore */ }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rvName').value.trim();
      const service = document.getElementById('rvService').value.trim();
      const town = document.getElementById('rvTown').value.trim();
      const text = document.getElementById('rvText').value.trim();

      if (!starValue) {
        reviewNote.style.color = '#e5a54b';
        reviewNote.textContent = 'Pick a star rating first.';
        return;
      }
      if (!name || !service || !text) {
        reviewNote.style.color = '#e5a54b';
        reviewNote.textContent = 'Add your name, service, and review before sending.';
        return;
      }

      const review = { rating: starValue, name, service, town, text, ts: Date.now() };

      // Persist for this browser
      try {
        const saved = JSON.parse(localStorage.getItem('northscape_reviews') || '[]');
        saved.unshift(review);
        localStorage.setItem('northscape_reviews', JSON.stringify(saved.slice(0, 5)));
      } catch (_) { /* ignore */ }

      // Show it right away
      renderReview(review, true);

      // Email Chance a copy so he can approve/add to the site
      const subj = `New review — ${starValue}★ — ${name}`;
      const body = [
        `Name: ${name}`,
        `Rating: ${starValue} / 5`,
        `Service: ${service}`,
        town ? `Town: ${town}` : null,
        '',
        'Review:',
        text,
        '',
        '— Sent from the North Scape Services site',
      ].filter(Boolean).join('\n');
      const mailto = `mailto:servicesnorthscape@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;

      reviewNote.style.color = '#23c552';
      reviewNote.textContent = 'Thanks! Your review is posted here and an email is opening so you can send Chance a copy.';
      window.setTimeout(() => { window.location.href = mailto; }, 600);

      // Reset picker & form
      reviewForm.reset();
      starValue = 0;
      paintStars(0);
      starPicker.classList.remove('picked');
      starCaption.textContent = captions[0];
    });
  }

  /* =========================================================
     Footer year
     ========================================================= */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     Smooth focus after in-page nav
     ========================================================= */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    window.setTimeout(() => {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }, 500);
  });

  /* =========================================================
     Loader dismiss
     ========================================================= */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (loader) {
      loader.classList.add('done');
      setTimeout(() => loader.remove(), 900);
    }
  });
})();
