import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SuccessPopup from "../components/SuccessPopup";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDarkMode);
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Create URLSearchParams for x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("grant_type", "password");
    formData.append("scope", "");
    formData.append("client_id", "string"); // Replace with actual client_id
    formData.append("client_secret", "string"); // Replace with actual client_secret

    try {
      const response = await fetch("https://devexy-backend.azurewebsites.net/auth/login", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();
     
      console.log("Login response:", data);
      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token_type", data.token_type);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify({ username }));
        setShowSuccess(true);
      } else {
        setError(data.detail || "Invalid username or password");
      }
    } catch (error) {
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowSuccess(false);
    navigate("/dashboard");
  };

  return (
    <div className={`w-full min-h-screen flex items-center justify-center p-6 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-green-50"} transition-colors duration-300`}>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${darkMode ? "bg-green-500" : "bg-green-300"} opacity-20`}
            style={{ width: Math.random() * 8 + 4, height: Math.random() * 8 + 4, left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh` }}
            animate={{ y: [0, -Math.random() * 100 - 50], x: [0, (Math.random() - 0.5) * 50], opacity: [0.2, 0] }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, repeatType: "loop" }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="absolute top-8 left-8 flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="Devexy Logo" className="h-6 w-auto" />
        <span className={`m-1 text-xl font-light ${darkMode ? "text-green-400" : "text-green-600"}`}>Devexy</span>
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

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`w-full max-w-md relative z-10 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-2xl shadow-2xl overflow-hidden`}
      >
        <div className="h-2 w-full bg-gradient-to-r from-green-400 to-green-600" />
        <div className="p-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="Devexy Logo" className="h-10 w-auto" />
            </div>
            <h2 className="text-3xl font-bold text-center mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">Welcome back</span>
            </h2>
            <p className={`text-center mb-8 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>Sign in to your DevExy account</p>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <label className={`block ${darkMode ? "text-gray-200" : "text-gray-700"} font-medium mb-2`}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-3 pr-4 py-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500" : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-green-500"} rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200`}
                placeholder="Enter your username"
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <label className={`block ${darkMode ? "text-gray-200" : "text-gray-700"} font-medium mb-2`}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-3 pr-4 py-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500" : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-green-500"} rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200`}
                placeholder="Enter your password"
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-medium ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"} text-white transition-all duration-300 shadow-lg`}
              >
                {isLoading ? "Loading..." : "Sign in"}
              </button>
            </motion.div>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.8 }} className="mt-8 text-center">
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Don't have an account?{" "}
              <motion.a whileHover={{ scale: 1.05 }} href="/register" className="text-green-500 hover:text-green-600 font-medium transition-colors duration-200">
                Sign up now
              </motion.a>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ duration: 0.8, delay: 1.2 }} className="fixed bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-green-300 to-green-400 rounded-full -mb-32 -ml-32 blur-2xl opacity-20 z-0" />
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ duration: 0.8, delay: 1.3 }} className="fixed top-0 right-0 w-80 h-80 bg-gradient-to-l from-green-300 to-green-400 rounded-full -mt-40 -mr-40 blur-2xl opacity-20 z-0" />

      {showSuccess && <SuccessPopup message="Login successful" onClose={handlePopupClose} />}
    </div>
  );
}