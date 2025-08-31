import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FlipCard } from '@/components/FlipCard';
import { Zap, TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-staking.jpg';

const features = [
  {
    icon: Zap,
    title: "High APY Rewards",
    description: "Earn competitive returns with our optimized staking rewards system",
    details: "Up to 18.4% APY with auto-compounding rewards. Our smart contracts optimize yield farming strategies to maximize your returns while minimizing gas costs."
  },
  {
    icon: Shield,
    title: "21-Day Security",
    description: "Secure unbonding period ensures network stability and your asset safety",
    details: "Industry-standard security with multi-sig governance. The 21-day unbonding ensures network decentralization and gives you time to reconsider withdrawals."
  },
  {
    icon: TrendingUp,
    title: "1.5× Loyalty Multiplier",
    description: "Boost your rewards with consistent staking and longer lock periods",
    details: "Earn 50% more rewards with consistent staking. The longer you stake without unstaking, the higher your multiplier grows, up to 1.5× base rewards."
  },
  {
    icon: Users,
    title: "Referral Rewards",
    description: "Earn bonus rewards by inviting friends to join the staking community",
    details: "Earn 2-5% bonus on all referral stakes. Build your network and unlock tier-based multipliers: Bronze (2%), Silver (3%), Gold (4%), Platinum (5%)."
  }
];

const stats = [
  { label: "Total Value Locked", value: "$12.5M" },
  { label: "Active Stakers", value: "2,847" },
  { label: "Average APY", value: "18.4%" },
  { label: "Rewards Distributed", value: "$1.2M" }
];

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Futuristic staking platform"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-orbitron text-5xl md:text-7xl font-bold mb-6 hover-electric animate-fade-in-up">
              Stake. Earn. <span className="text-electric">Multiply</span>.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up">
              Join the future of DeFi staking with our advanced reward system, 
              loyalty multipliers, and referral bonuses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
              <Link to="/stake">
                <Button 
                  size="lg" 
                  className="bg-electric hover:bg-electric-glow text-black font-bold px-8 py-4 text-lg shadow-glow hover:shadow-glow-strong transition-all duration-300 hover:scale-105"
                >
                  Start Staking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-electric text-electric hover:bg-electric/10 px-8 py-4 text-lg"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-surface">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-orbitron text-3xl md:text-4xl font-bold text-electric mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 hover-electric">
              Why Choose StakeFlow?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of staking with advanced features 
              designed for maximum rewards and security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <FlipCard key={index} height="h-64">
                  {{
                    front: (
                      <div className="p-6 text-center h-full flex flex-col justify-center">
                        <div className="w-16 h-16 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-electric" />
                        </div>
                        <h3 className="font-orbitron text-xl font-semibold mb-3 hover-electric">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    ),
                    back: (
                      <div className="p-6 h-full flex flex-col justify-center">
                        <div className="w-16 h-16 bg-electric/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-electric" />
                        </div>
                        <h3 className="font-orbitron text-lg font-semibold mb-3 text-electric text-center">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm text-center leading-relaxed">
                          {feature.details}
                        </p>
                      </div>
                    )
                  }}
                </FlipCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 hover-electric">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of stakers already earning rewards with our 
            innovative staking platform.
          </p>
          
          <Link to="/stake">
            <Button 
              size="lg" 
              className="bg-electric hover:bg-electric-glow text-black font-bold px-12 py-4 text-lg shadow-glow hover:shadow-glow-strong animate-glow-pulse"
            >
              Launch App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;