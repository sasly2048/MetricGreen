// Domain types — JSDoc for IDE intellisense without TypeScript build overhead.

/**
 * @typedef {Object} Sensor
 * @property {string} id
 * @property {string} name
 * @property {string} type - "iot" | "satellite" | "ground"
 * @property {string} location
 * @property {{lat:number,lon:number}} coords
 * @property {string} status - "online" | "degraded" | "offline"
 * @property {number} lastReading
 * @property {string} unit
 * @property {string} updatedAt - ISO timestamp
 * @property {string[]} certHashes
 */

/**
 * @typedef {Object} Producer
 * @property {string} id
 * @property {string} name
 * @property {string} wallet
 * @property {string} ensName
 * @property {string} country
 * @property {string} methodology
 * @property {string} vcsCert
 * @property {number} reputation
 * @property {number} creditsIssued
 * @property {string} joinedAt - ISO date
 * @property {boolean} verified
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} producerId
 * @property {string} registry - "Verra" | "Gold Standard" | "CAR" | "ACR"
 * @property {string} projectId
 * @property {"Reforestation"|"Direct Air Capture"|"Renewable Energy"|"Blue Carbon"|"Methane Capture"|"Soil Sequestration"} category
 * @property {string} location
 * @property {{lat:number,lon:number}} coords
 * @property {string} description
 * @property {string} imageHue
 * @property {number} totalIssued
 * @property {number} totalRetired
 * @property {number} available
 * @property {number} pricePerTonne
 * @property {string} vintage
 * @property {"Active"|"Listed"|"Retired"|"Challenged"} status
 * @property {string[]} sensorIds
 * @property {string} createdAt
 * @property {string} methodologyDoc
 */

/**
 * @typedef {Object} CarbonCredit
 * @property {string} id
 * @property {string} projectId
 * @property {string} serialNumber
 * @property {number} amount
 * @property {string} issuedAt
 * @property {string} mintedBy
 * @property {"Active"|"Retired"|"Listed"} status
 * @property {string} zkProof
 * @property {string} iotHash
 * @property {string} satelliteHash
 * @property {string} registryBatch
 * @property {string} challengeWindowEnds
 */

/**
 * @typedef {Object} AuditEvent
 * @property {string} id
 * @property {string} type - "Mint"|"Retire"|"Register"|"List"|"Purchase"|"Challenge"|"Verify"|"Revoke"
 * @property {string} actor
 * @property {string} projectId
 * @property {string} creditId
 * @property {number} amount
 * @property {string} txHash
 * @property {string} blockNumber
 * @property {string} timestamp
 * @property {string} note
 * @property {"Success"|"Pending"|"Failed"} status
 */

/**
 * @typedef {Object} MarketplaceListing
 * @property {string} id
 * @property {string} projectId
 * @property {string} creditId
 * @property {string} seller
 * @property {number} amount
 * @property {number} pricePerTonne
 * @property {string} vintage
 * @property {string} registry
 * @property {string} listedAt
 * @property {"Live"|"Sold"|"Cancelled"} status
 */

/**
 * @typedef {Object} NetworkMetric
 * @property {string} label
 * @property {string} value
 * @property {string} delta
 * @property {"up"|"down"|"flat"} trend
 * @property {string} hint
 */

// Centralized seed data — used across pages for a consistent demo narrative.
import { producers } from "./producers";
import { projects } from "./projects";
import { sensors } from "./sensors";
import { credits } from "./credits";
import { events } from "./events";
import { listings } from "./marketplace";

export {
  producers,
  projects,
  sensors,
  credits,
  events,
  listings,
};

export const networkStats = {
  totalCreditsIssued: 184_233,
  totalCreditsRetired: 71_402,
  totalTonneOffset: 184_233,
  activeProducers: 142,
  activeSensors: 1287,
  totalValueLocked: 24_800_000,
  averagePrice: 14.62,
  // For dashboard sparklines
  issuanceSeries: [
    4200, 4800, 5100, 5400, 5800, 6200, 6100, 6600, 7100, 7400, 7800, 8200,
    8100, 8600, 9100, 9400, 9800, 10200, 10600, 11000, 11400, 11800, 12200, 12600,
  ],
  retirementSeries: [
    1800, 1900, 2100, 2200, 2400, 2600, 2700, 2800, 3100, 3300, 3500, 3700,
    3900, 4100, 4300, 4500, 4700, 4900, 5100, 5300, 5500, 5700, 5900, 6100,
  ],
  priceSeries: [
    12.4, 12.8, 13.1, 12.9, 13.4, 13.6, 13.8, 14.1, 13.9, 14.2, 14.5, 14.6,
    14.3, 14.7, 14.9, 15.1, 14.8, 15.2, 15.4, 15.0, 14.9, 14.7, 14.6, 14.62,
  ],
  registryMix: [
    { name: "Verra", value: 58, color: "#10b981" },
    { name: "Gold Standard", value: 24, color: "#fbbf24" },
    { name: "CAR", value: 11, color: "#818cf8" },
    { name: "ACR", value: 7, color: "#fb7185" },
  ],
  categoryMix: [
    { name: "Reforestation", value: 34, color: "#10b981" },
    { name: "DAC", value: 18, color: "#22d3ee" },
    { name: "Renewable", value: 22, color: "#a78bfa" },
    { name: "Blue Carbon", value: 12, color: "#34d399" },
    { name: "Methane", value: 8, color: "#fbbf24" },
    { name: "Soil", value: 6, color: "#fb7185" },
  ],
};

export const chains = [
  {
    id: 1,
    name: "Sepolia",
    chainId: 11155111,
    short: "SEPOLIA",
    rpc: "https://rpc.sepolia.org",
    explorer: "https://sepolia.etherscan.io",
    isTestnet: true,
    contract: "0x336b85fBf799ca5fa67119aCd918B396E6EAbfcE",
  },
  {
    id: 2,
    name: "Polygon",
    chainId: 137,
    short: "POLYGON",
    rpc: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
    isTestnet: false,
    contract: "0x4a9b8e7c2d1f3a5b6c7d8e9f0a1b2c3d4e5f6a7b",
  },
  {
    id: 3,
    name: "Arbitrum One",
    chainId: 42161,
    short: "ARBITRUM",
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
    isTestnet: false,
    contract: "0x7c3a8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
  },
];

export const currentChain = chains[0];
