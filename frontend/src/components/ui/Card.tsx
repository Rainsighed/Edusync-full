import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  padding = 'md',
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  const cardClasses = `bg-white border border-[#e0e0e0] rounded ${paddingStyles[padding]} ${className}`;

  return (
    <div className={cardClasses}>
      {title && (
        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-[#e0e0e0]">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
