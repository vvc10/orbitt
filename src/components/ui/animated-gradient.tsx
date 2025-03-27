import { motion } from "framer-motion";

export const AnimatedGradient = ({ className = "" }) => (
  <motion.div
    className={`absolute inset-0 -z-10 ${className}`}
    animate={{
      background: [
        "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)",
        "radial-gradient(circle at 100% 100%, rgba(99,102,241,0.15) 0%, transparent 50%)",
        "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)"
      ]
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);