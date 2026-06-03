'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

const slides = [
  { id: 1, titleKey: 'slide1_title', descKey: 'slide1_desc' },
  { id: 2, titleKey: 'slide2_title', descKey: 'slide2_desc' },
  { id: 3, titleKey: 'slide3_title', descKey: 'slide3_desc' },
  { id: 4, titleKey: 'slide4_title', descKey: 'slide4_desc' },
];

export function AuthCarousel() {
  const t = useTranslations('AuthCarousel');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10 mt-12 mb-8 flex h-[280px] w-full max-w-lg flex-col justify-end">
      <div className="relative mb-8 h-56">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <h1 className="font-heading mb-4 text-4xl leading-tight font-semibold text-white md:text-5xl">
              {t(slides[currentSlide].titleKey)}
            </h1>
            <p className="text-lg leading-relaxed text-blue-100">
              {t(slides[currentSlide].descKey)}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              idx === currentSlide
                ? 'w-6 scale-110 bg-white' // Active dot is pill-shaped/longer
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
