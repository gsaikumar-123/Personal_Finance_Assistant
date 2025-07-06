import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Personal Finance Assistant
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          This helps you manage income and expenses, categorize transactions, 
          and gain insights into their financial activities. It also supports receipt 
          uploads and automatic data extraction using AI.
        </p>

        {user ? (
          <div className="space-y-4">
            <p className="text-gray-700">
              Welcome back, {user.firstName}!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="lg">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">
              Get started by creating an account or signing in to your existing account.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg">
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Expenses</h3>
            <p className="text-sm text-gray-600">Monitor your spending habits and identify areas for improvement</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-income rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <text x="4" y="18" fontSize="16" fontWeight="bold" fill="currentColor">₹</text>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manage Income</h3>
            <p className="text-sm text-gray-600">Keep track of all your income sources and earnings</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Visualize Data</h3>
            <p className="text-sm text-gray-600">Get insights with beautiful charts and analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;