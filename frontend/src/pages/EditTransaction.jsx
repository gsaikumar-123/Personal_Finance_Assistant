import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { transactionAPI } from '../utils/api';
import TransactionForm from '../components/common/TransactionForm';

const EditTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      setFetching(true);
      const response = await transactionAPI.getAll();
      const transactions = response.data?.data || response.data || [];
      const foundTransaction = transactions.find(t => t._id === id);
      
      if (!foundTransaction) {
        navigate('/dashboard');
        return;
      }

      setTransaction(foundTransaction);
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
      navigate('/dashboard');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (transactionData, setErrors) => {
    setLoading(true);
    try {
      await transactionAPI.update(id, transactionData);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Transaction update failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card">
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading transaction...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return null;
  }

  const initialData = {
    type: transaction.type,
    amount: transaction.amount.toString(),
    category: transaction.category,
    date: new Date(transaction.date).toISOString().split('T')[0],
    description: transaction.description || '',
    paymentMethod: transaction.paymentMethod,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Transaction</h1>
          <p className="text-gray-600 mt-2">Update your transaction details</p>
        </div>
        
        <TransactionForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard')}
          submitLabel="Update Transaction"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default EditTransaction;
