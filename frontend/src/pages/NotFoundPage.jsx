import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-serif text-5xl sm:text-6xl text-[#1E1C1A] mb-4">404</h1>
      <p className="text-sm text-[#5C574F] mb-8 max-w-sm">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#1E1C1A] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B8945A] transition-colors"
      >
        Return Home
      </Link>
    </section>
  );
}
