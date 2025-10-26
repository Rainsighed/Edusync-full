import React from 'react';
import { X } from 'lucide-react';

interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant,
  message,
  dismissible = true,
  onDismiss,
}) => {
  const variantStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`border rounded p-3 flex items-start justify-between ${variantStyles[variant]}`}>
      <p className="flex-1">{message}</p>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-3 text-current hover:opacity-70 transition-opacity"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
