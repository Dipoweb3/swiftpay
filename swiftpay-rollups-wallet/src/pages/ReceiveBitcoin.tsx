
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import NetworkSelector from '@/components/NetworkSelector';
import { Copy, Share2 } from 'lucide-react';
import { useWallet, Network } from '@/context/WalletContext';
import { toast } from '@/hooks/use-toast';

const ReceiveBitcoin = () => {
  const navigate = useNavigate();
  const { wallet, changeNetwork } = useWallet();
  const [network, setNetwork] = useState<Network>(wallet.network);
  const [copied, setCopied] = useState(false);
  
  // Redirect to unlock if wallet is not unlocked
  useEffect(() => {
    if (!wallet.isUnlocked) {
      navigate('/unlock');
    }
  }, [wallet.isUnlocked, navigate]);
  
  // Get the wallet address
  const walletAddress = wallet.address || 'No address available';
  
  // Handle network change
  const handleNetworkChange = (newNetwork: Network) => {
    setNetwork(newNetwork);
    changeNetwork(newNetwork);
  };
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({
      title: "Address copied",
      description: "Bitcoin address copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: 'My Bitcoin Address',
        text: `My ${network} Bitcoin address: ${walletAddress}`,
      });
    } else {
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support the Web Share API",
      });
    }
  };

  return (
    <Layout 
      title="Receive Bitcoin" 
      showBackButton 
      onBack={() => navigate('/dashboard')}
    >
      <div className="space-y-6">
        <NetworkSelector
          selectedNetwork={network}
          onNetworkChange={handleNetworkChange}
        />
        
        <div className="glass-card p-6 flex flex-col items-center">
          <div className="w-64 h-64 bg-white p-4 rounded-lg mb-6">
            {/* This would be a QR code in a real app */}
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <rect x="10" y="10" width="80" height="80" fill="black" />
                <rect x="20" y="20" width="60" height="60" fill="white" />
                <rect x="30" y="30" width="40" height="40" fill="black" />
                <rect x="40" y="40" width="20" height="20" fill="white" />
              </svg>
            </div>
          </div>
          
          <div className="mb-6 w-full">
            <p className="text-center text-sm text-gray-400 mb-2">Your {network === 'mainnet' ? 'Bitcoin' : network === 'testnet' ? 'Testnet' : 'Citrea'} Address</p>
            <div className="flex items-center bg-swiftpay-dark p-3 rounded-lg">
              <p className="text-sm mr-2 flex-1 overflow-hidden text-ellipsis text-center">
                {walletAddress}
              </p>
              <button 
                onClick={handleCopyAddress}
                className="p-1.5 hover:bg-swiftpay-dark-accent rounded"
              >
                <Copy size={16} />
              </button>
            </div>
            {copied && (
              <p className="text-center text-xs text-green-400 mt-1">Address copied to clipboard!</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button 
              variant="outline" 
              fullWidth 
              onClick={handleShare}
              icon={<Share2 size={18} />}
            >
              Share
            </Button>
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => navigate('/dashboard')}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReceiveBitcoin;
