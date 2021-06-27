const { assert, expect } = require("chai");
const CoinFlip = artifacts.require("CoinFlip");
const truffleAssert = require("truffle-assertions");
const zeroAddress = "0x0000000000000000000000000000000000000000";

let instance, event, activePlayer, inactivePlayer, winner, loser, participant1, participant2;

// using the mnemonic provided in the yarn script:
// player1 = 0xBBA5Af54eC0Af6b833Ba44FfF934a5f2FE10D722 PK: 0x57994353d1c06d598d8bcc1738625aa4d8a76060079468052927a0e4f68bf9f4
// player2 = 0x6ACc9629eBCCDA0ff2503EC67cEc35E65eCdA651 PK: 0x8fc2ebd50757b0685f87ef4400323ad2521df31dea170fdfbef2ccb599e704bc

contract("CoinFlip", ([player1, player2, stranger, someoneElse]) => {

  describe("insertPlayer()", () =>{

    beforeEach(async () => {
      instance = await CoinFlip.new(2, player1, player2);
      await instance.addCollateral({from: player1, value: 123});
      await instance.addCollateral({from: player2, value: 456});
    });

    it("inserts a player in the participating players array", async () => {
      await instance.insertPlayer(0, someoneElse);
      await instance.insertPlayer(1, stranger);
    });

    it("should NOT allow an index that is higher than the total number of players minus one", async () => {
      await truffleAssert.reverts(instance.insertPlayer(5, player2));
    });

    it("should NOT allow the zero address as a player", async () => {
      await truffleAssert.reverts(instance.insertPlayer(0, zeroAddress));
    });

    it("should NOT allow the contract address as a player", async () => {
      await truffleAssert.reverts(instance.insertPlayer(0, instance.address));
    });

    it("should allow replacing one player with another", async () => {
      await instance.insertPlayer(0, someoneElse);
    });

    it("should NOT allow inserting a player that is already participating (avoids double entries)", async () => {
      await truffleAssert.reverts(instance.insertPlayer(1, player1));
    });

  });

  describe("addCollateral()", () =>{

    beforeEach(async () => {
      instance = await CoinFlip.new(2, player1, player2);
    });

    it("amount can NOT be zero", async () => {
      await truffleAssert.reverts(instance.addCollateral({from: player1, value: 0}));
    });

    it("only participating players can add collateral", async () => {
      await instance.addCollateral({from: player1, value: 123});
      await instance.addCollateral({from: player2, value: 456});
      await truffleAssert.reverts(instance.addCollateral({from: stranger, value: 100}));
    });

  });

  describe("determineActivePlayer()", () =>{

    it("should select the active player that is allowed to flip the coin", async () => {
      instance = await CoinFlip.new(2, player1, player2);
      await instance.addCollateral({from: player1, value: 123});
      await instance.addCollateral({from: player2, value: 456});
      await instance.determineActivePlayer();
      activePlayer = await instance.activePlayer();
      participant1 = await instance.getPlayer(0);
      participant2 = await instance.getPlayer(1);
      expect(activePlayer.toLowerCase() == participant1.toLowerCase() || activePlayer.toLowerCase() == participant2.toLowerCase()).to.be.true;
    });

  });

  describe("flipCoin()", () =>{

    it("should ensure all players have staked before the coin can be flipped", async () => {
      instance = await CoinFlip.new(2, player1, player2);
      await instance.addCollateral({from: player1, value: 123});
      await instance.determineActivePlayer();
      activePlayer = await instance.activePlayer();
      await truffleAssert.reverts(instance.flipCoin({from: activePlayer})); // reverts bc player2 has not staked
    });

    beforeEach(async () => {
      instance = await CoinFlip.new(2, player1, player2);
      await instance.addCollateral({from: player1, value: 123});
      await instance.addCollateral({from: player2, value: 456});
      await instance.determineActivePlayer();
      activePlayer = await instance.activePlayer();
    });

    it("the active player can flip the coin", async () => {
      await instance.flipCoin({from: activePlayer});
    });

    it("another participating player can NOT flip the coin", async () => {
      if (activePlayer.toLowerCase() == player1.toLowerCase()) {
        inactivePlayer = player2;
      } else {
        inactivePlayer = player1;
      }
      await truffleAssert.reverts(instance.flipCoin({from: inactivePlayer}));
    });

    it("a stranger can NOT flip the coin", async () => {
      await truffleAssert.reverts(instance.flipCoin({from: stranger}));
    });

    it("should move player collaterals to jackpot", async () => {
      assert.equal(await instance.jackpot(), 0)
      await instance.flipCoin({from: activePlayer});
      assert.equal(await instance.jackpot(), 579)
    });

    it("should set the winner of the coin flip", async () => {
      await instance.flipCoin({from: activePlayer});
      winner = await instance.winner();
      participant1 = await instance.getPlayer(0);
      participant2 = await instance.getPlayer(1);
      expect(winner.toLowerCase() == participant1.toLowerCase() ||
        winner.toLowerCase() == participant2.toLowerCase()).to.be.true;
    });


  });

  describe("withdrawCollateral()", () =>{

    beforeEach(async () => {
      instance = await CoinFlip.new(2, player1, player2);
      await instance.addCollateral({from: player1, value: 123});
      await instance.addCollateral({from: player2, value: 456});
      await instance.determineActivePlayer();
      activePlayer = await instance.activePlayer();
      await instance.flipCoin({from: activePlayer});
      winner = await instance.winner();
    });

    it("the winner can withdraw the collateral", async () => {
      assert.equal(await instance.jackpot(), 579);
      await instance.withdrawCollateral({from: winner});
      assert.equal(await instance.jackpot(), 0);
    });

    it("another participating player can NOT withdraw the collateral", async () => {
      if (winner.toLowerCase() == player1.toLowerCase()) {
        loser = player2;
      } else {
        loser = player1;
      }
      await truffleAssert.reverts(instance.withdrawCollateral({from: loser}));
    });

    it("a stranger can NOT withdraw the collateral", async () => {
      await truffleAssert.reverts(instance.withdrawCollateral({from: stranger}));
    });

    it("emits a withdrawal event", async () => {
      event = await instance.withdrawCollateral({from: winner});
      truffleAssert.eventEmitted(event, "Withdrawal");
    });

  });

  describe("totalPlayers()", () =>{

    it("should return the correct number of participating players", async () => {
      instance = await CoinFlip.new(2, player1, player2);
      assert.equal(await instance.totalPlayers(), 2)
    });

  });

  describe("getPlayer()", () =>{

    it("should return the player at any given index position", async () => {
      instance = await CoinFlip.new(2, player1, player2);
      assert.equal(await instance.getPlayer(0), player1);
      assert.equal(await instance.getPlayer(1), player2);
    });

  });

});
