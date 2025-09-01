// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract StakingV2 is Ownable {
    IERC20 public immutable adtToken;

    struct Stake {
        uint256 amount;
        uint256 startTime;
        address referrer; // Address of the referrer
    }

    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lastRewardClaimTime;
    mapping(address => uint256) public referralRewards; // Rewards for referrers

    uint256 public constant REWARD_RATE_PER_SECOND = 3170979198; // Approximately 10% APR for 1,000,000 ADT (100,000 ADT per year / 31,536,000 seconds)
    uint256 public constant REFERRAL_PERCENTAGE = 500; // 5% (500 basis points)
    bool public paused;

    event Staked(address indexed user, uint256 amount, address indexed referrer);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event ReferralRewardsClaimed(address indexed referrer, uint256 amount);
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

    function stake(uint256 _amount, address _referrer) external whenNotPaused {
        require(_amount > 0, "Amount must be greater than 0");
        require(_referrer != msg.sender, "Cannot refer yourself");
        
        // Calculate pending rewards before new stake
        if (stakes[msg.sender].amount > 0) {
            _updateReward(msg.sender);
        }

        adtToken.transferFrom(msg.sender, address(this), _amount);
        stakes[msg.sender].amount += _amount;
        stakes[msg.sender].startTime = block.timestamp;
        
        // Set referrer only if it's the first stake and a valid referrer is provided
        if (stakes[msg.sender].referrer == address(0) && _referrer != address(0)) {
            stakes[msg.sender].referrer = _referrer;
        }

        emit Staked(msg.sender, _amount, stakes[msg.sender].referrer);
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
            stakes[msg.sender].referrer = address(0); // Clear referrer if all unstaked
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

    function claimReferralRewards() external {
        uint256 referrerReward = referralRewards[msg.sender];
        require(referrerReward > 0, "No referral rewards to claim");

        referralRewards[msg.sender] = 0;
        adtToken.transfer(msg.sender, referrerReward);

        emit ReferralRewardsClaimed(msg.sender, referrerReward);
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
            
            // Distribute referral rewards
            address referrer = stakes[_user].referrer;
            if (referrer != address(0) && newRewards > 0) {
                uint256 referralCut = (newRewards * REFERRAL_PERCENTAGE) / 10000; // 10000 for basis points
                referralRewards[referrer] += referralCut;
                rewards[_user] -= referralCut; // Deduct referral cut from user's rewards
            }

            // Update startTime to current block.timestamp to mark the last time rewards were accounted for this stake.
            // This ensures future reward calculations start from this point.
            stakes[_user].startTime = block.timestamp;
        }
    }
}
