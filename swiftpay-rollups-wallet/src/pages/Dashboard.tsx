
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import WalletCard from '@/components/WalletCard';
import TransactionList from '@/components/TransactionList';
import { ChevronRight } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { toast } from '@/hooks/use-toast';
import { TransactionsAPI } from '@/services/api';
import { useApi } from '@/hooks/useApi';
import { Transaction } from '@/types/transaction';

const Dashboard = () => {
  const navigate = useNavigate();
  const { wallet, hasWallet, refreshBalance } = useWallet();
  
  // Redirect to create wallet if no wallet exists
  useEffect(() => {
    if (!hasWallet) {
      navigate('/create-wallet');
    } else if (!wallet.isUnlocked) {
      navigate('/unlock');
    }
  }, [hasWallet, wallet.isUnlocked, navigate]);

  // Refresh balance on mount
  useEffect(() => {
    if (wallet.isUnlocked) {
      refreshBalance().catch(error => {
        console.error('Error refreshing balance:', error);
      });
    }
  }, [wallet.isUnlocked, refreshBalance]);
  
  // Fetch transactions
  const { 
    data: transactions, 
    isLoading: transactionsLoading, 
    error: transactionsError 
  } = useApi<Transaction[]>(
    TransactionsAPI.getTransactions,
    []
  );

  // Handle errors
  useEffect(() => {
    if (transactionsError) {
      toast({
        variant: "destructive",
        title: "Error loading transactions",
        description: (transactionsError as Error).message,
      });
    }
  }, [transactionsError]);

  const handleSend = () => {
    navigate('/send');
  };

  const handleReceive = () => {
    navigate('/receive');
  };

  const handleViewAllTransactions = () => {
    navigate('/transactions');
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        <WalletCard 
          onSend={handleSend}
          onReceive={handleReceive}
        />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <button 
              onClick={handleViewAllTransactions}
              className="flex items-center text-swiftpay-blue text-sm"
            >
              View all
              <ChevronRight size={16} />
            </button>
          </div>
          
          {transactionsLoading ? (
            <div className="glass-card p-6 animate-pulse">
              <div className="h-16 bg-gray-700/30 rounded mb-3"></div>
              <div className="h-16 bg-gray-700/30 rounded mb-3"></div>
              <div className="h-16 bg-gray-700/30 rounded"></div>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <TransactionList 
              transactions={transactions}
              limit={3}
            />
          ) : (
            <div className="text-center py-8 glass-card">
              <p className="text-gray-400">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
