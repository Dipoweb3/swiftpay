
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { Shield, Zap, Coins } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-swiftpay-dark text-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="mb-10">
          <Logo size="lg" />
        </div>
        
        <div className="max-w-md w-full mb-12">
          <h1 className="text-4xl font-bold mb-3 text-center">Fast Bitcoin Payments for Everyone</h1>
          <p className="text-center text-gray-400 mb-8">
            Experience Bitcoin without the wait. Fast, cheap, and secure with zk-rollups.
          </p>
          
          <div className="grid gap-6 mb-8">
            <div className="flex items-start glass-card p-4">
              <div className="mr-4 p-2 bg-swiftpay-blue/20 rounded-full">
                <Zap className="text-swiftpay-blue" size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1">Lightning Fast</h3>
                <p className="text-sm text-gray-400">
                  Send and receive Bitcoin in seconds, not minutes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start glass-card p-4">
              <div className="mr-4 p-2 bg-swiftpay-blue/20 rounded-full">
                <Coins className="text-swiftpay-blue" size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1">Low Fees</h3>
                <p className="text-sm text-gray-400">
                  Pay cents instead of dollars with zk-rollups.
                </p>
              </div>
            </div>
            
            <div className="flex items-start glass-card p-4">
              <div className="mr-4 p-2 bg-swiftpay-blue/20 rounded-full">
                <Shield className="text-swiftpay-blue" size={20} />
              </div>
              <div>
                <h3 className="font-medium mb-1">Completely Secure</h3>
                <p className="text-sm text-gray-400">
                  Built on Bitcoin with cutting-edge security.
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth
            onClick={() => navigate('/create-wallet')}
          >
            Get Started
          </Button>
          
          <p className="text-center mt-4">
            <a 
              href="#" 
              className="text-swiftpay-blue hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/unlock');
              }}
            >
              I already have a wallet
            </a>
          </p>
        </div>
      </main>
      
      <footer className="p-6 text-center text-gray-500 text-sm">
        <p>© 2025 SwiftPay. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
