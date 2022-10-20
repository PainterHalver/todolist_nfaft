import { motion } from "framer-motion";

const animationConfiguration = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
export default function Transition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={animationConfiguration}
      initial='initial'
      animate='animate'
      exit='exit'
      transition={{ duration: 2 }}>
      {children}
    </motion.div>
  );
}
