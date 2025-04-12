
import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Network } from '@/context/WalletContext';

interface NetworkSelectorProps {
  selectedNetwork: Network;
  onNetworkChange: (network: Network) => void;
  className?: string;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetwork,
  onNetworkChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const networks = [
    { id: 'mainnet' as Network, name: 'Bitcoin Mainnet', description: 'Slower, higher fees' },
    { id: 'testnet' as Network, name: 'Bitcoin Testnet', description: 'Testing network' },
    { id: 'citrea' as Network, name: 'Citrea zk-Rollup', description: 'Faster, lower fees' },
  ] as const;

  const selectedNetworkData = networks.find(network => network.id === selectedNetwork);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleNetworkSelect = (network: Network) => {
    onNetworkChange(network);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full p-3 text-left bg-swiftpay-dark-accent rounded-lg hover:bg-opacity-80 transition-colors border border-white/10"
      >
        <div className="flex items-center">
          <div className={cn(
            "w-3 h-3 rounded-full mr-2",
            selectedNetwork === 'mainnet' ? "bg-orange-500" : 
            selectedNetwork === 'testnet' ? "bg-blue-500" : "bg-green-500"
          )} />
          <div>
            <p className="text-sm font-medium">{selectedNetworkData?.name}</p>
            <p className="text-xs text-gray-400">{selectedNetworkData?.description}</p>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-swiftpay-dark-accent border border-white/10 rounded-lg shadow-lg">
          {networks.map((network) => (
            <button
              key={network.id}
              className="flex items-center justify-between w-full p-3 hover:bg-black/20 text-left"
              onClick={() => handleNetworkSelect(network.id)}
            >
              <div className="flex items-center">
                <div className={cn(
                  "w-3 h-3 rounded-full mr-2",
                  network.id === 'mainnet' ? "bg-orange-500" : 
                  network.id === 'testnet' ? "bg-blue-500" : "bg-green-500"
                )} />
                <div>
                  <p className="text-sm font-medium">{network.name}</p>
                  <p className="text-xs text-gray-400">{network.description}</p>
                </div>
              </div>
              {selectedNetwork === network.id && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;
