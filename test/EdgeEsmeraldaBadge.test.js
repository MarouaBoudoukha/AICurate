const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EdgeEsmeraldaBadge", function () {
  let badge;
  let owner;
  let user1;
  let user2;
  let user3;
  
  const BASE_URI = "https://api.aicurate.app/metadata/badges/";
  const NULL_HASH_1 = "0x1234567890123456789012345678901234567890123456789012345678901234";
  const NULL_HASH_2 = "0x2234567890123456789012345678901234567890123456789012345678901234";
  const NULL_HASH_3 = "0x3234567890123456789012345678901234567890123456789012345678901234";

  beforeEach(async function () {
    console.log("🏗️  Setting up test environment...");
    
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    const EdgeEsmeraldaBadge = await ethers.getContractFactory("EdgeEsmeraldaBadge");
    badge = await EdgeEsmeraldaBadge.deploy(BASE_URI, owner.address);
    await badge.waitForDeployment();
    
    console.log("✅ Contract deployed at:", await badge.getAddress());
  });

  describe("🚀 Contract Deployment", function () {
    it("Should deploy with correct initial values", async function () {
      expect(await badge.currentSupply()).to.equal(0);
      expect(await badge.MAX_SUPPLY()).to.equal(2000);
      
      const contractAddress = await badge.getAddress();
      expect(contractAddress).to.be.properAddress;
      
      console.log("✅ Initial supply:", (await badge.currentSupply()).toString());
      console.log("✅ Max supply:", (await badge.MAX_SUPPLY()).toString());
    });

    it("Should set correct owner", async function () {
      expect(await badge.owner()).to.equal(owner.address);
      console.log("✅ Owner set correctly:", await badge.owner());
    });

    it("Should return correct badge info", async function () {
      const info = await badge.getBadgeInfo();
      expect(info[0]).to.equal(0); // current supply
      expect(info[1]).to.equal(2000); // max supply
      expect(info[2]).to.equal(2000); // remaining
      
      console.log("✅ Badge info - Current:", info[0].toString(), "Max:", info[1].toString(), "Remaining:", info[2].toString());
    });
  });

  describe("💎 EdgeEsmeralda Minting", function () {
    it("Should allow user to mint EdgeEsmeralda badge", async function () {
      console.log("🔥 Testing user minting...");
      
      // Check user can mint before minting
      expect(await badge.canMint(user1.address)).to.be.true;
      
      // Mint badge
      const tx = await badge.connect(user1).mintEdgeEsmeralda(user1.address, NULL_HASH_1);
      const receipt = await tx.wait();
      
      // Check results
      expect(await badge.balanceOf(user1.address, 1)).to.equal(1);
      expect(await badge.hasMinted(user1.address)).to.be.true;
      expect(await badge.currentSupply()).to.equal(1);
      expect(await badge.canMint(user1.address)).to.be.false;
      
      console.log("✅ Badge minted successfully!");
      console.log("   Transaction hash:", receipt.hash);
      console.log("   Gas used:", receipt.gasUsed.toString());
      console.log("   Current supply:", (await badge.currentSupply()).toString());
    });

    it("Should prevent double minting to same address", async function () {
      console.log("🚫 Testing double minting prevention...");
      
      // First mint should succeed
      await badge.connect(user1).mintEdgeEsmeralda(user1.address, NULL_HASH_1);
      
      // Second mint should fail
      await expect(
        badge.connect(user1).mintEdgeEsmeralda(user1.address, NULL_HASH_2)
      ).to.be.revertedWith("Already minted");
      
      console.log("✅ Double minting correctly prevented");
    });

    it("Should prevent reuse of nullifier hash", async function () {
      console.log("🔒 Testing nullifier hash uniqueness...");
      
      // First user mints with NULL_HASH_1
      await badge.connect(user1).mintEdgeEsmeralda(user1.address, NULL_HASH_1);
      
      // Second user tries to use same nullifier hash - should fail
      await expect(
        badge.connect(user2).mintEdgeEsmeralda(user2.address, NULL_HASH_1)
      ).to.be.revertedWith("Nullifier used");
      
      console.log("✅ Nullifier hash reuse correctly prevented");
    });

    it("Should track current supply correctly", async function () {
      console.log("📊 Testing supply tracking...");
      
      // Mint 3 badges
      await badge.connect(user1).mintEdgeEsmeralda(user1.address, NULL_HASH_1);
      await badge.connect(user2).mintEdgeEsmeralda(user2.address, NULL_HASH_2);
      await badge.connect(user3).mintEdgeEsmeralda(user3.address, NULL_HASH_3);
      
      expect(await badge.currentSupply()).to.equal(3);
      
      const info = await badge.getBadgeInfo();
      expect(info[2]).to.equal(1997); // remaining = 2000 - 3
      
      console.log("✅ Supply tracking working correctly");
      console.log("   Current supply:", (await badge.currentSupply()).toString());
      console.log("   Remaining:", info[2].toString());
    });

    it("Should emit EdgeEsmeraldaMinted event", async function () {
      console.log("📡 Testing event emission...");
      
      await expect(
        badge.connect(user1).mintEdgeEsmeralda(user1.address, NULL_HASH_1)
      ).to.emit(badge, "EdgeEsmeraldaMinted")
       .withArgs(user1.address, 1, NULL_HASH_1);
      
      console.log("✅ Event emitted correctly");
    });
  });

  describe("🔒 Security Tests", function () {
    it("Should prevent transfers (soulbound)", async function () {
      console.log("🛡️  Testing soulbound property...");
      
      // Mint badge to user1
      await badge.connect(user1).mintEdgeEsmeralda(user1.address, NULL_HASH_1);
      
      // Try to transfer - should fail
      await expect(
        badge.connect(user1).safeTransferFrom(user1.address, user2.address, 1, 1, "0x")
      ).to.be.revertedWith("EdgeEsmeralda badges are soulbound");
      
      console.log("✅ Transfer correctly prevented (soulbound)");
    });

    it("Should prevent minting with zero nullifier", async function () {
      console.log("🚫 Testing zero nullifier prevention...");
      
      await expect(
        badge.connect(user1).mintEdgeEsmeralda(user1.address, "0x0000000000000000000000000000000000000000000000000000000000000000")
      ).to.be.revertedWith("Invalid nullifier");
      
      console.log("✅ Zero nullifier correctly rejected");
    });
  });

  describe("👑 Admin Functions", function () {
    it("Should allow admin to mint badges", async function () {
      console.log("👨‍💼 Testing admin mint...");
      
      await badge.connect(owner).adminMint(user1.address);
      
      expect(await badge.balanceOf(user1.address, 1)).to.equal(1);
      expect(await badge.currentSupply()).to.equal(1);
      
      console.log("✅ Admin mint successful");
    });

    it("Should prevent non-admin from using admin mint", async function () {
      console.log("🚫 Testing admin-only restriction...");
      
      await expect(
        badge.connect(user1).adminMint(user2.address)
      ).to.be.revertedWithCustomError(badge, "OwnableUnauthorizedAccount");
      
      console.log("✅ Non-admin correctly blocked from admin functions");
    });
  });

  describe("📈 Gas Usage Analysis", function () {
    it("Should report gas usage for minting", async function () {
      console.log("⛽ Analyzing gas usage...");
      
      const tx = await badge.connect(user1).mintEdgeEsmeralda(user1.address, NULL_HASH_1);
      const receipt = await tx.wait();
      
      console.log("📊 Gas Usage Report:");
      console.log("   Gas used for minting:", receipt.gasUsed.toString());
      console.log("   Gas price:", receipt.gasPrice?.toString() || "N/A");
      
      // Expect reasonable gas usage (less than 200k gas)
      expect(receipt.gasUsed).to.be.below(200000);
    });
  });
});