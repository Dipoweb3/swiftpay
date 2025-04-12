
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Send, ReceiptText, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  hideNavigation = false,
  title,
  showBackButton = false,
  onBack,
}) => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Send', icon: Send, path: '/send' },
    { name: 'Receive', icon: ReceiptText, path: '/receive' },
    { name: 'Bridge', icon: ArrowRightLeft, path: '/bridge' },
    { name: 'Security', icon: ShieldCheck, path: '/security' },
  ];

  return (
    <div className="min-h-screen bg-swiftpay-dark text-white flex flex-col">
      {/* Header */}
      {(title || showBackButton) && (
        <header className="sticky top-0 z-10 bg-swiftpay-dark border-b border-white/10">
          <div className="container mx-auto px-4 h-16 flex items-center">
            {showBackButton && (
              <button 
                onClick={onBack} 
                className="mr-4 p-2 hover:bg-swiftpay-dark-accent rounded-full"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            
            {title && (
              <h1 className="text-xl font-semibold">{title}</h1>
            )}
          </div>
        </header>
      )}
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-md">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {!hideNavigation && (
        <nav className="sticky bottom-0 bg-swiftpay-dark-accent border-t border-white/10 py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-around items-center">
              {navItems.map((item) => {
                const isActive = path === item.path;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex flex-col items-center p-2 rounded-lg",
                      isActive ? "text-swiftpay-blue" : "text-gray-400 hover:text-white"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="text-xs mt-1">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
