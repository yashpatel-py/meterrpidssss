import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, ShieldCheck, LogOut, LayoutDashboard, FilePlus2, NotebookPen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { label: 'Posts', icon: NotebookPen, to: '/admin/posts' },
  { label: 'Create Post', icon: FilePlus2, to: '/admin/posts/new' },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-slate-900/80 backdrop-blur border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-slate-950 font-black text-xl">
              M
            </span>
            <div>
              <p className="font-semibold tracking-wide uppercase text-xs text-slate-400">Meteorroids</p>
              <h1 className="font-semibold text-lg">Admin Console</h1>
            </div>
          </Link>
          <button
            type="button"
            className="lg:hidden text-slate-400 hover:text-slate-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>
        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 text-white'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-6 py-5 border-t border-slate-800 text-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-10 w-10 text-cyan-400" />
            <div>
              <p className="font-semibold">{user?.email}</p>
              <p className="text-slate-400 text-xs uppercase tracking-wide">{user?.role}</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-72">
        <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            className="lg:hidden text-slate-300 hover:text-white"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-3 text-sm text-slate-400">
            <span className="hidden sm:inline">Secure session active</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </header>
        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
