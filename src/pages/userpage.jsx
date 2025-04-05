import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserPage() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDarkMode);
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-green-50"} transition-colors duration-300`}>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="absolute top-8 left-8 flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className={`m-1 text-xl font-light ${darkMode ? "text-green-400" : "text-green-600"}`}>exAIma</span>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`absolute top-8 right-8 p-2 rounded-full ${darkMode ? "bg-gray-800 text-yellow-300" : "bg-white text-gray-700"} shadow-lg z-10`}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
        <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Welcome! This is a placeholder for your user page.</p>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate("/")} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200">
          Go Home
        </motion.button>
      </motion.div>
    </div>
  );
}