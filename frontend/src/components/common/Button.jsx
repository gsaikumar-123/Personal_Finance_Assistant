import React from 'react'

const Button = ({
  label = 'Click',
  onClick,
  type = 'button',
  disabled = false,
  color = 'primary',
}) => {
  const base = 'font-medium rounded-md px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const colors = {
    primary: 'bg-primary text-white hover:bg-blue-800 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-gray-600 focus:ring-secondary',
    success: 'bg-income text-white hover:bg-green-700 focus:ring-income',
    danger: 'bg-expense text-white hover:bg-red-700 focus:ring-expense',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
  }

  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${colors[color]} ${disabledStyle}`}
    >
      {label}
    </button>
  )
}

export default Button
