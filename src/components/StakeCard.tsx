import React from 'react';
import { FlipCard } from './FlipCard';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, Clock, Users } from 'lucide-react';

interface StakeCardProps {
  poolName: string;
  apy: string;
  tvl: string;
  userStaked: string;
  rewards: string;
  timeLeft?: string;
  isActive?: boolean;
}

export const StakeCard: React.FC<StakeCardProps> = ({
  poolName,
  apy,
  tvl,
  userStaked,
  rewards,
  timeLeft,
  isActive = true
}) => {
  return (
    <FlipCard
      className="w-full max-w-sm transition-all duration-300 hover:scale-105"
      height="h-64"
    >
      {{
        front: (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-electric" />
              <h3 className="font-orbitron text-xl font-bold hover-electric">
                {poolName}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">APY</span>
                <span className="font-bold text-electric text-lg">{apy}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">TVL</span>
                <span className="font-semibold">{tvl}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Your Stake</span>
                <span className="font-semibold">{userStaked}</span>
              </div>
            </div>
            
            <div className="pt-2 text-xs text-muted-foreground">
              Hover to see details
            </div>
          </div>
        ),
        back: (
          <div className="space-y-4 text-center">
            <h3 className="font-orbitron text-lg font-bold text-electric mb-4">
              {poolName} Details
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-electric" />
                <span>Pending Rewards: <strong className="text-electric">{rewards}</strong></span>
              </div>
              
              {timeLeft && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-electric" />
                  <span>Unbonding: <strong>{timeLeft}</strong></span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-electric" />
                <span>21-day lock period</span>
              </div>
              
              <div className="text-xs text-muted-foreground mt-4">
                1.5× loyalty multiplier available
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                size="sm" 
                className="flex-1 bg-electric hover:bg-electric-glow text-black font-semibold"
              >
                Stake
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-electric text-electric hover:bg-electric/10"
              >
                Claim
              </Button>
            </div>
          </div>
        ),
      }}
    </FlipCard>
  );
};

export default StakeCard;