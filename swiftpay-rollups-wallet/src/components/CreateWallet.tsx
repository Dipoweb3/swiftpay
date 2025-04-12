import React, { useState } from 'react';
import Button from './Button';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateWalletProps {
  onComplete: (seedPhrase: string, password: string) => void;
  isLoading?: boolean;
}

const CreateWallet: React.FC<CreateWalletProps> = ({ onComplete, isLoading = false }) => {
  const [step, setStep] = useState<'generate' | 'backup' | 'confirm' | 'password'>('generate');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [confirmSeed, setConfirmSeed] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  React.useEffect(() => {
    const mockSeedPhrase = 'apple banana cherry dolphin elephant frog giraffe honey igloo jungle kiwi lemon';
    setSeedPhrase(mockSeedPhrase);
    
    const words = mockSeedPhrase.split(' ');
    setShuffledWords([...words].sort(() => Math.random() - 0.5));
  }, []);

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seedPhrase);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWordSelect = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleConfirmSeed = () => {
    const confirmedSeed = selectedWords.join(' ');
    setConfirmSeed(confirmedSeed);
    if (confirmedSeed === seedPhrase) {
      setStep('password');
    } else {
      alert('Seed phrase does not match. Please try again.');
      setSelectedWords([]);
    }
  };

  const handleCreateWallet = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    onComplete(seedPhrase, password);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {step === 'generate' && (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Create New Wallet</h2>
            <p className="text-gray-400">Let's set up your Bitcoin wallet and keep it secure</p>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Your Recovery Phrase</h3>
            <p className="text-sm text-gray-400 mb-4">
              Write down these 12 words in order and keep them somewhere safe. Anyone with this phrase can access your wallet.
            </p>
            
            <div className="bg-swiftpay-dark p-4 rounded-lg mb-4 relative">
              <div className="grid grid-cols-3 gap-2">
                {seedPhrase.split(' ').map((word, index) => (
                  <div key={index} className="flex items-center bg-swiftpay-dark-accent p-2 rounded">
                    <span className="text-gray-400 mr-2 text-xs">{index + 1}.</span>
                    <span className="text-sm">{word}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleCopySeed}
                className="absolute top-2 right-2 p-2 hover:bg-swiftpay-dark-accent rounded-full"
              >
                <Copy size={16} />
              </button>
              
              {isCopied && (
                <div className="absolute top-2 right-12 bg-swiftpay-dark-accent px-2 py-1 rounded text-xs">
                  Copied!
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex items-center bg-yellow-500/20 text-yellow-400 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Never share your recovery phrase with anyone</span>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => setStep('backup')}
              disabled={isLoading}
            >
              I've written it down
            </Button>
          </div>
        </>
      )}
      
      {step === 'backup' && (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Verify Recovery Phrase</h2>
            <p className="text-gray-400">Select the words in the correct order</p>
          </div>
          
          <div className="glass-card p-6">
            <div className="mb-4 min-h-[100px] bg-swiftpay-dark p-4 rounded-lg border border-dashed border-gray-600">
              <div className="flex flex-wrap gap-2">
                {selectedWords.map((word, index) => (
                  <div 
                    key={index}
                    className="bg-swiftpay-blue/20 text-swiftpay-blue px-3 py-1 rounded text-sm"
                    onClick={() => handleWordSelect(word)}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {shuffledWords.map((word, index) => (
                  <button
                    key={index}
                    className={cn(
                      "px-3 py-1 rounded text-sm",
                      selectedWords.includes(word) 
                        ? "bg-gray-600 text-gray-400" 
                        : "bg-swiftpay-dark-accent text-white hover:bg-swiftpay-dark-accent/80"
                    )}
                    onClick={() => handleWordSelect(word)}
                    disabled={selectedWords.includes(word) || isLoading}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setStep('generate');
                  setSelectedWords([]);
                }}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleConfirmSeed}
                disabled={selectedWords.length !== seedPhrase.split(' ').length || isLoading}
              >
                Confirm
              </Button>
            </div>
          </div>
        </>
      )}
      
      {step === 'password' && (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Create Password</h2>
            <p className="text-gray-400">Set a strong password to secure your wallet</p>
          </div>
          
          <div className="glass-card p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-swiftpay-dark border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-swiftpay-blue focus:border-transparent"
                    placeholder="Enter password"
                    disabled={isLoading}
                  />
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
              
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-swiftpay-dark border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-swiftpay-blue focus:border-transparent"
                  placeholder="Confirm password"
                  disabled={isLoading}
                />
              </div>
              
              {password && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Password strength:</p>
                  <div className="flex space-x-1">
                    <div className={`h-1 flex-1 rounded-full ${password.length > 0 ? 'bg-red-500' : 'bg-gray-600'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-yellow-500' : 'bg-gray-600'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${password.length >= 10 && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-400">
                    <li className={`${password.length >= 8 ? 'text-green-400' : ''}`}>• At least 8 characters</li>
                    <li className={`${/[A-Z]/.test(password) ? 'text-green-400' : ''}`}>• At least one uppercase letter</li>
                    <li className={`${/[0-9]/.test(password) ? 'text-green-400' : ''}`}>• At least one number</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => setStep('backup')}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleCreateWallet}
                disabled={!password || password.length < 8 || password !== confirmPassword || isLoading}
                isLoading={isLoading}
              >
                Create Wallet
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateWallet;
