
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className={`${sizes[size]} rounded-full bg-swiftpay-blue flex items-center justify-center`}>
        <img 
          src="/SwiftPay-uploads/3e97530b-490e-4d25-9217-bb1cee682e79.png" 
          alt="SwiftPay Logo" 
          className="w-full h-full object-contain" 
        />
      </div>
    </Link>
  );
};

export default Logo;
