'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-white px-6">
      {/* Decorative blue blurs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-50/80 blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 flex max-w-sm flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8">
          <Image src="/logo.png" alt="Karsa" width={56} height={56} priority />
        </div>

        <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-8xl font-extrabold tracking-tight text-transparent md:text-9xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Page not found</h2>

        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_12px_25px_rgba(37,99,235,0.4)] active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
