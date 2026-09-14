/* ------------------------------------------------------------------
   MW.P1CS — main.js
   Three.js 3D backdrop + interactive site logic
------------------------------------------------------------------- */

(() => {
  // ------------------------------------------------------------------
  // LOADER
  // ------------------------------------------------------------------
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 800);
  });

  // ------------------------------------------------------------------
  // YEAR
  // ------------------------------------------------------------------
  document.getElementById('year').textContent = new Date().getFullYear();

  // ------------------------------------------------------------------
  // CUSTOM CURSOR
  // ------------------------------------------------------------------
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('[data-hover], a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  // ------------------------------------------------------------------
  // NAV toggle (mobile) + active section
  // ------------------------------------------------------------------
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', () => nav.classList.toggle('open'));

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  const sections = document.querySelectorAll('.section');
  const setActiveLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        const id = sec.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });

  // ------------------------------------------------------------------
  // GALLERY — generated cards with SVG "photos" (abstract, brand-safe)
  // ------------------------------------------------------------------
  const gallery = document.getElementById('gallery');

  const items = [
    { title: 'Friday Night Lights', tag: 'Sports',    size: 'wide', theme: 'football' },
    { title: 'Court Vision',        tag: 'Sports',    size: 'tall', theme: 'basketball' },
    { title: 'Center Ice',          tag: 'Sports',    size: 'sq',   theme: 'hockey' },
    { title: 'Golden Hour Kickoff', tag: 'Sports',    size: 'med',  theme: 'soccer' },
    { title: 'Prom Night',          tag: 'Events',    size: 'med',  theme: 'events' },
    { title: 'Spring Showcase',     tag: 'Schools',   size: 'sq',   theme: 'school' },
    { title: 'Senior Series',       tag: 'Portraits', size: 'tall', theme: 'portrait' },
    { title: 'Championship Frame',  tag: 'Sports',    size: 'wide', theme: 'trophy' },
    { title: 'Homecoming',          tag: 'Events',    size: 'sq',   theme: 'events' },
    { title: 'Team Portraits',      tag: 'Portraits', size: 'med',  theme: 'portrait' },
  ];

  const svgFor = (theme) => {
    const gradients = {
      football:   ['#0a1a2f', '#ff5a1f'],
      basketball: ['#2a0d0d', '#ffa040'],
      hockey:     ['#0a1526', '#4fb0ff'],
      soccer:     ['#0a2010', '#8fe14a'],
      trophy:     ['#2a1a00', '#ffcf3f'],
      events:     ['#1a0a2a', '#c964ff'],
      school:     ['#0a1a1a', '#4fe0c9'],
      portrait:   ['#1a1a1e', '#ff9060'],
    };
    const [c1, c2] = gradients[theme] || ['#1a1a1e', '#ff5a1f'];
    const id = 'g' + Math.random().toString(36).slice(2, 9);

    // A stylized abstract "photo"
    return `
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="100%" stop-color="${c2}"/>
          </linearGradient>
          <radialGradient id="${id}r" cx="30%" cy="20%" r="80%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.35)"/>
            <stop offset="60%" stop-color="rgba(255,255,255,0)"/>
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill="url(#${id})"/>
        <rect width="400" height="300" fill="url(#${id}r)"/>
        ${themeShapes(theme)}
        <rect width="400" height="300" fill="none" stroke="rgba(255,255,255,0.06)"/>
      </svg>`;
  };

  function themeShapes(theme) {
    switch (theme) {
      case 'football':
        return `
          <ellipse cx="220" cy="200" rx="90" ry="40" fill="rgba(0,0,0,0.35)"/>
          <path d="M180 180 Q220 140 260 180 Q220 220 180 180 Z" fill="rgba(255,255,255,0.85)"/>
          <line x1="200" y1="180" x2="240" y2="180" stroke="#0a1a2f" stroke-width="2"/>
          <line x1="210" y1="175" x2="210" y2="185" stroke="#0a1a2f" stroke-width="2"/>
          <line x1="220" y1="175" x2="220" y2="185" stroke="#0a1a2f" stroke-width="2"/>
          <line x1="230" y1="175" x2="230" y2="185" stroke="#0a1a2f" stroke-width="2"/>`;
      case 'basketball':
        return `
          <circle cx="220" cy="180" r="60" fill="#c65020"/>
          <path d="M160 180 Q220 130 280 180" fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="2"/>
          <path d="M160 180 Q220 230 280 180" fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="2"/>
          <line x1="220" y1="120" x2="220" y2="240" stroke="rgba(0,0,0,0.6)" stroke-width="2"/>`;
      case 'hockey':
        return `
          <ellipse cx="220" cy="220" rx="70" ry="14" fill="#0a0a0c"/>
          <ellipse cx="220" cy="215" rx="70" ry="14" fill="#1a1a1e"/>
          <rect x="150" y="150" width="6" height="90" fill="rgba(255,255,255,0.8)" transform="rotate(-25 153 195)"/>`;
      case 'soccer':
        return `
          <circle cx="220" cy="190" r="50" fill="#ffffff"/>
          <polygon points="220,160 240,175 232,200 208,200 200,175" fill="#0a2010"/>
          <line x1="200" y1="175" x2="180" y2="170" stroke="#0a2010" stroke-width="1"/>
          <line x1="240" y1="175" x2="260" y2="170" stroke="#0a2010" stroke-width="1"/>`;
      case 'trophy':
        return `
          <path d="M170 130 h100 v30 a50 50 0 0 1 -100 0z" fill="#ffcf3f"/>
          <rect x="195" y="180" width="50" height="20" fill="#ffcf3f"/>
          <rect x="180" y="200" width="80" height="14" fill="#ffcf3f"/>
          <path d="M170 140 h-20 a20 20 0 0 0 20 20" fill="none" stroke="#ffcf3f" stroke-width="6"/>
          <path d="M270 140 h20 a20 20 0 0 1 -20 20" fill="none" stroke="#ffcf3f" stroke-width="6"/>`;
      case 'events':
        return `
          <circle cx="140" cy="80" r="4" fill="rgba(255,255,255,0.9)"/>
          <circle cx="260" cy="60" r="3" fill="rgba(255,255,255,0.7)"/>
          <circle cx="330" cy="120" r="5" fill="rgba(255,255,255,0.8)"/>
          <circle cx="80" cy="140" r="3" fill="rgba(255,255,255,0.6)"/>
          <path d="M100 200 Q200 240 320 200 L320 260 L100 260 Z" fill="rgba(0,0,0,0.4)"/>
          <path d="M180 210 L200 180 L220 210 Z" fill="rgba(255,255,255,0.7)"/>`;
      case 'school':
        return `
          <rect x="140" y="150" width="140" height="80" fill="rgba(0,0,0,0.4)"/>
          <polygon points="140,150 210,110 280,150" fill="rgba(255,255,255,0.9)"/>
          <rect x="200" y="180" width="20" height="50" fill="rgba(255,255,255,0.6)"/>
          <rect x="155" y="170" width="18" height="18" fill="rgba(255,255,255,0.4)"/>
          <rect x="247" y="170" width="18" height="18" fill="rgba(255,255,255,0.4)"/>`;
      case 'portrait':
        return `
          <circle cx="220" cy="140" r="40" fill="rgba(255,255,255,0.85)"/>
          <path d="M150 260 c 10 -50 60 -70 70 -70 s 60 20 70 70" fill="rgba(255,255,255,0.85)"/>
          <circle cx="220" cy="140" r="40" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>`;
      default:
        return '';
    }
  }

  const tagMap = { sports: 'Sports', events: 'Events', schools: 'Schools', portraits: 'Portraits' };

  items.forEach((it, i) => {
    const el = document.createElement('div');
    el.className = `gcard ${it.size}`;
    el.dataset.tag = it.tag.toLowerCase();
    el.setAttribute('data-hover', '');
    el.innerHTML = `
      <div class="art">${svgFor(it.theme)}</div>
      <div class="gcard-meta">
        <span class="gcard-tag">${it.tag}</span>
        <div class="gcard-title">${it.title}</div>
      </div>
    `;
    gallery.appendChild(el);

    // 3D tilt on mouse move
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `translateY(-6px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // Filter
  document.querySelectorAll('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.gcard').forEach(c => {
        if (filter === 'all' || c.dataset.tag === filter) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });

  // ------------------------------------------------------------------
  // REVEAL ON SCROLL (IntersectionObserver)
  // ------------------------------------------------------------------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.gcard').forEach(el => io.observe(el));
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  // Stat counters
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIo.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat-num').forEach(el => countIo.observe(el));

  // ------------------------------------------------------------------
  // Contact form
  // ------------------------------------------------------------------
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const subject = encodeURIComponent(`Booking: ${data.type} — ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nType: ${data.type}\n\n${data.message || ''}`
    );
    window.location.href = `mailto:me.p1cs2000@gmail.com?subject=${subject}&body=${body}`;
    document.getElementById('formNote').textContent = 'Opening your email client…';
  });

  // ------------------------------------------------------------------
  // THREE.JS 3D SCENE
  // ------------------------------------------------------------------
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0c, 0.035);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xff5a1f, 1.5);
  key.position.set(5, 4, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x4fb0ff, 0.8);
  fill.position.set(-6, -2, 3);
  scene.add(fill);
  const rim = new THREE.PointLight(0xffcf3f, 1.2, 20);
  rim.position.set(0, 2, -3);
  scene.add(rim);

  // ----- CENTERPIECE: 3D camera lens -----
  const lensGroup = new THREE.Group();
  scene.add(lensGroup);

  // Outer barrel
  const barrelGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.6, 64, 1, true);
  const barrelMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1e,
    metalness: 0.85,
    roughness: 0.35,
    side: THREE.DoubleSide,
  });
  const barrel = new THREE.Mesh(barrelGeo, barrelMat);
  barrel.rotation.x = Math.PI / 2;
  lensGroup.add(barrel);

  // Grip ring
  const gripGeo = new THREE.CylinderGeometry(1.55, 1.55, 0.4, 64, 1);
  const gripMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0c,
    metalness: 0.9,
    roughness: 0.6,
  });
  const grip = new THREE.Mesh(gripGeo, gripMat);
  grip.rotation.x = Math.PI / 2;
  grip.position.z = 0.2;
  lensGroup.add(grip);

  // Front rim (accent)
  const rimGeo = new THREE.TorusGeometry(1.5, 0.08, 24, 96);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xff5a1f,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0xff5a1f,
    emissiveIntensity: 0.3,
  });
  const frontRim = new THREE.Mesh(rimGeo, rimMat);
  frontRim.position.z = 0.8;
  lensGroup.add(frontRim);

  // Front glass
  const glassGeo = new THREE.CircleGeometry(1.35, 64);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0c,
    metalness: 1,
    roughness: 0.1,
    emissive: 0x1a2a4a,
    emissiveIntensity: 0.4,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.z = 0.81;
  lensGroup.add(glass);

  // Inner reflection ring
  const innerRingGeo = new THREE.RingGeometry(0.7, 1.2, 64);
  const innerRingMat = new THREE.MeshStandardMaterial({
    color: 0xffcf3f,
    metalness: 1,
    roughness: 0.2,
    emissive: 0xff8f3f,
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide,
  });
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRing.position.z = 0.82;
  lensGroup.add(innerRing);

  // Center dot
  const dotGeo = new THREE.CircleGeometry(0.4, 32);
  const dotMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0xff5a1f,
    emissiveIntensity: 0.6,
  });
  const dot = new THREE.Mesh(dotGeo, dotMat);
  dot.position.z = 0.83;
  lensGroup.add(dot);

  // Aperture blades
  const blades = [];
  const bladeCount = 8;
  for (let i = 0; i < bladeCount; i++) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.6, -0.2);
    shape.lineTo(1.2, 0.3);
    shape.lineTo(0.2, 0.4);
    shape.lineTo(0, 0);
    const bGeo = new THREE.ShapeGeometry(shape);
    const bMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a30,
      metalness: 0.9,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const blade = new THREE.Mesh(bGeo, bMat);
    blade.position.z = 0.79;
    blade.rotation.z = (i / bladeCount) * Math.PI * 2;
    blades.push(blade);
    lensGroup.add(blade);
  }

  lensGroup.position.set(0, 0, 0);

  // ----- Floating "polaroids" (photo cards) -----
  const cards = [];
  const cardColors = [0xff5a1f, 0xffcf3f, 0x4fb0ff, 0xff9060, 0x8fe14a, 0xc964ff];
  for (let i = 0; i < 18; i++) {
    const g = new THREE.PlaneGeometry(0.8, 1.0);
    const m = new THREE.MeshStandardMaterial({
      color: 0xf4f4f0,
      side: THREE.DoubleSide,
      metalness: 0.1,
      roughness: 0.7,
    });
    const card = new THREE.Mesh(g, m);
    const r = 5 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.7;
    card.position.set(
      r * Math.cos(theta) * Math.cos(phi),
      r * Math.sin(phi) * 1.2,
      r * Math.sin(theta) * Math.cos(phi) - 2
    );
    card.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    // Add a small colored inner "photo"
    const inner = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.7),
      new THREE.MeshStandardMaterial({
        color: cardColors[i % cardColors.length],
        emissive: cardColors[i % cardColors.length],
        emissiveIntensity: 0.15,
      })
    );
    inner.position.z = 0.01;
    inner.position.y = 0.08;
    card.add(inner);

    card.userData = {
      basePos: card.position.clone(),
      baseRot: card.rotation.clone(),
      speed: 0.3 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    };
    scene.add(card);
    cards.push(card);
  }

  // ----- Particle field (dust / bokeh) -----
  const particleCount = 400;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xff5a1f,
    size: 0.06,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ----- Wireframe grid on floor -----
  const grid = new THREE.GridHelper(60, 60, 0xff5a1f, 0x1a1a1e);
  grid.position.y = -6;
  grid.material.transparent = true;
  grid.material.opacity = 0.15;
  scene.add(grid);

  // ------------------------------------------------------------------
  // INTERACTION — mouse parallax + scroll
  // ------------------------------------------------------------------
  let mouseNX = 0, mouseNY = 0;
  let targetLensX = 0, targetLensY = 0;
  let scrollProgress = 0;

  window.addEventListener('mousemove', (e) => {
    mouseNX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseNY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetLensX = mouseNY * 0.4;
    targetLensY = mouseNX * 0.6;
  });

  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }, { passive: true });

  // Touch parallax (mobile)
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouseNX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
      mouseNY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      targetLensX = mouseNY * 0.4;
      targetLensY = mouseNX * 0.6;
    }
  }, { passive: true });

  // Resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // ------------------------------------------------------------------
  // ANIMATION LOOP
  // ------------------------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();

    // Lens rotation (mouse + slow drift)
    lensGroup.rotation.x += (targetLensX - lensGroup.rotation.x) * 0.05;
    lensGroup.rotation.y += (targetLensY + t * 0.15 - lensGroup.rotation.y) * 0.05;

    // Aperture pulse
    const scale = 1 + Math.sin(t * 0.8) * 0.03;
    lensGroup.scale.set(scale, scale, scale);

    // Blade rotation (aperture opening/closing)
    blades.forEach((b, i) => {
      b.rotation.z = (i / bladeCount) * Math.PI * 2 + t * 0.3 + Math.sin(t * 0.5) * 0.3;
    });

    // Inner ring pulse
    innerRing.material.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.2;

    // Cards floating
    cards.forEach((c) => {
      const d = c.userData;
      c.position.x = d.basePos.x + Math.sin(t * d.speed + d.offset) * 0.4;
      c.position.y = d.basePos.y + Math.cos(t * d.speed * 0.8 + d.offset) * 0.5;
      c.position.z = d.basePos.z + Math.sin(t * d.speed * 0.6 + d.offset) * 0.3;
      c.rotation.x = d.baseRot.x + t * d.speed * 0.2;
      c.rotation.y = d.baseRot.y + t * d.speed * 0.15;
    });

    // Particles drift
    particles.rotation.y = t * 0.02;
    particles.rotation.x = Math.sin(t * 0.05) * 0.05;

    // Scroll-driven camera / lens movement
    camera.position.z = 8 + scrollProgress * 4;
    camera.position.y = -scrollProgress * 3;
    lensGroup.position.x = scrollProgress * 4;
    lensGroup.position.y = -scrollProgress * 2;

    // Grid pan
    grid.position.z = (t * 0.3) % 2;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
