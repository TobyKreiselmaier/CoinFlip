# CoinFlip

Project to simulate randomness in a game and web3 calls in a React Front End.

- Two players (ETH wallet addresses) can participate in this CoinFlip game.
- They both must stake collateral (ETH) to play.
- The contract determines which player is allowed to flip the coin.
- This coin flip determines who the winner of the bet is.
- The winner is allowed to withdraw the total collateral.

## Installation - Tests - Deployment

1. Git clone repo with `git clone https://github.com/TobyKreiselmaier/CoinFlip.git`
2. Install `yarn` (npm install --global yarn) (yarn is more stable and faster than npm).
3. Install `truffle` (yarn global add truffle).
4. Install `ganache` (yarn global add ganache-cli).
3. Run `yarn` to install the necessary dependencies for this project.
4. Run `yarn ganache` to start [Ganache CLI](https://github.com/trufflesuite/ganache-cli) in a separate console.
5. Run `yarn compile` to compile the contracts in the local *contracts* folder with truffle.
6. Run `yarn test` to compile and run all automated tests in the *test* folder (recommended NodeJS version 12).
7. Run `yarn migrate` to deploy the contracts to the local *ganache* blockchain, which will run on port 8545.
8. Run `yarn migrate --network kovan` to deploy the contracts to the public *Kovan* testnet.
9. To run the front end in your local browser `cd client` and `yarn start`. The website will appear on `http://localhost:3000/`.
10. To test the front in (in folder `client`), run `yarn test`.

### Optional:

1. Run `yarn console` to enter [truffle commands](https://www.trufflesuite.com/docs/truffle/reference/truffle-commands) directly.

2. In order to play this game with more than two players, do the following:

    - adust constructor arguments (CoinFlip.sol lines 36-41) for desired number of players.
    - adjust migration arguments (2_CoinFlip_migration.js lines 9-11) for desired number of players.
    - adjust accounts created by Ganache (currently 12 available).
    - tests are currently designed for the two player mode only.

3. Migration automatically deploys an ERC20 `CoinFlip Token (CFT)`, which can be used as collateral using `safeTransferFrom`.

4. `LoserPays.sol` contains some ideas about a feeless transfer of the jackpot to the winner.

5. Future: Swap between ETH and CFT. This would require a reliable price oracle or a hardcoded price for demonstration purposes.
