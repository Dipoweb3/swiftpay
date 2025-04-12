
import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Loader, RefreshCcw } from 'lucide-react';
import Button from './Button';
import NetworkSelector from './NetworkSelector';
import { useWallet, Network } from '@/context/WalletContext';

interface WalletCardProps {
  onSend: () => void;
  onReceive: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  onSend,
  onReceive,
}) => {
  const { wallet, changeNetwork, refreshBalance } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usdPrice, setUsdPrice] = useState(48000); // Default BTC price in USD

  // Get current balance based on selected network
  const currentBalance = wallet.network === 'mainnet'
    ? wallet.mainnetBalance
    : wallet.network === 'testnet'
      ? wallet.testnetBalance
      : wallet.citreaBalance;
  
  // Calculate USD value
  const usdBalance = currentBalance * usdPrice;

  // Fetch BTC price on mount
  useEffect(() => {
    fetchBtcPrice();
  }, []);

  // Fetch BTC price
  const fetchBtcPrice = async () => {
    try {
      // In a real app, this would use CoinGecko or similar API
      // For demo purposes, we'll use a mock price
      // Example API call: const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      // const data = await response.json();
      // setUsdPrice(data.bitcoin.usd);
      
      // Mock price update
      setUsdPrice(48000 + Math.random() * 2000);
    } catch (error) {
      console.error('Error fetching BTC price:', error);
    }
  };

  // Handle network change
  const handleNetworkChange = (network: Network) => {
    changeNetwork(network);
  };

  // Handle balance refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalance();
      await fetchBtcPrice();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <NetworkSelector 
          selectedNetwork={wallet.network} 
          onNetworkChange={handleNetworkChange}
        />
        
        <button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="p-2 rounded-full hover:bg-swiftpay-dark-accent transition-colors disabled:opacity-50"
        >
          {isRefreshing ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <RefreshCcw size={18} />
          )}
        </button>
      </div>
      
      <div className="space-y-1 mb-6">
        <h3 className="text-lg text-gray-400">Balance</h3>
        <h1 className="text-4xl font-bold">{currentBalance.toFixed(8)} BTC</h1>
        <p className="text-lg text-green-400">${usdBalance.toFixed(2)}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="primary" 
          fullWidth 
          icon={<ArrowUp size={18} />}
          onClick={onSend}
          disabled={!wallet.isUnlocked}
        >
          Send
        </Button>
        <Button 
          variant="outline" 
          fullWidth 
          icon={<ArrowDown size={18} />}
          onClick={onReceive}
        >
          Receive
        </Button>
      </div>
    </div>
  );
};

export default WalletCard;
