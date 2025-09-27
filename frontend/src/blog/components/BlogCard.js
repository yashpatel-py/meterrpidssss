import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80';

function getReadingMinutes(html) {
  if (!html) return 2;
  const text = html.replace(/<[^>]+>/g, ' ');
  const wordCount = text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}

function BlogCard({ post }) {
  const hero = post.hero_image || FALLBACK_IMAGE;
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft';

  const readingMinutes = useMemo(() => getReadingMinutes(post.content), [post.content]);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-white/5 text-white shadow-[0_30px_80px_rgba(8,47,73,0.35)] transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/10"
    >
      <span className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-white/5 to-sky-400/0 opacity-0 transition group-hover:opacity-100" />
      <div className="relative h-60 overflow-hidden">
        <img
          src={hero}
          alt={post.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-6 bottom-6 flex items-center gap-2">
          {post.category?.name ? (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              {post.category.name}
            </span>
          ) : null}
          <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white/70 backdrop-blur">
            {publishedDate}
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-5 p-8">
        <h3 className="text-2xl font-semibold leading-tight tracking-tight">{post.title}</h3>
        {post.excerpt ? <p className="text-sm leading-relaxed text-white/70">{post.excerpt}</p> : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.25em] text-white/50">
          <span>{readingMinutes} min read</span>
          {post.tags?.length ? (
            <span className="flex flex-wrap gap-2 text-[0.65rem] normal-case tracking-tight text-emerald-200/80">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag.id}>#{tag.slug}</span>
              ))}
            </span>
          ) : null}
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200">
          Read the study <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
