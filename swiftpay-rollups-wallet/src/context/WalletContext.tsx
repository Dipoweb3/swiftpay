
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from '@scure/bip32';
import * as ecc from '@bitcoinerlab/secp256k1';
import CryptoJS from 'crypto-js';
import ECPairFactory from 'ecpair';
import { Buffer } from 'buffer';

// Ensure Buffer is globally available for bitcoinjs-lib
window.Buffer = Buffer;

export type Network = 'mainnet' | 'testnet' | 'citrea';

export interface WalletData {
  mnemonic?: string;
  address?: string;
  privateKey?: string;
  network: Network;
  mainnetBalance: number;
  testnetBalance: number;
  citreaBalance: number;
  isUnlocked: boolean;
}

interface WalletContextType {
  wallet: WalletData;
  generating: boolean;
  createWallet: (password: string) => Promise<string>;
  restoreWallet: (mnemonic: string, password: string) => Promise<boolean>;
  unlockWallet: (password: string) => Promise<boolean>;
  unlockWithBiometrics: () => Promise<boolean>;
  lockWallet: () => void;
  changeNetwork: (network: Network) => void;
  getBalance: () => Promise<number>;
  refreshBalance: () => Promise<void>;
  hasWallet: boolean;
}

// Correctly use bip32 HDKey API
const ECPair = ECPairFactory(ecc);

const defaultWallet: WalletData = {
  network: 'mainnet',
  mainnetBalance: 0,
  testnetBalance: 0,
  citreaBalance: 0,
  isUnlocked: false
};

const WalletContext = createContext<WalletContextType>({
  wallet: defaultWallet,
  generating: false,
  createWallet: async () => '',
  restoreWallet: async () => false,
  unlockWallet: async () => false,
  unlockWithBiometrics: async () => false,
  lockWallet: () => {},
  changeNetwork: () => {},
  getBalance: async () => 0,
  refreshBalance: async () => {},
  hasWallet: false
});

export const useWallet = () => useContext(WalletContext);

const WALLET_DATA_KEY = 'swiftpay_wallet_data';
const ENCRYPTED_SEED_KEY = 'swiftpay_encrypted_seed';

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletData>(defaultWallet);
  const [generating, setGenerating] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    const encryptedData = localStorage.getItem(ENCRYPTED_SEED_KEY);
    setHasWallet(!!encryptedData);
    
    const storedWalletData = localStorage.getItem(WALLET_DATA_KEY);
    if (storedWalletData) {
      try {
        const parsedData = JSON.parse(storedWalletData);
        setWallet(prevWallet => ({
          ...prevWallet,
          network: parsedData.network || 'mainnet',
          mainnetBalance: parsedData.mainnetBalance || 0,
          testnetBalance: parsedData.testnetBalance || 0,
          citreaBalance: parsedData.citreaBalance || 0
        }));
      } catch (error) {
        console.error('Error parsing wallet data:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (wallet.network) {
      const dataToStore = {
        network: wallet.network,
        mainnetBalance: wallet.mainnetBalance,
        testnetBalance: wallet.testnetBalance,
        citreaBalance: wallet.citreaBalance
      };
      localStorage.setItem(WALLET_DATA_KEY, JSON.stringify(dataToStore));
    }
  }, [wallet.network, wallet.mainnetBalance, wallet.testnetBalance, wallet.citreaBalance]);

  const createWallet = async (password: string): Promise<string> => {
    try {
      setGenerating(true);
      
      const mnemonic = bip39.generateMnemonic(128);
      const seed = await bip39.mnemonicToSeed(mnemonic);
      
      // Use the correct bip32 API
      const rootKey = bip32.HDKey.fromMasterSeed(seed);
      const path = `m/44'/0'/0'/0/0`;
      const child = rootKey.derive(path);
      
      const { address, privateKey } = getAddressAndKeyFromNode(child, 'mainnet');
      
      const encryptedMnemonic = encryptMnemonic(mnemonic, password);
      localStorage.setItem(ENCRYPTED_SEED_KEY, encryptedMnemonic);
      
      setWallet({
        ...defaultWallet,
        address,
        network: 'mainnet'
      });
      
      setHasWallet(true);
      return mnemonic;
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw new Error('Failed to create wallet');
    } finally {
      setGenerating(false);
    }
  };

  const restoreWallet = async (mnemonic: string, password: string): Promise<boolean> => {
    try {
      setGenerating(true);
      
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
      }
      
      const seed = await bip39.mnemonicToSeed(mnemonic);
      
      // Use the correct bip32 API
      const rootKey = bip32.HDKey.fromMasterSeed(seed);
      const path = `m/44'/0'/0'/0/0`;
      const child = rootKey.derive(path);
      
      const { address, privateKey } = getAddressAndKeyFromNode(child, 'mainnet');
      
      const encryptedMnemonic = encryptMnemonic(mnemonic, password);
      localStorage.setItem(ENCRYPTED_SEED_KEY, encryptedMnemonic);
      
      setWallet({
        ...defaultWallet,
        address,
        network: 'mainnet'
      });
      
      setHasWallet(true);
      return true;
    } catch (error) {
      console.error('Error restoring wallet:', error);
      return false;
    } finally {
      setGenerating(false);
    }
  };

  const unlockWallet = async (password: string): Promise<boolean> => {
    try {
      const encryptedData = localStorage.getItem(ENCRYPTED_SEED_KEY);
      if (!encryptedData) {
        throw new Error('No wallet found');
      }
      
      const mnemonic = decryptMnemonic(encryptedData, password);
      
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid password');
      }
      
      const seed = await bip39.mnemonicToSeed(mnemonic);
      
      // Use the correct bip32 API
      const rootKey = bip32.HDKey.fromMasterSeed(seed);
      const path = `m/44'/0'/0'/0/0`;
      const child = rootKey.derive(path);
      
      const { address, privateKey } = getAddressAndKeyFromNode(child, wallet.network);
      
      setWallet(prev => ({
        ...prev,
        mnemonic,
        address,
        privateKey,
        isUnlocked: true
      }));
      
      await refreshBalance();
      
      return true;
    } catch (error) {
      console.error('Error unlocking wallet:', error);
      return false;
    }
  };

  const unlockWithBiometrics = async (): Promise<boolean> => {
    try {
      const mockPassword = 'biometric_secure_key';
      return await unlockWallet(mockPassword);
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  };

  const lockWallet = () => {
    setWallet(prev => ({
      ...prev,
      mnemonic: undefined,
      privateKey: undefined,
      isUnlocked: false
    }));
  };

  const changeNetwork = (network: Network) => {
    setWallet(prev => ({ ...prev, network }));
  };

  const getBalance = async (): Promise<number> => {
    if (!wallet.address) {
      return 0;
    }
    
    switch (wallet.network) {
      case 'mainnet':
        return wallet.mainnetBalance;
      case 'testnet':
        return wallet.testnetBalance;
      case 'citrea':
        return wallet.citreaBalance;
      default:
        return 0;
    }
  };

  const refreshBalance = async (): Promise<void> => {
    if (!wallet.address) {
      return;
    }
    
    try {
      let balance = 0;
      
      switch (wallet.network) {
        case 'mainnet':
          balance = 0.00125;
          setWallet(prev => ({ ...prev, mainnetBalance: balance }));
          break;
        case 'testnet':
          balance = 0.05;
          setWallet(prev => ({ ...prev, testnetBalance: balance }));
          break;
        case 'citrea':
          balance = 0.1;
          setWallet(prev => ({ ...prev, citreaBalance: balance }));
          break;
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  const getAddressAndKeyFromNode = (
    node: bip32.HDKey, 
    network: Network
  ): { address: string; privateKey: string } => {
    const networkParams = network === 'testnet' 
      ? bitcoin.networks.testnet 
      : bitcoin.networks.bitcoin;
    
    const privateKeyBuffer = node.privateKey;
    if (!privateKeyBuffer) {
      throw new Error('Failed to derive private key');
    }
    
    const keypair = ECPair.fromPrivateKey(Buffer.from(privateKeyBuffer), { network: networkParams });
    const privateKey = keypair.toWIF();
    
    const { address } = bitcoin.payments.p2wpkh({ 
      pubkey: Buffer.from(node.publicKey), 
      network: networkParams 
    });
    
    if (!address) {
      throw new Error('Failed to derive address');
    }
    
    return { address, privateKey };
  };

  const encryptMnemonic = (mnemonic: string, password: string): string => {
    return CryptoJS.AES.encrypt(mnemonic, password).toString();
  };

  const decryptMnemonic = (encryptedData: string, password: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const value = {
    wallet,
    generating,
    createWallet,
    restoreWallet,
    unlockWallet,
    unlockWithBiometrics,
    lockWallet,
    changeNetwork,
    getBalance,
    refreshBalance,
    hasWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
