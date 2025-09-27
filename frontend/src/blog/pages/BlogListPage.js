import React, { useEffect, useMemo, useState } from 'react';
import { Activity, FileText, Layers } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import BlogHero from '../components/BlogHero';
import { API_BASE_URL } from '../utils/config';
import TopBar from '../../components/TopBar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const pillars = [
  {
    title: 'Time-motion clarity',
    description:
      'Shadowing teams across intake, coding, and AR to surface the true micro-frictions that slow reimbursements.',
    icon: Activity,
  },
  {
    title: 'Operational choreography',
    description:
      'Turning observations into precise runbooks, cross-team rituals, and measurement cadences your staff can trust.',
    icon: Layers,
  },
  {
    title: 'Financial storytelling',
    description:
      'Linking every workflow decision back to revenue yield, patient satisfaction, and staff wellbeing metrics.',
    icon: FileText,
  },
];

const playbookTimeline = [
  {
    phase: '01 — Field immersion',
    headline: 'Ride-alongs across the revenue cycle',
    copy:
      'From front desk conversations to denial triage huddles, we capture where time is lost and morale dips begin.',
  },
  {
    phase: '02 — Signal modeling',
    headline: 'Quantify the high-leverage friction points',
    copy:
      'We benchmark cycle times, handoff accuracy, and staff load so every recommendation is backed by clear deltas.',
  },
  {
    phase: '03 — Ritual design',
    headline: 'Operational scripts that actually stick',
    copy:
      'Layered cadences and guardrails create predictable throughput without crushing clinical empathy.',
  },
  {
    phase: '04 — Continuous lift',
    headline: 'Pulse checks and iteration windows',
    copy:
      'Weekly retros, QA embeds, and telemetry ensure the improvements compound quarter after quarter.',
  },
];

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

  const { featuredPost, additionalPosts } = useMemo(() => {
    if (!posts.length) {
      return { featuredPost: null, additionalPosts: [] };
    }

    return { featuredPost: posts[0], additionalPosts: posts.slice(1) };
  }, [posts]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopBar />
      <Header />
      <main className="bg-gradient-to-b from-white via-slate-50 to-white pb-20">
        <div className="container mx-auto px-6 pt-28 sm:pt-32">
          <BlogHero post={featuredPost} />

          <section className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pillars.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-[28px] border border-primary/10 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-white to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex h-full flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-primary-dark">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{description}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-20 grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-[32px] border border-primary/10 bg-gradient-to-br from-primary/10 via-white to-accent/10 p-8 text-primary-dark shadow-[0_25px_80px_rgba(49,41,124,0.12)]">
              <p className="text-xs uppercase tracking-[0.4em] text-primary">Method in motion</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Inside every Meteorroids time-study
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-primary-dark/80">
                Each article distils hundreds of minutes spent shoulder-to-shoulder with revenue cycle teams. Use these notes to
                build believable roadmaps, coach your talent, and protect patient trust.
              </p>
            </div>

            <div className="relative rounded-[32px] border border-primary/10 bg-white p-8 shadow-sm">
              <div className="absolute inset-y-6 left-6 w-px bg-gradient-to-b from-primary via-accent/60 to-primary" />
              <div className="space-y-8">
                {playbookTimeline.map((step, index) => (
                  <div key={step.phase} className="relative pl-16">
                    <div className="absolute left-0 top-1.5 flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary text-white text-sm font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-xs uppercase tracking-[0.35em] text-primary/80">{step.phase}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{step.headline}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-20">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-primary">Latest dispatches</p>
                <h2 className="mt-2 text-3xl font-semibold text-primary-dark">Playbooks to recalibrate your revenue cycle</h2>
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
                <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-16 text-center text-slate-500">
                  No posts yet. Check back soon!
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {(additionalPosts.length ? additionalPosts : posts).map((post) => (
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
