import React, { useEffect, useState } from 'react';
import { Activity, FileText, Layers, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchJSON } from '../utils/api';

function StatCard({ icon: Icon, label, value, accentClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
      <div className={`inline-flex items-center justify-center rounded-xl p-3 ${accentClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
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
        <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Mission brief</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">Control Center Overview</h1>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={FileText}
          label="Published posts"
          value={stats.posts}
          accentClass="bg-primary"
        />
        <StatCard
          icon={Layers}
          label="Categories tracked"
          value={stats.categories}
          accentClass="bg-accent"
        />
        <StatCard
          icon={Tag}
          label="Active tags"
          value={stats.tags}
          accentClass="bg-emerald-500"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/70">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
          <Activity className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-semibold text-slate-900">Recent posts</h2>
        </div>
        <div className="space-y-3">
          {recentPosts.length === 0 ? (
            <p className="text-slate-500">No posts yet. Ready for liftoff?</p>
          ) : (
            recentPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                    <p className="text-sm text-slate-500">Slug: {post.slug}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      post.status === 'published'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
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
