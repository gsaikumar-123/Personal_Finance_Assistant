import { useState, useEffect } from 'react';
import { transactionAPI } from '../utils/api';
import { formatCurrency } from '../utils/format';
import { allCategories, transactionTypes } from '../utils/constants';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import CategoryChart from '../components/charts/CategoryChart';
import DateChart from '../components/charts/DateChart';
import TransactionCard from '../components/transactions/TransactionCard';

const FilterTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    fromDate: '',
    toDate: ''
  });

  const hasFilters = Object.values(filters).some(v => v !== '');

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await transactionAPI.getAll();
      const data = res.data?.data || res.data || [];
      setTransactions(data);
      setFiltered(data);
    } catch (err) {
      setTransactions([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...transactions];

    if (filters.type) {
      result = result.filter(t => t.type === filters.type);
    }

    if (filters.category) {
      result = result.filter(t => t.category === filters.category);
    }

    if (filters.fromDate) {
      result = result.filter(t => new Date(t.date) >= new Date(filters.fromDate));
    }

    if (filters.toDate) {
      result = result.filter(t => new Date(t.date) <= new Date(filters.toDate));
    }

    setFiltered(result);
  };

  const clearFilters = () => {
    setFilters({ type: '', category: '', fromDate: '', toDate: '' });
    setFiltered(transactions);
  };

  const totalIncome = filtered
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const renderCard = (label, value, icon, bg, textColor) => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{label}</p>
          <p className={`text-lg sm:text-2xl font-bold ${textColor} truncate`}>
            {formatCurrency(value)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Filter and analyze your transactions</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select label="Type" name="type" value={filters.type} onChange={e => updateFilter('type', e.target.value)} options={[{ value: '', label: 'All Types' }, ...transactionTypes]} />
            <Select label="Category" name="category" value={filters.category} onChange={e => updateFilter('category', e.target.value)} options={[{ value: '', label: 'All Categories' }, ...allCategories]} />
            <Input label="From Date" type="date" name="fromDate" value={filters.fromDate} onChange={e => updateFilter('fromDate', e.target.value)} />
            <Input label="To Date" type="date" name="toDate" value={filters.toDate} onChange={e => updateFilter('toDate', e.target.value)} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button onClick={applyFilters} disabled={!hasFilters} className="w-full sm:w-auto">Apply Filters</Button>
            {hasFilters && <Button onClick={clearFilters} variant="outline" className="w-full sm:w-auto">Clear Filters</Button>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          {renderCard('Total Income', totalIncome, <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>, 'bg-green-100', 'text-income')}
          {renderCard('Total Expenses', totalExpense, <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>, 'bg-red-100', 'text-expense')}
          {renderCard('Balance', balance, <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, 'bg-primary', balance >= 0 ? 'text-income' : 'text-expense')}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <CategoryChart transactions={filtered} />
          <DateChart transactions={filtered} />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Transactions ({filtered.length})</h3>
            {hasFilters && <span className="text-xs sm:text-sm text-gray-500">Showing filtered results</span>}
          </div>

          {loading ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">Loading transactions...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <div className="mb-2">No transactions found</div>
              <div className="text-xs sm:text-sm text-gray-400">{hasFilters ? 'Try adjusting your filters' : 'Add your first transaction to get started'}</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {filtered.slice(0, 50).map(t => <TransactionCard key={t._id} transaction={t} onDelete={fetchData} />)}
              </div>
              {filtered.length > 50 && <div className="mt-4 text-center text-sm text-gray-500">Showing first 50 of {filtered.length} transactions</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterTransactions;