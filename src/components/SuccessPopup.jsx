import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuccessPopup({ message, onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      if (onClose) onClose();
    }, 3000); // Auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-2xl text-center max-w-sm"
        >
          <p className="text-green-600 font-semibold text-lg">{message}</p>
          <button
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            OK
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}