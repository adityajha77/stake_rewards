import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export const ConnectWallet: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const connector = connectors[0]; // use only the first connector (e.g. MetaMask)

  if (isConnected) {
    return (
      <Button
        className="bg-electric hover:bg-electric-glow text-black font-semibold shadow-glow"
        onClick={() => disconnect()}
      >
        {address?.slice(0, 6)}...{address?.slice(-4)} (Disconnect)
      </Button>
    );
  }

  return (
    <Button
      className="bg-electric hover:bg-electric-glow text-black font-semibold shadow-glow"
      onClick={() => connect({ connector })}
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
};
