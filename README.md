# Clear Path Snow Co.

Website and starter business plan for a **student-run snow removal
business in Auburn, Maine**, run by a 17-year-old around a full school
schedule.

> Out before the bus. Back after the bell.

- **Business plan:** [`BUSINESS_PLAN.md`](BUSINESS_PLAN.md) covers pricing,
  client capacity, startup costs, the legal/safety checklist for a minor,
  and marketing.
- **Website:** a single page with services, school-day storm schedule,
  pricing, instant estimator, service area, FAQ, and contact form.

## Make it yours

Open `main.js` and edit the `CONFIG` block at the top:

```js
const CONFIG = {
  ownerName: "the owner",   // your first name
  phone: "(207) 000-0000",  // your cell
  email: "you@example.com", // where requests go
  seasonSpotsTotal: 12,     // max season clients
  seasonSpotsTaken: 0,      // update as people sign up
};
```

Prices appear in two places: the text in `index.html` (pricing section)
and the `PRICES` block in `main.js` (used by the estimator). Update both.

## Stack

Vanilla HTML, CSS, and JavaScript with no build step. Fonts come from
Google Fonts. The contact form opens the visitor's email app with the
request already filled in, so no server is needed.

## Local preview

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Files

- `index.html` — page structure
- `styles.css` — winter navy / ice blue / safety orange theme, responsive layout
- `main.js` — config, estimator, contact form, mobile nav, snowfall
- `assets/logo.svg` — snowflake logo and favicon
- `BUSINESS_PLAN.md` — the business side
