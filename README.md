# 🌿 MetricGreen - **Decentralized Carbon Credit Infrastructure**

**MetricGreen** is a blockchain-based platform designed to eliminate greenwashing and double-counting in the voluntary carbon market (VCM). By integrating IoT data and API Keys with smart contracts through decentralized oracles, the system automates the minting of carbon credit NFTs based on verifiable, real-world environmental impact.

https://metricgreen1.vercel.app/

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
   Using the built-in MetricGreen dApp dashboard, users input customized environmental data (Project Name, specific Registry standard like Verra/Gold Standard, specific Project ID, and custom credit amounts). Upon programmatic verification of the proof, the smart contract dynamically mints a customized ERC-721 Carbon Credit NFT. The asset briefly enters a "challenge window" pending third-party verifier attestation against the selected registry.

4. **Marketplace Exchange & Retirement**
   The NFT is listed on the platform marketplace. When a corporate buyer purchases and claims the offset, the NFT is irreversibly turned, dropping the circulating supply and generating a permanent, tamper-proof on-chain certificate.

---

## 🛠 Technical Stack

| Layer               | Technology          | Purpose                                                              |
| :------------------ | :------------------ | :------------------------------------------------------------------- |
| **Blockchain**      | Polygon / Arbitrum  | Low-cost, high-throughput transactions for minting & retiring.       |
| **Smart Contracts** | Solidity            | Implements NFT logic, ownership tracking, and Registry Integrations. |
| **Privacy Layer**   | Circom / SnarkJS    | Generates and verifies Zero-Knowledge Proofs off-chain.              |
| **Oracles**         | Chainlink Functions | Connects real-world IoT measurements to on-chain logic.              |
| **Storage**         | IPFS (Pinata)       | Stores encrypted reports and metadata in a decentralized manner.     |
| **Development**     | Foundry / Hardhat   | High-performance smart contract compilation and testing.             |

---

## �️ Sensor Fusion (IoT + Satellite dMRV)

1. Create a `.env.local` file in the root directory.
2. Add your Smart Contract Address and your IoT API credentials:

```env
NEXT_PUBLIC_METRIC_GREEN_CONTRACT_ADDRESS="0xYourDeployedContractAddress"

# Ground Node: Factory IoT Gateway
IOT_SENSOR_API_KEY="your_iot_gateway_key_here"

# Space Node: Geospatial dMRV Oracle (e.g. Sentinel-5P, GHGSat)
SATELLITE_ORACLE_API_KEY="your_satellite_provider_key_here"
SATELLITE_ORACLE_URL="https://api.space-observation.com/v1/co2-column"
```

MetricGreen is designed to pull raw `CO2e` reduction metrics securely via this external API, funnel it locally through the Zero-Knowledge generation layer, and publish **only** the mathematical cryptographic proof on-chain—fully protecting your raw proprietary factory telemetry.

---

## ⚡ Getting Started

**Prerequisites:**

- A Web3 Crypto Wallet like [MetaMask](https://metamask.io/) installed in your browser is **required** to interact with the blockchain and mint carbon credits.
- Node.js installed on your machine.

First, install dependencies and run the development server:

```bash
npm install
```

```bash
npm run dev
```
