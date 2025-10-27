const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  type = 'button',
  className = '' 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 min-h-10 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-800 active:bg-blue-900 focus:ring-primary shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-white hover:bg-gray-600 active:bg-gray-700 focus:ring-secondary shadow-sm hover:shadow-md',
    success: 'bg-income text-white hover:bg-green-700 active:bg-green-800 focus:ring-income shadow-sm hover:shadow-md',
    danger: 'bg-expense text-white hover:bg-red-700 active:bg-red-800 focus:ring-expense shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white active:bg-blue-900 focus:ring-primary transition-colors',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-6 py-3 text-base sm:text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;``