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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white font-black text-xl">
            M
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Meteorroids Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Secure access to mission control</p>
        </div>

        {error ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <ShieldAlert className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none"
              placeholder="admin@meteorroids.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors duration-150 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
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
