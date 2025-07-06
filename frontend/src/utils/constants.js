export const categories = {
  income: [
    { value: 'salary', label: 'Salary' },
    { value: 'business', label: 'Business' },
    { value: 'investments', label: 'Investments' },
    { value: 'other', label: 'Other' },
  ],
  expense: [
    { value: 'food', label: 'Food' },
    { value: 'rent', label: 'Rent' },
    { value: 'transport', label: 'Transport' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
  ],
};

export const allCategories = [
  { value: 'salary', label: 'Salary' },
  { value: 'business', label: 'Business' },
  { value: 'investments', label: 'Investments' },
  { value: 'food', label: 'Food' },
  { value: 'rent', label: 'Rent' },
  { value: 'transport', label: 'Transport' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

export const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'creditcard', label: 'Credit Card' },
  { value: 'debitcard', label: 'Debit Card' },
  { value: 'banktransfer', label: 'Bank Transfer' },
  { value: 'upi', label: 'UPI' },
  { value: 'other', label: 'Other' },
];

export const transactionTypes = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export const defaultFormData = {
  type: 'expense',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  paymentMethod: '',
};
