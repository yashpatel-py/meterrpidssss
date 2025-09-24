import React, { useEffect, useState } from 'react';
import { Activity, FileText, Layers, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchJSON } from '../utils/api';

function StatCard({ icon: Icon, label, value, accentClass }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
      <div className={`inline-flex items-center justify-center rounded-xl p-3 ${accentClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ posts: 0, categories: 0, tags: 0 });
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    async function load() {
      const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';
      const [postsRes, categoriesRes, tagsRes] = await Promise.all([
        fetchJSON(`${base}/api/posts?status=all&limit=5&page=1`, token),
        fetchJSON(`${base}/api/categories`, token),
        fetchJSON(`${base}/api/tags`, token),
      ]);

      setStats({
        posts: postsRes.data.length,
        categories: categoriesRes.data.length,
        tags: tagsRes.data.length,
      });
      setRecentPosts(postsRes.data.slice(0, 5));
    }

    load().catch((error) => console.error('Failed to load dashboard data', error));
  }, [token]);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Mission brief</p>
        <h1 className="mt-1 text-3xl font-semibold text-white">Control Center Overview</h1>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={FileText}
          label="Published posts"
          value={stats.posts}
          accentClass="bg-fuchsia-500/20 text-fuchsia-300"
        />
        <StatCard
          icon={Layers}
          label="Categories tracked"
          value={stats.categories}
          accentClass="bg-cyan-500/20 text-cyan-300"
        />
        <StatCard
          icon={Tag}
          label="Active tags"
          value={stats.tags}
          accentClass="bg-emerald-500/20 text-emerald-300"
        />
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/40">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <Activity className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-semibold text-white">Recent posts</h2>
        </div>
        <div className="space-y-3">
          {recentPosts.length === 0 ? (
            <p className="text-slate-400">No posts yet. Ready for liftoff?</p>
          ) : (
            recentPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 transition hover:border-cyan-500/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                    <p className="text-sm text-slate-400">Slug: {post.slug}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      post.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
