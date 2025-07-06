import { useState, useEffect } from 'react';
import { transactionAPI } from '../../utils/api';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const TransactionForm = ({ transaction = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: '',
    description: '',
    paymentMethod: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = {
    income: [
      { value: 'salary', label: 'Salary' },
      { value: 'business', label: 'Business' },
      { value: 'investments', label: 'Investments' },
      { value: 'other', label: 'Other' }
    ],
    expense: [
      { value: 'food', label: 'Food' },
      { value: 'rent', label: 'Rent' },
      { value: 'transport', label: 'Transport' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'utilities', label: 'Utilities' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'education', label: 'Education' },
      { value: 'other', label: 'Other' }
    ],
  };

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'creditcard', label: 'Credit Card' },
    { value: 'debitcard', label: 'Debit Card' },
    { value: 'banktransfer', label: 'Bank Transfer' },
    { value: 'upi', label: 'UPI' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        date: new Date(transaction.date).toISOString().split('T')[0],
        description: transaction.description || '',
        paymentMethod: transaction.paymentMethod,
      });
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        paymentMethod: '',
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (transaction) {
        await transactionAPI.update(transaction._id, transactionData);
      } else {
        await transactionAPI.add(transactionData);
      }
      
      onSuccess?.();
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Transaction save failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {transaction ? 'Edit Transaction' : 'Add Transaction'}
      </h2>
      
      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={[
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
          ]}
          error={errors.type}
          required
        />

        <Input
          label="Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          error={errors.amount}
          required
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories[formData.type]}
          placeholder="Select category"
          error={errors.category}
          required
        />

        <Input
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />

        <Select
          label="Payment Method"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          options={paymentMethods}
          placeholder="Select payment method"
          error={errors.paymentMethod}
          required
        />

        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional description"
          error={errors.description}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant={formData.type === 'income' ? 'success' : 'primary'}
        >
          {loading ? 'Saving...' : (transaction ? 'Update' : 'Add')}
        </Button>
        
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;