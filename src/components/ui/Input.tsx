import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  textarea?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  textarea,
  select,
  options,
  error,
  leftIcon,
  className = '',
  id,
  ...props
}) => {
  const baseInputStyles = `w-full px-4 py-2.5 bg-brand-navy/5 border border-transparent rounded-lg focus:border-brand-orange focus:bg-white outline-none transition-all font-bold text-sm text-brand-navy placeholder:text-brand-navy/20 ${leftIcon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 ml-1" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/20 scale-75">
            {leftIcon}
          </div>
        )}
        
        {textarea ? (
          <textarea
            className={`${baseInputStyles} min-h-[80px] py-4 resize-none font-sans font-normal leading-relaxed`}
            {...(props as any)}
          />
        ) : select ? (
          <select
            className={`${baseInputStyles} appearance-none cursor-pointer`}
            {...(props as any)}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={baseInputStyles}
            {...(props as any)}
          />
        )}
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold uppercase ml-1 tracking-wider">{error}</p>}
    </div>
  );
};

export default Input;
