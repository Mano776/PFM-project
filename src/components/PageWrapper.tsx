import React from 'react';
import { motion } from 'motion/react';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
    >
        {children}
    </motion.div>
);

export default PageWrapper;
