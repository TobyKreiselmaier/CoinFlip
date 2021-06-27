// Reference <http://truffleframework.com/docs/advanced/configuration>

const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
//The accounts in this mnemonic hold kETH for the testnet and never hold real ETH.
const mnemonic = fs.existsSync('.secret')
    ? fs.readFileSync('.secret').toString().trim()
    : null;
const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {           // Ganache CLI is recommended
      host: '127.0.0.1',     // Localhost
      port: 8545,            // Standard port for Ganache CLI
      network_id: '*',       // Any ID will be accepted
      gas: 10000000          // can be configured as needed; 6721975 is the default block limit on Ganache CLI
    },
    kovan: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://kovan.infura.io/v3/2a34155324e24e37a26058e4936f712b`
      ),
      network_id: 42,       // Kovan's id
      gas: 5500000,         //
      confirmations: 0,     // # of confs to wait between deployments. (default: 0)
      from: '0xBBA5Af54eC0Af6b833Ba44FfF934a5f2FE10D722',
      timeoutBlocks: 200,   // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: false,    // Skip dry run before migrations? (default: false for public nets )
    },
  },
  mocha: {
    useColors: true,
    reporter: 'eth-gas-reporter'
  },
  compilers: {
    solc: {
      version: '0.8.6',
      evmVersion: 'berlin',
      optimizer: {
          enabled: false, // set to true for deployment on public blockchains to reduce bytecode
          runs: 200,      // recommended for efficient code
      }
    },
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  }
};
