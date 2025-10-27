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
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Receipt Extractor</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Upload a receipt image or PDF to automatically extract transaction details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Upload Receipt</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-primary transition">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-gray-600">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Choose File
                      </Button>
                      <p className="mt-2 text-sm">or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                </div>

                {file && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Selected: <span className="font-medium">{file.name}</span></p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={extractReceipt}
                        disabled={extracting}
                        className="flex-1 sm:flex-auto"
                      >
                        {extracting ? 'Extracting...' : 'Extract Details'}
                      </Button>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="flex-1 sm:flex-auto"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {preview && (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Receipt Preview</h3>
                <div className="max-h-80 sm:max-h-96 overflow-auto rounded-lg border border-gray-200">
                  <img
                    src={preview}
                    alt="Receipt preview"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {extractedData && (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Extracted Data</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Amount</span>
                      <p className="text-lg sm:text-xl font-bold text-red-600 mt-1">₹{extractedData.amount || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Date</span>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">{extractedData.date || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 col-span-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Merchant</span>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1 truncate">{extractedData.merchant || '-'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 col-span-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Category</span>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">{extractedData.category || '-'}</p>
                    </div>
                  </div>
                  {extractedData.items && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Items</span>
                      <ul className="mt-2 text-xs sm:text-sm text-gray-700 space-y-1">
                        {extractedData.items.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Transaction Details</h3>
              {extractedData?.transactionId ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm sm:text-base font-semibold text-green-800">Successfully Saved!</p>
                        <p className="text-xs sm:text-sm text-green-700 mt-1">ID: {extractedData.transactionId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div className="bg-gray-50 rounded p-3">
                      <span className="text-xs font-medium text-gray-600">Type</span>
                      <p className="font-semibold text-red-600 mt-1">Expense</p>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <span className="text-xs font-medium text-gray-600">Amount</span>
                      <p className="font-bold text-red-600 mt-1">₹{extractedData.amount}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <span className="text-xs font-medium text-gray-600">Category</span>
                      <p className="font-semibold text-gray-900 mt-1 capitalize">{extractedData.category}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <span className="text-xs font-medium text-gray-600">Date</span>
                      <p className="font-semibold text-gray-900 mt-1">{extractedData.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => navigate('/dashboard')}
                      className="flex-1 sm:flex-auto"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={() => navigate('/filter-transactions')}
                      variant="outline"
                      className="flex-1 sm:flex-auto"
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