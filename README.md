# CoinFlip

Project to simulate randomness in a game.

- Two players (ETH wallet addresses) can participate in this CoinFlip game.
- They both must stake collateral (ETH) to play.
- The contract determines which player is allowed to flip the coin.
- This coin flip determines who the winner of the bet is.
- The winner is allowed to withdraw the total collateral.

## Installation - Tests - Deployment

1. Git clone repo with `git clone https://github.com/TobyKreiselmaier/CoinFlip.git`
2. Make sure `yarn` is installed (npm install --global yarn) (yarn is more stable and faster than npm)
3. Run `yarn` to install the necessary dependencies for the project.
4. Run `yarn ganache` to start [Ganache CLI](https://github.com/trufflesuite/ganache-cli) in a separate console.
5. Run `yarn compile` to compile the contracts in the local *contracts* folder with truffle.
6. Run `yarn test` to compile and run all automated tests in the *test* folder (recommended NodeJS version 12).
7. Run `yarn migrate` to deploy the contracts to the local *ganache* blockchain, which will run on port 8545.
8. Run `yarn migrate --network Kovan` to deploy the contracts to the public Kovan testnet.

### Optional:
Run `yarn console` to enter [truffle commands](https://www.trufflesuite.com/docs/truffle/reference/truffle-commands) directly.
