import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../utils/api';
import { formatCurrency } from '../utils/format';
import { allCategories, transactionTypes } from '../utils/constants';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import CategoryChart from '../components/charts/CategoryChart';
import DateChart from '../components/charts/DateChart';

const FilterTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', category: '', fromDate: '', toDate: '' });
  const [deletingId, setDeletingId] = useState(null);

  const hasFilters = Object.values(filters).some(v => v !== '');
  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await transactionAPI.getAll();
      const data = res.data?.data || res.data || [];
      setTransactions(data);
      setFiltered(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setTransactions([]); 
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...transactions];
    if (filters.type) result = result.filter(t => t.type === filters.type);
    if (filters.category) result = result.filter(t => t.category === filters.category);
    if (filters.fromDate) result = result.filter(t => new Date(t.date) >= new Date(filters.fromDate));
    if (filters.toDate) result = result.filter(t => new Date(t.date) <= new Date(filters.toDate));
    setFiltered(result);
  };

  const clearFilters = () => {
    setFilters({ type: '', category: '', fromDate: '', toDate: '' });
    setFiltered(transactions);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    setDeletingId(id);
    try {
      await transactionAPI.delete(id);
      await fetchData();
    } catch {}
    setDeletingId(null);
  };

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const renderCard = (label, value, icon, bg, text) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mr-4`}>{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${text}`}>{formatCurrency(value)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Filter Transactions</h1>
          <p className="text-gray-600 mt-2">Filter and analyze your transactions</p>
        </div>

        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select 
              label="Type" 
              name="type" 
              value={filters.type} 
              onChange={e => updateFilter('type', e.target.value)} 
              options={[{ value: '', label: 'All Types' }, ...transactionTypes]} 
            />
            <Select 
              label="Category" 
              name="category" 
              value={filters.category} 
              onChange={e => updateFilter('category', e.target.value)} 
              options={[{ value: '', label: 'All Categories' }, ...allCategories]} 
            />
            <Input 
              label="From Date" 
              type="date" 
              name="fromDate" 
              value={filters.fromDate} 
              onChange={e => updateFilter('fromDate', e.target.value)} 
            />
            <Input 
              label="To Date" 
              type="date" 
              name="toDate" 
              value={filters.toDate} 
              onChange={e => updateFilter('toDate', e.target.value)} 
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={applyFilters} disabled={!hasFilters}>Apply Filters</Button>
            {hasFilters && <Button onClick={clearFilters} variant="outline">Clear Filters</Button>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {renderCard('Total Income', totalIncome,
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>,
            'bg-green-100', 'text-income')}
          {renderCard('Total Expenses', totalExpense,
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>,
            'bg-red-100', 'text-expense')}
          {renderCard('Balance', balance,
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
            'bg-primary', balance >= 0 ? 'text-income' : 'text-expense')}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CategoryChart transactions={filtered} />
          <DateChart transactions={filtered} />
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filtered Results ({filtered.length} transactions)</h3>
            {hasFilters && <span className="text-sm text-gray-500">Showing filtered results</span>}
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading transactions...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-4">No transactions found</div>
              <div className="text-sm text-gray-400">{hasFilters ? 'Try adjusting your filters' : 'Add your first transaction to get started'}</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Date', 'Type', 'Amount', 'Category', 'Description', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.slice(0, 10).map(t => (
                      <tr key={t._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t.type}</span></td>
                        <td className="px-6 py-4 font-medium"><span className={t.type === 'income' ? 'text-income' : 'text-expense'}>{formatCurrency(t.amount)}</span></td>
                        <td className="px-6 py-4"><span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{t.category}</span></td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{t.description || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/edit-transaction/${t._id}`)}>Edit</Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(t._id)} disabled={deletingId === t._id}>{deletingId === t._id ? 'Deleting...' : 'Delete'}</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length > 10 && (
                <div className="px-6 py-3 text-sm text-gray-500 text-center">
                  Showing first 10 of {filtered.length} transactions
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterTransactions;
