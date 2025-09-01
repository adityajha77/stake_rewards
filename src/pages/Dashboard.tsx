import React from 'react';
import { StakeCard } from '@/components/StakeCard';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  TrendingUp,
  Users,
  Copy,
  ExternalLink,
  Zap,
  CheckCircle
} from 'lucide-react';
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { formatUnits } from 'viem';
import { ADITYA_TOKEN_ADDRESS, STAKING_CONTRACT_ADDRESS, STAKING_CONTRACT_ABI } from '@/contracts';
import { useToast } from '@/components/ui/use-toast';

export const Dashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();

  // Fetch ADT Token Balance
  const { data: adtBalanceData, refetch: refetchAdtBalance } = useBalance({
    address: address,
    token: ADITYA_TOKEN_ADDRESS,
    chainId: sepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 5000,
    },
  });

  // Fetch Staked Amount
  const { data: stakedAmountData, refetch: refetchStakedBalance } = useReadContract({
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

  // ✅ Fix: destructure tuple [amount, startTime]
  const [stakeAmount = 0n] = (stakedAmountData || []) as [bigint, bigint];

  // Fetch Earned Rewards
  const { data: earnedRewardsData, refetch: refetchEarnedRewards } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi: STAKING_CONTRACT_ABI,
    functionName: 'getEarnedRewards',
    args: [address || '0x0'],
    chainId: sepolia.id,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 1000,
    },
  });

  // Claim Rewards functionality
  const { data: claimHash, writeContract: claimWrite } = useWriteContract();
  const { isLoading: isClaiming, isSuccess: isClaimed } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  React.useEffect(() => {
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

  const walletBalance = adtBalanceData ? formatUnits(adtBalanceData.value, adtBalanceData.decimals) : "0.00";
  const totalStaked = formatUnits(stakeAmount, 18);
  const pendingRewards = earnedRewardsData ? formatUnits(earnedRewardsData as bigint, 18) : "0.00";

  // Mock data for now, replace with actual contract calls for referral, loyalty
  const mockData = {
    referralCount: 8,
    referralRewards: "240.00",
    loyaltyMultiplier: "1.5x",
  };

  const stakingPools = [
    {
      poolName: "Main Pool",
      apy: "10.0%",
      tvl: "$1.0M",
      userStaked: totalStaked,
      rewards: pendingRewards + " ADT",
      timeLeft: "Continuous",
      isActive: true,
      description: "Our flagship staking pool with competitive rewards and proven security.",
      minStake: "1 ADT",
      lockPeriod: "None"
    },
  ];

  const handleCopyReferral = () => {
    navigator.clipboard.writeText("https://stakeflow.app/ref/0x1234...abcd");
    toast({
      title: "Referral Link Copied!",
      description: "Your referral link has been copied to the clipboard.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-orbitron text-4xl font-bold mb-2 hover-electric">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Monitor your staking performance and rewards
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Wallet Balance</span>
          </div>
          <div className="font-orbitron text-2xl font-bold hover-electric">
            {walletBalance} ADT
          </div>
        </div>

        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Total Staked</span>
          </div>
          <div className="font-orbitron text-2xl font-bold hover-electric">
            {totalStaked} ADT
          </div>
        </div>

        <div className="bg-gradient-surface border border-electric/20 rounded-lg p-6 shadow-glow hover:shadow-glow-strong transition-all">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Pending Rewards</span>
          </div>
          <div className="font-orbitron text-2xl font-bold text-electric">
            {pendingRewards} ADT
          </div>
          <Button
            size="sm"
            className="mt-2 w-full bg-electric hover:bg-electric-glow text-black"
            onClick={handleClaimRewards}
            disabled={!isConnected || isClaiming || parseFloat(pendingRewards) <= 0}
          >
            {isClaiming ? "Claiming..." : "Claim Rewards"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Staking Pools */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-orbitron text-2xl font-semibold hover-electric">
              Your Staking Pools
            </h2>
            <Button variant="outline" className="border-electric text-electric hover:bg-electric/10">
              <ExternalLink className="h-4 w-4 mr-2" />
              Explore Pools
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {stakingPools.map((pool, index) => (
              <StakeCard key={index} {...pool} />
            ))}
          </div>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Loyalty Multiplier */}
          <div className="bg-gradient-surface border border-electric/20 rounded-lg p-6 shadow-glow">
            <div className="text-center">
              <div className="w-16 h-16 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-electric" />
              </div>
              <h3 className="font-orbitron text-xl font-semibold mb-2 hover-electric">
                Loyalty Multiplier
              </h3>
              <div className="font-orbitron text-3xl font-bold text-electric mb-2">
                {mockData.loyaltyMultiplier}
              </div>
              <p className="text-sm text-muted-foreground">
                Your rewards are multiplied by your loyalty level
              </p>
            </div>
          </div>

          {/* Referral Quick Access */}
          <div className="bg-gradient-surface border border-card-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-electric" />
              <h3 className="font-orbitron font-semibold hover-electric">Referrals</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Friends Invited</span>
                <span className="font-bold">{mockData.referralCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bonus Earned</span>
                <span className="font-bold text-electric">{mockData.referralRewards} ADT</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 border-electric text-electric hover:bg-electric/10"
              onClick={handleCopyReferral}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Referral Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
