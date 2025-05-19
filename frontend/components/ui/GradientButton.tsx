import React from 'react';
import { ButtonProps } from 'antd';

interface GradientButtonProps extends Omit<ButtonProps, 'type'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const baseStyles = 'relative overflow-hidden rounded-lg transition-all duration-300 font-medium flex items-center justify-center';
  
  const variantStyles = {
    default: 'text-white shadow-lg hover:shadow-xl active:shadow',
    outline: 'border-2 border-xtalpi-indigo text-xtalpi-indigo hover:text-white',
    ghost: 'bg-transparent text-xtalpi-indigo hover:bg-opacity-10 hover:bg-xtalpi-indigo/10',
  };

  // 渐变背景样式
  const gradientBg = variant === 'default' ? 'bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple hover:scale-105' : '';
  
  const hoverFill = variant === 'outline' ? 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-xtalpi-dark-blue before:via-xtalpi-indigo before:to-xtalpi-purple before:opacity-0 before:transition-opacity hover:before:opacity-100 before:-z-10 hover:border-transparent' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${gradientBg} ${hoverFill} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;
