import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, waffle } from 'hardhat';
import chai from 'chai';
import { Contract } from 'ethers';

chai.use(waffle.solidity);
const { expect } = chai;

const NFT_NAME = 'Soulbound Token';
const NFT_SYMBOL = 'SBT';
const BASE_URI = 'https://example.com/nft';

describe('SBT', () => {
  let sbt: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();
    const SBT = await ethers.getContractFactory('SBT');
    sbt = await SBT.deploy(NFT_NAME, NFT_SYMBOL);
    await sbt.deployed();
  });

  /**
   * Deployment
   */
  describe('Deployment', () => {
    it('SBT contract deployed successfully', async () => {
      expect(sbt.address).to.not.be.undefined;
    });

    it('Check name and symbol', async () => {
      expect(await sbt.name()).to.be.equal(NFT_NAME);
      expect(await sbt.symbol()).to.be.equal(NFT_SYMBOL);
    });
  });

  /**
   * Ownership
   */
  describe('Ownership', () => {
    it('Check owner', async () => {
      expect(await sbt.owner()).to.be.equal(owner.address);
    });

    it('Non owner can\'t transfer ownership', async () => {
      await expect(
        sbt.connect(user1).transferOwnership(owner.address)
      ).to.be.reverted;
    });

    it('Owner can transfer ownership', async () => {
      expect(await sbt.owner()).to.be.equal(owner.address);
      await sbt.connect(owner).transferOwnership(user1.address);
      expect(await sbt.owner()).to.be.equal(user1.address);
    });
  });

  /**
   * claimSBT
   */
  describe('claimSBT', () => {
    it('Not issued SBT can\'t be claimed', async () => {
      await expect(sbt.connect(user1).claimSBT(BASE_URI)).to
        .be.reverted;
    });

    it('Issued SBT can be claimed', async () => {
      await sbt.connect(owner).issueSBT(user1.address);
      await sbt.connect(user1).claimSBT(BASE_URI);

      expect(await sbt.accountToURI(user1.address)).to.be.equal(BASE_URI);
    });
  });
});
