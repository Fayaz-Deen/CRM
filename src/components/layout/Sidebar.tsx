import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Share2,
  FileText,
  CheckSquare,
  Video,
  Tag,
  FolderOpen,
  Moon,
  Sun,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../ui/Avatar';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/calendar', icon: Video, label: 'Calendar' },
  { to: '/meetings', icon: Calendar, label: 'Meetings' },
  { to: '/reminders', icon: Bell, label: 'Reminders' },
  { to: '/tags', icon: Tag, label: 'Tags' },
  { to: '/groups', icon: FolderOpen, label: 'Groups' },
  { to: '/shared', icon: Share2, label: 'Shared' },
  { to: '/templates', icon: FileText, label: 'Templates' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header - pointer-events-auto ensures clicks work */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] lg:hidden pointer-events-auto">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--accent))] active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2">
          <img src="/symbol.png" alt="Nu-Connect" className="h-7 w-7 rounded-lg object-contain" />
          <span className="text-sm font-bold">Nu-Connect</span>
        </div>

        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--accent))] active:scale-95"
        >
          {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      {/* Mobile Menu - Only renders when open */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-14 left-0 right-0 bottom-0 bg-[hsl(var(--background))] overflow-hidden transition-transform duration-200 ${
            isOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div
            className="h-full overflow-y-auto"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* User info at top */}
            <div className="p-4 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))]">
              <div className="flex items-center gap-3">
                <Avatar src={user?.profilePicture} name={user?.name || 'User'} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{user?.name || 'User'}</p>
                  <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">
                    {user?.email || 'No email'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Grid */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all ${
                        isActive
                          ? 'bg-[hsl(var(--primary))] text-white'
                          : 'bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] active:scale-95'
                      }`
                    }
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="p-4 space-y-3">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 p-4 rounded-xl bg-[hsl(var(--card))] text-[hsl(var(--foreground))] active:scale-[0.98]"
              >
                {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="text-sm font-medium">
                  {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 p-4 rounded-xl bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))] active:scale-[0.98]"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-72 flex-col bg-[hsl(var(--card))] shadow-strong">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-[hsl(var(--border))] px-6">
          <img src="/symbol.png" alt="Nu-Connect" className="h-11 w-11 rounded-xl object-contain" />
          <div>
            <span className="text-lg font-bold">Nu-Connect</span>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Manage your network</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]'
                  }`
                }
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Theme toggle */}
        <div className="border-t border-[hsl(var(--border))] p-4">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-all hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
          >
            <div className="relative h-5 w-5">
              <Sun className={`absolute inset-0 h-5 w-5 transition-all ${resolvedTheme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
              <Moon className={`absolute inset-0 h-5 w-5 transition-all ${resolvedTheme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
            </div>
            <span>{resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>

        {/* User section */}
        <div className="border-t border-[hsl(var(--border))] p-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-[hsl(var(--accent))] p-3">
            <Avatar src={user?.profilePicture} name={user?.name || 'User'} size="md" />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">
                {user?.email || 'No email'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/10 transition-all hover:bg-[hsl(var(--destructive))]/20 active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
