// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {
    IERC20 public immutable adtToken;

    struct Stake {
        uint256 amount;
        uint256 startTime;
    }

    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lastRewardClaimTime;

    uint256 public constant REWARD_RATE_PER_SECOND = 3170979198; // Approximately 10% APR for 1,000,000 ADT (100,000 ADT per year / 31,536,000 seconds)
    bool public paused;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardDeposited(address indexed owner, uint256 amount);
    event Paused(address indexed owner);
    event Unpaused(address indexed owner);

    constructor(address _adtTokenAddress, address initialOwner) Ownable(initialOwner) {
        adtToken = IERC20(_adtTokenAddress);
        paused = false;
    }

    modifier whenNotPaused() {
        require(!paused, "Staking is paused");
        _;
    }

    function stake(uint256 _amount) external whenNotPaused {
        require(_amount > 0, "Amount must be greater than 0");
        
        // Calculate pending rewards before new stake
        if (stakes[msg.sender].amount > 0) {
            _updateReward(msg.sender);
        }

        adtToken.transferFrom(msg.sender, address(this), _amount);
        stakes[msg.sender].amount += _amount;
        stakes[msg.sender].startTime = block.timestamp;

        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) external whenNotPaused {
        require(_amount > 0, "Amount must be greater than 0");
        require(stakes[msg.sender].amount >= _amount, "Insufficient staked amount");

        _updateReward(msg.sender); // Update rewards before unstaking

        stakes[msg.sender].amount -= _amount;
        adtToken.transfer(msg.sender, _amount);

        // If user unstakes all, reset start time
        if (stakes[msg.sender].amount == 0) {
            stakes[msg.sender].startTime = 0;
        } else {
            // If partial unstake, update start time to now for remaining stake
            stakes[msg.sender].startTime = block.timestamp;
        }

        emit Unstaked(msg.sender, _amount);
    }

    function claimReward() external whenNotPaused {
        _updateReward(msg.sender);
        uint256 rewardAmount = rewards[msg.sender];
        require(rewardAmount > 0, "No rewards to claim");

        rewards[msg.sender] = 0;
        lastRewardClaimTime[msg.sender] = block.timestamp;
        adtToken.transfer(msg.sender, rewardAmount);

        emit RewardsClaimed(msg.sender, rewardAmount);
    }

    function getEarnedRewards(address _user) public view returns (uint256) {
        uint256 stakedAmount = stakes[_user].amount;
        if (stakedAmount == 0) {
            return rewards[_user];
        }

        uint256 timeStaked = block.timestamp - stakes[_user].startTime;
        uint256 pendingRewards = (stakedAmount * REWARD_RATE_PER_SECOND * timeStaked) / 1e18; // Assuming 18 decimals for ADT
        return rewards[_user] + pendingRewards;
    }

    function depositRewardTokens(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be greater than 0");
        adtToken.transferFrom(msg.sender, address(this), _amount);
        emit RewardDeposited(msg.sender, _amount);
    }

    function pause() external onlyOwner {
        require(!paused, "Staking is already paused");
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        require(paused, "Staking is not paused");
        paused = false;
        emit Unpaused(msg.sender);
    }

    function _updateReward(address _user) internal {
        uint256 stakedAmount = stakes[_user].amount;
        if (stakedAmount > 0) {
            uint256 timeElapsed = block.timestamp - stakes[_user].startTime;
            uint256 newRewards = (stakedAmount * REWARD_RATE_PER_SECOND * timeElapsed) / 1e18;
            rewards[_user] += newRewards;
            stakes[_user].startTime = block.timestamp; // Reset start time for reward calculation
        }
    }
}
