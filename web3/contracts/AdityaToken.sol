// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AdityaToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Aditya Token", "ADT") {
        _mint(msg.sender, initialSupply);
    }
}
