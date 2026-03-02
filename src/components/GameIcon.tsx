import React from 'react';

interface GameIconProps {
  type: 'play' | 'arrow_up' | 'arrow_down' | 'star' | 'checkmark' | 'cross' | 'repeat';
  variant?: 'light' | 'dark' | 'outline' | 'color';
  color?: 'yellow' | 'blue' | 'red' | 'green' | 'grey' | 'extra';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GameIcon: React.FC<GameIconProps> = ({ 
  type, 
  variant = 'outline', 
  color = 'extra',
  size = 'md',
  className = '' 
}) => {
  const getIconPath = () => {
    const baseAsset = '/Assets/PNG';
    
    // Ícones da pasta Extra (play, arrows, repeat)
    if (['play', 'arrow_up', 'arrow_down', 'repeat'].includes(type)) {
      return `${baseAsset}/Extra/Default/icon_${type}_${variant}.png`;
    }
    
    // Ícones das pastas coloridas (star, checkmark, cross)
    const colorPath = color === 'extra' ? 'Extra' : 
      color.charAt(0).toUpperCase() + color.slice(1);
    
    if (type === 'star') {
      return variant === 'outline' 
        ? `${baseAsset}/${colorPath}/Default/star_outline.png`
        : `${baseAsset}/${colorPath}/Default/star.png`;
    }
    
    return `${baseAsset}/${colorPath}/Default/icon_${variant === 'outline' ? 'outline_' : ''}${type}.png`;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  return (
    <img
      src={getIconPath()}
      alt={`${type} icon`}
      className={`${getSizeClasses()} ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default GameIcon;