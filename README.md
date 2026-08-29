# 🌿 MetricGreen — Programmable Carbon Credit Infrastructure

**MetricGreen** is an institutional-grade decentralized protocol for issuing, trading, and permanently retiring verifiable carbon credits. It combines zero-knowledge proofs, IoT sensor fusion, and on-chain attestations to eliminate greenwashing and double-counting at the protocol layer.

> _The future of the voluntary carbon market is cryptographic, transparent, and permanent._

---

## ✨ What's inside

A complete, production-grade SaaS product, including:

- **Marketing site** with a distinctive editorial layout: hero, problem (sticky-rail), solution, workflow (sticky-rail), stats, architecture, testimonials, FAQ, CTA
- **Dashboard** with KPIs, charts, sensor status, recent on-chain events
- **Projects** directory, project detail, and a 3-step register & mint flow
- **Marketplace** with live listings, filters, and a multi-stage purchase & retire dialog
- **Audit trail** with searchable, expandable on-chain events
- **Admin / Verifier console** with review queue, producer registry, and protocol settings
- **Settings** with profile, notifications, security, audio, API keys, billing, webhooks
- **Docs** with anchor navigation, architecture, smart contract reference, API docs
- **Pricing** (with full comparison table), **Security**, **How it Works** marketing pages
- **Command palette** (⌘K), wallet connection modal with 4 providers, persistent demo state

### Design system polish

- **Type system**: Inter (UI), Space Grotesk (display), JetBrains Mono (data), Instrument Serif (editorial italic accents)
- **Surface scale**: three tiers (`.surface-1`, `.surface-2`, `.surface-3`) with consistent border + blur tokens
- **Eyebrow** → **Title** → **Description** pattern reused across every section for visual rhythm
- **Sticky-rail layouts** on problem/workflow sections for editorial asymmetry
- **Tightened type scale**: `-0.03em` letter-spacing on display, `1.05` line-height, `tabular-nums` on numerics
- **Mono captions**: `10px` uppercase tracked text for labels, `9.5px` for fine print, `8.5px` for chart labels
- **All page headers** share the same `PageHeader` component (eyebrow / title / description / actions)
- **Consistent section rhythm** with `Section` component + `mt-10` between sections
- **All elevations** use the same border opacity range (`white/[0.04–0.10]`)
- **All icons** sized consistently at `h-3.5 w-3.5` in body text, `h-4 w-4` in actions
- **All numeric data** use JetBrains Mono with `tabular-nums` for column alignment

### SFX system

- **Subtle by design** — sounds only on key moments (success, error, burn, proof, purchase, connect, switch, step, notify, tick)
- **Master volume slider** in Settings, with live preview buttons for every effect
- **Normal / Developer modes** — Normal mutes the keyboard chatter, Developer adds tighter feedback
- **Toggle in header** and in the wallet menu for quick access
- **Sustained sound palette** of 10 carefully-tuned Web Audio synth sounds (no asset files)

## 🛠 Tech stack

| Layer           | Technology                                                                    |
| --------------- | ----------------------------------------------------------------------------- |
| Frontend        | Next.js 16, React 19, Tailwind CSS 4                                          |
| Animations      | Framer Motion                                                                 |
| Icons           | lucide-react                                                                  |
| Notifications   | sonner                                                                        |
| Sound           | Web Audio API (no asset files)                                                |
| Smart Contracts | Solidity 0.8.28, OpenZeppelin ERC-721 + ReentrancyGuard, Hardhat              |
| Off-chain       | Node.js API route for IoT/satellite verification                              |
| Charts          | Custom SVG (no chart library dep)                                             |
| State           | React Context + localStorage persistence                                      |

## 🚀 Getting started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Environment variables (optional)

Create `.env.local`:

```env
NEXT_PUBLIC_METRIC_GREEN_CONTRACT_ADDRESS=0x336b85fBf799ca5fa67119aCd918B396E6EAbfcE
NEXT_PUBLIC_METRIC_GREEN_CHAIN_ID=11155111
NEXT_PUBLIC_METRIC_GREEN_CHAIN_NAME=Sepolia

IOT_HARDWARE_API_KEY=
SATELLITE_PROVIDER_API_KEY=
SATELLITE_PROVIDER_URL=https://api.open-meteo.com/v1/forecast
```

### Smart contracts

```bash
npm run compile         # Compile Solidity
npm run test            # Run Hardhat test suite
npm run deploy:sepolia  # Deploy to Sepolia
```

## 🏗 Architecture

```
src/
├── app/                         # Pages (App Router)
│   ├── (marketing)              # Landing, how-it-works, pricing, security
│   ├── dashboard/               # Producer & buyer console
│   ├── projects/                # Project directory + detail + new
│   ├── marketplace/             # Live listings
│   ├── audit/                   # On-chain event log
│   ├── admin/                   # Verifier console
│   ├── settings/                # Account settings (profile, audio, API, webhooks)
│   ├── docs/                    # Documentation
│   └── api/verify/              # ZK + sensor verification endpoint
├── components/
│   ├── site/                    # Header, footer, command palette, brand, audio bootstrap
│   ├── marketing/               # Landing page sections (each is its own component)
│   ├── dashboard/               # Dashboard sidebar (with mobile sheet)
│   ├── marketplace/             # Purchase & retire dialog
│   ├── projects/                # Mint flow dialog
│   ├── ui/                      # Reusable primitives (Button, Card, Charts, Illustrations, Logos, EmptyStates, MicroInteractions, Tooltip, Page)
│   └── ...                      # Each component is small and focused
├── lib/                         # Mock data layer, demo state, utils, sfx
└── ...
```

## 🔐 Smart contract

`contracts/MetricGreen.sol` implements:

- `registerProducer(bytes32 certId, string methodology)` — pay a 1+ ETH reputation bond
- `mintCredit(MintParams)` — issue an ERC-721 with embedded ZK proof, IoT hash, and satellite hash
- `attest(uint256 creditId)` — verifier-only attestation
- `challenge(uint256 creditId, string reason)` — verifier-only dispute (reduces producer reputation)
- `retire(uint256 creditId)` — permanent, irreversible burn that emits a retirement certificate
- `revokeProducer(address)` — admin-only producer revocation
- `addVerifier(address)` / `removeVerifier(address)` — manage verifier set

See `test/MetricGreen.js` for the full test suite.

## 🛡 License

MIT for smart contracts. Apache 2.0 for off-chain components.
