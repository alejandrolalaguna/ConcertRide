# Go-to-Market & Sales Strategy Prompt for Claude Code

You are a GTM strategist and business development lead for ConcertRide. Your goal is to design a phased commercialization and sales strategy that identifies distribution channels, partnership opportunities, and B2B/B2C sales angles aligned with the product's competitive position.

## Context: ConcertRide Platform

**Product Summary:**
- Ride-sharing platform for concert attendees (driver + passenger matching)
- Real-time concert ingestion from multiple sources (Ticketmaster primary)
- Location-based matching, simple auth, neo-brutalist UX
- Current stage: MVP with core matching + landing page
- Tech: Cloudflare Workers, Turso, React SPA (low-cost, global edge deployment)
- Market position: Niche play (concert + transport), underserved vs. Blablacar/Uber

**Geographic focus (initial):** Spain (Spanish domain `concertride.es`, potential for LATAM expansion)

**Unit Economics (assumptions you should validate):**
- Driver acquisition cost (CAC): TBD
- Passenger acquisition cost (CAC): TBD
- Ride commission (typical: 10–25% of passenger fee or driver fee)
- Churn risk: High (event-triggered, one-off users) vs. subscription potential

## Sales Strategy Framework

### 1. Revenue Models (to Evaluate)

For each model, assess:
- **Primary payer** (driver, passenger, venue, promoter, or platform)?
- **Pricing** (% commission, flat fee, freemium tier, B2B licensing)?
- **Stickiness** (repeat usage, network lock-in)?
- **Defensibility** (easy for competitors to copy)?

**Models to consider:**
- **Commission on rides** (passenger or driver fee; Blablacar model)
- **Premium features** (faster matching, verified badges, ad-free for drivers)
- **B2B licensing** (venues, promoters sell rides as add-on to tickets)
- **Data licensing** (anonymized concert-goer + travel patterns to ticket platforms)
- **Sponsored content** (promoters/venues pay for featured rides or spotlight)
- **Insurance/protection** (trip insurance, damage waiver)

---

### 2. Distribution Channels (B2C)

**Direct-to-user channels:**
1. **Organic / Viral**
   - Event page shares (Spotify concert playlists, Songkick/Bandsintown links)
   - Driver/passenger referral loops (both sides incentivized)
   - SEO (concert + rides keywords: "viaje a concierto de [artista]")

2. **Paid acquisition**
   - Google Ads (concert + city keywords, low competition)
   - Instagram / TikTok (user-generated content from riders, event hype)
   - Spotify ads (concert discovery → ride discovery loop)

3. **Partnerships with event discovery**
   - Songkick, Bandsintown, RA: embed or link rides
   - Ticketmaster: add "book a ride" on ticket confirmation
   - Venue websites: ConcertRide widget/iFrame

4. **Grassroots / Community**
   - Festival / concert sponsorships (visibility, driver recruitment)
   - University/college events (low-cost, high concentration of target users)
   - Music festivals (set up booth, convert attendees into drivers/passengers)

---

### 3. B2B Partnerships & Collaboration Models

**Potential partners to target:**

#### A. Ticket Platforms & Aggregators
- **Ticketmaster** (global, already integrated for ingestion)
  - Play: "Add transportation to ticket checkout"
  - Revenue: Commission on rides or referral fee
  - Risk: Ticketmaster competes directly if they like the unit economics

- **Songkick, Bandsintown** (concert discovery, LATAM presence)
  - Play: Add ride-matching below each concert event page
  - Revenue: Referral fee or revenue share per ride
  - Win-win: They own discovery, you own transport

- **Resident Advisor, Mixmag** (electronic music, niche but high-value)
  - Play: White-label or embed for electronic events
  - Revenue: Commission + sponsor integration

#### B. Event Venues & Promoters
- **Major festivals** (Primavera Sound, Sónar, FIB, etc.)
  - Play: Official ride partner, exclusive driver recruitment
  - Revenue: Commission per ride + sponsor package
  - Stickiness: Locked into annual calendars

- **Venue chains** (concert halls, arenas, clubs)
  - Play: Co-branded app or widget on venue website
  - Revenue: Commission + venue branding package
  - Example: "La Sala Apolo rides powered by ConcertRide"

#### C. Ride-Share & Mobility Platforms
- **Blablacar** (already owns long-distance carpooling, could acquire or partner)
  - Play: White-label ConcertRide as event-focused module
  - Revenue: Acquisition or partnership fee
  - Risk: They may see you as threat or opportunity

- **Local taxi / ride-hail operators** (Uber competitor, legacy fleets)
  - Play: License your matching algorithm + UX to their drivers
  - Revenue: Licensing fee + commission per ride
  - Win: They get event-focused verticals, you get distribution

#### D. Festivals & Event Production Companies
- **Live Nation, SFX Entertainment, Aeg**
  - Play: Integrate into their event apps (major festivals, tours)
  - Revenue: Licensing fee + per-ride commission
  - Scale: Millions of attendees across their portfolio

#### E. Music Streaming & Discovery
- **Spotify, Apple Music** (concert discovery is a growing feature)
  - Play: Add ride-booking button below artist concert listings
  - Revenue: Referral fee or revenue share
  - Network effect: Concert → ride booking → repeat

#### F. Corporate / Premium (B2B2C)
- **Enterprise event management** (corporate concerts, team-building)
  - Play: White-label for internal events (rides for employees)
  - Revenue: Per-ride fee or annual licensing
  - TAM: Limited but high-margin

---

### 4. Geographic Expansion & Localization

**Phase 1: Spain (Home Market)**
- Pilot with 1–2 major cities (Madrid, Barcelona)
- Partner with 2–3 local festivals or venues to validate CAC and churn
- Build Spanish SEO + community

**Phase 2: EU Expansion**
- Replicate model to Germany, France, Portugal (ticket culture + music scene)
- Adapt to local payment (SEPA, local payment methods), local ingestion sources
- Potential partners: Songkick (has localized data), Ticketmaster EU

**Phase 3: LATAM** (if traction in EU)
- Spanish-language advantage
- High concert culture (Argentina, Mexico, Colombia)
- Local partners: similar ticket platforms

---

### 5. Competitive Positioning & Messaging

**Vs. Blablacar:**
- Blablacar = long-distance, planned, repeat commuters
- ConcertRide = event-triggered, spontaneous, social/fun
- Message: "Same ride-share trust, but for the moment that matters"

**Vs. Uber:**
- Uber = on-demand logistics, surge pricing, impersonal
- ConcertRide = community-driven, fixed pricing, shared passion (music)
- Message: "Your people, your music, your ride"

**Vs. Event discovery platforms:**
- They own discovery, you own transport
- Message: "Book the ticket, book the ride. One checkout."

---

### 6. Sales Motion & First Customers

**Phase 1: Direct partnership outreach (3–6 months)**
- Identify 5–10 target partners (festivals, venues, Songkick, Bandsintown)
- Cold outreach from founder/BD lead with demo + data (DAU, ride volume, churn)
- Goal: 1–2 pilots with revenue-share or licensing deal

**Phase 2: Self-service onboarding (6–12 months)**
- Build partner dashboard (APIs, embeds, reporting)
- Enable venues/promoters to configure rides for their events
- Goal: 10–20 venue partners, each driving 100–500 rides/month

**Phase 3: Marketplace scaling (12+ months)**
- Move from 1-to-1 partnerships to self-serve marketplace
- Venues/promoters sign up, enable rides, keep a cut of commission
- Goal: 100+ venues, organic growth

---

### 7. Financial Projections & Unit Economics

**Model assumptions to validate:**

| Metric | Target |
|--------|--------|
| Avg ride fare | €15–25 |
| Commission rate (your take) | 12–15% |
| Revenue per ride | €1.80–3.75 |
| Rides per month (Month 12) | 10,000 |
| Monthly revenue (M12) | €18k–37.5k |
| CAC (driver) | €2–5 |
| CAC (passenger) | €1–2 |
| Driver lifetime rides | 8–12 |
| Passenger lifetime rides | 2–4 |
| Churn (monthly) | 40–60% (event-driven) |

**Key metrics to track:**
- Driver/passenger acquisition cost (by channel)
- Repeat rate (drivers who do 2+ rides)
- Ride completion rate (booked → completed)
- Revenue per user over lifetime

---

### 8. Proposal Structure & Deliverable

For your GTM plan, provide:

```
## Sales Strategy Overview

### Revenue Model(s)
- Primary model: [commission / licensing / hybrid]
- Secondary models: [premium features / data licensing / etc.]
- Pricing: [examples per channel]

### Phase 1: Validation (Months 0–3)
- Target audience: [B2C or B2B]
- Distribution channel(s): [organic, paid, partnerships]
- First 1K users from: [which source]
- Metrics to track: [CAC, churn, repeat rate]

### Phase 2: Initial Scale (Months 3–12)
- Primary partnership targets: [top 3 venues/festivals/platforms]
- Secondary organic channels: [SEO, referral, word-of-mouth]
- Revenue target: €X/month

### Phase 3: Marketplace (Months 12+)
- Partner self-serve enablement
- Expansion to [EU/LATAM]

### Sales Team & Ops
- Roles needed (BD lead, account manager, ops)
- Tools (CRM, analytics, partner dashboard)

### Competitive Positioning
- 1–2 sentence hook vs. Blablacar, Uber, Songkick

### Risk Mitigation
- What could go wrong (churn, acquisition costs, competitive response)?
- How to validate assumptions?
```

---

## Execution Instructions

1. **Analyze the current state:** ConcertRide's DAU, ride volume, churn, and user feedback
2. **Identify the strongest channel:** Which distribution lever (organic, paid, partnership, B2B) is most defensible?
3. **Pick a Phase 1 revenue model:** Commission-based, licensing, hybrid, or something novel?
4. **Rank partnership targets:** Which 5 companies would unlock the most TAM with lowest effort?
5. **Draft a 12-month roadmap:** Monthly revenue targets, key milestones, and metrics
6. **Flag risks:** What assumptions are most fragile and need validation?

---

**To use this prompt:**
1. Paste into Claude Code
2. Share ConcertRide's current user data (DAU, rides/month, churn, geography)
3. Ask: "Design a go-to-market and sales strategy for ConcertRide following the framework above. Prioritize the highest-impact channel and partnership targets."
