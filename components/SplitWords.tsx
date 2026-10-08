"use client";

import { motion } from "framer-motion";

export default function SplitWords({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.06,
  once = true,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block"
          initial="hidden"
          whileInView="shown"
          viewport={{ once, amount: 0.4 }}
          variants={{ hidden: {}, shown: {} }}
        >
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block ${wordClassName}`}
              variants={{
                hidden: { y: "115%", opacity: 0 },
                shown: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.7,
                    delay: delay + index * stagger,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
          {"\u00A0"}
        </motion.span>
      ))}
    </span>
  );
}
