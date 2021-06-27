import React, { useState, useEffect } from "react";
import CoinFlip from "./contracts/CoinFlip.json";
import getWeb3 from "./getWeb3";

import "./App.css";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [player1, setPlayer1] = useState(undefined);
  const [player2, setPlayer2] = useState(undefined);
  // const [active, setActive] = useState(undefined);
  // const [winner, setWinner] = useState(undefined);

  useEffect(() => {
    const init = async() => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the current account.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = CoinFlip.networks[networkId];
        const contract = new web3.eth.Contract(
          CoinFlip.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Set web3, accounts, and contract to the state.
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, [contract]);

  useEffect(() => {
    const load = async () => { // web3, accounts, contracts can be used within
      const player1 = await contract.methods.getPlayer(0).call();
      const player2 = await contract.methods.getPlayer(1).call();
      setPlayer1(player1);
      setPlayer2(player2);

      // player1 adds 5 tETH as collateral - confirm in MM
      // await contract.methods.addCollateral().send({ from: player1, value: 5000000000000000000 });
      // player2 adds 3 tETH as collateral - switch to second account and confirm in MM
      // await contract.methods.addCollateral().send({ from: player2, value: 3000000000000000000 });

      // determine player that is allowed to flip coin
      // const active = await contract.methods.determineActivePlayer().call();
      // setActive(active);

      // determine winner that is allowed to withdraw total collateral
      // const winner = await contract.methods.flipCoin().send({ from: active });
      // setWinner(winner);

      // withdraw collateral
      // await contract.methods.withdrawCollateral().send({ from: winner });
    }
    if(typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof contract !== 'undefined') {
      load()
    }
  }, [web3, accounts, contract, player1, player2]); // add active, winner
  if(typeof web3 === 'undefined') {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="App">
      <h1>CoinFlip Project</h1>
      <p>Pseudo-Randomness and Web3 calls in React</p>
      <h2>Start the Game ...</h2>
      <p>
        This version of the Dapp works for two players.
        Please import these two following accounts in MetaMask with PKs provided in CoinFlip.test.js.
      </p>
      <p>Player1: {player1}</p>
      <p>Player2: {player2}</p>
    </div>
  );
}

export default App;
