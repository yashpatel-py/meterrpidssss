import React, { useEffect, useMemo, useState } from 'react';
import { Copy, Lock, RefreshCcw, Unlock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchJSON } from '../utils/api';
import RichTextEditor from '../components/RichTextEditor';

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  heroImage: '',
  status: 'draft',
  authorId: '',
  tagIds: [],
  publishedAt: '',
};

const EXCERPT_MAX = 160;
const TITLE_MAX = 120;
const SLUG_MAX = 90;

function PostEditorPage() {
  const { token, user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageMode, setImageMode] = useState('url');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [slugLocked, setSlugLocked] = useState(false);
  const [slugCopied, setSlugCopied] = useState(false);

  const baseUrl = useMemo(() => process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000', []);
  const blogBaseUrl = useMemo(() => {
    if (typeof window !== 'undefined' && window.location) {
      return `${window.location.origin}/blog/`;}
    return '/blog/';
  }, []);

  const stripHtml = (value) => value.replace(/<[^>]+>/g, ' ');

  const slugify = (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, SLUG_MAX);

  const autoSlug = (titleValue, excerptValue, contentValue) => {
    const descriptionPart = excerptValue || stripHtml(contentValue || '');
    const combined = `${titleValue || ''} ${descriptionPart}`.trim();
    if (!combined) return '';
    return slugify(combined);
  };

  const toggleSlugLock = () => {
    setSlugLocked((prev) => !prev);
  };

  const regenerateSlug = () => {
    setForm((prev) => {
      const nextSlug = autoSlug(prev.title, prev.excerpt, prev.content);
      if (!nextSlug) {
        return prev;
      }
      return { ...prev, slug: nextSlug };
    });
    setSlugLocked(false);
  };

  const handleCopySlug = async () => {
    if (!form.slug) return;
    try {
      await navigator.clipboard.writeText(form.slug);
      setSlugCopied(true);
      window.setTimeout(() => setSlugCopied(false), 1500);
    } catch (err) {
      console.warn('Unable to copy slug', err);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setForm(() => ({ ...emptyForm }));
      setSlugLocked(false);
      setImageMode('url');
      setUploadedImage(null);
    }
  }, [isEditing]);

  useEffect(() => {
    async function loadMeta() {
      const [authorsRes, tagsRes] = await Promise.all([
        fetchJSON(`${baseUrl}/api/admin/metadata/authors`, token).catch(() => ({ data: [] })),
        fetchJSON(`${baseUrl}/api/tags`, token).catch(() => ({ data: [] })),
      ]);

      const authorList = authorsRes.data || [];
      setAuthors(authorList);
      setTags(tagsRes.data || []);

      if (!authorList.length) {
        setError('No authors available. Please create an author entry first.');
        return;
      }

      if (!isEditing) {
        const normalizedEmail = user?.email?.toLowerCase() ?? '';
        const emailSlug = slugify(normalizedEmail);
        const defaultAuthor = authorList.find(
          (author) => author.slug === emailSlug || author.slug === normalizedEmail
        );
        const fallbackAuthor = authorList[0];

        setForm((prev) => ({
          ...prev,
          authorId: prev.authorId || ((defaultAuthor ?? fallbackAuthor)?.id ?? ''),
        }));
      }
    }

    async function loadPost() {
      if (!isEditing) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetchJSON(`${baseUrl}/api/admin/posts/${id}`, token);
        const data = response.data;
        setForm({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || '',
          heroImage: data.hero_image || '',
          status: data.status,
          authorId: data.author?.id ?? '',
          tagIds: data.tags?.map((tag) => tag.id) ?? [],
          publishedAt: data.published_at ? data.published_at.slice(0, 16) : '',
        });
        setSlugLocked(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMeta().catch((err) => console.error(err));
    loadPost();
  }, [baseUrl, id, isEditing, token, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => {
      const next = { ...prev };

      if (name === 'slug') {
        setSlugLocked(true);
        next.slug = slugify(value).slice(0, SLUG_MAX);
        return next;
      }

      if (name === 'title') {
        next[name] = value.slice(0, TITLE_MAX);
      } else if (name === 'excerpt') {
        next[name] = value.slice(0, EXCERPT_MAX);
      } else {
        next[name] = value;
      }

      if (!slugLocked && (name === 'title' || name === 'excerpt')) {
        next.slug = autoSlug(next.title, next.excerpt, next.content);
      }

      return next;
    });
  };

  const handleTagToggle = (tagId) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((idValue) => idValue !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleImageModeChange = (mode) => {
    setImageMode(mode);
    if (mode === 'url') {
      setUploadedImage(null);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() ?? '';
      setUploadedImage({ name: file.name, size: file.size, preview: result });
      setForm((prev) => ({ ...prev, heroImage: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!form.authorId) {
        throw new Error('Author is required. Contact an administrator.');
      }
      const payload = {
        ...form,
        authorId: Number(form.authorId),
        tagIds: form.tagIds,
        heroImage: form.heroImage || null,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      };

      const url = isEditing ? `${baseUrl}/api/admin/posts/${id}` : `${baseUrl}/api/admin/posts`;
      const method = isEditing ? 'PATCH' : 'POST';

      await fetchJSON(url, token, { method, body: JSON.stringify(payload) });
      navigate('/admin/posts', { replace: true });
    } catch (err) {
        setError(err.message);
      } finally {
        setSaving(false);
      }
  };

  if (loading) {
    return <div className="text-slate-500">Preparing editor…</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-primary/70">{isEditing ? 'Update' : 'Compose'}</p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">{isEditing ? 'Edit mission log' : 'New mission log'}</h1>
      </header>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500 text-right">
              {form.title.length}/{TITLE_MAX}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              required
              value={form.slug}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500 text-right">
              {form.slug.length}/{SLUG_MAX}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="excerpt">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            value={form.excerpt}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500 text-right">
            {form.excerpt.length}/{EXCERPT_MAX}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="content">
            Blog description
          </label>
          <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <RichTextEditor
              key={isEditing ? id : 'new-post'}
              value={form.content}
              onChange={(html) => {
                setForm((prev) => {
                  const next = { ...prev, content: html };
                  if (!slugLocked) {
                    next.slug = autoSlug(next.title, next.excerpt, html);
                  }
                  return next;
                });
              }}
              placeholder="Tell the full story..."
            />
          </div>
        </div>

        <input type="hidden" name="authorId" value={form.authorId} readOnly />
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Author:</span>{' '}
          {authors.find((author) => author.id === Number(form.authorId))?.name || 'Unassigned'}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="publishedAt">
              Publish date
            </label>
            <input
              type="datetime-local"
              id="publishedAt"
              name="publishedAt"
              value={form.publishedAt}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-3">
          <p className="text-sm font-medium text-slate-700">Hero image</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              className={`rounded-full border px-4 py-2 transition ${
                imageMode === 'url'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary'
              }`}
              onClick={() => handleImageModeChange('url')}
            >
              Use link
            </button>
            <button
              type="button"
              className={`rounded-full border px-4 py-2 transition ${
                imageMode === 'upload'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary'
              }`}
              onClick={() => handleImageModeChange('upload')}
            >
              Upload file
            </button>
          </div>
          {imageMode === 'url' ? (
            <input
              id="heroImage"
              name="heroImage"
              value={form.heroImage}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:outline-none"
              placeholder="https://..."
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="heroFile" />
              <label
                htmlFor="heroFile"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary/40 px-4 py-2 text-sm text-primary"
              >
                Choose image
              </label>
              {uploadedImage ? (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-slate-600">{uploadedImage.name}</p>
                  <img src={uploadedImage.preview} alt="Preview" className="mx-auto max-h-40 rounded-xl border border-slate-300 object-cover" />
                </div>
              ) : null}
            </div>
          )}
        </div>



        <div>
          <p className="text-sm font-medium text-slate-700">Tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = form.tagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  #{tag.name}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEditing ? 'Update post' : 'Publish post'}
        </button>
      </form>
    </div>
  );
}

export default PostEditorPage;
