import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchJSON } from '../utils/api';

function PostListPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';
        const response = await fetchJSON(`${base}/api/posts?status=all&limit=50&page=1`, token);
        setPosts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) {
    return <div className="text-slate-500">Loading posts…</div>;
  }

  if (error) {
    return <div className="text-red-600">Failed to load posts: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-primary/70">Content index</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Posts inventory</h1>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-primary/30 hover:bg-primary-dark"
        >
          + New mission log
        </Link>
      </header>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wide text-xs">
            <tr>
              <th scope="col" className="px-6 py-4 text-left">Title</th>
              <th scope="col" className="px-6 py-4 text-left">Status</th>
              <th scope="col" className="px-6 py-4 text-left">Published</th>
              <th scope="col" className="px-6 py-4 text-left">Author</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{post.title}</div>
                  <div className="text-xs text-slate-500">{post.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      post.status === 'published'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {post.published_at ? new Date(post.published_at).toLocaleString() : '—'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{post.author?.name || '—'}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/admin/posts/${post.id}/edit`}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostListPage;
