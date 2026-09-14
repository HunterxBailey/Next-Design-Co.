# MW.P1CS — Myles Walker Photography

A 3D interactive portfolio site for **Myles Walker**, a freelance photographer
based in **Lewiston, Maine**. Junior in high school. Studio name: **MW.P1CS**.

- Phone: (207) 888-7408
- Email: me.p1cs2000@gmail.com

## Stack

Vanilla HTML, CSS, and JavaScript — no build step. Three.js (loaded from CDN)
powers the 3D backdrop: an interactive camera lens, floating photo cards, a
particle field, and a scroll-driven camera rig.

## Local preview

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Files

- `index.html` — page structure & sections (hero, work, about, services, contact)
- `styles.css` — dark editorial theme, motion, responsive layout
- `main.js`   — Three.js scene, gallery generator, cursor, reveals, form
