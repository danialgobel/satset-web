import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeroTypewriterProps {
  hasEntered: boolean;
}

export function HeroTypewriter({ hasEntered }: HeroTypewriterProps) {
  const fullText = 'Satsetwel*';
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!hasEntered) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < fullText.length) {
        // Slow, calm typing animation (190ms per letter)
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        }, 190);
      } else {
        // Comfortable pause once fully typed (3500ms) before gently re-typing
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 3500);
      }
    } else {
      if (displayedText.length > 0) {
        // Slow and smooth character deletion (85ms per letter)
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length - 1));
        }, 85);
      } else {
        // Pause briefly before typing again (900ms)
        timeout = setTimeout(() => {
          setIsDeleting(false);
        }, 900);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, hasEntered]);

  const hasAsterisk = displayedText.endsWith('*');
  const mainPart = hasAsterisk ? displayedText.slice(0, -1) : displayedText;

  return (
    <span className="inline-flex items-center">
      <span>{mainPart}</span>
      {hasAsterisk && <span className="text-[#DEDBC8] font-light">*</span>}
      {/* Sleek Blinking Cursor */}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
        className="inline-block text-[#DEDBC8] font-light ml-0.5"
      >
        |
      </motion.span>
    </span>
  );
}
