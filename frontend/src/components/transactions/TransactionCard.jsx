import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../../utils/api';
import { formatCurrency, formatDate, getCategoryColor, getPaymentMethodColor } from '../../utils/format';
import Button from '../common/Button';
import { useState } from 'react';
import ConfirmDialog from '../common/ConfirmDialog';

const TransactionCard = ({ transaction, onDelete }) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

  const handleDelete = () => {
    setConfirmDelete({ isOpen: true, id: transaction._id });
  };

  const confirmDeleteTransaction = async () => {
    setDeletingId(transaction._id);
    try {
      await transactionAPI.delete(transaction._id);
      onDelete?.();
    } catch (error) {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                transaction.type === 'income' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(transaction.category)}`}>
                {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 text-sm truncate">{transaction.description || 'No description'}</p>
            <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.date)}</p>
          </div>
          <p className={`text-lg sm:text-xl font-bold whitespace-nowrap ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
            {formatCurrency(transaction.amount)}
          </p>
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/edit-transaction/${transaction._id}`)}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={handleDelete}
            disabled={deletingId === transaction._id}
            className="flex-1"
          >
            {deletingId === transaction._id ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={confirmDeleteTransaction}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default TransactionCard;
