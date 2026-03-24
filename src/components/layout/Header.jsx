import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Search, Bell, ChevronDown, Mail, Zap, Wifi, WifiOff, LogOut, User, Settings } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [brevoConnected] = useState(true);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 shrink-0 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search emails, contacts..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Connection badge */}
        <div className="flex items-center gap-2">
          <Badge variant={brevoConnected ? 'connected' : 'disconnected'}>
            {brevoConnected ? <><Wifi size={10} /> Brevo</> : <><WifiOff size={10} /> Brevo</>}
          </Badge>
          <Badge variant="smtp">SMTP</Badge>
        </div>

        {/* New Email button */}
        <Button icon={Mail} size="sm" onClick={() => navigate('/compose')}>
          New Email
        </Button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-700">{initials}</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-gray-900 leading-none">{user?.name}</p>
              <p className="text-xs text-gray-400 leading-none mt-0.5">{user?.role}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl border border-gray-100 shadow-xl z-20 py-1.5 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={15} className="text-gray-400" /> View Profile
                  </button>
                  <button onClick={() => { navigate('/settings/brevo'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings size={15} className="text-gray-400" /> Settings
                  </button>
                </div>
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
