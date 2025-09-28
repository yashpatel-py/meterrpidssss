import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarDays, Clock, Tag as TagIcon, User } from 'lucide-react';
import { API_BASE_URL } from '../utils/config';
import TopBar from '../../components/TopBar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ShareButtons from '../components/ShareButtons';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80';

function getReadingMinutes(html) {
  if (!html) return 2;
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

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

  const readingMinutes = useMemo(() => getReadingMinutes(post?.content), [post?.content]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
        <TopBar />
        <Header />
        <main className="container mx-auto px-6 py-32">
          <div className="h-[420px] animate-pulse rounded-[48px] border border-slate-200 bg-slate-100" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
        <TopBar />
        <Header />
        <main className="container mx-auto px-6 py-32 text-center text-red-600">
          {error || 'Article not found.'}
        </main>
        <Footer />
      </div>
    );
  }

  const heroImage = post.hero_image || FALLBACK_IMAGE;
  const publishedAt = post.published_at
    ? new Date(post.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Unpublished';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white text-slate-900">
      <TopBar />
      <Header />
      <main className="pb-32">
        <div className="container mx-auto px-6 pt-28 sm:pt-32">
          <section className="relative overflow-hidden rounded-[48px] border border-slate-200 bg-white px-6 py-16 text-slate-900 shadow-[0_45px_120px_rgba(15,23,42,0.08)] sm:px-12 lg:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_55%)]" />
            <div className="absolute -left-32 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-emerald-100/40 blur-3xl lg:block" />
            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  ← Back to insights
                </Link>
                <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
                  {post.category?.name || 'Time Study' }
                </div>
                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">{post.title}</h1>
                {post.excerpt ? <p className="max-w-2xl text-lg leading-relaxed text-slate-600">{post.excerpt}</p> : null}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <User size={16} className="text-emerald-600" />
                    {post.author?.name || 'Meteorroids Crew'}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={16} className="text-emerald-600" />
                    {publishedAt}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={16} className="text-emerald-600" />
                    {readingMinutes} min read
                  </span>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
                <div className="absolute -inset-6 rounded-[42px] bg-gradient-to-br from-emerald-200/60 via-sky-200/40 to-indigo-200/40 blur-2xl" />
                <div className="relative overflow-hidden rounded-[36px] border border-slate-100 bg-slate-50 shadow-[0_30px_120px_rgba(14,165,233,0.15)]">
                  <img src={heroImage} alt={post.title} className="aspect-[4/5] w-full object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </section>

          <section className="relative -mt-24 lg:-mt-32">
            <div className="mx-auto max-w-5xl rounded-[40px] border border-slate-200 bg-white p-8 text-slate-900 shadow-[0_40px_140px_rgba(15,23,42,0.08)] sm:p-10 lg:p-14">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Published</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{publishedAt}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Author</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{post.author?.name || 'Meteorroids Crew'}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Cadence</p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{readingMinutes} minute read</p>
                </div>
              </div>

              <div className="mt-10 space-y-10">
                <article className="prose prose-lg prose-slate mx-auto max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                <div className="flex flex-wrap items-center justify-between gap-6">
                  {post.tags?.length ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
                        <TagIcon size={16} /> Tags
                      </span>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                        {post.tags.map((tag) => (
                          <span key={tag.id} className="rounded-full border border-slate-200 px-3 py-1">#{tag.slug}</span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <ShareButtons title={post.title} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BlogDetailPage;
