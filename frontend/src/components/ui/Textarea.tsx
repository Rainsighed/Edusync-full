import React from 'react';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  name,
  rows = 4,
}) => {
  const baseStyles = 'w-full px-3 py-2 rounded border transition-colors duration-150 focus:outline-none focus:ring-2 resize-y';
  const normalStyles = 'border-[#d0d0d0] focus:border-[#2c3e50] focus:ring-[#2c3e50]/20';
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';

  const textareaClasses = `${baseStyles} ${error ? errorStyles : normalStyles} ${disabledStyles} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block font-medium text-sm mb-1 text-[#1a1a1a]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
