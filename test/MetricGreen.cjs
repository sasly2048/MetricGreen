import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("MetricGreen Contract", function () {
  let contract, owner, addr1;

  beforeEach(async function () {
    const MetricGreen = await ethers.getContractFactory("MetricGreen");
    [owner, addr1] = await ethers.getSigners();
    contract = await MetricGreen.deploy();
  });

  it("Should set the right admin", async function () {
    expect(await contract.admin()).to.equal(owner.address);
  });

  it("Should register a VCS001 certificate", async function () {
    await contract.connect(addr1).registerCertificate("VCS001-XYZ");
    expect(await contract.isRegistered(addr1.address)).to.be.true;
    expect(await contract.registryCertificates(addr1.address)).to.equal("VCS001-XYZ");
  });
});
