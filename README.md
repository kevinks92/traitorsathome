# The Traitors at Home 🗡️

A real-life social deduction party game — a mobile PWA that lets you run your own version of *The Traitors* for friends at home. One person hosts, everyone else plays on their phone. No app download needed.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Backend / Realtime DB | [Convex](https://convex.dev) |
| Hosting | GitHub Pages / Vercel / Netlify (your choice) |
| PWA | vite-plugin-pwa (installable on iOS & Android) |

---

## First-time setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd traitors-at-home
npm install
```

### 2. Create a Convex project

```bash
npm run convex:dev
```

This will:
- Prompt you to log in to Convex (free account)
- Create a new project
- Generate `convex/_generated/` automatically
- Print your deployment URL (e.g. `https://happy-animal-123.convex.cloud`)

### 3. Set your environment variable

```bash
cp .env.example .env
# Then edit .env and paste in your Convex URL
```

### 4. Run locally

```bash
# In one terminal — keep Convex syncing:
npm run convex:dev

# In another terminal — Vite dev server:
npm run dev
```

Open `http://localhost:5173` on your phone or desktop. Share the game ID with your players — they just need the URL.

---

## Deploying to production

### Deploy Convex backend

```bash
npm run convex:deploy
```

### Deploy frontend (Vercel example)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add environment variable `VITE_CONVEX_URL` = your Convex URL
4. Deploy — Vercel builds with `npm run build` automatically

The PWA is installable: players can tap "Add to Home Screen" on iOS/Android for a native-app feel.

---

## Project structure

```
traitors-at-home/
├── convex/
│   ├── schema.ts          # Convex DB schema (key-value store)
│   └── storage.ts         # get / set / del / delByPrefix functions
├── public/
│   ├── icon-192.png       # PWA icon (add your own)
│   └── icon-512.png
├── src/
│   ├── constants/
│   │   ├── phases.js      # PHASES, ROOMS, PHASE_INSTRUCTIONS, PHASE_STRIP
│   │   ├── quips.js       # HOST_QUIPS, getQuip
│   │   ├── timers.js      # BASE_PHASE_TIMERS, getPhaseTimers
│   │   └── content.js     # TRIVIA_BANK, MISSIONS, HOT_TAKES, etc.
│   ├── utils/
│   │   └── gameUtils.js   # generateWitnessQuestions, shuffle, helpers
│   ├── styles/
│   │   └── index.js       # FONTS + CSS template literal
│   ├── components/
│   │   ├── PhaseContent.jsx      # Per-phase player UI (largest component)
│   │   ├── PhaseAtmosphere.jsx   # Ambient background visuals
│   │   ├── AnimatedCandles.jsx
│   │   ├── GoldFrame.jsx
│   │   ├── RoleCard.jsx
│   │   ├── BanishReveal.jsx
│   │   ├── RoomSelector.jsx      # Free-roam room + mission UI
│   │   ├── GameIntroScreen.jsx
│   │   ├── WinnerScreen.jsx
│   │   ├── HistoryScreen.jsx
│   │   ├── HistoryStatsCard.jsx
│   │   ├── StatsCard.jsx
│   │   ├── TutorialScreen.jsx
│   │   ├── DemoScreen.jsx
│   │   ├── GameElementToggle.jsx
│   │   ├── GhostChat.jsx
│   │   ├── MsgLog.jsx
│   │   └── AvatarCapture.jsx
│   ├── storage.js          # save() / load() backed by Convex HTTP client
│   ├── TraitorsGame.jsx    # Main game component (~2700 lines)
│   └── main.jsx            # React entry point + ConvexProvider
├── index.html
├── vite.config.js
└── package.json
```

---

## How the game works

- **Host** creates a game, shares the 6-character Game ID
- **Players** join on their own phones via the same URL
- The host runs all phase transitions from their panel
- State is persisted in Convex — players can close/reopen their browser and rejoin automatically
- Polling interval: 2.2 seconds (same as original; Convex reactive queries can be adopted for instant updates in a future upgrade)

---

## Adding PWA icons

Drop two PNG files into `/public/`:
- `icon-192.png` — 192×192px
- `icon-512.png` — 512×512px

A simple dark shield or candle on a black background works great.
