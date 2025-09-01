import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Copy, 
  Share2, 
  TrendingUp, 
  Gift,
  ExternalLink,
  Trophy,
  Star
} from 'lucide-react';

// Mock referral data
const referralData = {
  totalReferrals: 12,
  activeReferrals: 8,
  totalBonusEarned: "450.75",
  pendingBonus: "25.50",
  referralLink: "https://stakeflow.app/ref/0x1234...abcd",
  tier: "Silver",
  nextTierProgress: 65
};

const referralHistory = [
  {
    id: 1,
    address: "0x1234...5678",
    dateJoined: "2024-01-15",
    stakeAmount: "5,000.00",
    bonusEarned: "50.00",
    status: "active"
  },
  {
    id: 2,
    address: "0xabcd...efgh",
    dateJoined: "2024-01-20",
    stakeAmount: "2,500.00",
    bonusEarned: "25.00",
    status: "active"
  },
  {
    id: 3,
    address: "0x9876...4321",
    dateJoined: "2024-02-01",
    stakeAmount: "10,000.00",
    bonusEarned: "100.00",
    status: "active"
  },
  {
    id: 4,
    address: "0xfedc...ba98",
    dateJoined: "2024-02-10",
    stakeAmount: "0.00",
    bonusEarned: "0.00",
    status: "pending"
  }
];

const referralTiers = [
  { name: "Bronze", min: 0, bonus: "2%", color: "text-orange-500" },
  { name: "Silver", min: 5, bonus: "3%", color: "text-gray-400" },
  { name: "Gold", min: 15, bonus: "4%", color: "text-yellow-500" },
  { name: "Platinum", min: 30, bonus: "5%", color: "text-purple-500" }
];

export const Referrals: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join StakeFlow - Earn Crypto Rewards',
          text: 'Join me on StakeFlow and start earning staking rewards!',
          url: referralData.referralLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-orbitron text-4xl font-bold mb-2 hover-electric">
          Referral Program (COMING SOON)...
        </h1>
        <p className="text-muted-foreground text-lg">
          Invite friends and earn bonus rewards together
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <div className="font-orbitron text-2xl font-bold hover-electric">
            {referralData.totalReferrals}
          </div>
          <div className="text-sm text-muted-foreground">Friends Invited</div>
        </div>

        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <div className="font-orbitron text-2xl font-bold text-electric">
            {referralData.activeReferrals}
          </div>
          <div className="text-sm text-muted-foreground">Currently Staking</div>
        </div>

        <div className="bg-gradient-surface border border-electric/20 rounded-lg p-6 shadow-glow hover:shadow-glow-strong transition-all">
          <div className="flex items-center justify-between mb-4">
            <Gift className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Earned</span>
          </div>
          <div className="font-orbitron text-2xl font-bold text-electric">
            {referralData.totalBonusEarned} FLOW
          </div>
          <div className="text-sm text-muted-foreground">Total Bonus</div>
        </div>

        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Tier</span>
          </div>
          <div className="font-orbitron text-2xl font-bold hover-electric">
            {referralData.tier}
          </div>
          <div className="text-sm text-muted-foreground">Current Level</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Referral Link & Sharing */}
        <div className="lg:col-span-2 space-y-6">
          {/* Share Link Card */}
          <div className="bg-gradient-surface border border-card-border rounded-lg hover:shadow-card-hover transition-all">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="h-5 w-5 text-electric" />
                <h3 className="font-orbitron text-lg font-semibold hover-electric">
                  Your Referral Link
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={referralData.referralLink}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button 
                    variant="outline"
                    onClick={handleCopyLink}
                    className="border-electric text-electric hover:bg-electric/10"
                  >
                    {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-electric hover:bg-electric-glow text-black font-semibold"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-electric text-electric hover:bg-electric/10"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* How It Works Section */}
              <div className="mt-6 pt-6 border-t border-card-border">
                <h3 className="font-orbitron text-lg font-semibold text-electric mb-4">
                  How It Works
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-electric/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-electric font-bold text-xs">1</span>
                    </div>
                    <div>
                      <div className="font-semibold">Share Your Link</div>
                      <div className="text-muted-foreground">
                        Send your unique referral link to friends
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-electric/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-electric font-bold text-xs">2</span>
                    </div>
                    <div>
                      <div className="font-semibold">They Start Staking</div>
                      <div className="text-muted-foreground">
                        Your friend stakes tokens using your link
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-electric/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-electric font-bold text-xs">3</span>
                    </div>
                    <div>
                      <div className="font-semibold">You Both Earn</div>
                      <div className="text-muted-foreground">
                        Both you and your friend get bonus rewards
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Referral History */}
          <div>
            <h2 className="font-orbitron text-2xl font-semibold mb-6 hover-electric">
              Your Referrals
            </h2>
            
            <div className="space-y-4">
              {referralHistory.map((referral) => (
                <div 
                  key={referral.id}
                  className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-3 h-3 rounded-full
                        ${referral.status === 'active' ? 'bg-electric' : 'bg-muted-foreground'}
                      `}></div>
                      <div>
                        <div className="font-mono text-sm hover-electric">
                          {referral.address}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Joined: {referral.dateJoined}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-electric">
                        +{referral.bonusEarned} FLOW
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Staked: {referral.stakeAmount} FLOW
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tier Progress & Info */}
        <div className="space-y-6">
          {/* Current Tier */}
          <div className="bg-gradient-surface border border-electric/20 rounded-lg p-6 shadow-glow">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-electric" />
              </div>
              <h3 className="font-orbitron text-xl font-semibold mb-2 hover-electric">
                {referralData.tier} Tier
              </h3>
              <div className="text-3xl font-bold text-electric mb-2">
                3% Bonus
              </div>
              <p className="text-sm text-muted-foreground">
                Your current referral bonus rate
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress to Gold</span>
                <span className="text-electric">{referralData.nextTierProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-electric h-2 rounded-full transition-all duration-300"
                  style={{ width: `${referralData.nextTierProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                3 more active referrals needed
              </div>
            </div>
          </div>

          {/* Tier Levels */}
          <div className="bg-gradient-surface border border-card-border rounded-lg p-6">
            <h3 className="font-orbitron font-semibold mb-4 hover-electric">
              Tier Levels
            </h3>
            <div className="space-y-3">
              {referralTiers.map((tier, index) => (
                <div 
                  key={index}
                  className={`
                    flex items-center justify-between p-3 rounded-lg transition-all
                    ${tier.name === referralData.tier 
                      ? 'bg-electric/10 border border-electric/20' 
                      : 'bg-muted/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Star className={`h-4 w-4 ${tier.color}`} />
                    <span className="font-semibold">{tier.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-electric">{tier.bonus}</div>
                    <div className="text-xs text-muted-foreground">
                      {tier.min}+ referrals
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Rewards */}
          <div className="bg-gradient-surface border border-card-border rounded-lg p-6">
            <h3 className="font-orbitron font-semibold mb-4 hover-electric">
              Pending Rewards
            </h3>
            <div className="text-center">
              <div className="font-orbitron text-2xl font-bold text-electric mb-2">
                {referralData.pendingBonus} FLOW
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Available to claim
              </p>
              <Button 
                className="w-full bg-electric hover:bg-electric-glow text-black font-semibold"
              >
                Claim Rewards
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;