const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying MetricGreen with:", deployer.address);
  const MetricGreen = await hre.ethers.getContractFactory("MetricGreen");
  const contract = await MetricGreen.deploy();
  await contract.waitForDeployment();
  const addr = await contract.getAddress();
  console.log("MetricGreen deployed to:", addr);
  console.log("Set NEXT_PUBLIC_METRIC_GREEN_CONTRACT_ADDRESS=" + addr);
}

main().catch((e) => { console.error(e); process.exit(1); });
