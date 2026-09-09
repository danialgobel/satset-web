import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  containerClassName?: string;
}

export function WordsPullUpMultiStyle({
  segments,
  containerClassName = ''
}: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Flatten all words while associating each with its segment className
  const allWords = segments.flatMap((seg) =>
    seg.text.split(' ').filter(Boolean).map((word) => ({
      word,
      className: seg.className || ''
    }))
  );

  return (
    <div
      ref={ref}
      className={`inline-flex flex-wrap justify-center items-baseline gap-x-[0.25em] gap-y-[0.1em] ${containerClassName}`}
    >
      {allWords.map((item, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className={`inline-block ${item.className}`}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: i * 0.05,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
