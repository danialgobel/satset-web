import { motion } from 'framer-motion';

interface IntroSplashProps {
  onEnter: () => void;
}

export function IntroSplash({ onEnter }: IntroSplashProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 sm:p-10 bg-black overflow-hidden select-none"
    >
      {/* Background Vintage DClassic II */}
      <img
        src="/assets/dokumentasi_baru/vintage_dclassic_02.webp"
        alt="Satsetwel Intro"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Film Noise & Dark Vignette Overlay */}
      <div className="noise-overlay absolute inset-0 opacity-[0.55] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

      {/* Top Spacer */}
      <div className="relative z-10 pt-4">
        <span className="text-xs font-mono tracking-widest text-[#DEDBC8]/60 uppercase">
          SATSETWELL ARCHIVE
        </span>
      </div>

      {/* Center Hero Heading: Satsetwel* */}
      <div className="relative z-10 text-center flex flex-col items-center my-auto">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-[-0.06em] text-[#E1E0CC] leading-none mb-3">
          Satsetwel<span className="text-[#DEDBC8] font-light">*</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#DEDBC8]/75 font-light tracking-wide max-w-sm mx-auto">
          Sebuah ruang tumbuh bersama dari masa kecil hingga saat ini.
        </p>
      </div>

      {/* Bottom Action: Ketuk untuk memulai (Murni Teks, Tanpa Emotikon, Apple Glass Style) */}
      <div className="relative z-10 pb-8 sm:pb-12">
        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-white/[0.14] hover:bg-white/[0.24] active:bg-white/[0.1] backdrop-blur-2xl border border-white/30 hover:border-white/55 text-white font-medium text-sm sm:text-base tracking-wider uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_12px_36px_rgba(0,0,0,0.4)] transition-all cursor-pointer"
        >
          Ketuk untuk memulai
        </motion.button>
      </div>
    </motion.div>
  );
}
