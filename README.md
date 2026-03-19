# 🌿 MetricGreen – Decentralized Carbon Credit Infrastructure

**MetricGreen** is a blockchain-based platform designed to eliminate greenwashing and double-counting in the voluntary carbon market (VCM). By integrating IoT data with smart contracts through decentralized oracles, the system automates the minting of carbon credit NFTs based on verifiable, real-world environmental impact.

---

## 🚀 Key Features

- **Privacy-First Verification:** Validates environmental thresholds using Zero-Knowledge Proofs (zk-SNARKs) without exposing sensitive raw corporate data.
- **Financial Accountability:** A built-in **Reputation Bond** mechanism financially penalizes fraudulent submissions, ensuring trust in the ecosystem.
- **Irreversible Retirement:** A permanent urn function removes credits from circulation once claimed, mathematically preventing resale or double-counting.
- **Near Real-Time Verification:** Automated pipelines replace slow manual audits with daily cryptographic verification.

---

## 🏗 The Architecture & Workflow

The platform securely digitizes the lifecycle of a carbon credit from generation to retirement:

`mermaid
sequenceDiagram
    autonumber
    actor Producer as Carbon Producer
    participant SC as MetricGreen Contract
    participant Oracle as Chainlink / IoT
    participant ZK as ZK-Proof Engine
    actor Buyer as Corporation

    Producer->>SC: 1. Stake Reputation Bond (USDC/DAI)
    Oracle->>ZK: 2. Ingest IoT Data & Validate
    ZK-->>SC: 3. Submit Cryptographic ZK-Proof
    SC->>Producer: 4. Mint Carbon Credit NFT (ERC-721)
    Note over SC: Enters "Challenge Window"
    Buyer->>SC: 5. Purchase Credit on Marketplace
    Buyer->>SC: 6. Retire Credit (Burn)
    SC-->>Buyer: 7. Issue On-Chain Offset Certificate
`

### Phase Breakdown:
1. **Security Layer:** Producers deposit a Reputation Bond (USDC/DAI) into escrow.
2. **Data Ingestion:** IoT sensors route data via Chainlink. Producers generate local ZK-Proofs to confirm compliance.
3. **Automated Minting:** Valid proofs dynamically mint ERC-721 Carbon Credits subject to a challenge window.
4. **Retirement:** Corporations purchase and "burn" the credit, receiving an immutable on-chain certificate.

---

## 🛠 Technical Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Blockchain** | Polygon / Arbitrum (L2) | Low-cost, high-throughput transactions for minting & retiring. |
| **Smart Contracts** | Solidity | Implements NFT logic, ownership tracking, and Reputation Escrow. |
| **Privacy Layer** | Circom / SnarkJS | Generates and verifies Zero-Knowledge Proofs. |
| **Oracles** | Chainlink Functions | Connects off-chain IoT measurements to on-chain logic. |
| **Storage** | IPFS (via Pinata) | Stores encrypted reports and metadata in a decentralized manner. |
| **Frontend** | Next.js & Tailwind CSS | Web3 dashboard for monitoring carbon offsets and transactions. |
| **Development** | Foundry / Hardhat | Supports intelligent smart contract development and testing. |

---

## ⚡ Getting Started

First, install dependencies and run the development server:

`ash
npm install
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
