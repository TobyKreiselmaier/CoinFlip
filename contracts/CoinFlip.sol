// SPDX-License-Identifier: MIT

/* 
 * This contract works with pseudo-randomness that could be predetermined and exploited by a miner
 * For demonstration purposes only.
 */

import { Context } from "./Context.sol";
import { Ownable } from "./Ownable.sol";

pragma solidity 0.8.6;

contract CoinFlip is Context, Ownable {

    uint totalPlayers;
    uint jackpot;
    address activePlayer;
    address winner;
    address[] participatingPlayers;
    mapping(address => uint) userCollaterals;

    event Winner(address winner);
    event Withdrawal(address to, uint256 amount);

    // @dev This game can be played by any number of users that are set in the constructor.
    constructor(uint _num, address _player1, address _player2) {
        totalPlayers = _num;
        participatingPlayers = new address[](totalPlayers);
        participatingPlayers[0] = _player1;
        participatingPlayers[1] = _player2;
    }

    function insertPlayer (uint _index, address _player) public {
        require(_index < totalPlayers, "CoinFlip: index is not available.");
        require(_player != address(0) && _player != address(this), "CoinFlip: address not allowed.");
            participatingPlayers[_index] = _player;
    }

    function determineActivePlayer() public returns (address _activePlayer) {
        return activePlayer = participatingPlayers[block.timestamp % totalPlayers];
    }

    function flipCoin() public returns (address _winner) {
        require(_msgSender() == activePlayer, "CoinFlip: Not active player!");
        winner = participatingPlayers[block.timestamp % totalPlayers]; // returns the winner
        emit Winner(winner);
        return winner;
    }

    function withdrawCollateral() public payable {
        require(_msgSender() == winner, "CoinFlip: only winner can withdraw!");
        for (uint i = 0; i < participatingPlayers.length; i++) {
            require(userCollaterals[participatingPlayers[i]] > 0, // checks
            "CoinFlip: a participating player made no deposits - no withdrawal allowed");
            jackpot += userCollaterals[participatingPlayers[i]];
            userCollaterals[participatingPlayers[i]] = 0; // effects
        }
        payout(jackpot, payable(_msgSender())); // interactions
        assert(jackpot == 0); // the final balance must be 0 (invariant)
    }

    function payout(uint _amount, address payable _to) internal {
        _to.transfer(_amount);
        emit Withdrawal(_to, _amount);
    }

    function getNumberOfPlayers() public view returns (uint) {
        return totalPlayers;
    }

    function getPlayer(uint _index) public view returns (address) {
        return participatingPlayers[_index];
    }
}
