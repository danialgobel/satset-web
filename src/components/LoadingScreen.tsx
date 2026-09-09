import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { allArchivePhotos } from '../data/membersData';

interface LoadingScreenProps {
  onComplete: () => void;
  isMediaReady: boolean;
}

export function LoadingScreen({ onComplete, isMediaReady }: LoadingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const photos = allArchivePhotos;

  // Carousel auto-advance every 900ms
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 900);
    return () => clearInterval(timer);
  }, [photos.length]);

  // Smooth progress calculation & readiness detection
  useEffect(() => {
    const start = Date.now();
    const minDuration = 3200; // minimum duration (3.2s) for delightful visual transition
    const maxDuration = 5500; // maximum fallback

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const timeRatio = Math.min(1, elapsed / minDuration);

      if (elapsed >= maxDuration || (isMediaReady && elapsed >= minDuration)) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(onComplete, 400); // brief pause at 100% then reveal
      } else {
        // Smoothly progress up to 92% until media is confirmed ready
        const targetProgress = isMediaReady 
          ? Math.min(100, Math.floor(timeRatio * 100))
          : Math.min(92, Math.floor(timeRatio * 92));
        setProgress((prev) => Math.max(prev, targetProgress));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isMediaReady, onComplete]);

  // Helper to use ultra-fast 20KB loading thumbnails instead of 3.3MB raw files
  const getThumbUrl = (src: string) => {
    if (src.includes('/assets/dokumentasi_baru/')) {
      return src.replace('/assets/dokumentasi_baru/', '/assets/loading_thumbs/');
    }
    return src;
  };

  // 3 Photos in view (Left, Center, Right)
  const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
  const currentPhoto = photos[currentIndex];
  const nextIdx = (currentIndex + 1) % photos.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-between p-6 sm:p-10 bg-black overflow-hidden select-none"
    >
      {/* Background Noise & Vignette */}
      <div className="noise-overlay absolute inset-0 opacity-[0.55] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 pt-4 sm:pt-6 text-center">
        <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#DEDBC8]/60 uppercase">
          SATSETWELL ARCHIVE
        </span>
        <h2 className="text-xs sm:text-sm font-medium tracking-wide text-[#E1E0CC]/80 mt-1">
          Menyiapkan Dokumentasi Sinematik...
        </h2>
      </div>

      {/* Center 3-Photo Carousel */}
      <div className="relative z-10 w-full max-w-2xl h-64 sm:h-80 flex items-center justify-center my-auto overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Left Photo (Blurred, Dimmed, Scaled Down) */}
          <motion.div
            key={`left-${prevIdx}`}
            initial={{ opacity: 0, x: -60, scale: 0.8 }}
            animate={{ opacity: 0.35, x: -110, scale: 0.82 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute w-36 sm:w-56 h-48 sm:h-72 rounded-2xl overflow-hidden shadow-2xl blur-[2.5px] pointer-events-none"
          >
            <img
              src={getThumbUrl(photos[prevIdx].src)}
              alt="Archive Preview"
              loading="eager"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Center Photo (Focused, Sharp, Prominent) */}
          <motion.div
            key={`center-${currentIndex}`}
            initial={{ opacity: 0.5, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 w-48 sm:w-64 h-60 sm:h-80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/20"
          >
            <img
              src={getThumbUrl(currentPhoto.src)}
              alt={currentPhoto.caption}
              loading="eager"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3.5 sm:p-4">
              <span className="text-[11px] sm:text-xs font-mono text-[#DEDBC8] tracking-wider truncate">
                {currentPhoto.caption}
              </span>
            </div>
          </motion.div>

          {/* Right Photo (Blurred, Dimmed, Scaled Down) */}
          <motion.div
            key={`right-${nextIdx}`}
            initial={{ opacity: 0, x: 60, scale: 0.8 }}
            animate={{ opacity: 0.35, x: 110, scale: 0.82 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute w-36 sm:w-56 h-48 sm:h-72 rounded-2xl overflow-hidden shadow-2xl blur-[2.5px] pointer-events-none"
          >
            <img
              src={getThumbUrl(photos[nextIdx].src)}
              alt="Archive Preview"
              loading="eager"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Progress Bar & Percentage */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm pb-8 sm:pb-12 text-center">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#DEDBC8]/70 mb-2.5">
          <span>MEMUAT BUFFER HD</span>
          <span>{progress}%</span>
        </div>
        {/* Apple Glass Progress Track */}
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden backdrop-blur-md p-[1px] border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#DEDBC8]/60 to-[#DEDBC8] rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[10px] text-gray-500 font-mono mt-3">
          Mengoptimalkan video 1080p & audio Steve Lacy
        </p>
      </div>
    </motion.div>
  );
}
