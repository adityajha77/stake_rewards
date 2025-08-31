import React, { useState, useEffect } from 'react';
import { StakeCard } from '@/components/StakeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Zap,
  Plus,
  Minus,
  Info,
  ExternalLink,
  Shield,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains'; // Import sepolia chain
import { parseUnits, formatUnits } from 'viem';
import { ADITYA_TOKEN_ADDRESS, ADITYA_TOKEN_ABI, STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI } from '@/contracts';
import { useToast } from '@/components/ui/use-toast';
import { config } from '@/lib/wagmi'; // Import wagmi config

const availablePools = [
  {
    poolName: "Main Pool",
    apy: "10.0%", // Updated to 10% as per requirement
    tvl: "$1.0M", // Placeholder, will update with actual TVL later
    userStaked: "0.00 ADT",
    rewards: "0.00 ADT",
    timeLeft: "Continuous",
    isActive: true,
    description: "Our flagship staking pool with competitive rewards and proven security.",
    minStake: "1 ADT",
    lockPeriod: "None"
  },
];

export const Stake: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [unstakeAmount, setUnstakeAmount] = useState<string>('');
  const { writeContract } = useWriteContract();

  // Read user's ADT balance
  const { data: adtBalance, refetch: refetchAdtBalance } = useReadContract({
    address: ADITYA_TOKEN_ADDRESS,
    abi: ADITYA_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0'],
    chainId: sepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  // Read user's staked ADT balance
  const { data: stakedBalanceData, refetch: refetchStakedBalance } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'stakes',
    args: [address || '0x0'],
    chainId: sepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 5000,
    },
  });
  const stakedBalance = stakedBalanceData ? (stakedBalanceData as { amount: bigint, startTime: bigint }).amount : 0n;

  // Read user's earned rewards
  const { data: earnedRewards, refetch: refetchEarnedRewards } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'getEarnedRewards',
    args: [address || '0x0'],
    chainId: sepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 1000, // Live updating rewards
    },
  });

  // Read ADT allowance for staking contract
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: ADITYA_TOKEN_ADDRESS,
    abi: ADITYA_TOKEN_ABI,
    functionName: 'allowance',
    args: [address || '0x0', STAKING_CONTRACT_ADDRESS],
    chainId: sepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 5000,
    },
  });

  const handleMaxStake = () => {
    if (adtBalance) {
      setStakeAmount(formatUnits(adtBalance as bigint, 18));
    }
  };

  const handleMaxUnstake = () => {
    if (stakedBalance) {
      setUnstakeAmount(formatUnits(stakedBalance as bigint, 18));
    }
  };

  // Stake functionality
  const { data: approveHash, writeContract: approveWrite } = useWriteContract();
  const { data: stakeHash, writeContract: stakeWrite } = useWriteContract();

  const { isLoading: isApproving, isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  const { isLoading: isStaking, isSuccess: isStaked } = useWaitForTransactionReceipt({
    hash: stakeHash,
  });

  useEffect(() => {
    if (isApproved) {
      toast({
        title: "Approval Successful",
        description: "You have approved the staking contract to spend your ADT tokens.",
      });
      // Proceed to stake after approval
      handleStake();
    }
  }, [isApproved]);

  useEffect(() => {
    if (isStaked) {
      toast({
        title: "Stake Successful",
        description: `You have staked ${stakeAmount} ADT.`,
      });
      setStakeAmount('');
      refetchAdtBalance();
      refetchStakedBalance();
      refetchEarnedRewards();
      refetchAllowance();
    }
  }, [isStaked]);

  const handleApproveAndStake = async () => {
    if (!address || !stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount to stake.",
        variant: "destructive",
      });
      return;
    }

    const amountToStake = parseUnits(stakeAmount, 18);

    if (allowance !== undefined && (allowance as bigint) < amountToStake) {
      approveWrite({
        address: ADITYA_TOKEN_ADDRESS,
        abi: ADITYA_TOKEN_ABI,
        functionName: 'approve',
        args: [STAKING_CONTRACT_ADDRESS, amountToStake],
        chainId: sepolia.id,
        account: address,
        chain: sepolia,
      });
    } else {
      handleStake();
    }
  };

  const handleStake = () => {
    if (!address || !stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount to stake.",
        variant: "destructive",
      });
      return;
    }
    const amountToStake = parseUnits(stakeAmount, 18);
    stakeWrite({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'stake',
      args: [amountToStake],
      chainId: sepolia.id,
      account: address,
      chain: sepolia,
    });
  };

  // Unstake functionality
  const { data: unstakeHash, writeContract: unstakeWrite } = useWriteContract();
  const { isLoading: isUnstaking, isSuccess: isUnstaked } = useWaitForTransactionReceipt({
    hash: unstakeHash,
  });

  useEffect(() => {
    if (isUnstaked) {
      toast({
        title: "Unstake Initiated",
        description: `You have initiated unstaking for ${unstakeAmount} ADT. Your rewards will be claimed automatically.`,
      });
      setUnstakeAmount('');
      refetchAdtBalance();
      refetchStakedBalance();
      refetchEarnedRewards();
      // Automatically claim rewards after unstaking
      handleClaimRewards();
    }
  }, [isUnstaked]);

  const handleUnstake = () => {
    if (!address || !unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount to unstake.",
        variant: "destructive",
      });
      return;
    }
    const amountToUnstake = parseUnits(unstakeAmount, 18);
    unstakeWrite({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'unstake',
      args: [amountToUnstake],
      chainId: sepolia.id,
      account: address,
      chain: sepolia,
    });
  };

  // Claim Rewards functionality
  const { data: claimHash, writeContract: claimWrite } = useWriteContract();
  const { isLoading: isClaiming, isSuccess: isClaimed } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  useEffect(() => {
    if (isClaimed) {
      toast({
        title: "Rewards Claimed",
        description: "Your ADT rewards have been claimed.",
      });
      refetchAdtBalance();
      refetchStakedBalance();
      refetchEarnedRewards();
    }
  }, [isClaimed]);

  const handleClaimRewards = () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet.",
        variant: "destructive",
      });
      return;
    }
    claimWrite({
      address: STAKING_CONTRACT_ADDRESS,
      abi: STAKING_CONTRACT_ABI,
      functionName: 'claimReward',
      chainId: sepolia.id,
      account: address,
      chain: sepolia,
    });
  };

  const formattedAdtBalance = adtBalance ? formatUnits(adtBalance as bigint, 18) : '0.00';
  const formattedStakedBalance = stakedBalance ? formatUnits(stakedBalance as bigint, 18) : '0.00';
  const formattedEarnedRewards = earnedRewards ? formatUnits(earnedRewards as bigint, 18) : '0.00';


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-orbitron text-4xl font-bold mb-2 hover-electric">
          Staking Pools
        </h1>
        <p className="text-muted-foreground text-lg">
          Choose from our available staking pools and start earning rewards
        </p>
      </div>

      {/* Stake/Unstake Actions */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Stake Section */}
          <div className="bg-gradient-surface border border-card-border rounded-lg p-8 hover:shadow-card-hover transition-all">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="h-6 w-6 text-electric" />
              <h3 className="font-orbitron text-2xl font-semibold hover-electric">
                Stake Tokens
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="stake-amount" className="text-sm text-muted-foreground">
                  Amount to Stake
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="flex-1 text-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMaxStake}
                    className="border-electric text-electric hover:bg-electric/10"
                  >
                    MAX
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Balance: {formattedAdtBalance} ADT
                </div>
              </div>

              {/* Staking Details */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Estimated APY:</span>
                  <span className="text-electric font-semibold">10.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Lock Period:</span>
                  <span>None</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Stake:</span>
                  <span>1 ADT</span>
                </div>
                <div className="pt-2 border-t border-electric/20">
                  <div className="flex justify-between font-semibold">
                    <span>Est. Daily Rewards:</span>
                    <span className="text-electric">
                      {stakeAmount ? (parseFloat(stakeAmount) * 0.10 / 365).toFixed(2) : '0.00'} ADT
                    </span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-electric hover:bg-electric-glow text-black font-semibold py-4 text-lg"
                onClick={handleApproveAndStake}
                disabled={!stakeAmount || !isConnected || isApproving || isStaking}
              >
                {isApproving ? "Approving..." : isStaking ? "Staking..." : "Stake ADT"}
              </Button>
            </div>
          </div>

          {/* Unstake Section */}
          <div className="bg-gradient-surface border border-card-border rounded-lg p-8 hover:shadow-card-hover transition-all">
            <div className="flex items-center gap-2 mb-6">
              <Minus className="h-6 w-6 text-electric" />
              <h3 className="font-orbitron text-2xl font-semibold hover-electric">
                Unstake Tokens
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="unstake-amount" className="text-sm text-muted-foreground">
                  Amount to Unstake
                </Label>
                <div className="text-sm text-muted-foreground mt-1 mb-2">
                  You Staked: <span className="font-semibold text-electric">{formattedStakedBalance} ADT</span>
                </div>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="unstake-amount"
                    type="number"
                    placeholder="0.00"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    className="flex-1 text-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMaxUnstake}
                    className="border-electric text-electric hover:bg-electric/10"
                  >
                    MAX
                  </Button>
                </div>
              </div>

              {/* Unstaking Process */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-electric mt-0.5" />
                  <div>
                    <div className="font-semibold">Instant Unbonding</div>
                    <div className="text-muted-foreground">
                      Tokens are available immediately after unstaking
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-electric mt-0.5" />
                  <div>
                    <div className="font-semibold">Rewards Stop</div>
                    <div className="text-muted-foreground">
                      No rewards earned after unstaking
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-electric/20 text-center text-xs text-muted-foreground">
                  You can withdraw after the unbonding period ends
                </div>
              </div>

              <Button
                size="lg"
                variant="outline"
                className="w-full border-electric text-electric hover:bg-electric/10 py-4 text-lg"
                onClick={handleUnstake}
                disabled={!unstakeAmount || !isConnected || isUnstaking}
              >
                {isUnstaking ? "Unstaking..." : "Unstake ADT"}
              </Button>
            </div>
          </div>
        </div>

        {/* Your Staking Summary */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-gradient-surface border border-card-border rounded-lg p-6">
            <h3 className="font-orbitron font-semibold mb-4 hover-electric text-center">
              Your Staking Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">You Staked</span>
                <span className="font-semibold">{formattedStakedBalance} ADT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Profit</span>
                <span className="font-semibold text-electric">{formattedEarnedRewards} ADT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current APY</span>
                <span className="font-semibold text-electric">10.0%</span>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full bg-electric hover:bg-electric-glow text-black font-semibold py-4 text-lg mt-6"
              onClick={handleClaimRewards}
              disabled={!isConnected || isClaiming || parseFloat(formattedEarnedRewards) <= 0}
            >
              {isClaiming ? "Claiming..." : "Claim Rewards"}
            </Button>
          </div>
        </div>
      </div>

      {/* Available Pools */}
      <div>
        <div className="mb-6">
          <h2 className="font-orbitron text-2xl font-semibold mb-4 hover-electric text-center">
            Available Pools
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {availablePools.map((pool, index) => (
              <div key={index}>
                <StakeCard {...pool} />
                {!pool.isActive && (
                  <div className="mt-2 text-center">
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pool Features */}
        <div className="bg-gradient-surface border border-card-border rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="font-orbitron text-xl font-semibold mb-6 hover-electric text-center">
            Pool Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-electric" />
              </div>
              <h4 className="font-semibold mb-2 text-lg">Secure</h4>
              <p className="text-sm text-muted-foreground">
                Audited smart contracts with proven security
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-electric" />
              </div>
              <h4 className="font-semibold mb-2 text-lg">High APY</h4>
              <p className="text-sm text-muted-foreground">
                Competitive rewards with loyalty multipliers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-electric" />
              </div>
              <h4 className="font-semibold mb-2 text-lg">Flexible</h4>
              <p className="text-sm text-muted-foreground">
                Unstake anytime with transparent unbonding
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
