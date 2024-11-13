"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const FadeInEffect = ({
  words,
  className,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
}) => {
  // Combine words into a single string for full-sentence fade-in
  const sentenceText = words.map((word) => word.text).join(" ");
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      animate(
        scope.current,
        {
          opacity: [0, 1], // Only fade in from transparent to opaque
        },
        {
          duration: 1.2, // Set duration for fade-in effect
          ease: "easeOut", // Smooth easing for the fade
        }
      );
    }
  }, [isInView]);

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0 }} // Start fully transparent
      animate={{ opacity: 1 }} // Fade to full opacity
      className={cn(
        "text-base sm:text-m md:text-m lg:text-m",
        className // Custom className allows additional control over styling
      )}
    >
      {sentenceText}
    </motion.div>
  );
};
