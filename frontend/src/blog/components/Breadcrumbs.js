import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumbs({ items }) {
  return (
    <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-medium text-slate-700">{item.label}</span>
              ) : (
                <Link to={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              )}
              {!isLast && <span className="text-slate-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
