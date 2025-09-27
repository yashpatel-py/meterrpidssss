import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1600&q=80';

function BlogHero({ post }) {
  const heroImage = post?.hero_image || FALLBACK_IMAGE;
  const categoryLabel = post?.category?.name || 'Time Study Playbook';

  return (
    <section className="relative overflow-hidden rounded-[48px] border border-slate-800/20 bg-slate-950 px-6 py-16 text-white shadow-[0_40px_120px_rgba(15,23,42,0.35)] sm:px-12 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.45),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.35),_transparent_55%)]" />
      <div className="absolute -right-32 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-sky-400/20 blur-3xl lg:block" />
      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <nav className="flex items-center gap-2 text-sm text-slate-300/80">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-white">Insights</span>
          </nav>

          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-[0.25em] uppercase text-white/80">
            {categoryLabel}
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {post?.title || 'Precision time-study insights for high-trust billing teams'}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-200">
              {post?.excerpt ||
                'Learn how Meteorroids measures, optimises, and operationalises every clinical minute so your revenue cycle stays predictable and your teams stay energised.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {post ? (
              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-emerald-200"
              >
                Dive into feature
                <ArrowRight size={18} />
              </Link>
            ) : null}
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white/80 transition hover:border-white hover:text-white"
            >
              Speak with us
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <div className="absolute -inset-6 rounded-[42px] bg-gradient-to-br from-emerald-400/40 via-sky-400/20 to-indigo-500/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-[36px] border border-white/20 bg-white/10 shadow-[0_30px_120px_rgba(14,165,233,0.25)]">
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
            className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition hover:border-white/30"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-white/70">{stat.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BlogHero;
