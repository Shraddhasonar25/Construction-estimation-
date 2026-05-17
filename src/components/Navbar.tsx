import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HardHat, LogOut, User, LayoutDashboard, FilePlus, ClipboardList, Settings, Users } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-zinc-900 font-bold text-xl">
              <HardHat className="w-8 h-8 text-emerald-600" />
              <span>ConstruEst</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-6 mr-6">
                  {user.role === 'admin' ? (
                    <>
                      <Link to="/admin" className="text-zinc-600 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/admin/requests" className="text-zinc-600 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
                        <ClipboardList className="w-4 h-4" /> Requests
                      </Link>
                      <Link to="/admin/users" className="text-zinc-600 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
                        <Users className="w-4 h-4" /> Users
                      </Link>
                      <Link to="/admin/settings" className="text-zinc-600 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" className="text-zinc-600 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/create-request" className="text-zinc-600 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
                        <FilePlus className="w-4 h-4" /> New Request
                      </Link>
                      <Link to="/my-requests" className="text-zinc-600 hover:text-emerald-600 flex items-center gap-1 text-sm font-medium">
                        <ClipboardList className="w-4 h-4" /> My Requests
                      </Link>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3 pl-6 border-l border-zinc-200">
                  <Link to="/profile" className="flex items-center gap-2 text-zinc-700 hover:text-emerald-600">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-zinc-600 hover:text-zinc-900 text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
