import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  Menu,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  FilePlus2,
  NotebookPen,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { label: 'Posts', icon: NotebookPen, to: '/admin/posts' },
  { label: 'Create Post', icon: FilePlus2, to: '/admin/posts/new' },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-800">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white/95 shadow-lg shadow-primary/10 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white font-black text-xl">
              M
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                Meteoroid Services
              </p>
              <h1 className="text-lg font-semibold text-slate-900">Admin Console</h1>
            </div>
          </Link>
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700 lg:hidden"
            onClick={closeSidebar}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm shadow-primary/10'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
              onClick={closeSidebar}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-6 py-6 border-t border-slate-200 text-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
              <p className="text-xs uppercase tracking-wide text-primary/80">{user?.role}</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              type="button"
              className="text-slate-600 hover:text-primary lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-auto flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Mission Control
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 sm:p-6">
              <Outlet />
            </div>
            <footer className="pb-8 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} Meteoroid Services. Crafted with precision.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
