import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../auth/AuthProvider";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();  // logoutを追加

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl text-red-600 font-bold">
                🐈 KINOKEN
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/' 
                    ? 'border-red-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                ホーム
              </Link>
              <Link
                to="/pomo"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/pomo'
                    ? 'border-red-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                タイマー
              </Link>
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  location.pathname === '/dashboard'
                    ? 'border-red-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                統計
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {currentUser && (
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                ログアウト
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;