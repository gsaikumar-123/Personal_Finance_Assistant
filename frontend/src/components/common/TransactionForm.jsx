import { useState } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import { categories, paymentMethods, transactionTypes, defaultFormData } from '../../utils/constants';

const TransactionForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  submitLabel = 'Save',
  loading = false 
}) => {
  const [formData, setFormData] = useState(initialData || defaultFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
    const transactionData = { ...formData, amount: parseFloat(formData.amount) };
    await onSubmit(transactionData, setErrors);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={transactionTypes}
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

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant={formData.type === 'income' ? 'success' : 'primary'}
          className="flex-1"
        >
          {loading ? 'Saving...' : submitLabel}
        </Button>
        
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionForm; 