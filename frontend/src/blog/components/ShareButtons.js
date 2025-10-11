import React from 'react';
import { Facebook, Linkedin, Twitter, Link as LinkIcon } from 'lucide-react';

const shareConfigs = [
  {
    icon: Twitter,
    label: 'Twitter',
    buildUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    icon: Facebook,
    label: 'Facebook',
    buildUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    buildUrl: (url, title) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
];

function ShareButtons({ title }) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-primary">Share:</span>
      {shareConfigs.map(({ icon: Icon, label, buildUrl }) => (
        <a
          key={label}
          href={buildUrl(currentUrl, title)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white hover:border-primary"
        >
          <Icon size={16} />
          {label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white hover:border-primary"
      >
        <LinkIcon size={16} /> Copy link
      </button>
    </div>
  );
}

export default ShareButtons;
