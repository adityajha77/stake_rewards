import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { 
  Home, 
  BarChart3, 
  Coins, 
  Clock, 
  Users, 
  BookOpen,
  Moon,
  Sun
} from 'lucide-react';
import { ConnectWallet } from './ConnectWallet';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { name: 'Stake', path: '/stake', icon: Coins },
  { name: 'Referrals', path: '/referrals', icon: Users },
  { name: 'About', path: '/about', icon: BookOpen },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover-electric transition-all">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Coins className="h-5 w-5 text-black" />
            </div>
            <span className="font-orbitron text-xl font-bold">StakeFlow</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
                    hover-electric hover:bg-surface
                    ${isActive 
                      ? 'bg-electric/10 text-electric border border-electric/20' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle & Connect Wallet */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="border-electric/20 hover:bg-electric/10"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
