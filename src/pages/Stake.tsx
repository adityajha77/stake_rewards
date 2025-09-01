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
import { parseUnits, formatUnits, formatEther } from 'viem';
import { ADITYA_TOKEN_ADDRESS, ADITYA_TOKEN_ABI, STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI } from '@/contracts';
import { useToast } from '@/components/ui/use-toast';
import { config } from '@/lib/wagmi'; // Import wagmi config
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<string | null>(null);
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

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

  // Read last claimed timestamp for faucet
  const { data: lastClaimedTimestamp, refetch: refetchLastClaimedTimestamp } = useReadContract({
    address: ADITYA_TOKEN_ADDRESS,
    abi: ADITYA_TOKEN_ABI,
    functionName: 'lastClaimed',
    args: [address || '0x0'],
    chainId: sepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 5000,
    },
  });

  // Read faucet amount
  const { data: faucetAmount, refetch: refetchFaucetAmount } = useReadContract({
    address: ADITYA_TOKEN_ADDRESS,
    abi: ADITYA_TOKEN_ABI,
    functionName: 'faucetAmount',
    chainId: sepolia.id,
    query: {
      enabled: isConnected,
      refetchInterval: 5000,
    },
  });

  // Read ONE_YEAR constant from contract
  const { data: oneYearDuration } = useReadContract({
    address: ADITYA_TOKEN_ADDRESS,
    abi: ADITYA_TOKEN_ABI,
    functionName: 'ONE_YEAR',
    chainId: sepolia.id,
    query: {
      enabled: isConnected,
    },
  });

  // ✅ FIX: Extract `amount` correctly from struct (array index 0)
  const stakedBalance = stakedBalanceData ? (stakedBalanceData as [bigint, bigint])[0] : 0n;

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

  // Faucet claim functionality
  const { data: claimFaucetHash, writeContract: claimFaucetWrite } = useWriteContract({
    mutation: {
      onError: (error) => {
        toast({
          title: "Faucet Claim Error",
          description: error.message,
          variant: "destructive",
        });
      },
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
  // Stake functionality
  const { data: approveHash, writeContract: approveWrite } = useWriteContract({
    mutation: {
      onError: (error) => {
        toast({
          title: "Approval Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });
  const { data: stakeHash, writeContract: stakeWrite } = useWriteContract({
    mutation: {
      onError: (error) => {
        toast({
          title: "Stake Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  // Unstake functionality
  const { data: unstakeHash, writeContract: unstakeWrite } = useWriteContract({
    mutation: {
      onError: (error) => {
        toast({
          title: "Unstake Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  // Claim Rewards functionality
  const { data: claimHash, writeContract: claimWrite } = useWriteContract({
    mutation: {
      onError: (error) => {
        toast({
          title: "Claim Rewards Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const handleStake = React.useCallback(() => {
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
      args: [amountToStake, '0x0000000000000000000000000000000000000000'],
      chainId: sepolia.id,
      account: address,
      chain: sepolia,
    });
  }, [address, stakeAmount, stakeWrite, toast]);

  const handleUnstake = React.useCallback(() => {
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
  }, [address, unstakeAmount, unstakeWrite, toast]);

  const handleClaimRewards = React.useCallback(() => {
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
  }, [address, claimWrite, toast]);

  const handleClaimFaucetTokens = React.useCallback(() => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet to claim tokens.",
        variant: "destructive",
      });
      return;
    }
    claimFaucetWrite({
      address: ADITYA_TOKEN_ADDRESS,
      abi: ADITYA_TOKEN_ABI,
      functionName: 'claimTokens',
      chainId: sepolia.id,
      account: address,
      chain: sepolia,
    });
  }, [address, claimFaucetWrite, toast]);

  const { isLoading: isApproving, isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approveHash,
    query: {
      enabled: !!approveHash,
    },
  });
  const { isLoading: isStaking, isSuccess: isStaked } = useWaitForTransactionReceipt({
    hash: stakeHash,
    query: {
      enabled: !!stakeHash,
    },
  });
  const { isLoading: isUnstaking, isSuccess: isUnstaked } = useWaitForTransactionReceipt({
    hash: unstakeHash,
    query: {
      enabled: !!unstakeHash,
    },
  });
  const { isLoading: isClaiming, isSuccess: isClaimed } = useWaitForTransactionReceipt({
    hash: claimHash,
    query: {
      enabled: !!claimHash,
    },
  });

  const { isLoading: isClaimingFaucet, isSuccess: isFaucetClaimed } = useWaitForTransactionReceipt({
    hash: claimFaucetHash,
    query: {
      enabled: !!claimFaucetHash,
    },
  });


  useEffect(() => {
    if (isApproved) {
      toast({
        title: "Approval Successful",
        description: "You have approved the staking contract to spend your ADT tokens. Proceeding with staking...",
      });
      setApprovalPending(false); // Reset approval pending state
      handleStake(); // Automatically trigger stake after successful approval
    }
  }, [isApproved, toast, handleStake]);

  useEffect(() => {
    if (isFaucetClaimed) {
      toast({
        title: "Faucet Claim Successful",
        description: `You have claimed ${faucetAmount ? formatUnits(faucetAmount as bigint, 18) : '0'} ADT from the faucet.`,
      });
      refetchAdtBalance();
      refetchLastClaimedTimestamp();
    }
  }, [isFaucetClaimed, faucetAmount, refetchAdtBalance, refetchLastClaimedTimestamp, toast]);

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
  }, [isStaked, stakeAmount, refetchAdtBalance, refetchStakedBalance, refetchEarnedRewards, refetchAllowance]);

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
    const currentAllowance = allowance !== undefined ? (allowance as bigint) : 0n;

    if (currentAllowance < amountToStake) {
      if (!approvalPending) {
        approveWrite({
          address: ADITYA_TOKEN_ADDRESS,
          abi: ADITYA_TOKEN_ABI,
          functionName: 'approve',
          args: [STAKING_CONTRACT_ADDRESS, amountToStake],
          chainId: sepolia.id,
          account: address,
          chain: sepolia,
        });
        setApprovalPending(true);
      } else {
        toast({
          title: "Approval Pending",
          description: "Please wait for the current approval transaction to complete.",
          variant: "default",
        });
      }
    } else {
      handleStake();
    }
  };

  useEffect(() => {
    if (isUnstaked) {
      toast({
        title: "Unstake Successful",
        description: `You have successfully unstaked ${unstakeAmount} ADT. Your rewards will be claimed automatically.`,
      });
      setUnstakeAmount('');
      refetchAdtBalance();
      refetchStakedBalance();
      refetchEarnedRewards();
      // Automatically claim rewards after unstaking
      handleClaimRewards();
    }
  }, [isUnstaked, unstakeAmount, refetchAdtBalance, refetchStakedBalance, refetchEarnedRewards, handleClaimRewards, toast]); // Added toast dependency

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
  }, [isClaimed, refetchAdtBalance, refetchStakedBalance, refetchEarnedRewards, toast]);

  useEffect(() => {
    if (lastClaimedTimestamp !== undefined && oneYearDuration !== undefined) {
      const lastClaim = Number(lastClaimedTimestamp);
      const oneYear = Number(oneYearDuration);
      const nextClaimTime = lastClaim + oneYear;
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      if (currentTime < nextClaimTime) {
        setCanClaim(false);
        const timeLeft = nextClaimTime - currentTime;
        const days = Math.floor(timeLeft / (3600 * 24));
        const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        setTimeUntilNextClaim(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCanClaim(true);
        setTimeUntilNextClaim(null);
      }
    } else {
      setCanClaim(true); // Assume can claim if data not loaded
      setTimeUntilNextClaim(null);
    }
  }, [lastClaimedTimestamp, oneYearDuration]);

  const formattedAdtBalance = adtBalance ? formatUnits(adtBalance as bigint, 18) : '0.00';
  const formattedStakedBalance = stakedBalance ? formatUnits(stakedBalance as bigint, 18) : '0.00';
  const formattedEarnedRewards = earnedRewards ? formatUnits(earnedRewards as bigint, 18) : '0.00';
  const formattedFaucetAmount = faucetAmount ? formatUnits(faucetAmount as bigint, 18) : '0.00';
  const lastClaimDate = lastClaimedTimestamp && Number(lastClaimedTimestamp) > 0
    ? new Date(Number(lastClaimedTimestamp) * 1000).toLocaleString()
    : 'Never';

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

      {/* Welcome Faucet Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <Card className="bg-gradient-surface border border-card-border rounded-lg p-8 hover:shadow-card-hover transition-all">
          <CardHeader className="flex items-center gap-2 mb-6 p-0">
            <Zap className="h-6 w-6 text-electric" />
            <CardTitle className="font-orbitron text-2xl font-semibold hover-electric">
              Welcome Faucet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-0">
            <p className="text-muted-foreground">
              Claim {formattedFaucetAmount} free ADT tokens once per year.
            </p>
            <div className="text-sm">
              Last Claim: <span className="font-semibold text-electric">{lastClaimDate}</span>
            </div>
            {timeUntilNextClaim && (
              <div className="text-sm">
                Next Claim In: <span className="font-semibold text-electric">{timeUntilNextClaim}</span>
              </div>
            )}
            <Button
              size="lg"
              className="w-full bg-electric hover:bg-electric-glow text-black font-semibold py-4 text-lg"
              onClick={handleClaimFaucetTokens}
              disabled={!isConnected || isClaimingFaucet || !canClaim}
            >
              {isClaimingFaucet ? "Claiming..." : `Claim ${formattedFaucetAmount} Free Tokens`}
            </Button>
          </CardContent>
        </Card>
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
                {isApproving ? "Approving..." : isStaking ? "Staking..." : (approvalPending ? "Approval Pending, Click to Stake" : "Stake ADT")}
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
                    Tokens are available immediately after unstaking
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
