
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UnlockWalletComponent from '@/components/UnlockWallet';
import Layout from '@/components/Layout';
import { useWallet } from '@/context/WalletContext';
import { toast } from '@/hooks/use-toast';

const Unlock = () => {
  const navigate = useNavigate();
  const { unlockWallet, unlockWithBiometrics } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async (password: string) => {
    setIsLoading(true);
    try {
      const success = await unlockWallet(password);
      if (success) {
        toast({
          title: "Wallet unlocked",
          description: "Welcome back to SwiftPay",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Unlock failed",
          description: "Incorrect password. Please try again."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unlock wallet. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockWithBiometrics = async () => {
    setIsLoading(true);
    try {
      const success = await unlockWithBiometrics();
      if (success) {
        toast({
          title: "Wallet unlocked",
          description: "Biometric authentication successful",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Biometric authentication failed",
          description: "Please try again or use your password"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to authenticate. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideNavigation>
      <UnlockWalletComponent 
        onUnlock={handleUnlock}
        onUnlockWithBiometrics={handleUnlockWithBiometrics}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default Unlock;
