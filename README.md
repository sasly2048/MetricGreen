# 🌿 MetricGreen – Decentralized Carbon Credit Infrastructure

**MetricGreen** is a blockchain-based platform designed to eliminate greenwashing and double-counting in the voluntary carbon market (VCM). By integrating IoT data with smart contracts through decentralized oracles, the system automates the minting of carbon credit NFTs based on verifiable, real-world environmental impact.

---

## 🚀 Key Features

- **Privacy-First Verification:** Validates environmental thresholds using Zero-Knowledge Proofs (zk-SNARKs) without exposing sensitive raw corporate data.
- **Financial Accountability:** A built-in **Reputation Bond** mechanism financially penalizes fraudulent submissions, ensuring trust in the ecosystem.
- **Irreversible Retirement:** A permanent `burn` function removes credits from circulation once claimed, mathematically preventing resale or double-counting.
- **Near Real-Time Verification:** Automated pipelines replace slow manual audits with daily cryptographic verification.

---

## 🏗 System Architecture & Workflow

The platform securely digitizes the lifecycle of a carbon credit from generation to retirement across three distinct layers:

### 1. Architectural Diagram

```mermaid
graph TD
    classDef actor node fill:#312e81,stroke:#6366f1,stroke-width:2px,color:#fff,rx:8;
    classDef contract fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    
    subgraph Layer1 [Data & Privacy Layer]
        A([📡 IoT Sensors]) -->|Raw Data| B(Chainlink Oracle)
        B -->|Encrypted Feed| C{ZK-Proof Engine}
    end

    subgraph Layer2 [Blockchain Layer Polygon / Arbitrum]
        C -->|Valid ZK-Proof| D[MetricGreen Smart Contract]
        P([🌱 Carbon Producer]):::actor -->|Stakes USDC Bond| D
        D -->|Mints ERC-721| E(Carbon Credit NFT)
    end

    subgraph Layer3 [Marketplace & Verification]
        E --> F[Decentralized Marketplace]
        F -->|Purchases & Burns| G([🏢 Corporate Buyer]):::actor
        G -->|Receives| H[On-Chain Offset Certificate]
    end

    style Layer1 fill:#171717,stroke:#333,stroke-width:1px
    style Layer2 fill:#171717,stroke:#333,stroke-width:1px
    style Layer3 fill:#171717,stroke:#333,stroke-width:1px
### 2. The 4-Phase Workflow

1. **Phase 1: Security Setup (Reputation Bond)**
   - Producers must deposit a Reputation Bond (in stablecoins like USDC/DAI) into a smart contract escrow. This acts as strict financial collateral against fraudulent reporting.

2. **Phase 2: Data Ingestion & ZK-Verification**
   - Metrics are collected via IoT sensors and external APIs through Chainlink Functions.
   - Instead of uploading sensitive raw corporate data, producers generate a local **Zero-Knowledge Proof (zk-SNARK)** that mathematically confirms compliance with predefined thresholds.

3. **Phase 3: Automated Minting & The "Challenge Window"**
   - Upon programmatic verification of the ZK-Proof, the smart contract dynamically mints a unique ERC-721 Carbon Credit NFT.
   - The asset briefly enters a "challenge window" where the Reputation Bond remains locked and can be slashed if manual anomalies are detected.

4. **Phase 4: Marketplace Exchange & Irreversible Retirement**
   - The NFT is listed on the platform marketplace.
   - Corporations purchase credits using stablecoins. To claim the carbon offset, the NFT is irreversibly `burned` via the contract's retire function, dropping the circulating supply and generating a permanent, tamper-proof on-chain certificate.

---

## 🛠 Technical Stack

| Layer               | Technology               | Purpose                                                          |
| :------------------ | :----------------------- | :--------------------------------------------------------------- |
| **Blockchain**      | Polygon / Arbitrum (L2)  | Low-cost, high-throughput transactions for minting & retiring.   |
| **Smart Contracts** | Solidity                 | Implements NFT logic, ownership tracking, and Reputation Escrow. |
| **Privacy Layer**   | Circom / SnarkJS         | Generates and verifies Zero-Knowledge Proofs.                    |
| **Oracles**         | Chainlink Functions      | Connects off-chain IoT measurements to on-chain logic.           |
| **Storage**         | IPFS (via Pinata)        | Stores encrypted reports and metadata in a decentralized manner. |
| **Frontend**        | Next.js 15 & Tailwind v4 | Web3 dashboard for monitoring carbon offsets and transactions.   |
| **Development**     | Foundry / Hardhat        | Supports intelligent smart contract development and testing.     |

---

## ⚡ Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
