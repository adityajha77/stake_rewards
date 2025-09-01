// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdityaToken is ERC20, Ownable {
    mapping(address => uint256) public lastClaimed;
    uint256 public faucetAmount;
    uint256 public constant ONE_YEAR = 365 days; // Approximately one year in seconds

    constructor(uint256 initialSupply) ERC20("Aditya Token", "ADT") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        faucetAmount = 100 * (10 ** decimals()); // Default to 100 tokens
    }

    function setFaucetAmount(uint256 _amount) public onlyOwner {
        faucetAmount = _amount;
    }

    function claimTokens() public {
        require(block.timestamp >= lastClaimed[msg.sender] + ONE_YEAR, "You can only claim once per year.");
        
        lastClaimed[msg.sender] = block.timestamp;
        _mint(msg.sender, faucetAmount);
    }
}
