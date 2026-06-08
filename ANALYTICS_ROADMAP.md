# Analytics and Product Roadmap

## Baseline

Measurement started on June 2, 2026.

- 73 visitors
- 819 page views
- 42% bounce rate
- 33 visitors and 397 page views in the latest 24-hour period
- Google accounts for 30 identified visitors
- France accounts for 77% of visitors
- Mobile accounts for 44% of visitors
- The home page generated 182 views from 31 visitors in 24 hours

The sample is still small. Decisions should be reassessed after at least 14 and
30 complete days of data.

## Measurement Added

- Vercel Speed Insights on every route
- Catalogue search events after a 600 ms debounce
- Index, sector, and benefit filter events
- Empty-result and general filter reset events
- Company-card opening events
- Official club and company website outbound events
- Club registration CTA events
- FAQ opening events
- Hero video completion and replay events

Custom-event reporting requires a Vercel Pro team. The implementation is ready,
but the current Hobby dashboard does not expose those event reports.

## Priority 0: Measurement Reliability

1. Collect 14 days of Speed Insights before making performance conclusions.
2. Exclude owner and development traffic from production analysis.
3. Add UTM conventions for portfolio links, social posts, newsletters, and
   partnerships.
4. Upgrade to Vercel Pro or connect a privacy-friendly product analytics tool if
   custom-event funnels are required.
5. Review analytics weekly using fixed 7-day and 30-day comparisons.

## Priority 1: Navigation and Conversion

1. [Done] Preserve catalogue filters and scroll position when returning from a
   company page.
2. [Done] Add previous and next company navigation on detail pages.
3. [Done] Add related companies based on sector and index.
4. Make the primary club registration CTA sticky on mobile.
5. Separate the official club link from the generic investor-relations page.
6. Add a clear "How to join" summary above the full benefit list.
7. Show the minimum investment and holding mode next to every CTA.
8. Add a comparison shortlist for two to four companies.

The repeated home-page views suggest that users currently use the home page as
the only navigation hub. Preserving catalogue state and adding related-company
navigation should reduce unnecessary returns while increasing useful depth.

## Priority 2: Catalogue Discovery

1. Add sorting by minimum investment, number of benefits, company name, and
   verification date.
2. Add quick filters for one-share clubs, discounts, gifts, events, and
   registration type.
3. Display active filters as removable chips.
4. Persist filters in the URL so searches can be shared and indexed where
   appropriate.
5. Add autocomplete and popular-search suggestions.
6. Add a compact mobile filter drawer.
7. Add a "best value" view based on estimated benefit value versus entry cost.

## Priority 3: Trust, Freshness, and SEO

1. Add `requiredShares`, `conditions`, and `sourceUrl` to each benefit.
2. Add `lastVerifiedAt` and a verification status to each company.
3. Display official sources as dedicated links instead of embedding them in
   descriptions.
4. Add editor, methodology, correction policy, and legal-information pages.
5. Add per-company Open Graph images.
6. Add dynamic `lastModified` values to the sitemap.
7. Add structured source and verification information to JSON-LD.
8. Prioritize pages already receiving traffic: Accor, Hermes, Carrefour,
   Air France-KLM, Air Liquide, and Airbus.

## Priority 4: Mobile and Performance

1. [Done] Replace the external Google Fonts stylesheet with `next/font`.
2. [Done] Replace the hero poster `<img>` with `next/image`.
3. [Done] Replace `preload="auto"` with `preload="metadata"` for the hero video.
4. Generate smaller mobile video and poster variants.
5. Measure whether the hero video delays LCP before keeping it above the fold.
6. Reserve stable dimensions for all media to protect CLS.
7. Audit tap targets, filter density, and long benefit rows below 390 px.
8. Review the live quote API latency and cache policy.

## Content Coverage Audit

- 19 CAC 40 companies have dedicated JSON dossiers with expanded benefits,
  cited sources, and richer FAQs.
- The other 39 companies have useful benefits and FAQs, but remain synthetic
  profiles without the same source-by-source research depth.
- Detail pages now identify this difference as either "detailed, cited sources"
  or "synthetic profile", and generate a structured summary from available
  eligibility and benefit data.
- The next content phase should enrich non-CAC profiles in batches, starting
  with companies that receive traffic or offer a measurable financial benefit.

## Priority 5: Retention and Growth

1. Add a watchlist stored locally before introducing accounts.
2. Offer alerts when benefits or eligibility conditions change.
3. Publish editorial pages targeting high-intent searches such as:
   - best shareholder clubs
   - clubs accessible with one share
   - cheapest shareholder benefits
   - nominative versus bearer shares
4. Build sector and index landing pages.
5. Add shareable company and comparison cards.
6. Create a monthly freshness report to support trust and backlinks.

## Decision Gates

- After 14 days: evaluate Core Web Vitals, mobile behavior, landing pages, and
  acquisition quality.
- After 30 days: prioritize pages using traffic, bounce rate, outbound club
  clicks, and search demand.
- After custom events become visible: build a funnel from landing page to
  catalogue interaction, company view, official club click, and registration
  CTA click.
