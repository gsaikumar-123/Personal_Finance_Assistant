export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateForInput = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const getCategoryColor = (category) => {
  const colors = {
    salary: 'bg-green-100 text-green-800',
    business: 'bg-blue-100 text-blue-800',
    investments: 'bg-purple-100 text-purple-800',
    food: 'bg-orange-100 text-orange-800',
    rent: 'bg-red-100 text-red-800',
    transport: 'bg-yellow-100 text-yellow-800',
    entertainment: 'bg-pink-100 text-pink-800',
    utilities: 'bg-gray-100 text-gray-800',
    healthcare: 'bg-indigo-100 text-indigo-800',
    education: 'bg-teal-100 text-teal-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return colors[category] || colors.other;
};

export const getPaymentMethodColor = (method) => {
  const colors = {
    cash: 'bg-green-100 text-green-800',
    creditcard: 'bg-blue-100 text-blue-800',
    debitcard: 'bg-purple-100 text-purple-800',
    banktransfer: 'bg-indigo-100 text-indigo-800',
    upi: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return colors[method] || colors.other;
}; 