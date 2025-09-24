import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import BlogHero from '../components/BlogHero';
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
    <div className="bg-slate-50 min-h-screen">
      <TopBar />
      <Header />
      <main className="pb-16">
        <div className="container mx-auto px-6 pb-12 pt-28 sm:pt-32">
          <BlogHero />

          <div className="mt-12">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-96 animate-pulse rounded-3xl border border-slate-200 bg-white shadow-inner"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center text-red-500">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500">
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
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BlogListPage;
