import React from 'react';
import { StakeCard } from '@/components/StakeCard';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  Users, 
  Copy,
  ExternalLink,
  Zap 
} from 'lucide-react';

// Mock data - replace with real data from smart contracts
const mockData = {
  walletBalance: "2,500.00",
  totalStaked: "10,000.00",
  totalRewards: "1,250.00",
  pendingRewards: "125.50",
  referralCount: 8,
  referralRewards: "240.00",
  loyaltyMultiplier: "1.5x",
  nextUnbonding: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
};

const stakingPools = [
  {
    poolName: "Main Pool",
    apy: "18.4%",
    tvl: "$12.5M",
    userStaked: "10,000.00 FLOW",
    rewards: "125.50 FLOW",
    timeLeft: "15d 4h 32m",
    isActive: true
  },
  {
    poolName: "Partner Pool A",
    apy: "22.1%",
    tvl: "$2.8M",
    userStaked: "0.00 FLOW",
    rewards: "0.00 FLOW",
    isActive: false
  }
];

export const Dashboard: React.FC = () => {
  const handleCopyReferral = () => {
    navigator.clipboard.writeText("https://stakeflow.app/ref/0x1234...abcd");
    // Add toast notification
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
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Wallet Balance</span>
          </div>
          <div className="font-orbitron text-2xl font-bold hover-electric">
            {mockData.walletBalance} FLOW
          </div>
        </div>

        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Total Staked</span>
          </div>
          <div className="font-orbitron text-2xl font-bold hover-electric">
            {mockData.totalStaked} FLOW
          </div>
        </div>

        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Total Earned</span>
          </div>
          <div className="font-orbitron text-2xl font-bold text-electric">
            {mockData.totalRewards} FLOW
          </div>
        </div>

        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <div className="font-orbitron text-2xl font-bold text-electric">
            {mockData.pendingRewards} FLOW
          </div>
          <Button 
            size="sm" 
            className="mt-2 w-full bg-electric hover:bg-electric-glow text-black"
          >
            Claim Rewards
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
          {/* Unbonding Timer */}
          <div className="bg-gradient-surface border border-card-border rounded-lg p-6">
            <CountdownTimer 
              targetDate={mockData.nextUnbonding}
              onComplete={() => console.log('Unbonding complete!')}
            />
            <Button 
              variant="outline" 
              className="w-full mt-4 border-electric text-electric hover:bg-electric/10"
            >
              Withdraw Available
            </Button>
          </div>

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
                <span className="font-bold text-electric">{mockData.referralRewards} FLOW</span>
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