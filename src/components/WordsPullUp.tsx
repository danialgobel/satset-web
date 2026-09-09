import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}

export function WordsPullUp({ text, className = '', showAsterisk = false }: WordsPullUpProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const words = text.split(' ');

  return (
    <h1
      ref={ref}
      className={`inline-flex flex-wrap items-baseline gap-x-[0.2em] overflow-hidden ${className}`}
    >
      {words.map((word, i) => {
        const isLastWord = i === words.length - 1;
        return (
          <span key={i} className="inline-block overflow-hidden relative">
            <motion.span
              className="inline-block relative"
              initial={{ y: '100%', opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {word}
              {isLastWord && showAsterisk && (
                <span className="absolute -top-[0.2em] -right-[0.35em] text-[0.35em] font-light text-[#DEDBC8] select-none">
                  *
                </span>
              )}
            </motion.span>
          </span>
        );
      })}
    </h1>
  );
}
