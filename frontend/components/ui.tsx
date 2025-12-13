import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-field text-white hover:bg-green-600 shadow-lg shadow-green-900/20",
    secondary: "bg-field-card text-white hover:bg-field-input border border-white/10",
    outline: "bg-transparent border-2 border-field text-field hover:bg-field/10",
    ghost: "bg-transparent text-gray-400 hover:text-white"
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', type, ...props }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-xs font-bold tracking-wider text-gray-400 uppercase ml-1">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-field transition-colors">
            {icon}
          </div>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`w-full bg-field-input border border-white/5 rounded-xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-field/50 focus:ring-1 focus:ring-field/50 transition-all ${icon ? 'pl-11' : ''} ${isPassword ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- CARD ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-field-card rounded-2xl p-5 border border-white/5 ${className}`}>
      {children}
    </div>
  );
};

// --- BADGE ---
export const Badge: React.FC<{ children: React.ReactNode; color?: string; className?: string }> = ({ children, color = 'bg-gray-700', className = '' }) => {
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${color} ${className}`}>
      {children}
    </span>
  );
}