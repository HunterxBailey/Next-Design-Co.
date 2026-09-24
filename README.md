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

## Printables

- **Flyer:** [`print/flyer.html`](print/flyer.html) is a US Letter flyer with
  8 tear-off phone tabs. Ready to print: [`print/flyer.pdf`](print/flyer.pdf).
- **Season agreement:** [`print/season-agreement.html`](print/season-agreement.html)
  is 2 pages: an order form (driveway size, add-ons, payment, property notes)
  plus plain-English terms and signature lines for the client, you, and a
  parent/guardian co-signer. Ready to print:
  [`print/season-agreement.pdf`](print/season-agreement.pdf).

Print at 100% scale ("Actual size") with headers and footers turned off. The
agreement is a template, not legal advice, so have a parent read it first.

## Make it yours

All business info is in **`config.js`**. The website, flyer, and agreement
all read from it:

```js
const CONFIG = {
  ownerName: "Hunter",
  ownerFullName: "Hunter Bailey",
  phone: "(207) 346-1691",
  email: "hunterlbailey2020@icloud.com",
  siteUrl: "",              // set once published to add a QR code to the flyer
  seasonStart: "November 15, 2026",
  seasonEnd: "April 1, 2027",
  earlyBirdDeadline: "November 1",
  seasonSpotsTotal: 12,     // max season clients
  seasonSpotsTaken: 0,      // update as people sign up
};
```

Prices are in the `PRICES` block in the same file. They drive the
estimator, the flyer, and the agreement. The pricing section text in
`index.html` is written out by hand, so update it too if prices change.

The PDFs are snapshots. After you change `config.js`, open the HTML version
and print it (or "Save as PDF") to get an updated copy.

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
- `config.js` — your name, contact info, season dates, and prices
- `main.js` — estimator, contact form, mobile nav, snowfall
- `print/` — flyer and season agreement (HTML + PDF), shared print styles
- `assets/logo.svg` — snowflake logo and favicon
- `assets/vendor/qrcode.js` — QR code generator for the flyer (MIT, Kazuhiko Arase)
- `BUSINESS_PLAN.md` — the business side
