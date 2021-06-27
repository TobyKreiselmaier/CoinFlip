// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

/**
 * A little helper to protect contract from being re-entrant in state
 * modifying functions.
 */

contract NonReentrant {

    uint private entry_guard;

    modifier noReentry {
        require (entry_guard == 0, "NonReentrant: Reentry");
        entry_guard = 1;
        _;
        entry_guard = 0;
    }
    
}
