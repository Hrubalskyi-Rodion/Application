import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          EventHub
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-indigo-600">
            Events
          </Link>
          {token ? (
            <>
              <Link to="/my-events" className="text-gray-600 hover:text-indigo-600">
                My Events
              </Link>
              <Link
                to="/create"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                + Create Event
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-red-500">
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
