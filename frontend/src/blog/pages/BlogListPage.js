import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import { API_BASE_URL } from '../utils/config';
import TopBar from '../../components/TopBar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts?status=published&limit=12&page=1`);
        if (!response.ok) {
          throw new Error('Failed to load posts');
        }
        const data = await response.json();
        setPosts(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
      <TopBar />
      <Header />
      <main className="pb-20">
        <div className="container mx-auto px-6 pt-28 sm:pt-32">
          <section className="rounded-[32px] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
            <span className="inline-flex items-center justify-center rounded-full border border-accent/70 bg-accent/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Time study playbook
            </span>
            <div className="mt-6 space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Meteorroids insights to sharpen revenue performance
              </h1>
              <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600">
                Explore the latest playbooks, field observations, and practical guides our team uses to unlock predictable collections and happier care teams.
              </p>
            </div>
          </section>

          <section className="mt-20">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-primary">Latest dispatches</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Playbooks to recalibrate your revenue cycle</h2>
              </div>
            </div>

            <div className="mt-10">
              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-96 animate-pulse rounded-[32px] border border-slate-200 bg-slate-100"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-[32px] border border-red-200 bg-red-50 px-6 py-16 text-center text-red-600">
                  {error}
                </div>
              ) : posts.length === 0 ? (
                <div className="rounded-[32px] border border-slate-200 bg-slate-50 px-6 py-16 text-center text-slate-500">
                  No posts yet. Check back soon!
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BlogListPage;
