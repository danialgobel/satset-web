import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Download, Check } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  caption?: string;
  subtext?: string;
}

export function LightboxModal({
  isOpen,
  onClose,
  imageSrc,
  caption,
  subtext
}: LightboxModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Reset loading status whenever modal opens or imageSrc changes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      setIsDownloading(false);
      setDownloadSuccess(false);
    }
  }, [isOpen, imageSrc]);

  const handleDownload = async () => {
    if (!imageSrc || isDownloading) return;
    try {
      setIsDownloading(true);
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const extension = imageSrc.split('.').pop()?.split('?')[0] || 'jpg';
      const safeCaption = caption
        ? caption.toLowerCase().replace(/[^a-z0-9]/g, '_')
        : 'satsetwell_archive';
      link.download = `${safeCaption}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2200);
    } catch {
      // Fallback for strict browser restrictions
      const link = document.createElement('a');
      link.href = imageSrc;
      link.target = '_blank';
      link.download = 'satsetwell_archive';
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2200);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-xl p-4 md:p-10 select-none"
          onClick={onClose}
        >
          {/* Close Button (Apple Glass Style) */}
          <button
            onClick={onClose}
            aria-label="Tutup Pratinjau Foto"
            className="absolute top-5 right-5 sm:top-7 sm:right-7 p-3 rounded-full bg-white/10 text-[#DEDBC8] hover:bg-white/20 active:scale-95 transition-all z-20 cursor-pointer border border-white/15 backdrop-blur-md shadow-lg"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Elegant Satsetwel Loading Animation */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  key="lightbox-loader"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center justify-center p-7 sm:p-10 rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] min-w-[270px] sm:min-w-[340px] text-center"
                >
                  {/* Glowing Spinner with Aperture / Sparkles */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-[#DEDBC8]/15" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#DEDBC8] border-r-[#DEDBC8]/70 animate-spin" />
                    <div className="w-8 h-8 rounded-full bg-[#DEDBC8]/10 backdrop-blur-sm flex items-center justify-center text-[#DEDBC8]">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                  </div>

                  {/* Brand Tagline */}
                  <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#DEDBC8]/60 uppercase mb-1.5">
                    SATSETWELL ARCHIVE
                  </span>

                  {/* Aesthetic Indonesian Typography */}
                  <h3 className="text-[#E1E0CC] text-base sm:text-lg font-medium tracking-tight mb-1">
                    Memuat Aset Satset...
                  </h3>
                  <p className="text-[#DEDBC8]/70 text-xs sm:text-sm font-light max-w-[260px] leading-relaxed">
                    Sabar ya, foto resolusi tinggi lagi dimuat.
                  </p>

                  {/* Progress Shimmer Bar */}
                  <div className="w-36 sm:w-44 h-1 bg-white/10 rounded-full overflow-hidden mt-5">
                    <motion.div
                      animate={{ x: [-160, 160] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                      className="w-20 h-full bg-gradient-to-r from-transparent via-[#DEDBC8] to-transparent"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error State Fallback */}
            {hasError && !isLoading && (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-red-300 text-sm font-medium mb-1">Foto gagal dimuat</p>
                <p className="text-gray-400 text-xs">Periksa koneksi internet Anda.</p>
              </div>
            )}

            {/* High-Resolution Image Container */}
            <div className={`flex flex-col items-center transition-all duration-500 ${isLoading ? 'opacity-0 absolute pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
              <img
                src={imageSrc}
                alt={caption || 'Pratinjau Satsetwell'}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl sm:rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              />

              {/* Caption & Subtext */}
              {caption && (
                <div className="mt-4 text-center px-4">
                  <h4 className="text-[#E1E0CC] text-base sm:text-lg font-medium tracking-wide">
                    {caption}
                  </h4>
                  {subtext && (
                    <p className="text-[#DEDBC8]/70 text-xs sm:text-sm mt-1 font-light">
                      {subtext}
                    </p>
                  )}
                </div>
              )}

              {/* Unduh Foto Asli (4K Full Resolution) - No AI Emojis */}
              <div className="mt-4 flex items-center justify-center">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] active:bg-white/[0.04] border border-white/20 hover:border-white/40 text-[#E1E0CC] text-xs font-mono tracking-wider uppercase backdrop-blur-xl transition-all duration-200 shadow-lg cursor-pointer active:scale-95 disabled:opacity-50 select-none"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#DEDBC8]" />
                      <span>Tersimpan</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#DEDBC8]" />
                      <span>{isDownloading ? 'Mengunduh...' : 'Unduh Foto Asli'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
