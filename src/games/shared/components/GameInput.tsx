import React from 'react';
import { motion } from 'framer-motion';
import Input from '../../../shared/components/ui/Input';

interface GameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'rectangle' | 'square';
  style?: 'default' | 'outline';
}

const GameInput: React.FC<GameInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  variant = 'rectangle',
  style = 'outline'
}) => {
  const getInputAsset = () => {
    return `/Assets/PNG/Extra/Default/input_${style}_${variant}.png`;
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('${getInputAsset()}')`,
          backgroundSize: 'stretch',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      />
      <Input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          relative z-10 w-full !border-0 !bg-transparent px-4 py-3 
          outline-none focus:!ring-0
          font-comfortaa text-white placeholder-gray-400
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
        style={{
          background: 'transparent'
        }}
      />
    </motion.div>
  );
};

export default GameInput;
