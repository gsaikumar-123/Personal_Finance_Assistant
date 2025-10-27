import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-500 text-sm sm:text-base">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                {user.firstName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">{user.emailId}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                First Name
              </label>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{user.firstName}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Last Name
              </label>
              <p className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{user.lastName}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Email
              </label>
              <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">{user.emailId}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Back to Dashboard
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="danger"
              className="w-full sm:w-auto"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;