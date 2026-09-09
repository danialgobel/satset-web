import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Character({ char, progress, range }: CharacterProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

interface ScrollRevealParagraphProps {
  text: string;
  className?: string;
}

export function ScrollRevealParagraph({ text, className = '' }: ScrollRevealParagraphProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.35']
  });

  const characters = text.split('');
  const totalChars = characters.length;

  return (
    <p ref={containerRef} className={`leading-relaxed ${className}`}>
      {characters.map((char, index) => {
        const charProgress = index / totalChars;
        const start = Math.max(0, charProgress - 0.08);
        const end = Math.min(1, charProgress + 0.04);
        return (
          <Character
            key={index}
            char={char}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}
