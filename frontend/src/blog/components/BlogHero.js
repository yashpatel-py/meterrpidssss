import React from 'react';

function BlogHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-primary/10 via-white to-accent/10 px-6 py-16 shadow-xl sm:px-12">
      <div className="relative z-10 mx-auto max-w-3xl text-center space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Meteorroids Insights</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Explore stories that keep your billing universe aligned
        </h1>
        <p className="text-lg text-slate-600">
          Practical guidance, engineering notes, and growth tactics from the Meteorroids crew. Always focused on
          resilient billing experiences and operational clarity.
        </p>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_60%)]" />
    </section>
  );
}

export default BlogHero;
