const CoinFlip = artifacts.require("CoinFlip");
const players = 2;

module.exports = async function(deployer, network, accounts) {

    await deployer.deploy(
        CoinFlip,
        players,        // number of players
        accounts[0],    // player 1
        accounts[1]     // player 2
    );

    const instance = await CoinFlip.deployed();

    let owner, number, player;
    console.log('\nMigration of CoinFlip Contract');
    console.log('******************************\n');

    console.log('Contract Address: ' + instance.address);
    owner = await instance.owner();
    console.log('Contract Owner: ' + owner);
    number = await instance.totalPlayers();
    console.log('Number of players: ' + number);

    // show which players are part of the game
    for (i = 0; i < players; i++) {
        player = await instance.getPlayer(i);
        console.log('Player ' + i + ': ' + player);
    }

    console.log('\nMigration Completed Successfully!');
    console.log('*********************************');

};
