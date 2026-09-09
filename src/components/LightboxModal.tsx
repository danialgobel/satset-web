import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Tutup Pratinjau Foto"
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-[#DEDBC8] hover:bg-white/20 transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageSrc}
              alt={caption || 'Pratinjau Satsetwell'}
              className="max-h-[75vh] w-auto object-contain rounded-xl border border-white/10 shadow-2xl"
            />
            {caption && (
              <div className="mt-4 text-center">
                <h4 className="text-[#E1E0CC] text-base md:text-lg font-medium tracking-wide">
                  {caption}
                </h4>
                {subtext && (
                  <p className="text-gray-400 text-xs md:text-sm mt-1">{subtext}</p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
