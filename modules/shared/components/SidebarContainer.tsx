"use client";
import { motion } from "framer-motion";

const SidebarContainer = ({ children, align, isOpen }: { children: React.ReactNode; align?: string; isOpen?: boolean }) => {
  return (
    <motion.div
            initial={{ x: align === 'left' ? -270 : 270 }}
            animate={{ x: isOpen ? 0 : align === 'left' ? -270 : 270 }}
            transition={{ duration: 0.3 }}
            className={`absolute right-0 top-0 max-w-min h-full z-10 ${align === 'left' ? 'left-0 border-r border-border' : 'right-0 border-l border-border'}`}
    >
      {children}
    </motion.div>
  );
}

export default SidebarContainer;