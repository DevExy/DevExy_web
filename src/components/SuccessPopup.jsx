import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Removed AnimatePresence to simplify

export default function SuccessPopup({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-green-200 dark:border-green-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{message}</p>
          <button onClick={onClose} className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200">
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}