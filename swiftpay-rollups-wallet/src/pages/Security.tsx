
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { ChevronRight, ShieldCheck, Fingerprint, Eye, EyeOff, Smartphone, Key, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const SecurityOption = ({ 
  icon, 
  title, 
  description, 
  onClick,
  active = false,
  showToggle = false,
  isToggled = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  active?: boolean;
  showToggle?: boolean;
  isToggled?: boolean;
}) => {
  return (
    <button 
      className="w-full glass-card p-4 flex items-center justify-between mb-3 hover:bg-swiftpay-dark-accent/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="mr-4 text-swiftpay-blue">{icon}</div>
        <div className="text-left">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      
      {showToggle ? (
        <div className={cn(
          "w-12 h-6 rounded-full p-1 transition-colors",
          isToggled ? "bg-swiftpay-blue" : "bg-gray-700"
        )}>
          <div className={cn(
            "w-4 h-4 bg-white rounded-full transition-transform",
            isToggled ? "transform translate-x-6" : ""
          )}></div>
        </div>
      ) : (
        <ChevronRight size={20} className="text-gray-400" />
      )}
    </button>
  );
};

const Security = () => {
  const navigate = useNavigate();
  
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isAppLockEnabled, setIsAppLockEnabled] = useState(true);
  
  const handleToggleBiometric = () => {
    setIsBiometricEnabled(!isBiometricEnabled);
  };
  
  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };
  
  const handleToggleAppLock = () => {
    setIsAppLockEnabled(!isAppLockEnabled);
  };
  
  const handleRecoveryPhrase = () => {
    // In a real app, this would require password verification before showing recovery phrase
    console.log('Show recovery phrase (with verification)');
  };
  
  const handleDeviceManagement = () => {
    console.log('Show device management');
  };

  return (
    <Layout title="Security">
      <div className="space-y-6">
        <div className="glass-card p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
              <ShieldCheck className="text-green-500" size={20} />
            </div>
            <div>
              <h3 className="font-medium">Security Status</h3>
              <p className="text-sm text-green-400">Strong</p>
            </div>
          </div>
          
          <div className="w-20 bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full" style={{ width: '80%' }}></div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Authentication</h2>
          
          <SecurityOption 
            icon={<Fingerprint size={24} />}
            title="Biometric Authentication"
            description="Unlock with fingerprint or Face ID"
            onClick={handleToggleBiometric}
            showToggle
            isToggled={isBiometricEnabled}
          />
          
          <SecurityOption 
            icon={<Smartphone size={24} />}
            title="Two-Factor Authentication"
            description="Add an extra layer of security"
            onClick={handleToggle2FA}
            showToggle
            isToggled={is2FAEnabled}
          />
          
          <SecurityOption 
            icon={<Clock size={24} />}
            title="Auto-Lock"
            description="Lock app after 5 minutes of inactivity"
            onClick={handleToggleAppLock}
            showToggle
            isToggled={isAppLockEnabled}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Recovery & Devices</h2>
          
          <SecurityOption 
            icon={<Key size={24} />}
            title="Recovery Phrase"
            description="View your 12-word recovery phrase"
            onClick={handleRecoveryPhrase}
          />
          
          <SecurityOption 
            icon={<Smartphone size={24} />}
            title="Device Management"
            description="Manage devices that can access your wallet"
            onClick={handleDeviceManagement}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Security;
