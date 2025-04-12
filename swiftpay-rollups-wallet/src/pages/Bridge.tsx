
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Bridge = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<'to-rollup' | 'to-mainnet'>('to-rollup');
  
  // Mock balances
  const balances = {
    mainnet: { btc: 0.25, usd: 12330.20 },
    rollup: { btc: 0.15, usd: 7398.12 },
  };
  
  const sourceNetwork = direction === 'to-rollup' ? 'mainnet' : 'rollup';
  const targetNetwork = direction === 'to-rollup' ? 'rollup' : 'mainnet';
  
  const toggleDirection = () => {
    setDirection(direction === 'to-rollup' ? 'to-mainnet' : 'to-rollup');
    setAmount('');
  };
  
  const handleBridge = () => {
    // In a real app, this would initiate the bridge transaction
    console.log('Bridging', amount, 'BTC from', sourceNetwork, 'to', targetNetwork);
    
    // For demo, just go back to dashboard
    navigate('/dashboard');
  };

  return (
    <Layout 
      title="Bridge Bitcoin" 
      showBackButton 
      onBack={() => navigate('/dashboard')}
    >
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6 text-center">
            {direction === 'to-rollup' ? 'Bridge to zk-Rollup' : 'Bridge to Bitcoin Mainnet'}
          </h2>
          
          <div className="grid grid-cols-5 mb-6">
            <div className="col-span-2 flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                sourceNetwork === 'mainnet' ? "bg-orange-500/20" : "bg-green-500/20"
              )}>
                <span className={cn(
                  "text-2xl font-bold",
                  sourceNetwork === 'mainnet' ? "text-orange-400" : "text-green-400"
                )}>B</span>
              </div>
              <p className="text-sm font-medium">
                {sourceNetwork === 'mainnet' ? 'Bitcoin' : 'zkBitcoin'}
              </p>
              <p className="text-xs text-gray-400">
                Balance: {balances[sourceNetwork].btc.toFixed(8)}
              </p>
            </div>
            
            <div className="col-span-1 flex items-center justify-center">
              <button 
                onClick={toggleDirection}
                className="w-10 h-10 rounded-full bg-swiftpay-dark-accent flex items-center justify-center hover:bg-opacity-80"
              >
                <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="col-span-2 flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                targetNetwork === 'mainnet' ? "bg-orange-500/20" : "bg-green-500/20"
              )}>
                <span className={cn(
                  "text-2xl font-bold",
                  targetNetwork === 'mainnet' ? "text-orange-400" : "text-green-400"
                )}>B</span>
              </div>
              <p className="text-sm font-medium">
                {targetNetwork === 'mainnet' ? 'Bitcoin' : 'zkBitcoin'}
              </p>
              <p className="text-xs text-gray-400">
                Balance: {balances[targetNetwork].btc.toFixed(8)}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-1">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00000000"
                className="w-full bg-swiftpay-dark border border-gray-700 rounded-lg p-3 pr-16 focus:ring-2 focus:ring-swiftpay-blue focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button className="text-swiftpay-blue text-sm" onClick={() => setAmount(balances[sourceNetwork].btc.toString())}>
                  MAX
                </button>
              </div>
            </div>
            
            {amount && (
              <div className="mt-1 text-right text-sm text-gray-400">
                ≈ ${(parseFloat(amount) * 49320.80).toFixed(2)}
              </div>
            )}
          </div>
          
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-500 mb-1">Important Information</h4>
                <p className="text-xs text-gray-400">
                  {direction === 'to-rollup' 
                    ? "Bridging to zk-Rollup takes about 5-10 minutes. Your BTC will be locked on the mainnet and an equivalent amount of zkBTC will be minted."
                    : "Bridging back to mainnet can take up to 24 hours to complete. Your zkBTC will be burned and your locked BTC will be released."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <div className="flex-1 p-3 bg-swiftpay-dark rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Bridge Fee</p>
              <p className="text-sm font-medium">0.0001 BTC ($4.93)</p>
            </div>
            <div className="flex-1 p-3 bg-swiftpay-dark rounded-lg">
              <p className="text-xs text-gray-400 mb-1">You'll Receive</p>
              <p className="text-sm font-medium">
                {amount ? (parseFloat(amount) - 0.0001).toFixed(8) : '0.00000000'} BTC
              </p>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            fullWidth 
            className="mt-6"
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balances[sourceNetwork].btc}
            onClick={handleBridge}
          >
            Bridge Bitcoin
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Bridge;
