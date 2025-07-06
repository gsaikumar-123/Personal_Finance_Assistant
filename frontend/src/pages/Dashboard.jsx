import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../utils/api';
import { formatCurrency } from '../utils/format';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import TransactionFilter from '../components/transactions/TransactionFilter';
import CategoryChart from '../components/charts/CategoryChart';
import DateChart from '../components/charts/DateChart';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAll();
      const data = response.data?.data || response.data || [];
      const safeData = Array.isArray(data) ? data : [];
      setTransactions(safeData);
      setFilteredTransactions(safeData);
    } catch (error) {
      setTransactions([]);
      setFilteredTransactions([]);
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSuccess = () => {
    setShowForm(false);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFilter = async (filters) => {
    try {
      setLoading(true);
      let response;

      if (filters.type) {
        response = await transactionAPI.getByType(filters.type);
      } else if (filters.category) {
        response = await transactionAPI.filterByCategory(filters.category);
      } else if (filters.fromDate && filters.toDate) {
        response = await transactionAPI.filterByDate(filters.fromDate, filters.toDate);
      } else {
        response = await transactionAPI.getAll();
      }

      const data = response.data?.data || response.data || [];
      const safeData = Array.isArray(data) ? data : [];
      setFilteredTransactions(safeData);
    } catch (error) {
      setFilteredTransactions([]);
      console.error('Failed to filter transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilteredTransactions(Array.isArray(transactions) ? transactions : []);
  };

  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeFilteredTransactions = Array.isArray(filteredTransactions) ? filteredTransactions : [];

  const totalIncome = safeTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = safeTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName}! Here's your financial overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-income rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-income">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-expense rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-expense">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CategoryChart transactions={safeTransactions} />
          <DateChart transactions={safeTransactions} />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
            <Button
              onClick={() => setShowForm(true)}
              disabled={showForm}
            >
              Add Transaction
            </Button>
          </div>

          {showForm && (
            <div className="mb-6">
              <TransactionForm
                transaction={editingTransaction}
                onSuccess={handleTransactionSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTransaction(null);
                }}
              />
            </div>
          )}

          <TransactionFilter
            onFilter={handleFilter}
            onClear={handleClearFilters}
          />
        </div>

        <TransactionList
          transactions={safeFilteredTransactions}
          onUpdate={handleEditTransaction}
          onDelete={fetchTransactions}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
