"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const PopUpEffect = ({
  words,
  className,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
}) => {
  // Combine words into a single string for a full-sentence animation
  const sentenceText = words.map((word) => word.text).join(" ");
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      animate(
        scope.current, // Apply animation to the entire sentence
        {
          scale: [1.5, 0.9, 1], // Spring effect with larger to smaller bounce
          opacity: [0, 1], // Fade in as it springs up
        },
        {
          type: "spring",
          stiffness: 200, // Control bounce stiffness
          damping: 15, // Control bounce effect
          duration: 0.6, // Duration of the animation
        }
      );
    }
  }, [isInView]);

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0, scale: 0.8 }} // Start small and invisible
      animate={{ opacity: 1, scale: 1 }} // Pop to full size
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-m font-bold",
        className // Custom className allows control over alignment or additional styles
      )}
    >
      {sentenceText}
    </motion.div>
  );
};
