import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DiagramSection from "../components/DiagramSection";// Assuming this is in a separate file

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [diagram, setDiagram] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUsername(userData.username || "User");

    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDarkMode);

    const timer = setTimeout(() => setShowStats(true), 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const stats = [
    { label: "Projects", value: "12", percentage: "71%", trend: "up" },
    { label: "Tasks", value: "48", percentage: "75%", trend: "up" },
    { label: "Completion", value: "85%", percentage: "85%", trend: "up" },
  ];

  const renderDashboard = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-lg"
        >
          Create New Project
        </motion.button> */}
      </div>

      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className={`p-6 rounded-xl ${darkMode ? "bg-gray-800 bg-opacity-80" : "bg-white"} shadow-xl backdrop-blur-sm relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                  {stat.trend === "up" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{stat.label}</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-4xl font-bold">{stat.value}</h3>
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.percentage}
                  </span>
                </div>
                <div className="mt-4 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400"
                    initial={{ width: 0 }}
                    animate={{ width: stat.percentage }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`col-span-2 p-6 rounded-xl shadow-xl ${darkMode ? "bg-gray-800 bg-opacity-90" : "bg-white"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Active Projects</h3>
            <button className={`text-sm font-medium ${darkMode ? "text-green-400" : "text-green-600"} hover:underline`}>View All</button>
          </div>
          
          <div className="space-y-4">
            {["AI-Driven VS Code Extension", "Flutter Mobile App", "Requirements Backend"].map((project, idx) => (
              <motion.div 
                key={project}
                whileHover={{ x: 4 }}
                className={`p-4 rounded-lg border ${darkMode ? "border-gray-700 hover:border-green-600" : "border-gray-200 hover:border-green-400"} transition-colors duration-300`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{project}</h4>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Last updated: 2 hours ago</p>
                  </div>
                  <div className={`text-xs font-medium px-3 py-1 rounded-full ${idx === 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : idx === 1 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"}`}>
                    {idx === 0 ? "In Progress" : idx === 1 ? "Review" : "Planning"}
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{idx === 0 ? "71%" : idx === 1 ? "85%" : "45%"}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${idx === 0 ? "bg-green-500" : idx === 1 ? "bg-yellow-500" : "bg-blue-500"}`}
                      initial={{ width: 0 }}
                      animate={{ width: idx === 0 ? "71%" : idx === 1 ? "85%" : "45%" }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.5 + idx * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-xl shadow-xl ${darkMode ? "bg-gray-800 bg-opacity-90" : "bg-white"}`}
        >
          <h3 className="text-xl font-bold mb-6">Team Activity</h3>
          
          <div className="space-y-4">
            {[
              { name: "Stebi AR", role: "Full Stack Developer", time: "1h ago", action: "Updated code base" },
              { name: "Sreesh K", role: "Flutter Developer", time: "3h ago", action: "Created new UI components" },
              { name: "Adhithyan VP", role: "AI Engineer", time: "5h ago", action: "Deployed ML model" }
            ].map((person, idx) => (
              <motion.div 
                key={person.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-green-100"} text-green-600 font-bold`}>
                  {person.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{person.name}</h4>
                    <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{person.time}</span>
                  </div>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{person.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderDiagram = () => (
    <DiagramSection darkMode={darkMode} setDiagram={setDiagram} />
  );

  const renderAbout = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8">About DevExy</h2>
      <div className={`p-8 rounded-xl shadow-xl ${darkMode ? "bg-gray-800 bg-opacity-80" : "bg-white"} backdrop-blur-sm`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:space-x-8 mb-8">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <img src="public/logo.png" alt="DevExy Platform" className="rounded-xl shadow-lg" />
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-bold mb-4">Unlock a smarter approach to project management</h3>
              <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                DevExy is a powerful development platform designed to help developers streamline their workflow and increase productivity. Our mission is to provide innovative tools that make development more efficient and enjoyable.
              </p>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                With AI-driven automation and real-time insights, DevExy empowers teams to build high-quality software with confidence.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { 
                title: "AI-Driven Development", 
                description: "Leverage artificial intelligence to optimize your development workflow", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              { 
                title: "Seamless Integration", 
                description: "Connect with all your favorite tools and workflows", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              { 
                title: "Real-time Insights", 
                description: "Stay informed with instant alerts and live updates", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className={`p-6 rounded-xl text-center ${darkMode ? "bg-gray-700 bg-opacity-50" : "bg-gray-50"}`}
              >
                <div className={`mx-auto mb-4 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
      <div className={`p-8 rounded-xl shadow-xl ${darkMode ? "bg-gray-800 bg-opacity-80" : "bg-white"} backdrop-blur-sm`}>
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                We'd love to hear from you! Please reach out to us with any questions or feedback about our platform.
              </p>
              
              <div className="space-y-4">
                {[
                  { label: "Email", value: "support@devexy.com", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )},
                  { label: "Phone", value: "+918129690147", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  )},
                  { label: "Location", value: "STC,Thrissur", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                ].map((contact) => (
                  <div key={contact.label} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-green-100"} ${darkMode ? "text-green-400" : "text-green-600"}`}>
                      {contact.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{contact.label}</p>
                      <p className="font-medium">{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-6 rounded-xl ${darkMode ? "bg-gray-700 bg-opacity-50" : "bg-gray-50"}`}
            >
              <h3 className="text-xl font-bold mb-4">Send us a message</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Name</label>
                  <input type="text" className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-green-500`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Email</label>
                  <input type="email" className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-green-500`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Message</label>
                  <textarea rows={4} className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"} focus:outline-none focus:ring-2 focus:ring-green-500`}></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-medium shadow-lg"
                >
                  Send Message
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard": return renderDashboard();
      case "diagram": return renderDiagram();
      case "about": return renderAbout();
      case "contact": return renderContact();
      default: return renderDashboard();
    }
  };

  const renderParticles = () => {
    return [...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full ${darkMode ? "bg-green-500" : "bg-green-300"} opacity-20`}
        style={{ 
          width: Math.random() * 8 + 4, 
          height: Math.random() * 8 + 4, 
          left: `${Math.random() * 100}vw`, 
          top: `${Math.random() * 100}vh` 
        }}
        animate={{ 
          y: [0, -Math.random() * 100 - 50], 
          x: [0, (Math.random() - 0.5) * 50], 
          opacity: [0.2, 0] 
        }}
        transition={{ 
          duration: Math.random() * 10 + 10, 
          repeat: Infinity, 
          repeatType: "loop" 
        }}
      />
    ));
  };

  const renderGradientBackground = () => (
    <div className="absolute inset-0 overflow-hidden z-0">
      <motion.div
        className={`absolute inset-0 ${darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-green-50 via-white to-green-100"}`}
      />
      {darkMode && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute -inset-[100px] opacity-30 blur-3xl"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.3) 0%, rgba(0, 0, 0, 0) 70%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className={`w-full min-h-screen flex flex-col ${darkMode ? "text-white" : "text-gray-800"} transition-colors duration-300 overflow-hidden`}>
      {renderGradientBackground()}
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {renderParticles()}
      </div>

      <header className={`w-full backdrop-blur-md shadow-md z-20 ${darkMode ? "bg-gray-900 bg-opacity-70" : "bg-white bg-opacity-80"}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <img 
              src="/logo.png" 
              alt="DevExy Logo" 
              className="w-10 h-10 rounded-xl"
            />
            <span className={`ml-2 text-xl font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}>DevExy</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <div className={`hidden md:flex space-x-1 ${darkMode ? "bg-gray-800 bg-opacity-70" : "bg-gray-100"} rounded-lg p-1`}>
              {["dashboard", "diagram", "about", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveNav(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeNav === item
                      ? darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800 shadow-sm"
                      : darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg text-sm ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1聞いたM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                <p className="text-sm font-medium">Welcome, {username}</p>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm1-3a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        {renderContent()}
      </main>
    </div>
  );
}