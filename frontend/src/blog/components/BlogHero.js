import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1600&q=80';

function BlogHero({ post }) {
  const heroImage = post?.hero_image || FALLBACK_IMAGE;
  const categoryLabel = post?.category?.name || 'Time Study Playbook';

  return (
    <section className="relative overflow-hidden rounded-[48px] border border-primary/10 bg-white px-6 py-16 text-slate-900 shadow-[0_40px_120px_rgba(49,41,124,0.1)] sm:px-12 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(183,166,214,0.45),_transparent_60%),radial-gradient(circle_at_bottom_right,_rgba(49,41,124,0.35),_transparent_55%)]" />
      <div className="absolute -right-32 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-accent/50 blur-3xl lg:block" />
      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <nav className="flex items-center gap-2 text-sm text-primary/70">
            <Link to="/" className="transition hover:text-primary-dark">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-primary-dark">Insights</span>
          </nav>

          <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium tracking-[0.25em] uppercase text-primary">
            {categoryLabel}
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-primary-dark sm:text-5xl lg:text-6xl">
              {post?.title || 'Precision time-study insights for high-trust billing teams'}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              {post?.excerpt ||
                'Learn how Meteorroids measures, optimises, and operationalises every clinical minute so your revenue cycle stays predictable and your teams stay energised.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {post ? (
              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-primary-dark"
              >
                Dive into feature
                <ArrowRight size={18} />
              </Link>
            ) : null}
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-6 py-3 text-base font-semibold text-primary transition hover:border-primary hover:text-primary-dark"
            >
              Speak with us
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <div className="absolute -inset-6 rounded-[42px] bg-gradient-to-br from-primary/30 via-accent/40 to-white/40 blur-2xl" />
          <div className="relative overflow-hidden rounded-[36px] border border-primary/20 bg-white shadow-[0_30px_120px_rgba(49,41,124,0.18)]">
            <img src={heroImage} alt={post?.title || 'Featured insight'} className="aspect-[4/5] w-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Average time saved', value: '18%', caption: 'per patient visit after workflow redesigns' },
          { label: 'Clinical interviews', value: '240+', caption: 'hours of field research to fuel each article' },
          { label: 'Playbook updates', value: 'Weekly', caption: 'fresh tactics from billing transformations' },
          { label: 'Reader satisfaction', value: '4.9/5', caption: 'teams applying Meteorroids guidance' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-primary/10 bg-white/80 p-5 backdrop-blur-sm transition hover:border-primary/40"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-primary-dark">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-600">{stat.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BlogHero;
