
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import TransactionList from '@/components/TransactionList';
import { Search } from 'lucide-react';
import { 
  Transaction, 
  isSendTransaction, 
  isReceiveTransaction,
  isBridgeTransaction
} from '@/types/transaction';
import { TransactionsAPI } from '@/services/api';
import { useApi } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'mainnet' | 'rollup'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch transactions
  const { 
    data: allTransactions, 
    isLoading, 
    error 
  } = useApi<Transaction[]>(
    TransactionsAPI.getTransactions,
    []
  );

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading transactions",
        description: (error as Error).message,
      });
    }
  }, [error]);
  
  const filteredTransactions = allTransactions 
    ? allTransactions.filter(tx => {
      // Filter by network
      if (filter !== 'all' && tx.network !== filter) {
        return false;
      }
      
      // Filter by search query (address, amount, etc.)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const amountStr = tx.amount.toString();
        
        // Different properties based on transaction type
        let recipientStr = '';
        let senderStr = '';
        
        if (isSendTransaction(tx)) {
          recipientStr = tx.recipient || '';
        } else if (isReceiveTransaction(tx)) {
          senderStr = tx.sender || '';
        } else if (isBridgeTransaction(tx)) {
          recipientStr = tx.recipient || '';
          senderStr = tx.sender || '';
        }
        
        return (
          amountStr.includes(query) ||
          recipientStr.toLowerCase().includes(query) ||
          senderStr.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    : [];
  
  return (
    <Layout 
      title="Transaction History" 
      showBackButton 
      onBack={() => navigate('/dashboard')}
    >
      <div className="space-y-6">
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-swiftpay-dark border border-gray-700 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-swiftpay-blue focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="flex mb-4">
          <button 
            className={`flex-1 py-2 text-center text-sm ${filter === 'all' ? 'text-swiftpay-blue border-b-2 border-swiftpay-blue' : 'text-gray-400'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`flex-1 py-2 text-center text-sm ${filter === 'mainnet' ? 'text-swiftpay-blue border-b-2 border-swiftpay-blue' : 'text-gray-400'}`}
            onClick={() => setFilter('mainnet')}
          >
            Bitcoin
          </button>
          <button 
            className={`flex-1 py-2 text-center text-sm ${filter === 'rollup' ? 'text-swiftpay-blue border-b-2 border-swiftpay-blue' : 'text-gray-400'}`}
            onClick={() => setFilter('rollup')}
          >
            zk-Rollup
          </button>
        </div>
        
        {isLoading ? (
          <div className="glass-card p-6 animate-pulse">
            <div className="h-16 bg-gray-700/30 rounded mb-3"></div>
            <div className="h-16 bg-gray-700/30 rounded mb-3"></div>
            <div className="h-16 bg-gray-700/30 rounded"></div>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <TransactionList transactions={filteredTransactions} />
        ) : (
          <div className="text-center py-10 glass-card">
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionHistory;
