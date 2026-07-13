import React from 'react';
import Button from '../../../shared/components/ui/Button';

interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  theme?: 'blue' | 'purple' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const variantMap: Record<NonNullable<GameButtonProps['variant']>, 'primary' | 'secondary' | 'danger'> = {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'danger'
}

const GameButton: React.FC<GameButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  theme,
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
    if (theme === 'yellow' || theme === 'green') return 'text-dark-bg';
    if (theme) return 'text-white';

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

  const getThemeClasses = () => {
    switch (theme) {
      case 'blue':
        return 'bg-gradient-to-br from-playzenha-blue via-blue-600 to-blue-800 border border-blue-300/30 shadow-playzenha-blue/30';
      case 'purple':
        return 'bg-gradient-to-br from-purple-400 via-purple-600 to-purple-900 border border-purple-300/30 shadow-purple-500/30';
      case 'green':
        return 'bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-700 border border-emerald-200/40 shadow-emerald-400/25';
      case 'yellow':
        return 'bg-gradient-to-br from-playzenha-yellow via-yellow-300 to-yellow-500 border border-yellow-100/50 shadow-playzenha-yellow/25';
      default:
        return '';
    }
  };

  const getThemeBackground = () => {
    switch (theme) {
      case 'blue':
        return 'linear-gradient(135deg, #0441F2 0%, #2563EB 52%, #1E3A8A 100%)';
      case 'purple':
        return 'linear-gradient(135deg, #C084FC 0%, #9333EA 52%, #581C87 100%)';
      case 'green':
        return 'linear-gradient(135deg, #6EE7B7 0%, #34D399 52%, #047857 100%)';
      case 'yellow':
        return 'linear-gradient(135deg, #FFC603 0%, #FDE047 52%, #EAB308 100%)';
      default:
        return undefined;
    }
  };

  const themedStyle = theme
    ? {
        backgroundImage: getThemeBackground(),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {
        backgroundImage: `url('${getButtonAsset()}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variantMap[variant]}
      className={`game-button-modern game-button-${variant} ${theme ? `game-button-theme-${theme}` : ''} relative !rounded-xl overflow-hidden ${getSizeClasses()} ${getTextColor()} ${getThemeClasses()} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      style={themedStyle}
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
      <div className={`game-button-overlay absolute inset-0 ${
        theme ? 'bg-white/5' :
        variant === 'primary' ? 'bg-playzenha-yellow/20' :
        variant === 'secondary' ? 'bg-playzenha-blue/30' :
        'bg-danger-red/30'
      }`} />
    </Button>
  );
};

export default GameButton;
