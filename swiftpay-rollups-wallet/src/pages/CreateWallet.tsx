
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateWalletComponent from '@/components/CreateWallet';
import Layout from '@/components/Layout';
import { useWallet } from '@/context/WalletContext';
import { toast } from '@/hooks/use-toast';

const CreateWallet = () => {
  const navigate = useNavigate();
  const { createWallet, generating } = useWallet();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWallet = async (seedPhrase: string, password: string) => {
    setIsCreating(true);
    try {
      // In our case, the component already has the seed phrase,
      // but in reality we should get it from createWallet
      await createWallet(password);
      
      toast({
        title: "Wallet created successfully",
        description: "Your wallet has been created and is ready to use",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating wallet",
        description: "Something went wrong while creating your wallet. Please try again."
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout
      hideNavigation
      showBackButton
      onBack={() => navigate('/')}
    >
      <CreateWalletComponent 
        onComplete={handleCreateWallet} 
        isLoading={isCreating || generating}
      />
    </Layout>
  );
};

export default CreateWallet;
