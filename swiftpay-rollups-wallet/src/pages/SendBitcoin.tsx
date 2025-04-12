
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Button from '@/components/Button';
import NetworkSelector from '@/components/NetworkSelector';
import { ArrowRight, Scan, Loader } from 'lucide-react';
import { useWallet, Network } from '@/context/WalletContext';
import { toast } from '@/hooks/use-toast';
import bitcoinAPI from '@/services/bitcoin';

const SendBitcoin = () => {
  const navigate = useNavigate();
  const { wallet, changeNetwork } = useWallet();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [network, setNetwork] = useState<Network>(wallet.network);
  const [currency, setCurrency] = useState<'BTC' | 'USD'>('BTC');
  const [isSending, setIsSending] = useState(false);
  const [feeEstimates, setFeeEstimates] = useState<{
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
  } | null>(null);
  const [selectedFee, setSelectedFee] = useState<'fastest' | 'halfHour' | 'hour' | 'economy'>('halfHour');
  
  // Mock exchange rate (in a real app, this would be fetched from an API)
  const [exchangeRate, setExchangeRate] = useState(48000);
  
  // Redirect to unlock if wallet is not unlocked
  useEffect(() => {
    if (!wallet.isUnlocked) {
      navigate('/unlock');
    }
  }, [wallet.isUnlocked, navigate]);
  
  // Load fee estimates on mount and when network changes
  useEffect(() => {
    const loadFeeEstimates = async () => {
      try {
        const estimates = await bitcoinAPI.getFeeEstimates(network);
        setFeeEstimates(estimates);
      } catch (error) {
        console.error('Error loading fee estimates:', error);
      }
    };
    
    loadFeeEstimates();
  }, [network]);
  
  // Handle network change
  const handleNetworkChange = (newNetwork: Network) => {
    setNetwork(newNetwork);
    changeNetwork(newNetwork);
  };
  
  // Convert between BTC and USD
  const formatCurrencyValue = (value: string) => {
    if (!value) return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    if (currency === 'BTC') {
      return numValue.toFixed(8);
    } else {
      return numValue.toFixed(2);
    }
  };
  
  const getEquivalentValue = () => {
    if (!amount) return '';
    
    const numValue = parseFloat(amount);
    if (isNaN(numValue)) return '';
    
    if (currency === 'BTC') {
      return `≈ $${(numValue * exchangeRate).toFixed(2)}`;
    } else {
      return `≈ ${(numValue / exchangeRate).toFixed(8)} BTC`;
    }
  };
  
  const toggleCurrency = () => {
    setCurrency(currency === 'BTC' ? 'USD' : 'BTC');
    setAmount('');
  };
  
  // Calculate transaction fee based on selected fee rate
  const calculateTxFee = () => {
    if (!feeEstimates) return 0;
    
    // Estimate fee based on a typical transaction size (250 bytes)
    const txSize = 250; // bytes
    const feeRate = selectedFee === 'fastest' ? feeEstimates.fastestFee :
                    selectedFee === 'halfHour' ? feeEstimates.halfHourFee :
                    selectedFee === 'hour' ? feeEstimates.hourFee :
                    feeEstimates.economyFee;
    
    // Convert sat/vB to BTC
    return (feeRate * txSize) / 100000000;
  };
  
  const getFeeInBtc = () => {
    return calculateTxFee();
  };
  
  const getFeeInUsd = () => {
    return calculateTxFee() * exchangeRate;
  };
  
  const handleSend = async () => {
    // In a real app, this would sign and broadcast the transaction
    setIsSending(true);
    
    try {
      // Validate inputs
      if (!recipient.trim()) {
        throw new Error('Recipient address is required');
      }
      
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      // Convert USD to BTC if needed
      const btcAmount = currency === 'USD' ? parseFloat(amount) / exchangeRate : parseFloat(amount);
      
      // Add network fee
      const fee = calculateTxFee();
      const totalAmount = btcAmount + fee;
      
      // Check if wallet has enough balance
      const walletBalance = network === 'mainnet' ? wallet.mainnetBalance : 
                            network === 'testnet' ? wallet.testnetBalance : 
                            wallet.citreaBalance;
      
      if (totalAmount > walletBalance) {
        throw new Error('Insufficient balance to cover the transaction and fee');
      }
      
      // In a real app, this is where we would:
      // 1. Create a Bitcoin transaction
      // 2. Sign it with the private key
      // 3. Broadcast it to the network
      
      // For demo purposes, we'll just simulate a successful transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Transaction sent",
        description: `Transaction successfully broadcast to the ${network} network`,
      });
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Failed to send transaction"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Layout 
      title="Send Bitcoin" 
      showBackButton 
      onBack={() => navigate('/dashboard')}
    >
      <div className="space-y-6">
        <NetworkSelector
          selectedNetwork={network}
          onNetworkChange={handleNetworkChange}
        />
        
        <div className="glass-card p-6">
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Recipient</label>
            <div className="relative">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Bitcoin address or username"
                className="w-full bg-swiftpay-dark border border-gray-700 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-swiftpay-blue focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                <Scan size={20} />
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <label className="text-sm text-gray-400">Amount</label>
              <button 
                onClick={toggleCurrency}
                className="text-xs text-swiftpay-blue"
              >
                Switch to {currency === 'BTC' ? 'USD' : 'BTC'}
              </button>
            </div>
            
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-swiftpay-dark border border-gray-700 rounded-lg p-3 pr-16 focus:ring-2 focus:ring-swiftpay-blue focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {currency}
              </div>
            </div>
            
            {amount && (
              <div className="mt-1 text-right text-sm text-gray-400">
                {getEquivalentValue()}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Transaction Fee</label>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => setSelectedFee('fastest')}
                className={`p-2 text-center rounded-lg text-sm ${
                  selectedFee === 'fastest' 
                    ? 'bg-swiftpay-blue text-white' 
                    : 'bg-swiftpay-dark-accent text-gray-300'
                }`}
              >
                Fastest
              </button>
              <button
                onClick={() => setSelectedFee('halfHour')}
                className={`p-2 text-center rounded-lg text-sm ${
                  selectedFee === 'halfHour' 
                    ? 'bg-swiftpay-blue text-white' 
                    : 'bg-swiftpay-dark-accent text-gray-300'
                }`}
              >
                Fast
              </button>
              <button
                onClick={() => setSelectedFee('hour')}
                className={`p-2 text-center rounded-lg text-sm ${
                  selectedFee === 'hour' 
                    ? 'bg-swiftpay-blue text-white' 
                    : 'bg-swiftpay-dark-accent text-gray-300'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setSelectedFee('economy')}
                className={`p-2 text-center rounded-lg text-sm ${
                  selectedFee === 'economy' 
                    ? 'bg-swiftpay-blue text-white' 
                    : 'bg-swiftpay-dark-accent text-gray-300'
                }`}
              >
                Economy
              </button>
            </div>
            
            <div className="flex justify-between mb-4 p-3 bg-swiftpay-dark rounded-lg">
              <span className="text-sm text-gray-400">Network Fee</span>
              <span className="text-sm font-medium">
                {getFeeInBtc().toFixed(8)} BTC (${getFeeInUsd().toFixed(2)})
              </span>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            fullWidth 
            disabled={!amount || !recipient || isSending}
            onClick={handleSend}
            icon={isSending ? <Loader className="animate-spin" size={18} /> : <ArrowRight size={18} />}
            isLoading={isSending}
          >
            Send Bitcoin
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SendBitcoin;
