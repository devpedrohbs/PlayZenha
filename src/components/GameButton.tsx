import React from 'react';
import { motion } from 'framer-motion';

interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const GameButton: React.FC<GameButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const getButtonAsset = () => {
    const baseAsset = '/Assets/PNG';
    
    switch (variant) {
      case 'primary':
        return `${baseAsset}/Yellow/Default/button_rectangle_depth_gloss.png`;
      case 'secondary':
        return `${baseAsset}/Blue/Default/button_rectangle_depth_gradient.png`;
      case 'danger':
        return `${baseAsset}/Red/Default/button_rectangle_depth_gloss.png`;
      default:
        return `${baseAsset}/Yellow/Default/button_rectangle_depth_gloss.png`;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return 'text-dark-bg';
      case 'secondary':
        return 'text-white';
      case 'danger':
        return 'text-white';
      default:
        return 'text-dark-bg';
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative font-fredoka font-bold rounded-xl overflow-hidden ${getSizeClasses()} ${getTextColor()} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={{
        backgroundImage: `url('${getButtonAsset()}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </div>
      
      {/* Overlay para garantir legibilidade do texto */}
      <div className={`absolute inset-0 ${
        variant === 'primary' ? 'bg-playzenha-yellow/20' : 
        variant === 'secondary' ? 'bg-playzenha-blue/30' :
        'bg-danger-red/30'
      }`} />
    </motion.button>
  );
};

export default GameButton;