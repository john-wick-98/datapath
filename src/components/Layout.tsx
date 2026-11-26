import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import MentorWidget from './MentorWidget';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/modules', label: 'Modules', icon: '📚' },
  { path: '/practice', label: 'Practice', icon: '🎯' },
  { path: '/mock-tests', label: 'Mock Tests', icon: '📝' },
  { path: '/progress', label: 'Progress', icon: '📈' },
  { path: '/placement', label: 'Placement Prep', icon: '💼' },
  { path: '/mentor', label: 'Mentor', icon: '🤖' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  return (
    <div className="min-h-screen flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🛤️</span>
            <span className="font-bold text-lg text-accent">DataPath</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-accent text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              <span>{item.icon}</span><span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link to="/" className="flex items-center gap-2"><span className="text-xl">🛤️</span><span className="font-bold text-accent">DataPath</span></Link>
          <div className="w-6" />
        </header>
        <main className="p-4 lg:p-8 max-w-5xl mx-auto">
          <Outlet />
        </main>
      </div>
      <MentorWidget />
    </div>
  );
}
