/* ==========================================================================
   Clear Path Snow Co. — business info
   Edit this one file. The website, flyer, and season agreement all read it.
   ========================================================================== */

const CONFIG = {
  ownerName: "Hunter",                    // first name, used on the site
  ownerFullName: "Hunter Bailey",         // used on the season agreement
  phone: "(207) 346-1691",                // your cell, for calls and texts
  email: "hunterlbailey2020@icloud.com",  // where quote requests are sent
  siteUrl: "",                            // once published, e.g. "https://clearpathsnow.com" (adds a QR code to the flyer)
  seasonStart: "November 15, 2026",
  seasonEnd: "April 1, 2027",
  earlyBirdDeadline: "November 1",        // $25 off season plans booked by this date
  seasonSpotsTotal: 12,                   // how many season clients you can handle
  seasonSpotsTaken: 0,                    // bump this as people sign up
};

const PRICES = {
  storm:  { small: 25,  medium: 35,  large: 50 },
  season: { small: 300, medium: 425, large: 575 },
  // Add-ons are per visit; on a season plan they're multiplied by ~12 storms.
  addon:  { walk: 10, car: 10, salt: 5 },
  stormsPerSeason: 12,
  earlyBirdDiscount: 25,
};
