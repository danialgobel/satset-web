import { motion, type Variants } from 'framer-motion';

interface GalleryCardItem {
  id: number;
  title: string;
  image: string;
  fullRes: string;
  hueA: number;
  hueB: number;
  desc?: string;
}

const galleryData: GalleryCardItem[] = [
  {
    id: 1,
    title: "Kenawa Island",
    image: "/assets/dokumentasi_baru/brotherhood_wide_4k.webp",
    fullRes: "/assets/dokumentasi_baru/brotherhood_wide_4k.jpg",
    hueA: 38,
    hueB: 48
  },
  {
    id: 2,
    title: "kumpulan power rangers",
    image: "/assets/dokumentasi_baru/gathering_outdoor_4k.webp",
    fullRes: "/assets/dokumentasi_baru/gathering_outdoor_4k.jpg",
    hueA: 200,
    hueB: 230
  },
  {
    id: 3,
    title: "perekrutan member baru",
    image: "/assets/dokumentasi_baru/circle_gathering_4k.webp",
    fullRes: "/assets/dokumentasi_baru/circle_gathering_4k.jpg",
    hueA: 280,
    hueB: 320
  },
  {
    id: 4,
    title: "pergantian shift malam",
    image: "/assets/dokumentasi_baru/cinematic_vertical.webp",
    fullRes: "/assets/dokumentasi_baru/cinematic_vertical.jpg",
    hueA: 190,
    hueB: 240
  },
  {
    id: 5,
    title: "Vintage DClassic I",
    image: "/assets/dokumentasi_baru/vintage_dclassic_01.webp",
    fullRes: "/assets/dokumentasi_baru/vintage_dclassic_01.jpg",
    hueA: 140,
    hueB: 180
  },
  {
    id: 6,
    title: "Vintage DClassic II",
    image: "/assets/dokumentasi_baru/vintage_dclassic_02.webp",
    fullRes: "/assets/dokumentasi_baru/vintage_dclassic_02.jpg",
    hueA: 25,
    hueB: 45
  },
  {
    id: 7,
    title: "Hoga Pure Moments",
    image: "/assets/dokumentasi_baru/hoga_moment_square.webp",
    fullRes: "/assets/dokumentasi_baru/hoga_moment_square.jpg",
    hueA: 340,
    hueB: 15
  }
];

const cardVariants: Variants = {
  offscreen: {
    y: 90,
    opacity: 0,
    scale: 0.96
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 180,
      mass: 0.8
    }
  }
};

interface ScrollTriggeredGalleryProps {
  onSelectImage: (item: { src: string; caption: string; subtext?: string }) => void;
}

export function ScrollTriggeredGallery({ onSelectImage }: ScrollTriggeredGalleryProps) {
  return (
    <div className="relative py-24 px-4 sm:px-6 md:px-8 bg-black overflow-hidden border-t border-white/10">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#DEDBC8]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#E1E0CC] tracking-tight">
            Gulir & Rasakan Memorinya.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-lg mx-auto font-light">
            Setiap kartu kenangan meluncur dengan animasi pegas interaktif saat digulir.
          </p>
        </div>

        {/* Scroll Cards Container */}
        <div className="flex flex-col items-center space-y-12 sm:space-y-16">
          {galleryData.map((item, i) => {
            const gradientBackground = `linear-gradient(135deg, hsl(${item.hueA}, 35%, 14%), hsl(${item.hueB}, 35%, 7%))`;

            return (
              <motion.div
                key={item.id}
                className="w-full max-w-lg cursor-pointer"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
                onClick={() =>
                  onSelectImage({
                    src: item.fullRes,
                    caption: item.title
                  })
                }
              >
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ background: gradientBackground }}
                  className="rounded-3xl p-5 sm:p-7 border border-white/10 hover:border-[#DEDBC8]/40 shadow-2xl relative overflow-hidden group transform-gpu will-change-transform"
                >
                  {/* Top indicator: Index number only (no KOLEKSI BARU text) */}
                  <div className="flex items-center justify-end mb-4">
                    <span className="text-xs font-mono text-gray-400 font-bold">
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Big Image Display with WebP & Visible Floating Loop */}
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{
                      duration: 4.2 + (i % 3) * 0.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: (i % 3) * 0.3
                    }}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-black/50 border border-white/10 transform-gpu will-change-transform"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </motion.div>

                  {/* Card Title (Clean, no description, no emojis, no HD optimized text) */}
                  <div className="pt-2">
                    <h3 className="text-xl sm:text-2xl font-medium text-[#E1E0CC] tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
