# Myatlastic — Business Plan

**An interactive world geography app for kids and Gen Z, monetised via tight-free subscription with school B2B.**

Version 1.0 · Pre-launch · Confidential · All figures USD

---

## 1. Executive summary

Myatlastic is a geography learning app covering every country with capitals, currencies, languages, religions, culture, notable figures, and short history. It targets kids 7–17 with age-gated modes (Kids 7–12, Teen+ 13–17).

The product is built as a single web codebase deployed as a Progressive Web App and as native iOS/Android via Capacitor.

Monetisation is **tight-free** with a 10-country preview and a hard paywall thereafter. Premium subscription unlocks all 195 countries, depth content (history, religion, culture, figures), landmark images, unlimited quizzes, Compare mode, and full Daily Streak.

| Plan | Price | Features |
|---|---|---|
| Free | $0 | 10 countries · 3 quizzes/day · 1 daily challenge |
| Pro Monthly | $7.99/mo | Everything unlocked |
| Pro Annual | $29.99/yr | Everything · save 69% |
| Family Annual | $49.99/yr | Up to 6 profiles |
| School Classroom | $199/yr | Teacher dashboard, progress reports |

**Base-case financials (3 years, USD, tight-free):**

| Metric | Value |
|---|---|
| Total net revenue | $181k |
| Peak cash burn | $132k → minimum funding $150k |
| First EBITDA-positive month | M26 |
| Cash-positive month | Not reached in 36 months under Base |
| End-Y3 user base | 14k free, 5.2k paid, 90 schools |

### Why the strategy is honest about its risk

The tight-free strategy was selected over my analytical recommendation. It produces higher per-user conversion (5.5% vs. 3% under generous-free), but the absolute user pool is smaller, App Store reviews are more polarised, and cash break-even pushes beyond 36 months under the Base scenario. The Bull scenario reaches cash-positive at M33. The Bear scenario does not reach EBITDA-positive in 36 months at all.

**Implication:** Under tight-free, you must hit at least the Base scenario on conversion (5.5%) and run an aggressive paid acquisition channel from month 3. Generous-free was a more forgiving design; tight-free demands operational excellence.

---

## 2. Problem and opportunity

### The problem

Geography literacy is poor and declining. National Geographic surveys of US 18–24 year-olds have repeatedly shown that a majority cannot locate countries in the news on a map. Schools have minimal budget for engaging digital tools, and parents looking for educational screen time face a fragmented market.

Existing apps fall into three buckets:

| Category | Examples | Weakness |
|---|---|---|
| Quiz-only | Seterra, Stack the States | Shallow, no context |
| Encyclopedia-style | World Atlas by Nat Geo | Static, no game loop |
| Game with light geo | GeoGuessr | Adult-skewed, not kid-safe |

### The opportunity

Room for an app that combines (a) a beautiful reference layer with depth on culture/history/religion, (b) a real game loop that drives daily return, (c) age-appropriate modes for two distinct audiences, and (d) a teacher-friendly version that schools will pay for.

US alone: ~50m K-12 students, ~130,000 schools.

---

## 3. Product

### Free tier (10 countries)
- 10 countries fully unlocked (alphabetical: Afghanistan through Australia or similar)
- Photorealistic 3D globe with all 195 countries visible
- Flag tooltips on hover for all countries
- Basic facts (capital, currency, language, continent) for all countries
- 3 quizzes per day
- One daily challenge per day
- Kids mode toggle

### Pro tier (all 195 countries)
- Full country depth: religion, culture, notable figures, short history
- Landmark images (Wikimedia Commons)
- Unlimited quizzes
- Compare mode (side-by-side analysis of any two countries)
- Full Daily Challenge with persistent streak history
- Offline mode on mobile
- States/provinces for federal countries

### Age-gated modes
- **Kids (7–12):** Brighter UI, larger text, simpler language, parental gate
- **Teen+ (13+):** Full content depth, dark theme available

### Roadmap

| Quarter post-launch | Feature |
|---|---|
| Q1 | Pronunciation audio for capitals |
| Q2 | Teacher dashboard (B2B unlock) |
| Q3 | Multiplayer quiz battles |
| Q4 | AR landmarks (selected countries) |
| Y2 | Time-period maps (1500 / 1900 / today) |

---

## 4. Market and competition

### TAM (bottom-up)
- English-speaking children 7–17, internet-connected: ~80m
- Of those, parents who buy educational apps: ~15% → 12m
- Annual willingness to pay $29.99: ~10% → 1.2m → **TAM (consumer): ~$30m/year**

### SOM — 3-year target (tight-free)
- Y3 paid users in Base: 5,200
- Y3 paid users in Bull: ~17,000
- SOM penetration: 0.4–1.4% — credible under tight-free assumptions

### School TAM
- US + UK primary + middle schools: ~150,000 schools
- Base case Y3 = 90 schools = 0.06% — deliberately conservative

### Competitive landscape

| Competitor | Pricing | Strength | Weakness vs Myatlastic |
|---|---|---|---|
| Seterra | Free, ad-supported | Quiz breadth | No context, ugly UI |
| Nat Geo Kids | $4.99/yr | Trusted brand | Not geography-focused |
| Stack the States | $3.99 one-off | Polished UX | US-only |
| GeoGuessr | $2.99–$9.99/mo | TikTok viral | Adult-skewed |
| Brilliant | $13.49/mo | Premium feel | Not geo-focused |

Myatlastic's positioning: **photorealistic globe + depth + age-segmented + school-ready from launch.**

---

## 5. Go-to-market

### Phase 1: Soft launch (M1–3)
- TestFlight beta with 50–100 parents/teachers
- Iterate on feedback
- Polish App Store listing assets

### Phase 2: Public launch (M4–6)
- iOS + Android + Web simultaneous
- Aggressive ASO — competitor keywords + long-tail
- Apple Search Ads starting at $650/month
- Outreach to 20 education bloggers (Common Sense Media, geography YouTubers)
- Organic posting on TikTok, Instagram (geography content travels)

### Phase 3: B2B development (M7–12)
- Direct outreach to 200 US schools
- Teacher resource pack aligned to US Common Core
- Attend ISTE conference
- Free term trial offer

### Phase 4: Scale (M13+)
- Expand paid acquisition (CAC ceiling $20)
- Localise to Spanish (US Hispanic + LatAm)
- Partnership conversations: BBC Bitesize, Twinkl

### Channels ranked

1. Apple Search Ads + Google Search Ads (paid)
2. Organic App Store discovery
3. TikTok/Instagram geography content
4. Common Sense Media editorial review
5. School B2B inbound (via myatlastic.com/#schools)

---

## 6. Compliance and legal

### COPPA (US, children under 13)
- Verifiable parental consent required for any data collection
- No behavioural advertising to under-13s
- Myatlastic: no account system, no data collection, no ads. Compliant by design.

### GDPR-K (EU/UK)
- Parental consent for under-16 (under-13 in UK)
- Age verification needed
- Myatlastic: no data collected, so triggers are minimal

### Apple App Store Kids category
- Stricter than COPPA — manual review
- No third-party ads at all
- Parental gates on IAP

### Google Play Designed for Families
- Similar restrictions

### Practical implications
- Free tier works fully offline, no account
- Subscription via Apple/Google in-app purchase (handles parental consent)
- No analytics SDK collecting PII
- Privacy manifest declares minimal usage
- Privacy policy and terms at myatlastic.com/privacy and myatlastic.com/terms

### Cost of compliance (in model)
- Legal review of privacy policy + terms: $1,300–$3,250 one-off
- Ongoing accounting/compliance: $260–$650/month

---

## 7. Team and resourcing

### Required at launch
- Founder — product, design, business
- One developer (could be founder, or contractor at $19,500)
- Content writer ($3,900 for initial 195-country pass)
- Illustrator/designer ($2,600–$6,500)

### Add by month 12
- Part-time community/support ($650/month)
- Part-time school sales on commission

### Add by Year 2
- Full-time developer
- Part-time educator for curriculum alignment

---

## 8. Risks specific to tight-free strategy

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Conversion below 4% (vs. 5.5% Base) | Medium | Halves LTV, pushes break-even further | A/B test paywall placement in M1-3 |
| Negative App Store reviews on paywall | High | App Store ranking hurts | Monitor reviews weekly, respond to all 1-2 star reviews |
| Reduced organic growth | High | CAC dominates spend | Run multiple ad creatives; consider influencer seeding |
| School cycle delays past 6 months | High | Y1 B2B revenue near zero | Don't depend on schools for runway |
| Cash-positive not reached in 36mo | Medium under Base | Need bridge funding | Plan for $200k total funding, not $150k minimum |

### Things that would invalidate this plan
- If 30-day organic install rate is under 100, ASO is broken — pause paid acquisition, redesign listing
- If conversion in M1-6 is under 4%, the tight wall isn't working — revisit free/paid split before M6
- If you can't sell a single school by M12, the school feature set is wrong

---

## 9. Funding

### Minimum: $150k (tight-free Base + buffer)

Tight-free does not reach cash-positive in 36 months under Base. You either need bridge funding, or you must outperform Base on conversion. Plan for the bridge.

### Recommended raise: $200k

This covers Base + buffer + bridge into month 42.

### Use of funds ($150k)

| Category | $ |
|---|---|
| App dev + content (one-off) | 26,000 |
| Founder partial salary (24 mo) | 39,000 |
| Contractors | 23,400 |
| Tools/legal/insurance | 13,000 |
| Marketing (M3-M30) | 28,600 |
| Buffer / bridge | 20,000 |

### Sources

1. Friends & family round: $30-60k
2. Apple Small Business Program (fee reduction)
3. US grants: SBIR, state-level innovation
4. Ed-tech angels with school sales experience

### Why not VC

TAM under tight-free is even tighter than under generous-free. Y3 revenue of $123k won't excite a VC. Optimise for ownership.

---

## 10. Milestones

| Month | Milestone | If hit | If missed |
|---|---|---|---|
| M3 | TestFlight beta, 50 testers | Continue to launch | Delay, redesign |
| M6 | 4,000 installs, 4% conversion | Continue | Investigate funnel; consider switching to generous-free |
| M12 | 12,000 installs, 200 paid, 3 schools | Hire support | Cut costs; pivot positioning |
| M18 | EBITDA-positive month | Continue investing | Tighten OPEX; focus on retention |
| M24 | $40k cumulative revenue | Plan for scale | Acquihire or sunset conversation |
| M36 | $180k+ ARR, 90 schools | Validate as lifestyle business | Continue or close |

---

## 11. Appendices

### A. Pricing rationale

- $7.99/month sits in the middle of the impulse-buy band, above casual but below committed-purchase
- $29.99/year is ~69% disc on monthly, drives annual mix
- $39.99 family is a 60% premium for 6× seats
- $199 school is below the $500–$2,000 norm

### B. Why tight-free over the model's recommendation

The model recommended generous-free (3% conversion, broader funnel, ~$333k 3yr revenue). Founder selected tight-free (5.5% conversion, narrower funnel, ~$181k 3yr revenue). The trade-off is well-understood:

- **Tight-free pros:** Faster decision per user, simpler product positioning, less freeloader cost
- **Tight-free cons:** Smaller user base, more polarised reviews, harder App Store ranking, no cash-positive in 36 months under Base

If conversion underperforms in months 1-6, switching to generous-free is a 2-week product change with no infrastructure rebuild.

### C. Things I am not certain about

- School sales velocity is the biggest unknown
- Apple commission may drop further after EU DMA enforcement (modelled at 15%)
- LTV uses constant churn; real churn is front-loaded — slight underestimate
- "Paid CAC" is paid-spend ÷ paid-installs, a marketing efficiency metric not true blended CAC

---

*End of business plan.*
