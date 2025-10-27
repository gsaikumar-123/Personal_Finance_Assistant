import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../utils/api';
import TransactionForm from '../components/common/TransactionForm';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (transactionData, setErrors) => {
    setLoading(true);
    try {
      await transactionAPI.add(transactionData);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Transaction save failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Transaction</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Add a new transaction to your financial records</p>
        </div>
        
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/filter-transactions')}
          submitLabel="Add Transaction"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AddTransaction;
