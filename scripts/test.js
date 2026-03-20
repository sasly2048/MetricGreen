const fs = require("fs");
const solc = require("solc");
const { ethers } = require("ethers");
const ganache = require("ganache");

async function runTest() {
  console.log("Compiling...");
  const source = fs.readFileSync("./contracts/MetricGreen.sol", "utf8");
  const input = {
    language: "Solidity",
    sources: { "MetricGreen.sol": { content: source } },
    settings: { outputSelection: { "*": { "*": ["*"] } } }
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contractData = output.contracts["MetricGreen.sol"].MetricGreen;

  console.log("Starting local EVM...");
  const provider = new ethers.BrowserProvider(ganache.provider());
  const signer = await provider.getSigner(0);
  const user = await provider.getSigner(1);

  console.log("Deploying MetricGreen...");
  const factory = new ethers.ContractFactory(contractData.abi, contractData.evm.bytecode.object, signer);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("Deployed at:", address);

  console.log("\n--- Running Tests ---");
  
  // 1. Initial State
  const admin = await contract.admin();
  console.log("Admin matches deployer:", admin === signer.address ? "PASS" : "FAIL");

  // 2. Register Certificate
  const contractAsUser = contract.connect(user);
  await contractAsUser.registerCertificate("VCS001-XYZ123");
  const isReg = await contractAsUser.isRegistered(user.address);
  const cert = await contractAsUser.registryCertificates(user.address);
  console.log("User registered properly:", (isReg && cert === "VCS001-XYZ123") ? "PASS" : "FAIL");

  // 3. Mint Credit
  await contractAsUser.mintCredit("WindFarm Alpha", 500);
  const count = await contractAsUser.getCreditsCount();
  const credit = await contractAsUser.credits(0);
  console.log("Credit minted:", (count === 1n && credit.carbonAmount === 500n) ? "PASS" : "FAIL");

  // 4. Retire Credit
  await contractAsUser.retireCredit(0);
  const updatedCredit = await contractAsUser.credits(0);
  console.log("Credit retired:", updatedCredit.isRetired === true ? "PASS" : "FAIL");

  // 5. Revoke Certificate (Admin only)
  await contract.revokeCertificate(user.address);
  const isRegAfter = await contract.isRegistered(user.address);
  console.log("Admin revoked user certificate:", !isRegAfter ? "PASS" : "FAIL");
}

runTest().catch(console.error);

