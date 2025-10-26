import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  size = 'sm',
}) => {
  const variantStyles = {
    default: 'bg-[#e0e0e0] text-[#333] border-[#ccc]',
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={`inline-block border rounded ${variantStyles[variant]} ${sizeStyles[size]} font-medium`}>
      {children}
    </span>
  );
};
