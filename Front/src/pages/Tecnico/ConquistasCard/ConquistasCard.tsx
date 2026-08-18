import { motion, type Variants } from "framer-motion";

interface ConquistaProps {
  ico: string;
  tit: string;
  desc: string;
  status: "desbloqueada" | "bloqueada" | string;
}

const cardHover = {
  scale: 1.05,
  y: -5,
  transition: { duration: 0.2 },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function ConquistaCard({ ico, tit, desc, status }: ConquistaProps) {
  return (
    <motion.div
      className={`conquista-card ${status}`}
      variants={itemVariants}
      whileHover={status === "desbloqueada" ? cardHover : {}}
    >
      <span>{ico}</span>
      <h5>{tit}</h5>
      <p>{desc}</p>
    </motion.div>
  );
}