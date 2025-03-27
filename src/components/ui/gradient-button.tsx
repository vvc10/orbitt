import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const GradientButton = ({ 
  children, 
  className = "", 
  onClick,
  variant = "primary"
}) => {
  const baseStyles = "relative overflow-hidden rounded-full px-6 py-3 font-medium transition-all duration-300";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/25",
    secondary: "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_100%)]" />
    </motion.button>
  );
};