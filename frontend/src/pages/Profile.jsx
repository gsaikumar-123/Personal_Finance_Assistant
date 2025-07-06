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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="card">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-white">
                {user.firstName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">{user.emailId}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <p className="text-gray-900">{user.firstName}</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <p className="text-gray-900">{user.lastName}</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <p className="text-gray-900">{user.emailId}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
            >
              Back to Dashboard
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="danger"
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