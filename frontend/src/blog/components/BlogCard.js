import React from 'react';
import { Link } from 'react-router-dom';

function BlogCard({ post }) {
  const hero = post.hero_image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';
  const publishedDate = post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Unpublished';

  return (
    <article className="group h-full rounded-3xl border border-slate-200 bg-white/70 shadow-lg transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <div className="overflow-hidden rounded-t-3xl">
        <img
          src={hero}
          alt={post.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-4 px-6 py-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-primary">
          {post.category?.name ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{post.category.name}</span>
          ) : null}
          <span className="text-slate-500">{publishedDate}</span>
        </div>
        <Link to={`/blog/${post.slug}`} className="block text-2xl font-semibold text-slate-900 hover:text-primary">
          {post.title}
        </Link>
        {post.excerpt ? <p className="text-slate-600">{post.excerpt}</p> : null}
        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-400">
          {post.tags?.slice(0, 3).map((tag) => (
            <span key={tag.id} className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">
              #{tag.slug}
            </span>
          ))}
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
        >
          Read more <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

export default BlogCard;
