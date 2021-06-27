// SPDX-License-Identifier: MIT

/*
 * This contract works with pseudo-randomness that could be predetermined and exploited by a miner
 * For demonstration purposes only.
 */

import { Context } from "./Context.sol";
import { Ownable } from "./Ownable.sol";
import { NonReentrant } from "./NonReentrant.sol";

pragma solidity 0.8.6;

contract CoinFlip is Context, Ownable, NonReentrant {

    uint public totalPlayers;
    uint public jackpot;
    address public activePlayer;
    address payable public winner;
    address[] public participatingPlayers;
    mapping(address => uint) userCollaterals;

    event Withdrawal(address to, uint256 amount);

    modifier onlyActivePlayer {
        require(_msgSender() == activePlayer, "CoinFlip: not active player");
        _;
    }

    modifier onlyWinner {
        require(_msgSender() == winner, "CoinFlip: not winner");
        _;
    }

    // @dev This game can be played by any number of users that are set in the constructor.
    constructor(uint _num, address _player1, address _player2) {
        totalPlayers = _num;
        participatingPlayers = new address[](totalPlayers);
        participatingPlayers[0] = _player1;
        participatingPlayers[1] = _player2;
    }

    function insertPlayer (uint _index, address _player) public {
        require(_index < totalPlayers, "CoinFlip: index is not available");
        require(_player != address(0) && _player != address(this), "CoinFlip: address not allowed");
        for (uint i = 0; i < participatingPlayers.length; i++) {
            require(_player != participatingPlayers[i], "CoinFlip: player is already participant");
        }
        participatingPlayers[_index] = _player;
    }

    function addCollateral () public payable {
        require(msg.value > 0, "CoinFlip: amount is too low.");
        require(_msgSender() == participatingPlayers[0] || _msgSender() == participatingPlayers[1],
            "CoinFlip: not a participating player - can not add funds");
        userCollaterals[_msgSender()] = msg.value;
    }

    function determineActivePlayer() public {
        activePlayer = participatingPlayers[block.timestamp % totalPlayers];
    }

    function flipCoin() public onlyActivePlayer {
        // ensure that all players have staked something
        for (uint i = 0; i < participatingPlayers.length; i++) {
            require(userCollaterals[participatingPlayers[i]] > 0,
                "CoinFlip: not all players have staked their collateral - can not flip coin");
        }
        // fill jackpot
        for (uint i = 0; i < participatingPlayers.length; i++) {
            jackpot += userCollaterals[participatingPlayers[i]];
            userCollaterals[participatingPlayers[i]] = 0;
        }
        // determine winner
        winner = payable(participatingPlayers[block.timestamp % totalPlayers]);
    }

    function withdrawCollateral() public onlyWinner noReentry { // checks
        uint toWithdraw = jackpot;
        jackpot = 0;                                            // effects
        payout(toWithdraw, winner);                             // interactions
        emit Withdrawal(winner, toWithdraw);
    }

    function payout(uint _amount, address payable _to) internal {
        (bool success, bytes memory data) = _to.call{value: _amount}("");
        require (success && data.length >= 0, "CoinFlip: payout failed");
    }

    function getPlayer(uint _index) public view returns (address) {
        return participatingPlayers[_index];
    }

}
