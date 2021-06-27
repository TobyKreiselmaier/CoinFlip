const ERC20 = artifacts.require('ERC20');

module.exports = async function (deployer, network, accounts) {

    await deployer.deploy(
        ERC20,
        accounts[0],      // owner
        'CoinFlip Token', // name
        'CFT',            // symbol
        10000000          // initial supply
    );
    
    const instance = await ERC20.deployed();

    let owner, name, symbol, decimals, supply;
    
    console.log('\nMigration of CoinFlip Token');
    console.log('***************************\n');
    console.log('Token Address: ' + instance.address);
    owner = await instance.owner();
    console.log('Token Owner: ' + owner);
    name = await instance.name();
    console.log('Token Name: ' + name);
    symbol = await instance.symbol();
    console.log('Token Symbol: ' + symbol);
    decimals = await instance.decimals();
    console.log('Token Decimals: ' + decimals);
    supply = await instance.totalSupply();
    console.log('Token TotalSupply: ' + supply);
    console.log('\nMigration Completed Successfully!');
    console.log('*********************************');
};
