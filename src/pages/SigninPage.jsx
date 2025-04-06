import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SuccessPopup from "../components/SuccessPopup";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Always black-green theme
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const payload = {
      username,
      email,
      full_name: fullName,
      github_username: githubUsername,
      password,
      confirm_password: confirmPassword,
    };

    try {
      const response = await fetch("https://devexy-backend.azurewebsites.net/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
      } else {
        setError(data.detail || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopupClose = () => {
    setShowSuccess(false);
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-black transition-colors duration-300 text-white">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-500 opacity-20"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
            }}
            animate={{
              y: [0, -Math.random() * 100 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.2, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8 flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/logo.png" alt="DevExy Logo" className="h-6 w-auto" />
        <span className="m-1 text-xl font-light text-green-400">DevExy</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-md relative z-10 bg-zinc-900 text-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="h-2 w-full bg-gradient-to-r from-green-400 to-green-600" />
        <div className="p-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="DevExy Logo" className="h-12 w-auto" />
            </div>
            <h2 className="text-3xl font-bold text-center mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
                Create Account
              </span>
            </h2>
            <p className="text-center mb-8 text-gray-400">Sign up for your DevExy account</p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-900 border-l-4 border-red-500 text-red-300 rounded"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {[
              { label: "Username", value: username, setValue: setUsername, type: "text", placeholder: "Choose a username" },
              { label: "Email", value: email, setValue: setEmail, type: "email", placeholder: "Enter your email" },
              { label: "Full Name", value: fullName, setValue: setFullName, type: "text", placeholder: "Enter your full name" },
              { label: "GitHub Username", value: githubUsername, setValue: setGithubUsername, type: "text", placeholder: "Enter your GitHub username" },
              { label: "Password", value: password, setValue: setPassword, type: "password", placeholder: "Create a password (min. 8 characters)" },
              { label: "Confirm Password", value: confirmPassword, setValue: setConfirmPassword, type: "password", placeholder: "Confirm your password" },
            ].map((field, i) => (
              <motion.div key={field.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}>
                <label className="block text-gray-200 font-medium mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  className="w-full pl-3 pr-4 py-2 bg-gray-800 border-gray-700 text-white focus:ring-green-500 rounded-lg border focus:outline-none focus:ring-2 transition-colors duration-200"
                  placeholder={field.placeholder}
                  required
                />
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.1 }}>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-medium ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"} text-white transition-all duration-300 shadow-lg`}
              >
                {isLoading ? "Loading..." : "Create Account"}
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <motion.a
                whileHover={{ scale: 1.05 }}
                onClick={handleSignIn}
                className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200 cursor-pointer"
              >
                Log in here
              </motion.a>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ duration: 0.8, delay: 1.3 }} className="fixed bottom-0 left-0 w-64 h-64 bg-green-400 rounded-full -mb-32 -ml-32 blur-2xl opacity-20 z-0" />
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ duration: 0.8, delay: 1.4 }} className="fixed top-0 right-0 w-80 h-80 bg-green-400 rounded-full -mt-40 -mr-40 blur-2xl opacity-20 z-0" />

      {showSuccess && <SuccessPopup message="Registration successful" onClose={handlePopupClose} />}
    </div>
  );
}
