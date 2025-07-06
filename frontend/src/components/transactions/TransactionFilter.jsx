import { useState } from 'react';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';

const TransactionFilter = ({ onFilter, onClear }) => {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    fromDate: '',
    toDate: '',
  });

  const categories = [
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilter = () => {
    onFilter?.(filters);
  };

  const handleClear = () => {
    setFilters({
      type: '',
      category: '',
      fromDate: '',
      toDate: '',
    });
    onClear?.();
  };

  const hasFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Transactions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Type"
          name="type"
          value={filters.type}
          onChange={handleChange}
          options={[
            { value: '', label: 'All Types' },
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
          ]}
        />

        <Select
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          options={[
            { value: '', label: 'All Categories' },
            ...categories,
          ]}
        />

        <Input
          label="From Date"
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
        />

        <Input
          label="To Date"
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={handleFilter}
          disabled={!hasFilters}
        >
          Apply Filters
        </Button>
        
        {hasFilters && (
          <Button
            onClick={handleClear}
            variant="outline"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionFilter;