import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, Check, Play, Eye, Sparkles, Image as ImageIcon, VolumeX, Share2, Copy } from 'lucide-react';
import { WordsPullUp } from './components/WordsPullUp';
import { WordsPullUpMultiStyle } from './components/WordsPullUpMultiStyle';
import { ScrollRevealParagraph } from './components/ScrollRevealParagraph';
import { Navbar } from './components/Navbar';
import { LightboxModal } from './components/LightboxModal';
import { VideoModal } from './components/VideoModal';
import { ScrollTriggeredGallery } from './components/ScrollTriggeredGallery';
import { IntroSplash } from './components/IntroSplash';
import { LoadingScreen } from './components/LoadingScreen';
import { squadsData, allArchivePhotos } from './data/membersData';
import type { ArchivePhoto } from './data/membersData';

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function App() {
  const [isSplashOpen, setIsSplashOpen] = useState(true);
  const [isLoadingScreenOpen, setIsLoadingScreenOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string; subtext?: string } | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [modalVideo, setModalVideo] = useState<{ src?: string; youtubeId?: string }>({
    src: '/assets/dokumentasi_baru/satsetwell_hero_hd.mp4'
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'classic'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      triggerToast('Tautan berhasil disalin!');
    } catch {
      triggerToast('Tautan berhasil disalin!');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Satsetwell: Creative Collective & Archive',
          text: 'Sebuah ruang tumbuh bersama dari masa kecil hingga saat ini.',
          url,
        });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }
    await handleCopyLink();
  };

  // Background Music Controller (Steve Lacy - Oh Yeah, starting from second 10)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

  const TARGET_VOLUME = 0.35;

  const fadeAudioTo = (targetVol: number, durationMs: number, onComplete?: () => void) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const startVol = audioRef.current.volume;
    const steps = Math.max(10, Math.floor(durationMs / 40));
    const stepDiff = (targetVol - startVol) / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        return;
      }
      currentStep++;
      const nextVol = Math.min(1, Math.max(0, startVol + stepDiff * currentStep));
      audioRef.current.volume = nextVol;

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        audioRef.current.volume = targetVol;
        if (onComplete) onComplete();
      }
    }, 40);
  };

  const handleSplashEnter = () => {
    setIsSplashOpen(false);
    setIsLoadingScreenOpen(true);

    // 1. Prepare and prebuffer in-DOM audio element immediately during user gesture
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.load();
    }

    // 2. Preload and prime hero video buffer
    if (heroVideoRef.current) {
      heroVideoRef.current.load();
      const checkVideoReady = () => {
        if (heroVideoRef.current && heroVideoRef.current.readyState >= 3) {
          setIsMediaReady(true);
        }
      };
      heroVideoRef.current.addEventListener('canplay', checkVideoReady, { once: true });
      heroVideoRef.current.addEventListener('canplaythrough', () => setIsMediaReady(true), { once: true });
      if (heroVideoRef.current.readyState >= 3) {
        setIsMediaReady(true);
      }
    }
  };

  const handleLoadingComplete = () => {
    setIsLoadingScreenOpen(false);
    setHasEntered(true);

    // 1. Play buttery-smooth 1080p hero video
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => {});
    }

    // 2. Start Steve Lacy background music with silky fade-in
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMusicPlaying(true);
            fadeAudioTo(TARGET_VOLUME, 1500);
          })
          .catch(() => {
            setIsMusicPlaying(false);
          });
      }
    }
  };

  // Sync background music with video modal (fade out on open, fade in on close)
  useEffect(() => {
    if (!hasEntered || !audioRef.current) return;

    if (isVideoOpen) {
      // Fade out background music while video modal is active
      fadeAudioTo(0, 800, () => {
        audioRef.current?.pause();
        setIsMusicPlaying(false);
      });
    } else {
      // Resume background music when video modal closes
      if (!isMusicMuted) {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
          fadeAudioTo(TARGET_VOLUME, 1000);
        }).catch(() => {});
      }
    }
  }, [isVideoOpen, hasEntered, isMusicMuted]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      fadeAudioTo(0, 500, () => {
        audioRef.current?.pause();
        setIsMusicPlaying(false);
        setIsMusicMuted(true);
      });
    } else {
      setIsMusicMuted(false);
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
        fadeAudioTo(TARGET_VOLUME, 800);
      }).catch(() => {});
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Guarantee instant video autoplay on mobile Safari & Chrome
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.muted = true;
      const playPromise = heroVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, fallback to retry on touch
          const onTouch = () => {
            heroVideoRef.current?.play();
            window.removeEventListener('touchstart', onTouch);
          };
          window.addEventListener('touchstart', onTouch, { once: true });
        });
      }
    }
  }, []);

  // Ref for features animation
  const featuresRef = useRef<HTMLDivElement>(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: '-80px' });

  // Filtered photos
  const filteredPhotos = allArchivePhotos.filter((photo) => {
    if (activeFilter === 'all') return true;
    return photo.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-black text-[#E1E0CC] selection:bg-[#DEDBC8] selection:text-black">
      {/* Intro / Splash Screen with relaxed typewriter */}
      <AnimatePresence>
        {isSplashOpen && <IntroSplash onEnter={handleSplashEnter} />}
      </AnimatePresence>

      {/* Loading Screen with 3-Photo Carousel & Preload detection */}
      <AnimatePresence>
        {isLoadingScreenOpen && (
          <LoadingScreen
            onComplete={handleLoadingComplete}
            isMediaReady={isMediaReady}
          />
        )}
      </AnimatePresence>

      {/* Hanging Top Navbar */}
      <Navbar onShare={handleShare} />

      {/* =========================================================================
          SECTION 1: HERO (Video Asli Satsetwell HD 1080p - Proporsi Pas di HP & Desktop)
          ========================================================================= */}
      <section id="hero" className="min-h-[580px] h-[84vh] max-h-[760px] md:h-screen md:max-h-none p-3 sm:p-4 md:p-6 w-full flex flex-col justify-center">
        <div className="relative w-full h-full rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-black flex flex-col justify-end shadow-2xl border border-white/10">
          {/* Video Dokumentasi Asli Satsetwell (1080p HD, Universal H.264, Autoplay di HP) */}
          <video
            ref={heroVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            // @ts-ignore
            webkit-playsinline="true"
            poster="/assets/dokumentasi_baru/gathering_outdoor_4k.webp"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/assets/dokumentasi_baru/satsetwell_hero_mobile.mp4" type="video/mp4" />
            <source src="/assets/dokumentasi_baru/satsetwell_hero_hd.mp4" type="video/mp4" />
          </video>

          {/* Noise Texture Overlay */}
          <div className="noise-overlay absolute inset-0 opacity-[0.55] mix-blend-overlay pointer-events-none" />

          {/* Cinematic Vignette & Dark Gradients for Maximum Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/55 pointer-events-none" />

          {/* Hero Bottom Content (12-Column Grid) */}
          <div className="relative z-10 w-full p-6 sm:p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
              {/* Left 8 Cols: Giant Heading */}
              <div className="lg:col-span-8 flex flex-col items-start">
                {/* Badge: made by danialgobel (dikecilkan dan minimalis) */}
                <div className="inline-flex items-center mb-2 sm:mb-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-[#DEDBC8]/20 text-[#DEDBC8]/80 text-[9px] sm:text-[10px] tracking-widest font-mono uppercase shadow-lg">
                  <span>made by danialgobel</span>
                </div>

                {/* Teks: Satsetwel* (ukuran proporsional, nyaman dilihat) */}
                <div className="relative select-none text-[17vw] sm:text-[15.5vw] md:text-[13.5vw] lg:text-[12vw] xl:text-[10.5vw] 2xl:text-[11vw] font-medium leading-[0.85] tracking-[-0.07em] text-[#E1E0CC]">
                  <WordsPullUp text="Satsetwel" showAsterisk={true} />
                </div>
              </div>

              {/* Right 4 Cols: Description & Apple Glasses Styled CTA Buttons */}
              <div className="lg:col-span-4 flex flex-col items-start space-y-4 sm:space-y-6 pb-2">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[#DEDBC8]/85 text-xs sm:text-sm md:text-base leading-relaxed max-w-md font-light"
                >
                  Satsetwell adalah ruang tumbuh bersama yang tak pernah berubah arah. Dibangun dari momen kecil, diperkuat oleh kepercayaan, dan dijalankan dengan kesederhanaan.
                </motion.p>

                {/* Apple Glasses Style Transparent Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap items-center gap-3.5"
                >
                  {/* Button 1: Jelajahi Member (Langsung Mengarah ke Direktori Member di Bawah) */}
                  <a
                    href="#members"
                    className="group inline-flex items-center gap-2.5 hover:gap-3.5 bg-white/[0.12] hover:bg-white/[0.22] active:bg-white/[0.08] backdrop-blur-2xl border border-white/25 hover:border-white/45 text-white font-medium text-xs sm:text-sm rounded-full pl-5 pr-1.5 py-1.5 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.35)] active:scale-95"
                  >
                    <span>Jelajahi Member</span>
                    <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </a>

                  {/* Button 2: Putar Video Lengkap (Apple Glass Style - Memutar Video Cover dengan Suara) */}
                  <button
                    onClick={() => {
                      setModalVideo({ src: '/assets/dokumentasi_baru/satsetwell_hero_hd.mp4' });
                      setIsVideoOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-full bg-white/[0.12] hover:bg-white/[0.22] active:bg-white/[0.08] backdrop-blur-2xl border border-white/25 hover:border-white/45 text-white text-xs sm:text-sm font-medium transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.35)] active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Putar Video Lengkap</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT (Dark card #101010 dengan tipografi editorial)
          ========================================================================= */}
      <section id="story" className="bg-black py-20 sm:py-28 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#101010] border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-14 md:p-20 text-center relative overflow-hidden shadow-2xl">
            {/* Top Subtitle Label */}
            <div className="inline-block mb-6">
              <span className="text-[#DEDBC8] text-[11px] sm:text-xs font-semibold tracking-widest uppercase border-b border-[#DEDBC8]/40 pb-1">
                Kolektif & Persaudaraan
              </span>
            </div>

            {/* Main Editorial Headline */}
            <div className="my-6 sm:my-8 text-2xl sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl mx-auto leading-[1.1] sm:leading-[1.05] tracking-tight">
              <WordsPullUpMultiStyle
                segments={[
                  { text: 'Kami adalah Satsetwell,', className: 'font-normal text-[#E1E0CC]' },
                  { text: 'ruang tumbuh bersama.', className: 'italic font-serif text-[#DEDBC8] text-[1.15em] mx-1' },
                  { text: 'Dibentuk sejak kecil, dijalankan tanpa keraguan bersama kawan terbaik.', className: 'font-normal text-[#E1E0CC]' }
                ]}
              />
            </div>

            {/* Scroll-Linked Progressive Text Reveal */}
            <div className="mt-8 sm:mt-12 max-w-2xl mx-auto text-[#DEDBC8] text-xs sm:text-sm md:text-base leading-relaxed">
              <ScrollRevealParagraph
                text="Satsetwell bukan sekadar nama, melainkan saksi perjalanan dari masa kecil hingga melangkah menuju kedewasaan. Kami tidak saling menunggu, kami bergerak bersama menyusuri setiap tantangan dengan kepercayaan penuh satu sama lain."
              />
            </div>

            {/* Signature badge (teks persahabatan abadi telah dihapus sesuai permintaan) */}
            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-[#DEDBC8]/70 font-mono">
              <span>SATSETWELL ARCHIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: COLLECTIVE & MEMBER SHOWCASE (Foto 4K Tegak & Nama Besar)
          ========================================================================= */}
      <section id="collective" className="min-h-screen bg-black py-20 px-4 sm:px-6 md:px-8 relative">
        <div className="bg-noise absolute inset-0 opacity-[0.12] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
            <div>
              <div className="inline-flex items-center gap-2 text-[#DEDBC8] text-xs font-mono tracking-widest uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lingkaran Kolektif</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-normal text-[#E1E0CC] tracking-tight">
                Member & Squad Satsetwell.
              </h2>
            </div>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mt-3 md:mt-0 font-light">
              Momen asli para member yang diabadikan secara visual dengan resolusi tinggi. Klik foto untuk melihat format asli.
            </p>
          </div>

          {/* 4-Column Card Grid */}
          <div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {/* Card 1: Video Dokumentasi Asli Satsetwell */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-[520px] rounded-3xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#DEDBC8]/50 transition-all shadow-2xl flex flex-col justify-between p-6 sm:p-7"
              onClick={() => {
                setModalVideo({ src: '/assets/dokumentasi_baru/satsetwell_hero_hd.mp4' });
                setIsVideoOpen(true);
              }}
            >
              {/* Cover Asli Dokumentasi Satsetwell */}
              <img
                src="/assets/dokumentasi_baru/gathering_outdoor_4k.webp"
                alt="Dokumentasi Satsetwell"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs text-[#DEDBC8] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  Dokumentasi Video
                </span>
                <span className="text-xs font-mono text-gray-400 font-bold">(00)</span>
              </div>

              {/* Center Play Button with Animated Ring */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                  <div className="absolute inset-0 rounded-full bg-[#DEDBC8]/30 animate-ping" />
                  <Play className="w-8 h-8 fill-[#DEDBC8] text-[#DEDBC8] ml-1" />
                </div>
                <span className="mt-4 px-3 py-1 rounded-full bg-black/60 text-[11px] text-[#DEDBC8] font-mono border border-white/10">
                  Putar Video HD
                </span>
              </div>

              <div className="relative z-10 pt-4 border-t border-white/15">
                <h3 className="text-xl sm:text-2xl font-bold text-[#E1E0CC] tracking-tight">
                  Arsip Sinematik.
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Rekaman video perjalanan dan kebersamaan Satsetwell dengan audio lengkap.
                </p>
              </div>
            </motion.div>

            {/* Cards 2, 3, 4: Squad Cards dengan FOTO BESAR 4K TEGAK & NAMA BESAR */}
            {squadsData.map((squad, idx) => (
              <motion.div
                key={squad.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.15 * (idx + 1), ease: [0.22, 1, 0.36, 1] }}
                className="min-h-[520px] bg-[#212121] rounded-3xl p-5 sm:p-6 flex flex-col justify-between border border-white/10 hover:border-[#DEDBC8]/50 transition-all duration-300 shadow-2xl group"
              >
                <div>
                  {/* Top Bar: Squad Title & Index */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#DEDBC8] font-bold tracking-wider">
                      {squad.title}
                    </span>
                    <span className="text-xs font-mono text-gray-400 font-bold">
                      ({squad.number})
                    </span>
                  </div>

                  {/* FOTO MEMBER BESAR 4K TEGAK */}
                  <div
                    onClick={() =>
                      setSelectedImage({
                        src: squad.fullResPhoto,
                        caption: squad.title,
                        subtext: squad.description
                      })
                    }
                    className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 border border-white/10 group-hover:border-[#DEDBC8]/40 shadow-lg cursor-pointer bg-black/50"
                  >
                    <img
                      src={squad.photo}
                      alt={squad.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-xs text-[#DEDBC8] flex items-center gap-1.5 border border-white/20">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Perbesar HD</span>
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi Squad */}
                  <p className="text-sm text-[#E1E0CC]/80 leading-relaxed font-light mb-4">
                    {squad.description}
                  </p>
                </div>

                {/* Bottom Action: Menuju Direktori Member di Bagian Bawah */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                    Satsetwell
                  </span>
                  <a
                    href="#members"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-white text-xs font-medium text-[#DEDBC8] hover:text-black transition-all border border-white/10 active:scale-95"
                  >
                    <span>Lihat Member</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: SCROLL TRIGGERED CARD ANIMATION (Sesuai Permintaan User)
          ========================================================================= */}
      <section id="scroll-archive">
        <ScrollTriggeredGallery
          onSelectImage={(item) => setSelectedImage(item)}
        />
      </section>

      {/* =========================================================================
          SECTION 5: GALERI ARSIP DENGAN TAB FILTER
          ========================================================================= */}
      <section id="archive" className="bg-black py-20 px-4 sm:px-6 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-[#DEDBC8] text-xs uppercase tracking-widest font-mono mb-2">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Galeri Kenangan Lengkap</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#E1E0CC]">
                Arsip Visual Satsetwell.
              </h2>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm max-w-md mt-3 md:mt-0 font-light">
              Seluruh foto dokumentasi asli yang tersimpan sejak awal berdirinya Satsetwell hingga dokumentasi 4K terbaru. Klik salah satu foto untuk memperbesar tampilan.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#DEDBC8] text-black shadow-lg'
                  : 'bg-[#212121] text-gray-300 hover:text-white border border-white/5'
              }`}
            >
              Semua Foto ({allArchivePhotos.length})
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                activeFilter === 'new'
                  ? 'bg-[#DEDBC8] text-black shadow-lg'
                  : 'bg-[#212121] text-gray-300 hover:text-white border border-white/5'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Dokumentasi Baru (9)
            </button>
            <button
              onClick={() => setActiveFilter('classic')}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                activeFilter === 'classic'
                  ? 'bg-[#DEDBC8] text-black shadow-lg'
                  : 'bg-[#212121] text-gray-300 hover:text-white border border-white/5'
              }`}
            >
              Arsip Klasik (9)
            </button>
          </div>

          {/* Photo Gallery Grid - Zero Lag Instant Filter */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {filteredPhotos.map((photo: ArchivePhoto) => (
              <div
                key={photo.id}
                onClick={() =>
                  setSelectedImage({
                    src: photo.fullRes,
                    caption: photo.caption,
                    subtext: `${photo.squad} • Format Resolusi Asli HD`
                  })
                }
                className="relative aspect-square rounded-2xl overflow-hidden bg-[#101010] border border-white/10 hover:border-[#DEDBC8]/50 group cursor-pointer shadow-xl transition-transform duration-200 hover:-translate-y-1 active:scale-95 will-change-transform"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 sm:p-5">
                  <span className="text-[10px] uppercase font-mono text-[#DEDBC8] bg-black/60 px-2 py-0.5 rounded w-fit mb-1 border border-white/10">
                    {photo.squad}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white">{photo.caption}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: TERHUBUNG DENGAN MEMBER (Super Interactive UI)
          ========================================================================= */}
      <section id="members" className="bg-[#0e0e0e] py-24 px-4 sm:px-6 md:px-8 border-t border-white/10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#212121] border border-[#DEDBC8]/20 text-[#DEDBC8] text-xs font-mono mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>INTERACTIVE MEMBER DIRECTORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#E1E0CC] tracking-tight">
              Terhubung dengan Member.
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-3">
              Setiap tombol kartu di bawah ini interaktif dan dapat diklik untuk langsung membuka akun Instagram masing-masing member.
            </p>
          </div>

          {/* Member Interactive Cards with whileHover & whileTap */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { name: 'Fadil', handle: '@fyade1', url: 'https://www.instagram.com/fyade1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Irsyad', handle: '@irsyddl_', url: 'https://www.instagram.com/irsyddl_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Diki', handle: '@_7iiikkyiiss', url: 'https://www.instagram.com/_7iiikkyiiss?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Danil', handle: '@hajjeddaniel', url: 'https://www.instagram.com/hajjeddaniel?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Nanda', handle: '@ndarizqi_13', url: 'https://www.instagram.com/ndarizqi_13?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Zayyid', handle: '@hii.jeyyy', url: 'https://www.instagram.com/hii.jeyyy?stkn=OXdpbXp2OXM3NDM=' },
              { name: 'Ozil', handle: '@kozill', url: 'https://www.instagram.com/kozill?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Ali', handle: '@alikazhim_', url: 'https://www.instagram.com/alikazhim_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Farid', handle: '@ahmfarid_', url: 'https://www.instagram.com/ahmfarid_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Danial', handle: '@danialgobell', url: 'https://www.instagram.com/danialgobell?igsh=MXhmaG5mZzF4MHlnOQ==' },
              { name: 'Sudes', handle: '@sudes924', url: 'https://www.instagram.com/sudes924?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Iqbal', handle: '@iqbaaaaaaalle', url: 'https://www.instagram.com/iqbaaaaaaalle?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Adib', handle: '@adiblzwr_ilhmy', url: 'https://www.instagram.com/adiblzwr_ilhmy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
              { name: 'Sakil', handle: '@syakilazzrfny', url: 'https://www.instagram.com/syakilazzrfny?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
            ].map((m) => (
              <motion.a
                key={m.handle}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="bg-[#1c1c1c] hover:bg-[#252525] p-4 rounded-2xl border border-white/10 hover:border-[#DEDBC8] hover:shadow-[0_0_25px_rgba(222,219,200,0.15)] transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                {/* Active Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-gray-400">ACTIVE</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-[#DEDBC8] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 -rotate-45" />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#DEDBC8] transition-colors">
                    {m.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{m.handle}</p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 group-hover:text-gray-300">
                  <span>Buka Profil</span>
                  <InstagramIcon className="w-3.5 h-3.5 text-[#DEDBC8]" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Official IG Banner */}
          <motion.div
            whileHover={{ y: -2 }}
            className="mt-14 bg-gradient-to-r from-[#212121] via-[#1a1a1a] to-[#212121] rounded-3xl p-6 sm:p-9 border border-white/15 hover:border-[#DEDBC8]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#DEDBC8] text-black flex items-center justify-center shrink-0 shadow-lg">
                <InstagramIcon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Official Instagram Satsetwell</h4>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Ikuti pembaruan kegiatan dan seluruh dokumentasi bersama kami.
                </p>
              </div>
            </div>
            <motion.a
              href="https://www.instagram.com/satsetwel?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#DEDBC8] text-black font-bold text-xs sm:text-sm hover:bg-white transition-all shadow-xl"
            >
              <span>Follow @satsetwel</span>
              <ArrowRight className="w-4 h-4 -rotate-45" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="bg-black py-12 px-4 sm:px-6 md:px-8 border-t border-white/10 text-center sm:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight text-[#E1E0CC]">
              Satsetwell<span className="text-[#DEDBC8] font-light">*</span>
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Creative Brotherhood Archive
            </span>
          </div>

          {/* Share & Copy Link Buttons (Tanpa Emot AI) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/[0.04] border border-white/15 text-[#E1E0CC] text-xs font-mono tracking-wide uppercase transition-all duration-300 cursor-pointer active:scale-95 select-none"
            >
              <Copy className="w-3.5 h-3.5 text-[#DEDBC8]" />
              <span>Salin Tautan</span>
            </button>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Satsetwell: Creative Collective & Archive — ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/[0.04] border border-white/15 text-[#E1E0CC] text-xs font-mono tracking-wide uppercase transition-all duration-300 cursor-pointer active:scale-95 select-none"
            >
              <Share2 className="w-3.5 h-3.5 text-[#DEDBC8]" />
              <span>Bagikan ke WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} Satsetwell. All memories preserved.
            </div>

            <a
              href="#hero"
              className="text-xs text-gray-400 hover:text-[#DEDBC8] transition-colors"
            >
              Kembali ke Atas ↑
            </a>
          </div>
        </div>
      </footer>

      {/* Toast Notification (Tanpa Emot AI) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black/90 backdrop-blur-2xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.85)] text-[#E1E0CC] text-xs sm:text-sm font-mono tracking-wider pointer-events-none select-none"
          >
            <Check className="w-4 h-4 text-[#DEDBC8]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Apple Glass Music Pill (Steve Lacy - Oh Yeah) */}
      {hasEntered && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="fixed bottom-5 right-5 z-40"
        >
          <button
            onClick={toggleMusic}
            className="flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-2xl border border-white/20 hover:border-white/40 text-[#E1E0CC] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_10px_30px_rgba(0,0,0,0.5)] transition-all cursor-pointer group active:scale-95"
            title={isMusicPlaying ? 'Jeda Musik' : 'Putar Musik'}
          >
            {/* Animated Equalizer Bars when playing, or static muted icon */}
            <div className="w-4 h-4 flex items-end justify-center gap-0.5">
              {isMusicPlaying ? (
                <>
                  <span className="w-1 bg-[#DEDBC8] rounded-full animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ height: '70%' }} />
                  <span className="w-1 bg-[#DEDBC8] rounded-full animate-[equalizer_1.1s_ease-in-out_infinite_0.2s]" style={{ height: '100%' }} />
                  <span className="w-1 bg-[#DEDBC8] rounded-full animate-[equalizer_0.9s_ease-in-out_infinite_0.4s]" style={{ height: '50%' }} />
                </>
              ) : (
                <VolumeX className="w-4 h-4 text-white/50" />
              )}
            </div>

            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-white/90 leading-tight">
                Steve Lacy
              </span>
              <span className="text-[9px] text-[#DEDBC8]/70 font-mono leading-none">
                oh yeah
              </span>
            </div>

            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70 uppercase ml-1">
              {isMusicPlaying ? '10s' : 'PAUSED'}
            </span>
          </button>
        </motion.div>
      )}

      {/* Background Audio Element (Native In-DOM Preloaded for iOS & Android) */}
      <audio
        ref={audioRef}
        src="/assets/audio/steve_lacy_from_10s.mp3"
        preload="auto"
        loop
      />

      {/* Modals */}
      <LightboxModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageSrc={selectedImage?.src || ''}
        caption={selectedImage?.caption}
        subtext={selectedImage?.subtext}
      />

      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoSrc={modalVideo.src}
        youtubeId={modalVideo.youtubeId}
      />
    </div>
  );
}
