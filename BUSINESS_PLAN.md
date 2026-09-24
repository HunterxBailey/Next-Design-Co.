# Clear Path Snow Co. — Starter Business Plan

A student-run residential snow removal business in **Auburn, Maine**, built to
run around a full school schedule.

> Tagline: **Out before the bus. Back after the bell.**

---

## 1. The idea in one paragraph

Clear Path clears driveways, walkways, and steps for homeowners in Auburn.
Most of the income comes from **season plans**: a flat price covers every
storm of 2" or more from Nov 15 to Apr 1. That gives you steady, predictable
money and a fixed route. **Per-storm** customers fill any open time. All work
fits into three windows: **5:00–7:15 AM**, **2:30–8:00 PM**, and **weekends
and snow days**.

Why it works in Auburn: the Lewiston–Auburn area usually gets **around 70–80
inches of snow a season**, spread over roughly **12–20 storms**. Older
neighbors, busy families, and people who leave early for work will pay to not
shovel, and most plowing companies don't want small 1–2 car driveways.

---

## 2. Services & pricing

| Service | Per storm | Season plan (Nov 15 – Apr 1) |
|---|---|---|
| 1-car driveway + front walk/steps | $25 | $300 |
| 2-car driveway + front walk/steps | $35 | $425 |
| Large / long driveway | $50+ | $575+ |
| Extra walkway or back steps | +$10 | +$10 per storm |
| Car brush-off | +$10 per car | +$10 per storm |
| Salt / ice melt | +$5 | +$5 per storm |
| Roof rake (from the ground only) | $40+ | — |
| Storms over 12" | +50% | included |

**Rules to keep it fair to you:**
- A season-plan storm means **2 inches or more**.
- Per-storm prices cover **up to 8"**. Charge more for bigger storms.
- Season plans are paid **up front**, or half by Nov 15 and half by Jan 15.
- **Never work on a roof.** Rake only from the ground.

To change prices, edit the `PRICES` block in `config.js` (it updates the
estimator, flyer, and agreement) and the pricing text in `index.html`.

---

## 3. How many clients can you actually handle?

This is the most important number in the plan. Don't sign up more people than
you can clear before school.

Rough clearing times for a 4–6" storm, **including walking or driving
between houses**:

| Tool | 1-car | 2-car |
|---|---|---|
| Shovel / snow pusher | 25–35 min | 40–60 min |
| Snowblower | 10–15 min | 15–25 min |

The morning window (5:00–7:15) is about **2 hours 15 minutes**:

- **Shovel only:** about 3–4 driveways per morning
- **With a snowblower:** about 6–8 driveways per morning

The rest get done in the afternoon (2:30–8:00).

**Suggested first-season cap:**
- **Shovel only:** 8–10 season clients
- **With a snowblower:** 12–15 season clients
- Keep **3–5 per-storm customers** on a waitlist to fill gaps.

Set this in `config.js` under `seasonSpotsTotal`. The default is
12. As people sign up, raise `seasonSpotsTaken` and the "spots open" meter
updates.

**Plan the route by street.** Keep clients within a small area (for example,
all in New Auburn or all near Minot Ave) so you aren't losing time driving
across the city. Put people who need to be cleared early for work first.

---

## 4. Startup costs

| Item | Approx. cost | Needed? |
|---|---|---|
| 2 good shovels (one for backup) | $60–80 | Yes |
| Wide snow pusher | $35–50 | Yes |
| Ice chopper / scraper | $20–30 | Yes |
| Ice melt (pet-safe option too) | $40–60 to start | Yes |
| Headlamp (5 AM is dark) | $20–30 | Yes |
| Ice cleats for boots | $20–30 | Yes |
| Reflective vest | $10–15 | Yes |
| Long-handled roof rake | $50–80 | Optional |
| Flyers (print ~200) | $25–40 | Yes |
| **Total without a snowblower** | **about $280–$400** | |
| Used 2-stage snowblower (Facebook Marketplace / Craigslist) | $300–$700 | Recommended, year 2 at the latest |
| Snowblower gas, oil, shear pins | $50–100 / season | If you have one |

---

## 5. Money: a realistic first season

**Example: 10 season clients (average $400) + per-storm work**

| | Amount |
|---|---|
| 10 season plans × $400 | $4,000 |
| Per-storm jobs (~40 × $30) | $1,200 |
| Add-ons (salt, cars, walks) | ~$300 |
| **Gross income** | **~$5,500** |
| Supplies, gas, ice melt, flyers | –$400 to –$600 |
| Set aside for taxes (see below) | –15% of profit |

These are estimates. A light winter means fewer per-storm jobs, and that's
the reason to focus on season plans.

---

## 6. Being 17: legal, money, and safety checklist

This isn't legal or tax advice. Go through it with a parent or guardian.

- [ ] **Parent or guardian on board.** Many contracts, bank accounts, and
      payment apps need someone 18 or older. Have a parent co-sign season
      agreements or add their name.
- [ ] **Payment apps.** Venmo, PayPal, and Cash App generally require users
      to be 18+. Use cash or checks, or a payment account a parent manages
      for you. Always give a written or texted receipt.
- [ ] **Bank account.** Open a separate student or teen account (parent
      joint account) just for business money.
- [ ] **Taxes.** If you **net $400 or more** in a year from
      self-employment, you have to file a federal return and pay
      self-employment tax, even as a minor. Keep every receipt and track
      income in a simple spreadsheet. Setting aside about 15% of profit
      covers most of it.
- [ ] **Local rules.** Call or email the **Auburn City Clerk's office** to
      ask whether a small residential snow shoveling business needs any
      permit or registration. Many small service businesses don't, but ask.
- [ ] **Where the snow goes.** Maine law and city rules say you can't push
      or blow snow into the street or onto sidewalks. Pile it on the
      customer's property.
- [ ] **Insurance.** Ask your family's insurance agent whether a small
      business liability policy or rider makes sense. A homeowner's policy
      usually does **not** cover business work. This matters if someone
      slips on a walkway you cleared.
- [x] **Written season agreement.** Ready in `print/season-agreement.html`
      (and `.pdf`). It covers the address, what's cleared, the 2" trigger,
      the season dates, price and payment, ice after you leave, missed
      storms, ending early, and a parent/guardian co-signature. Have a
      parent read it before your first client signs.
- [ ] **Safety.** Lift with your legs, take breaks, wear cleats and a
      reflective vest in the dark, never put hands in a snowblower chute
      (use the clean-out tool), and stay off roofs.

---

## 7. Balancing it with school

- **School comes first.** Don't take a client whose deadline you can only
  meet by skipping class or being late.
- **Check the forecast the night before.** Sleep early on storm nights, lay
  out your gear, and charge your phone and headlamp.
- **Text every client** before the route with an estimated time, and again
  when you finish, with a photo if you can. This is what gets you
  referrals.
- **Line up a backup helper** (a friend or sibling) for huge storms and sick
  days. Pay them per driveway.
- **Snow days are your best days.** Use them to catch up and pick up
  per-storm jobs.

---

## 8. Getting your first customers (Oct – mid-Nov)

1. **Start with people you know:** neighbors, family friends, parents'
   coworkers, teachers, church, or team families.
2. **Flyers** (`print/flyer.pdf`) on community boards (library, grocery
   stores, laundromats) and handed to neighbors in 2–3 areas close to
   home. Don't put flyers in mailboxes, since that's against federal law.
3. **Local Facebook groups** (Auburn / L-A community groups) and **Nextdoor**.
   Post once in October and again before the first storm.
4. **Offer an early-bird deal:** $25 off a season plan if booked before
   Nov 1.
5. **Ask for referrals:** $20 off for every neighbor they sign up.
6. **Older residents** often need help most. Be patient, reliable, and
   polite, and they'll tell everyone they know.

---

## 9. First-week to-do list

- [x] Put your real name, phone, and email in `config.js`
- [ ] Publish the site (GitHub Pages, Netlify, or similar)
- [ ] Buy the "Yes" equipment from the startup list
- [x] Season agreement drafted (`print/season-agreement.pdf`); have a parent review it
- [ ] Open the business bank account with a parent
- [ ] Contact the Auburn City Clerk and your insurance agent
- [ ] Print flyers (`print/flyer.pdf`) and post in local groups
- [ ] Make a client spreadsheet: name, address, phone, plan, paid?, notes
- [ ] Plan your morning route order by street
