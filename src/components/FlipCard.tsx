import React from 'react';
import { cn } from '@/lib/utils';

interface FlipCardProps {
  className?: string;
  height?: string;
  children: {
    front: React.ReactNode;
    back: React.ReactNode;
  };
}

export const FlipCard: React.FC<FlipCardProps> = ({ 
  className, 
  height = "h-48",
  children 
}) => {
  return (
    <div className={cn("flip-card", height, className)}>
      <div className="flip-card-inner h-full">
        {/* Front Face */}
        <div className="flip-card-front h-full bg-gradient-surface border border-card-border shadow-card p-6 flex flex-col justify-center items-center">
          {children.front}
        </div>
        
        {/* Back Face */}
        <div className="flip-card-back h-full bg-card border border-electric/20 shadow-glow p-6 flex flex-col justify-center">
          {children.back}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;