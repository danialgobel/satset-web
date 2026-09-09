import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('hero');

  const navItems = [
    { id: 'story', label: 'Story', href: '#story' },
    { id: 'collective', label: 'Collective', href: '#collective' },
    { id: 'archive', label: 'Archive', href: '#archive' },
    { id: 'members', label: 'Members', href: '#members' },
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/satsetwel?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      external: true
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const sections = ['hero', 'story', 'collective', 'archive', 'members'];

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto bg-black/85 backdrop-blur-2xl rounded-b-2xl md:rounded-b-3xl px-3 py-1.5 sm:px-6 sm:py-2.5 md:px-8 md:py-3 border-b border-x border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-1 sm:gap-3 md:gap-6 transition-all duration-300 hover:border-white/30 max-w-[95vw] overflow-x-auto no-scrollbar"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                if (!item.external) {
                  setActiveSection(item.id);
                }
              }}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={`relative px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 select-none ${
                isActive ? 'text-white' : 'text-[#E1E0CC]/75 hover:text-white'
              }`}
            >
              {/* Apple VisionOS / iOS Glass Segmented Indicator */}
              {isActive && (
                <motion.span
                  layoutId="activeNavbarGlassPill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-2xl border border-white/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_4px_16px_rgba(0,0,0,0.4)] pointer-events-none"
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </header>
  );
}
