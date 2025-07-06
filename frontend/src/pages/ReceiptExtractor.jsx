import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionAPI } from '../utils/api';
import Button from '../components/common/Button';
import TransactionForm from '../components/common/TransactionForm';
import { useNotification } from '../context/NotificationContext';

const ReceiptExtractor = () => {
  const navigate = useNavigate();
  const { showError, showSuccess, showInfo, showWarning } = useNotification();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      showError('Please select a valid image (JPEG, PNG) or PDF file');
      return;
    }

    setFile(selectedFile);
    setExtractedData(null);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const extractReceipt = async () => {
    if (!file) return;

    setExtracting(true);
    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await fetch('/api/extract-receipt', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.status === 503 && data.demo) {
        setExtractedData(data.demo);
        showWarning('Demo mode: Using sample data. Add your Gemini API key to enable real receipt extraction.');
      } else if (!response.ok) {
        throw new Error('Failed to extract receipt');
      } else {
        setExtractedData(data);
        if (data.transactionId) {
          showSuccess(`Receipt extracted and transaction saved successfully! Transaction ID: ${data.transactionId}`);
        } else if (data.message) {
          showInfo(data.message);
        }
      }
    } catch (error) {
      console.error('Extraction failed:', error);
      showError('Failed to extract receipt. Please try again or enter details manually.');
    } finally {
      setExtracting(false);
    }
  };

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

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setExtractedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Receipt Extractor</h1>
          <p className="text-gray-600 mt-2">Upload a receipt image or PDF to automatically extract transaction details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Upload Receipt</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-gray-600">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                      >
                        Choose File
                      </Button>
                      <p className="mt-2 text-sm">or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                </div>

                {file && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Selected file: {file.name}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={extractReceipt}
                        disabled={extracting}
                        variant="primary"
                      >
                        {extracting ? 'Extracting...' : 'Extract Details'}
                      </Button>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {preview && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Receipt Preview</h3>
                <div className="max-h-64 overflow-auto">
                  <img
                    src={preview}
                    alt="Receipt preview"
                    className="w-full h-auto rounded border"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {extractedData && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Extracted Data</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Amount:</span>
                      <p className="text-lg font-bold text-red-600">₹{extractedData.amount || 'Not found'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Date:</span>
                      <p>{extractedData.date || 'Not found'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Merchant:</span>
                      <p>{extractedData.merchant || 'Not found'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Category:</span>
                      <p>{extractedData.category || 'Not found'}</p>
                    </div>
                  </div>
                  {extractedData.items && (
                    <div>
                      <span className="font-medium text-gray-600">Items:</span>
                      <ul className="mt-1 text-sm text-gray-600">
                        {extractedData.items.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
              {extractedData?.transactionId ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-800 font-medium">Transaction Saved Successfully!</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">Transaction ID: {extractedData.transactionId}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Type:</span>
                        <p className="text-red-600 font-medium">Expense</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Amount:</span>
                        <p className="text-lg font-bold text-red-600">₹{extractedData.amount || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Category:</span>
                        <p className="capitalize">{extractedData.category || 'other'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Date:</span>
                        <p>{extractedData.date || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">Description:</span>
                        <p>{extractedData.merchant || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate('/dashboard')}
                      variant="primary"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={() => navigate('/filter-transactions')}
                      variant="outline"
                    >
                      View All Transactions
                    </Button>
                  </div>
                </div>
              ) : (
                <TransactionForm
                  initialData={extractedData ? {
                    type: 'expense',
                    amount: extractedData.amount?.toString() || '',
                    category: extractedData.category || '',
                    date: extractedData.date || new Date().toISOString().split('T')[0],
                    description: extractedData.merchant || '',
                    paymentMethod: 'other'
                  } : null}
                  onSubmit={handleSubmit}
                  onCancel={() => navigate('/dashboard')}
                  submitLabel="Add Transaction"
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptExtractor; 