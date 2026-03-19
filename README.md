# 🌿 MetricGreen - **Decentralized Carbon Credit Infrastructure**

MetricGreen is a blockchain-based platform designed to eliminate greenwashing and double-counting in the voluntary carbon market (VCM). By integrating real-time IoT data with smart contracts through decentralized oracles, the system automates the minting of carbon credit NFTs based on verifiable, real-world environmental impact.

---

## 🚀 Key Features

- **Privacy-First Verification:** Validates compliance using Zero-Knowledge Proofs (zk-SNARKs) without exposing sensitive corporate telemetry and raw data.
- **VCS001 Compliance:** A built-in **VCS001 Certificate Registry** ensures entities mathematically register verified compliance profiles before minting permissions are granted.
- **Irreversible Retirement:** A permanent "burn" function removes credits from circulation once claimed, mathematically preventing resale or double-counting.
- **Automated Audit Trail:** Real-time data ingestion replaces slow manual audits with daily, immutable cryptographic verification.

---

## 🏗 The 4-Phase Workflow

Our architecture digitizes and secures the lifecycle of a carbon credit end-to-end:

1. **Registry Integration (VCS001)**
   Producers register their verified VCS001 status into the decentralized registry layer. The smart contract actively prevents unauthorized wallets from interacting with minting mechanisms.

2. **Data Ingestion & ZK-Verification**
   Production metrics are routed via IoT sensors and Chainlink Functions. Producers generate a local **Zero-Knowledge Proof** to mathematically confirm compliance with environmental thresholds without uploading any raw proprietary data.

3. **Automated Minting & Challenge Window**
   Upon programmatic verification of the proof, the smart contract dynamically mints a unique ERC-721 Carbon Credit NFT. The asset briefly enters a "challenge window" pending third-party verifier attestation against the VCS001 registry.

4. **Marketplace Exchange & Retirement**
   The NFT is listed on the platform marketplace. When a corporate buyer purchases and claims the offset, the NFT is irreversibly urned, dropping the circulating supply and generating a permanent, tamper-proof on-chain certificate.

---

## 🛠 Technical Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Blockchain** | Polygon / Arbitrum | Low-cost, high-throughput transactions for minting & retiring. |
| **Smart Contracts** | Solidity | Implements NFT logic, ownership tracking, and Registry Integrations. |
| **Privacy Layer** | Circom / SnarkJS | Generates and verifies Zero-Knowledge Proofs off-chain. |
| **Oracles** | Chainlink Functions | Connects real-world IoT measurements to on-chain logic. |
| **Storage** | IPFS (Pinata) | Stores encrypted reports and metadata in a decentralized manner. |
| **Frontend** | Next.js 15 & Tailwind v4 | Hyper-responsive Web3 dashboard for monitoring offsets. |
| **Development** | Foundry / Hardhat | High-performance smart contract compilation and testing. |

---

## ⚡ Getting Started

First, install dependencies and run the development server:

`ash
npm install
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the dashboard.
