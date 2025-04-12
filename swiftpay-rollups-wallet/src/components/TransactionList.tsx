
import React from 'react';
import { ArrowDown, ArrowUp, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction, isSendTransaction, isReceiveTransaction } from '@/types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onShowMore?: () => void;
  limit?: number;
  showNetwork?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onShowMore,
  limit,
  showNetwork = true,
}) => {
  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 glass-card">
        <p className="text-gray-400">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayedTransactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <div className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mr-3",
              transaction.type === 'send' ? "bg-red-500/20" : "bg-green-500/20",
              transaction.type === 'bridge' && "bg-blue-500/20"
            )}>
              {transaction.type === 'send' && <ArrowUp className="text-red-500" size={20} />}
              {transaction.type === 'receive' && <ArrowDown className="text-green-500" size={20} />}
              {transaction.type === 'bridge' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12H22M22 12L16 6M22 12L16 18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium">
                {transaction.type === 'send' ? 'Sent' : 
                 transaction.type === 'receive' ? 'Received' : 'Bridged'}
              </p>
              <p className="text-sm text-gray-400">
                {transaction.timestamp.toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={cn(
              "font-medium",
              transaction.type === 'send' ? "text-red-400" : "text-green-400"
            )}>
              {transaction.type === 'send' ? '-' : '+'}{transaction.amount.toFixed(8)} BTC
            </span>
            
            <div className="flex items-center mt-1">
              {showNetwork && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded mr-2",
                  transaction.network === 'mainnet' ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"
                )}>
                  {transaction.network === 'mainnet' ? 'Mainnet' : 'Rollup'}
                </span>
              )}
              
              <span className={cn(
                "text-xs px-2 py-0.5 rounded flex items-center",
                transaction.status === 'confirmed' ? "bg-green-500/20 text-green-400" : 
                transaction.status === 'pending' ? "bg-yellow-500/20 text-yellow-400" : 
                "bg-red-500/20 text-red-400"
              )}>
                {transaction.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                {transaction.status}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      {onShowMore && transactions.length > (limit || 0) && (
        <button 
          onClick={onShowMore}
          className="flex items-center justify-center w-full p-3 text-swiftpay-blue hover:bg-swiftpay-dark-accent rounded-lg transition-colors"
        >
          View all transactions
          <ChevronRight className="ml-1 w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default TransactionList;
