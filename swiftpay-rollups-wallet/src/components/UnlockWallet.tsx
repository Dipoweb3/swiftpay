
import React, { useState } from 'react';
import Button from './Button';
import { Fingerprint, Eye, EyeOff, KeyRound, Loader } from 'lucide-react';
import Logo from './Logo';

interface UnlockWalletProps {
  onUnlock: (password: string) => void;
  onUnlockWithBiometrics: () => void;
  supportsBiometrics?: boolean;
  isLoading?: boolean;
}

const UnlockWallet: React.FC<UnlockWalletProps> = ({
  onUnlock,
  onUnlockWithBiometrics,
  supportsBiometrics = true,
  isLoading = false
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUnlock(password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Unlock</h1>
      <p className="text-gray-400 mb-8">with Biometrics</p>
      
      {supportsBiometrics && (
        <button 
          onClick={onUnlockWithBiometrics}
          disabled={isLoading}
          className="w-20 h-20 rounded-full bg-swiftpay-dark-accent flex items-center justify-center mb-8 hover:bg-swiftpay-dark-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader size={40} className="text-swiftpay-blue animate-spin" />
          ) : (
            <Fingerprint size={40} className="text-swiftpay-blue" />
          )}
        </button>
      )}
      
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="glass-card p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-swiftpay-dark border border-gray-700 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-swiftpay-blue focus:border-transparent"
                placeholder="Enter password"
                disabled={isLoading}
              />
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            fullWidth 
            type="submit"
            disabled={!password || isLoading}
            isLoading={isLoading}
          >
            Unlock
          </Button>
          
          <div className="mt-4 text-center">
            <a href="#" className="text-swiftpay-blue text-sm hover:underline">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnlockWallet;
