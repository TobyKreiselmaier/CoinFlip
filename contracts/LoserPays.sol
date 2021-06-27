// SPDX-License-Identifier: MIT

/*
 * This contract shows a draft for a feeless transfer function.
 * This code is not tested and adapted from https://github.com/bitclave/Feeless.
 * Another option is to generate a frontend call to a `transferFrom` with the loser as sender,
 * which they would have to sign in MM.
 */

import { NonReentrant } from "./NonReentrant.sol";

pragma solidity 0.8.6;

contract LoserPays is NonReentrant {

    address internal msgSender;
    mapping(address => uint) public nonces;

    modifier loserPays {
        if (msgSender == address(0)) {
            msgSender = msg.sender;
            _;
            msgSender = address(0);
        } else {
            _;
        }
    }

    function feelessTransfer(address sender, address target, bytes memory data, uint256 nonce, bytes memory sig) public payable loserPays noReentry{
        require(address(this) == target);
        bytes32 hash = keccak256(abi.encodePacked(target, data, nonce));
        msgSender = recover(hash, sig);
        require(msgSender == sender);
        require(nonces[msgSender]++ == nonce);
        (bool success, bytes memory reply) = target.call{value: msg.value}(data);
        require (success && reply.length >= 0, "LoserPays: transfer failed");
        msgSender = address(0);
    }

    /**
    * @dev Recovers signer address from a message by using the signature
    * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
    * @param signature bytes signature, the signature is generated using web3.eth.sign()
    */
    function recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Divide the signature in r, s and v variables with inline assembly.
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        }
        return ecrecover(hash, v, r, s);
    }

}
