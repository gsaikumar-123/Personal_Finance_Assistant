import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ transactions }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Clean up previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  }, [transactions]);

  const expenseTransactions = transactions?.filter(t => t.type === 'expense') || [];
  
  if (expenseTransactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
        <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
          No expense data available
        </div>
      </div>
    );
  }

  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const categories = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const data = {
    labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
    datasets: [
      {
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: window.innerWidth < 640 ? 12 : 20,
          usePointStyle: true,
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ₹${context.parsed.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
      <div className="h-56 sm:h-64 md:h-80">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default CategoryChart;