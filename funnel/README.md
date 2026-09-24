# Architronica — Meta Ads call funnel

Static HTML/CSS/JS. Upload the whole `funnel/` folder to any host (GHL custom code, Netlify, cPanel).

```
/funnel
  landing.html     Cold-traffic landing page (form sits directly under the hero)
  thank-you.html   Post-form "we'll call you" page (conversion event goes here)
  privacy.html     Placeholder privacy policy — complete before launch
  terms.html       Placeholder terms — complete before launch
  styles.css       All styling
  script.js        UTM capture/pass-through, form loader, sticky CTA, FAQ, redirect helper
  images/          Client project photos, compressed for web
```

## Before going live
1. **GHL form redirect** — Sites > Forms > "Architronica landing page form" > On Submit > Open URL > `https://YOUR-DOMAIN/thank-you.html`.
2. **Hidden UTM fields** — add hidden fields in the GHL form with query keys `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid`, `ttclid`, `msclkid`. `script.js` appends them to the form URL.
3. **Tracking** — paste GTM / Meta Pixel into the `TRACKING HEAD/BODY` comments on every page. Fire the Schedule/booked-call conversion only in the `CONVERSION EVENT` block on `thank-you.html`.
4. **Legal pages** — fill every `[BRACKET]` (company number, contact email, dates).
5. **Confirm claims** — the "How we run a job" points (fixed itemised quote, one project manager, weekly schedule, design and build) must match how Architronica actually works.
