import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/config';
import TopBar from '../../components/TopBar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${slug}`);
        if (!response.ok) {
          throw new Error('Unable to load article');
        }
        const data = await response.json();
        setPost(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar />
        <Header />
        <main className="container mx-auto px-6 py-32">
          <div className="h-96 animate-pulse rounded-3xl bg-white" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar />
        <Header />
        <main className="container mx-auto px-6 py-32 text-center text-red-500">
          {error || 'Article not found.'}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <TopBar />
      <Header />
      <main className="pb-20">
        <div className="container mx-auto px-6 pt-28 sm:pt-32">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            ← Back to all posts
          </Link>

          <article className="mt-6 space-y-10">
            <header className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">
                {post.category?.name || 'Meteorroids'}
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span>By {post.author?.name || 'Meteorroids Crew'}</span>
                {post.published_at ? <span>{new Date(post.published_at).toLocaleString()}</span> : null}
              </div>
            </header>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
              <img
                src={post.hero_image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80'}
                alt={post.title}
                className="h-96 w-full object-cover"
                loading="lazy"
              />
            </div>

            <section className="prose prose-lg prose-slate mx-auto max-w-3xl">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </section>

            {post.tags?.length ? (
              <div className="mx-auto max-w-3xl border-t border-slate-200 pt-6 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">Tags:</span>{' '}
                {post.tags.map((tag) => `#${tag.slug}`).join(' ')}
              </div>
            ) : null}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BlogDetailPage;
