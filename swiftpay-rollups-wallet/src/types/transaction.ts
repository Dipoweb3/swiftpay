
export interface BaseTransaction {
  id: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: Date;
  network: 'mainnet' | 'rollup';
}

export interface SendTransaction extends BaseTransaction {
  type: 'send';
  recipient: string;
  sender?: never;
}

export interface ReceiveTransaction extends BaseTransaction {
  type: 'receive';
  sender: string;
  recipient?: never;
}

export interface BridgeTransaction extends BaseTransaction {
  type: 'bridge';
  sender?: string;
  recipient?: string;
}

export type Transaction = SendTransaction | ReceiveTransaction | BridgeTransaction;

// Helper functions for type checking
export const isSendTransaction = (tx: Transaction): tx is SendTransaction => tx.type === 'send';
export const isReceiveTransaction = (tx: Transaction): tx is ReceiveTransaction => tx.type === 'receive';
export const isBridgeTransaction = (tx: Transaction): tx is BridgeTransaction => tx.type === 'bridge';

// Database types (matching our Supabase schema)
export interface TransactionDB {
  id: string;
  type: 'send' | 'receive' | 'bridge';
  amount: number;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: string;
  network: 'mainnet' | 'rollup';
  recipient?: string;
  sender?: string;
  user_id: string;
}

export interface WalletDB {
  id: string;
  user_id: string;
  mainnet_balance: number;
  rollup_balance: number;
  created_at: string;
}

export interface BridgeTransactionDB {
  id: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: string;
  from_network: 'mainnet' | 'rollup';
  to_network: 'mainnet' | 'rollup';
  user_id: string;
}

export interface ProfileDB {
  id: string;
  username?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}
