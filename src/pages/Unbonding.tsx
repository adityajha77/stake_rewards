import React from 'react';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

// Mock unbonding queue data
const unbondingQueue = [
  {
    id: 1,
    amount: "5,000.00 FLOW",
    initiatedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    completionDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    status: 'unbonding'
  },
  {
    id: 2,
    amount: "2,500.00 FLOW",
    initiatedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    completionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago (ready)
    status: 'ready'
  },
  {
    id: 3,
    amount: "1,000.00 FLOW",
    initiatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    completionDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000), // 19 days from now
    status: 'unbonding'
  }
];

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const Unbonding: React.FC = () => {
  const readyToWithdraw = unbondingQueue.filter(item => item.status === 'ready');
  const stillUnbonding = unbondingQueue.filter(item => item.status === 'unbonding');
  const totalReady = readyToWithdraw.reduce((sum, item) => 
    sum + parseFloat(item.amount.replace(/[^\d.]/g, '')), 0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-orbitron text-4xl font-bold mb-2 hover-electric">
          Unbonding Queue
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your unstaking progress and withdraw available tokens
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">In Queue</span>
          </div>
          <div className="font-orbitron text-2xl font-bold hover-electric">
            {stillUnbonding.length}
          </div>
          <div className="text-sm text-muted-foreground">Unbonding Requests</div>
        </div>

        <div className="bg-gradient-surface border border-electric/20 rounded-lg p-6 shadow-glow hover:shadow-glow-strong transition-all">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Ready</span>
          </div>
          <div className="font-orbitron text-2xl font-bold text-electric">
            {totalReady.toLocaleString()} FLOW
          </div>
          <div className="text-sm text-muted-foreground">Available to Withdraw</div>
        </div>

        <div className="bg-gradient-surface border border-card-border rounded-lg p-6 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="h-8 w-8 text-electric" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <div className="font-orbitron text-2xl font-bold hover-electric">
            {unbondingQueue.reduce((sum, item) => 
              sum + parseFloat(item.amount.replace(/[^\d.]/g, '')), 0
            ).toLocaleString()} FLOW
          </div>
          <div className="text-sm text-muted-foreground">All Unbonding</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Unbonding Queue */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-orbitron text-2xl font-semibold hover-electric">
              Your Unbonding History
            </h2>
            {readyToWithdraw.length > 0 && (
              <Button className="bg-electric hover:bg-electric-glow text-black font-semibold">
                <CheckCircle className="h-4 w-4 mr-2" />
                Withdraw All Ready
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {unbondingQueue.map((item) => (
              <div 
                key={item.id}
                className={`
                  bg-gradient-surface border rounded-lg p-6 hover:shadow-card-hover transition-all
                  ${item.status === 'ready' 
                    ? 'border-electric/40 shadow-glow' 
                    : 'border-card-border'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {item.status === 'ready' ? (
                      <CheckCircle className="h-6 w-6 text-electric" />
                    ) : (
                      <Clock className="h-6 w-6 text-electric" />
                    )}
                    <div>
                      <div className="font-orbitron text-lg font-semibold hover-electric">
                        {item.amount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Initiated: {formatDate(item.initiatedDate)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {item.status === 'ready' ? (
                      <div>
                        <div className="text-electric font-semibold mb-2">Ready!</div>
                        <Button 
                          size="sm" 
                          className="bg-electric hover:bg-electric-glow text-black"
                        >
                          Withdraw
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Completes:</div>
                        <div className="font-semibold">{formatDate(item.completionDate)}</div>
                      </div>
                    )}
                  </div>
                </div>

                {item.status === 'unbonding' && (
                  <div className="mt-4 pt-4 border-t border-card-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-electric">
                        {Math.round(
                          ((Date.now() - item.initiatedDate.getTime()) / 
                          (item.completionDate.getTime() - item.initiatedDate.getTime())) * 100
                        )}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-electric h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.round(
                            ((Date.now() - item.initiatedDate.getTime()) / 
                            (item.completionDate.getTime() - item.initiatedDate.getTime())) * 100
                          ))}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next Completion Timer */}
        <div className="space-y-6">
          {stillUnbonding.length > 0 && (
            <div className="bg-gradient-surface border border-card-border rounded-lg p-6">
              <CountdownTimer 
                targetDate={stillUnbonding.sort((a, b) => 
                  a.completionDate.getTime() - b.completionDate.getTime()
                )[0].completionDate}
                onComplete={() => console.log('Unbonding complete!')}
              />
            </div>
          )}

          {/* Unbonding Info */}
          <div className="bg-gradient-surface border border-card-border rounded-lg p-6">
            <h3 className="font-orbitron font-semibold mb-4 hover-electric">
              Unbonding Process
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-electric/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-electric font-bold text-xs">1</span>
                </div>
                <div>
                  <div className="font-semibold">Initiate Unstake</div>
                  <div className="text-muted-foreground">
                    Request to unstake your tokens from the pool
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-electric/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-electric font-bold text-xs">2</span>
                </div>
                <div>
                  <div className="font-semibold">21-Day Wait</div>
                  <div className="text-muted-foreground">
                    Tokens are locked during the unbonding period
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-electric/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-electric font-bold text-xs">3</span>
                </div>
                <div>
                  <div className="font-semibold">Withdraw</div>
                  <div className="text-muted-foreground">
                    Claim your tokens back to your wallet
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-surface border border-card-border rounded-lg p-6">
            <h3 className="font-orbitron font-semibold mb-4 hover-electric">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-electric text-electric hover:bg-electric/10"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-electric text-electric hover:bg-electric/10"
              >
                <Clock className="h-4 w-4 mr-2" />
                Set Reminder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unbonding;