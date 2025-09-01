import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  BookOpen, 
  ExternalLink,
  Lock,
  Award,
  Clock,
  AlertTriangle
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "High Performance Staking",
    description: "Optimized smart contracts ensure maximum reward efficiency with minimal gas costs."
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Audited contracts with multi-sig governance and time-locked upgrades for maximum security."
  },
  {
    icon: TrendingUp,
    title: "Loyalty Multipliers",
    description: "Consistent stakers earn up to 1.5× bonus rewards through our loyalty program."
  },
  {
    icon: Users,
    title: "Referral System",
    description: "Earn bonus rewards by inviting friends to join the staking community."
  }
];

const tokenomics = {
  totalSupply: "100,000,000",
  stakingRewards: "30%",
  liquidityMining: "20%",
  team: "15%",
  ecosystem: "35%"
};

const risks = [
  {
    title: "Smart Contract Risk",
    description: "Despite audits, smart contracts may contain bugs or vulnerabilities."
  },
  {
    title: "Reward Volatility", 
    description: "APY rates may fluctuate based on network conditions and total staked amount."
  },
  {
    title: "Regulatory Risk",
    description: "Future regulatory changes may affect the operation of staking protocols."
  }
];

export const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 hover-electric">
          About StakeFlow
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The future of decentralized staking with advanced reward mechanisms, 
          loyalty multipliers, and community-driven governance.
        </p>
      </div>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="font-orbitron text-3xl font-bold text-center mb-8 hover-electric">
          Platform Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-gradient-surface border border-card-border rounded-lg p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-electric" />
                </div>
                <h3 className="font-orbitron text-lg font-semibold mb-3 hover-electric">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <div className="bg-gradient-surface border border-card-border rounded-lg p-8">
          <h2 className="font-orbitron text-3xl font-bold text-center mb-8 hover-electric">
            How Staking Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-10 w-10 text-electric" />
              </div>
              <h3 className="font-orbitron text-xl font-semibold mb-3 hover-electric">
                1. Stake Your Tokens
              </h3>
              <p className="text-muted-foreground">
                Lock your FLOW tokens in our staking contract to start earning rewards immediately.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-electric" />
              </div>
              <h3 className="font-orbitron text-xl font-semibold mb-3 hover-electric">
                2. Earn Rewards
              </h3>
              <p className="text-muted-foreground">
                Receive daily rewards based on your stake amount, with potential loyalty multipliers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-electric" />
              </div>
              <h3 className="font-orbitron text-xl font-semibold mb-3 hover-electric">
                3. Unbond & Withdraw
              </h3>
              <p className="text-muted-foreground">
                Unstake anytime with a 21-day unbonding period to ensure network security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section className="mb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-orbitron text-3xl font-bold mb-8 hover-electric">
              Tokenomics
            </h2>
            <div className="bg-gradient-surface border border-card-border rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Supply</span>
                  <span className="font-orbitron text-xl font-bold hover-electric">
                    {tokenomics.totalSupply} FLOW
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Staking Rewards</span>
                    <span className="text-electric font-semibold">{tokenomics.stakingRewards}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ecosystem Fund</span>
                    <span className="text-electric font-semibold">{tokenomics.ecosystem}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Liquidity Mining</span>
                    <span className="text-electric font-semibold">{tokenomics.liquidityMining}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Team & Advisors</span>
                    <span className="text-electric font-semibold">{tokenomics.team}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-orbitron text-3xl font-bold mb-8 hover-electric">
              Loyalty System
            </h2>
            <div className="bg-gradient-surface border border-electric/20 rounded-lg p-6 shadow-glow">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="font-orbitron text-4xl font-bold text-electric mb-2">
                    1.5×
                  </div>
                  <p className="text-muted-foreground">Maximum Multiplier</p>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Staking Duration Bonus</span>
                    <span className="text-electric">+0.1× per month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consistency Bonus</span>
                    <span className="text-electric">+0.2× no unstakes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Referral Activity</span>
                    <span className="text-electric">+0.3× with referrals</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-electric/20">
                  <p className="text-xs text-muted-foreground text-center">
                    Multipliers are applied to base staking rewards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Disclosure */}
      <section className="mb-16">
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <h2 className="font-orbitron text-2xl font-bold text-destructive">
              Risk Disclosure
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {risks.map((risk, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-destructive">{risk.title}</h3>
                <p className="text-sm text-muted-foreground">{risk.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-destructive/10 rounded-lg">
            <p className="text-sm text-center">
              <strong>Important:</strong> Staking involves risks. Please do your own research and only stake what you can afford to lose.
              Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </section>

      {/* Documentation & Links */}
      <section className="text-center">
        <h2 className="font-orbitron text-3xl font-bold mb-8 hover-electric">
          Documentation & Resources
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
            <BookOpen className="h-12 w-12 text-electric mx-auto mb-4" />
            <h3 className="font-orbitron text-lg font-semibold mb-3 hover-electric">
              Whitepaper
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Read our detailed technical documentation and tokenomics.
            </p>
            <Button variant="outline" className="border-electric text-electric hover:bg-electric/10">
              <ExternalLink className="h-4 w-4 mr-2" />
              View PDF
            </Button>
          </div>

          <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
            <Shield className="h-12 w-12 text-electric mx-auto mb-4" />
            <h3 className="font-orbitron text-lg font-semibold mb-3 hover-electric">
              Audit Report
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Review our smart contract security audit results.
            </p>
            <Button variant="outline" className="border-electric text-electric hover:bg-electric/10">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Report
            </Button>
          </div>

          <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
            <Users className="h-12 w-12 text-electric mx-auto mb-4" />
            <h3 className="font-orbitron text-lg font-semibold mb-3 hover-electric">
              Community
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Join our Discord and Telegram communities.
            </p>
            <Button variant="outline" className="border-electric text-electric hover:bg-electric/10">
              <ExternalLink className="h-4 w-4 mr-2" />
              Join Discord
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
