
import { supabase } from "@/integrations/supabase/client";
import { 
  Transaction, TransactionDB, WalletDB, 
  BridgeTransactionDB, ProfileDB 
} from "@/types/transaction";

/**
 * API Service for handling all backend communications
 * This centralizes all API calls and provides proper error handling
 */

// Transaction API
export const TransactionsAPI = {
  // Get user transactions
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      return (data as TransactionDB[]).map(tx => ({
        ...tx,
        timestamp: new Date(tx.timestamp),
        amount: Number(tx.amount)
      })) as Transaction[];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
  
  // Record a new transaction
  createTransaction: async (transactionData: Omit<TransactionDB, 'id' | 'timestamp'>): Promise<Transaction> => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        timestamp: new Date(data.timestamp),
        amount: Number(data.amount)
      } as Transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }
};

// Wallet API
export const WalletAPI = {
  // Get wallet details
  getWalletDetails: async (): Promise<WalletDB> => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        mainnet_balance: Number(data.mainnet_balance),
        rollup_balance: Number(data.rollup_balance)
      } as WalletDB;
    } catch (error) {
      console.error('Error fetching wallet details:', error);
      throw error;
    }
  },
  
  // Update wallet balance
  updateWalletBalance: async (updates: {
    mainnet_balance?: number;
    rollup_balance?: number;
  }): Promise<WalletDB> => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .update(updates)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        mainnet_balance: Number(data.mainnet_balance),
        rollup_balance: Number(data.rollup_balance)
      } as WalletDB;
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      throw error;
    }
  },
  
  // Create a new wallet for user if it doesn't exist
  createWalletIfNotExists: async (): Promise<WalletDB> => {
    try {
      // First check if wallet exists
      const { data: existingWallet, error: fetchError } = await supabase
        .from('wallets')
        .select('*')
        .single();
      
      // If wallet already exists, return it
      if (existingWallet) {
        return {
          ...existingWallet,
          mainnet_balance: Number(existingWallet.mainnet_balance),
          rollup_balance: Number(existingWallet.rollup_balance)
        } as WalletDB;
      }
      
      // Get the user ID from auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create new wallet
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert({
          user_id: user.id,
          mainnet_balance: 0,
          rollup_balance: 0
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      return {
        ...newWallet,
        mainnet_balance: Number(newWallet.mainnet_balance),
        rollup_balance: Number(newWallet.rollup_balance)
      } as WalletDB;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }
};

// User API
export const UserAPI = {
  // Get user profile
  getUserProfile: async (): Promise<ProfileDB> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single();
      
      if (error) throw error;
      return data as ProfileDB;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: async (updates: Partial<ProfileDB>): Promise<ProfileDB> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .select()
        .single();
      
      if (error) throw error;
      return data as ProfileDB;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Bridge API
export const BridgeAPI = {
  // Initiate bridge transaction
  initiateBridge: async (bridgeData: Omit<BridgeTransactionDB, 'id' | 'timestamp' | 'status'>): Promise<BridgeTransactionDB> => {
    try {
      const { data, error } = await supabase
        .from('bridge_transactions')
        .insert({
          ...bridgeData,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return {
        ...data,
        amount: Number(data.amount)
      } as BridgeTransactionDB;
    } catch (error) {
      console.error('Error initiating bridge transaction:', error);
      throw error;
    }
  },
  
  // Get bridge transaction status
  getBridgeStatus: async (bridgeId: string): Promise<BridgeTransactionDB> => {
    try {
      const { data, error } = await supabase
        .from('bridge_transactions')
        .select('*')
        .eq('id', bridgeId)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        amount: Number(data.amount)
      } as BridgeTransactionDB;
    } catch (error) {
      console.error('Error fetching bridge status:', error);
      throw error;
    }
  }
};
