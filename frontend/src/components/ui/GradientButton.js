import React from 'react';
import PropTypes from 'prop-types';

const GradientButton = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  disabled = false,
  ...props
}) => {
  const baseStyles = 'relative overflow-hidden rounded-lg transition-all duration-300 font-medium flex items-center justify-center';
  
  const variantStyles = {
    default: 'text-white shadow-lg hover:shadow-xl active:shadow bg-gradient-to-r from-primary-500 to-accent hover:scale-105',
    outline: 'border-2 border-primary-500 text-primary-500 hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent',
    ghost: 'bg-transparent text-primary-500 hover:bg-opacity-10 hover:bg-primary-500/10',
    dark: 'bg-dark-bg text-white border border-primary-500/40 hover:border-primary-500',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

GradientButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'outline', 'ghost']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default GradientButton;
