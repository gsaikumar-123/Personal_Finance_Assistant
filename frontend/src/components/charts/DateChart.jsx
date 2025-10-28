import { useEffect, useRef } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DateChart = ({ transactions }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  }, [transactions]);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Income vs Expenses (Last 30 Days)</h3>
        <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
          No transaction data available
        </div>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const last30Days = sortedTransactions.filter(t => {
    const transactionDate = new Date(t.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return transactionDate >= thirtyDaysAgo;
  });

  const dailyExpenses = last30Days
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + transaction.amount;
      return acc;
    }, {});

  const dailyIncome = last30Days
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + transaction.amount;
      return acc;
    }, {});

  const allDates = [...new Set([...Object.keys(dailyExpenses), ...Object.keys(dailyIncome)])].sort();

  const data = {
    labels: allDates,
    datasets: [
      {
        label: 'Expenses',
        data: allDates.map(date => dailyExpenses[date] || 0),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Income',
        data: allDates.map(date => dailyIncome[date] || 0),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          padding: window.innerWidth < 640 ? 10 : 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₹${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(2);
          },
          font: {
            size: window.innerWidth < 640 ? 9 : 10,
          },
        },
      },
      x: {
        ticks: {
          maxTicksLimit: window.innerWidth < 640 ? 6 : 10,
          font: {
            size: window.innerWidth < 640 ? 9 : 10,
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
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Income vs Expenses (Last 30 Days)</h3>
      <div className="h-56 sm:h-64 md:h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default DateChart;