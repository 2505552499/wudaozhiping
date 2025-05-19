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
    default: 'text-white shadow-lg hover:shadow-xl active:shadow bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple hover:scale-105',
    outline: 'border-2 border-xtalpi-indigo text-xtalpi-indigo hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-xtalpi-dark-blue hover:via-xtalpi-indigo hover:to-xtalpi-purple',
    ghost: 'bg-transparent text-xtalpi-indigo hover:bg-opacity-10 hover:bg-xtalpi-indigo/10',
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
