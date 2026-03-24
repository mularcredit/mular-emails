import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import {
  Mail, Send, FileText, Users, Settings, BarChart3, ClipboardList,
  Zap, UserCircle, ChevronLeft, ChevronRight, LogOut, FileEdit
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/compose', icon: Mail, label: 'Compose' },
  { to: '/drafts', icon: FileEdit, label: 'Drafts' },
  { to: '/logs', icon: Send, label: 'Sent Emails' },
  { to: '/templates', icon: FileText, label: 'Templates' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const settingsItems = [
  { to: '/settings/brevo', icon: Zap, label: 'Sender Profiles' },
];

const bottomItems = [
  { to: '/profile', icon: UserCircle, label: 'Profile' },
];

function NavItem({ to, icon: Icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
          isActive
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        )
      }
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon size={18} className={clsx('shrink-0', isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-700')} />
          {!collapsed && <span>{label}</span>}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={clsx(
        'flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-300 shadow-sm',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={clsx('flex items-center gap-2.5 px-4 py-5 border-b border-gray-100', collapsed && 'justify-center px-2')}>
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          <img src="/mular-logo.png" alt="Mular Logo" className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-bold text-gray-900 text-sm">Mular</span>
            <span className="text-xs text-gray-400 block leading-none">Email Platform</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}

        <div className="pt-4 pb-1">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Settings</p>
          )}
          {collapsed && <div className="border-t border-gray-100 mx-2 mb-2" />}
        </div>
        {settingsItems.map((item) => (
          <NavItem key={item.to + item.label} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
        {bottomItems.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
        <button
          onClick={handleLogout}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all',
            collapsed && 'justify-center'
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs">Collapse</span></>}
        </button>
      </div>
    </div>
  );
}
