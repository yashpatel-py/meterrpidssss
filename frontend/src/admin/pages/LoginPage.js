import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      const redirectTo = location.state?.from || '/admin/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-fuchsia-500/10 backdrop-blur">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-slate-950 font-black text-xl">
            M
          </div>
          <h1 className="text-2xl font-semibold text-white">Meteorroids Admin</h1>
          <p className="text-sm text-slate-400 mt-1">Secure access to mission control</p>
        </div>

        {error ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <ShieldAlert className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              placeholder="admin@meteorroids.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-emerald-400 px-6 py-3 font-semibold text-slate-950 transition-transform duration-150 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in…
              </>
            ) : (
              'Enter mission control'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          Protected resources. Unauthorized access is monitored.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
