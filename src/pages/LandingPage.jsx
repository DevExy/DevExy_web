import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Code, Terminal, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Track scroll position for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const navbarVariants = {
    transparent: { backgroundColor: "rgba(17, 24, 39, 0.6)", backdropFilter: "blur(8px)" },
    solid: { backgroundColor: "rgb(17, 24, 39)" }
  };

  // Enhanced particle system
  const ParticleField = () => {
    const particles = Array(40).fill().map((_, index) => {
      const size = Math.random() * 4 + 1;
      const depth = Math.random();
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = 15 + Math.random() * 30;
      const delay = Math.random() * 5;
      
      return (
        <motion.div
          key={index}
          className="absolute rounded-full bg-gradient-to-r from-green-400 to-green-500"
          style={{
            width: size,
            height: size,
            x: `${x}%`,
            y: `${y}%`,
            opacity: 0.1 + depth * 0.3,
            filter: `blur(${(1 - depth) * 2}px)`,
            zIndex: Math.floor(depth * 10)
          }}
          animate={{
            x: [`${x}%`, `${x + (Math.random() * 10 - 5)}%`],
            y: [`${y}%`, `${y + (Math.random() * 10 - 5)}%`],
            opacity: [0.1 + depth * 0.3, 0.3 + depth * 0.3, 0.1 + depth * 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay,
            repeatType: "reverse"
          }}
        />
      );
    });

    return <div className="absolute inset-0 overflow-hidden">{particles}</div>;
  };

  // Floating code snippets for background effect
  const CodeSnippets = () => {
    const snippets = [
      "function optimize() { return performance++ }",
      "const devTools = new DevExy();",
      "await test.run({ speed: 'blazing' });",
      "<DevExy onSuccess={() => celebrate()} />",
      "import { speed } from 'devExy';"
    ];

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {snippets.map((snippet, idx) => (
          <motion.div
            key={idx}
            className="absolute text-green-500/10 font-mono text-sm sm:text-base"
            style={{
              top: `${15 + idx * 20}%`,
              left: idx % 2 === 0 ? '5%' : '70%',
              transform: `rotate(${idx % 2 === 0 ? -5 : 5}deg)`
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.05, 0.2, 0.05],
              x: [0, idx % 2 === 0 ? 10 : -10, 0]
            }}
            transition={{
              duration: 10 + idx * 2,
              ease: "easeInOut",
              repeat: Infinity,
              delay: idx * 3
            }}
          >
            {snippet}
          </motion.div>
        ))}
      </div>
    );
  };

  // Light beam effect
  const LightBeams = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.3),transparent_70%)]"
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity
          }}
        />
        <motion.div 
          className="absolute w-1/2 h-screen right-0 opacity-5 bg-[radial-gradient(ellipse_at_center_right,rgba(74,222,128,0.4),transparent_70%)]"
          animate={{ 
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 2
          }}
        />
      </div>
    );
  };

  // Loading line effect for buttons
  const LoadingLine = () => (
    <motion.span 
      className="absolute bottom-0 left-0 h-0.5 bg-white/20"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />
  );

  // Handlers for navigation
  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="bg-black text-gray-100 overflow-hidden">
      {/* Navigation with animation */}
      <motion.nav 
        className="fixed w-full z-50 shadow-md"
        initial="transparent"
        animate={scrollY > 50 ? "solid" : "transparent"}
        variants={navbarVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex justify-center items-center h-full">
              <div className="flex items-center space-x-2">
                <motion.img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="h-7 w-7"
                  whileHover={{ 
                    rotate: 360, 
                    transition: { duration: 0.5 } 
                  }}
                />
                <motion.div className="relative">
                  <motion.span 
                    className="text-xl font-bold text-green-400 z-10 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    DevExy
                  </motion.span>
                  <motion.span 
                    className="absolute top-0 left-0 w-full h-full bg-green-500/20 filter blur-md rounded-full z-0"
                    animate={{ 
                      opacity: [0.5, 1, 0.5], 
                      scale: [0.9, 1.05, 0.9] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  />
                </motion.div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Testimonials', 'Pricing', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-white relative"
                  whileHover={{ 
                    scale: 1.05, 
                    color: "#fff",
                    transition: { duration: 0.2 }
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {item}
                  <motion.span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400" 
                    whileHover={{ width: "100%", transition: { duration: 0.2 } }}
                  />
                </motion.a>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={handleSignIn}
                className="text-2sm text-green-400 font-bold bg-gray-800 hover:bg-green-300 hover:text-gray-900 px-3 py-2 rounded-md relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "#86efac", 
                  color: "#111827",
                  boxShadow: "0 0 15px rgba(74, 222, 128, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Sign In
                <LoadingLine />
              </motion.button>
              <motion.button
                onClick={handleSignUp}
                className="text-2sm text-green-300 font-bold bg-gray-800 hover:bg-green-300 hover:text-gray-900 px-3 py-2 rounded-md relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "#86efac", 
                  color: "#111827",
                  boxShadow: "0 0 15px rgba(74, 222, 128, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Sign Up
                <LoadingLine />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with parallax effect */}
      <div 
        ref={heroRef}
        className="py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden"
      >
        {/* Enhanced animated background */}
        <LightBeams />
        <ParticleField />
        <CodeSnippets />

        {/* Animated grid lines */}
        <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`grid-col-${i}`}
              className="h-full w-px bg-green-900/10"
              style={{ left: `${(i + 1) * (100 / 6)}%` }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`grid-row-${i}`}
              className="w-full h-px bg-green-900/10"
              style={{ top: `${(i + 1) * 20}%` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          ))}
        </div>

        <motion.div style={{ y, opacity }} className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <motion.h1 
              className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.span 
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
                animate={{ 
                  backgroundPosition: ["0% center", "100% center", "0% center"],
                }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              >
                Streamline Your Development
              </motion.span>
              {/* Glow effect */}
              <motion.span 
                className="absolute -inset-10 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-lg filter blur-3xl z-0"
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.95, 1.05, 0.95]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
            </motion.h1>
            <motion.p 
              className="mt-6 max-w-2xl mx-auto text-xl text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              A powerful platform for developers to test, manage, and conquer requirements with ease.
            </motion.p>
            <motion.div 
              className="mt-10 flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                onClick={handleSignUp}
                className="inline-flex items-center px-6 py-3 rounded-md text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 relative overflow-hidden group"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 20px rgba(74, 222, 128, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Get Started <ArrowRight className="ml-2 h-5 w-5 inline" /></span>
                {/* Animated gradient border */}
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-700 opacity-0 group-hover:opacity-100"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 3,
                    ease: "linear",
                    repeat: Infinity
                  }}
                />
                {/* Light pulse effect */}
                <motion.span 
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </motion.button>
              <motion.button 
                className="inline-flex items-center px-6 py-3 rounded-md text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Learn More</span>
                {/* Subtle animated border */}
                <motion.span 
                  className="absolute inset-0 border border-green-500/30 rounded-md opacity-0 group-hover:opacity-100"
                  animate={{ 
                    scale: [0.7, 1.1, 0.7],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Code highlight effect */}
      <div className="hidden lg:block absolute right-10 top-40 z-10 transform -rotate-6">
        <motion.div 
          className="w-64 h-48 rounded-lg bg-gray-800/50 border border-green-500/20 p-4 font-mono text-xs text-green-400 overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="flex items-center mb-2 space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: -100 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "loop" }}
          >
            <p><span className="text-blue-400">import</span> DevExy <span className="text-blue-400">from</span> <span className="text-green-300">'devExy'</span>;</p>
            <p>&nbsp;</p>
            <p><span className="text-purple-400">const</span> test = <span className="text-blue-400">new</span> DevExy.<span className="text-yellow-400">Test</span>();</p>
            <p>&nbsp;</p>
            <p><span className="text-purple-400">async function</span> <span className="text-yellow-400">runTests</span>() {`{`}</p>
            <p>&nbsp;&nbsp;<span className="text-blue-400">await</span> test.configure();</p>
            <p>&nbsp;&nbsp;<span className="text-blue-400">const</span> results = <span className="text-blue-400">await</span> test.run();</p>
            <p>&nbsp;&nbsp;<span className="text-blue-400">return</span> results.optimize();</p>
            <p>{`}`}</p>
            <p>&nbsp;</p>
            <p>runTests().then(<span className="text-yellow-400">console</span>.log);</p>
            <p>&nbsp;</p>
            <p><span className="text-gray-500">// Output: All tests passing!</span></p>
            <p>&nbsp;</p>
            <p><span className="text-blue-400">import</span> {`{`} optimize {`}`} <span className="text-blue-400">from</span> <span className="text-green-300">'devExy/tools'</span>;</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section with staggered animation */}
      <div id="features" className="py-16 bg-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(74,222,128,0.05),transparent_50%)]"></div>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-extrabold text-white">Tools for Dev Mastery</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              Everything you need to test and manage your project requirements efficiently.
            </p>
          </motion.div>
          <motion.div 
  className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
>
  {[
    { 
      icon: <Zap className="h-5 w-5 text-white" />, 
      title: "Blazing Fast Testing", 
      description: "Run tests at lightning speed with optimized workflows."
    },
    { 
      icon: <Code className="h-5 w-5 text-white" />, 
      title: "Code-Centric", 
      description: "Built by developers, for developers—manage code with precision."
    },
    { 
      icon: <Terminal className="h-5 w-5 text-white" />, 
      title: "CLI Integration", 
      description: "Seamless command-line tools for ultimate control."
    }
  ].map((feature, index) => (
    <motion.div 
      key={index} 
      className="pt-8" // Increased from pt-6 to pt-8
      variants={fadeIn}
    >
      <motion.div 
        className="flow-root bg-gray-800 rounded-lg px-8 py-10 shadow-lg border border-gray-700 h-full relative overflow-hidden group" // Increased px-6 pb-8 to px-8 py-10
        whileHover={{ 
          y: -10, 
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.8)",
          borderColor: "rgba(74, 222, 128, 0.5)" 
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-transparent opacity-0 group-hover:opacity-100"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, rgba(74, 222, 128, 0.1), transparent 50%)",
              "radial-gradient(circle at 100% 100%, rgba(74, 222, 128, 0.1), transparent 50%)",
              "radial-gradient(circle at 0% 0%, rgba(74, 222, 128, 0.1), transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="-mt-8 relative z-10"> {/* Increased from -mt-6 to -mt-8 to match pt-8 */}
          <motion.span 
            className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-green-500 to-green-700 rounded-md shadow-md relative" // Increased from p-2 to p-3
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            {feature.icon}
            {/* Pulse effect */}
            <motion.span 
              className="absolute inset-0 rounded-md bg-white"
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: index
              }}
            />
          </motion.span>
          <h3 className="mt-10 text-lg font-medium text-white group-hover:text-green-300 transition-colors duration-300"> {/* Increased from mt-8 to mt-10 */}
            {feature.title}
          </h3>
          <p className="mt-6 text-base text-gray-400"> {/* Increased from mt-5 to mt-6 */}
            {feature.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  ))}
</motion.div>
        </div>
      </div>

      {/* Testimonials Section with fade in */}
      <div id="testimonials" className="py-16 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(74,222,128,0.05),transparent_70%)]"></div>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-extrabold text-white">Loved by Developers</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              Hear from devs who've leveled up their workflow.
            </p>
          </motion.div>

          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              { quote: "DevExy made testing a breeze. My team's productivity is through the roof.", name: "Jane Doe", title: "Senior Dev, CodeZap", initials: "JD" },
              { quote: "Managing requirements used to be a nightmare. Now it's my favorite part.", name: "John Smith", title: "Lead Engineer, DevPeak", initials: "JS" }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 relative overflow-hidden group"
                variants={fadeIn}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.8)",
                  borderColor: "rgba(74, 222, 128, 0.3)" 
                }}
              >
                {/* Quote marks */}
                <motion.div 
                  className="absolute top-2 left-2 text-4xl text-green-500/10 font-serif"
                  animate={{ 
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index
                  }}
                >
                  "
                </motion.div>
                <motion.div 
                  className="absolute bottom-2 right-2 text-4xl text-green-500/10 font-serif"
                  animate={{ 
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index + 0.5
                  }}
                >
                  "
                </motion.div>
                {/* Subtle line animation */}
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100"
                  animate={{
                    left: ["-100%", "200%"]
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
                
                <motion.p 
                  className="text-gray-300 italic relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  "{testimonial.quote}"
                </motion.p>
                <div className="mt-4 flex items-center">
                  <motion.div 
                    className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center relative"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-white font-bold relative z-10">{testimonial.initials}</span>
                    {/* Pulse effect */}
                    <motion.span 
                      className="absolute inset-0 rounded-full bg-green-400 opacity-40"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0, 0.4]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror"
                      }}
                    />
                  </motion.div>
                  <div className="ml-3">
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                  <motion.div 
                    className="ml-auto"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <Check className="h-5 w-5 text-green-400" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16 bg-gray-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(74,222,128,0.05),transparent_70%)]"></div>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-extrabold text-white">Simple, Transparent Pricing</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              Choose the plan that works for your development needs.
            </p>
          </motion.div>

          <motion.div 
            className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              { 
                name: "Starter", 
                price: "$19", 
                description: "Perfect for individuals or small projects.",
                features: ["10 Test Projects", "Basic Analytics", "Community Support", "24h Response Time"]
              },
              { 
                name: "Pro", 
                price: "$49", 
                description: "For professional developers and growing teams.",
                features: ["Unlimited Projects", "Advanced Analytics", "Priority Support", "1h Response Time", "CI/CD Integration"]
              },
              { 
                name: "Enterprise", 
                price: "Custom", 
                description: "For large organizations with custom needs.",
                features: ["Unlimited Everything", "Custom Integrations", "Dedicated Support", "15min Response Time", "On-Premise Options"]
              }
            ].map((plan, index) => (
              <motion.div 
                key={index}
                className={`bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden relative ${
                  index === 1 ? "md:-mt-4 md:mb-4" : ""
                }`}
                variants={fadeIn}
                whileHover={{ 
                  scale: 1.03, 
                  borderColor: "rgba(74, 222, 128, 0.5)",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.8)",
                }}
              >
                {index === 1 && (
                  <div className="absolute top-0 inset-x-0 px-4 py-1 bg-green-500 text-center text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="ml-1 text-xl text-gray-400">/mo</span>}
                  </div>
                  <p className="mt-4 text-gray-400">{plan.description}</p>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                      >
                        <Check className="h-5 w-5 text-green-400 mr-2" />
                        <span className="text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div className="mt-8">
                    <motion.button
                      className={`w-full px-4 py-2 rounded-md font-medium ${
                        index === 1 
                          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      } relative overflow-hidden`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">Get Started</span>
                      {/* Subtle animation for primary button */}
                      {index === 1 && (
                        <motion.span 
                          className="absolute inset-0 bg-white opacity-0"
                          animate={{ 
                            opacity: [0, 0.1, 0],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                        />
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.03),transparent_70%)]"></div>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-extrabold text-white">Get in Touch</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              Have questions? We're here to help.
            </p>
          </motion.div>

          <motion.div 
            className="max-w-lg mx-auto bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated background effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-blue-900/5"
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(74, 222, 128, 0.05), transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(74, 222, 128, 0.05), transparent 50%)",
                  "radial-gradient(circle at 0% 0%, rgba(74, 222, 128, 0.05), transparent 50%)"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            
            <form className="space-y-4 relative z-10">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full border-gray-600 rounded-md bg-gray-700 text-white shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  placeholder="How can we help you?"
                />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border border-transparent rounded-md shadow-sm py-2 px-4 text-white font-medium relative overflow-hidden"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 15px rgba(74, 222, 128, 0.5)" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Send Message</span>
                {/* Animated element */}
                <motion.span 
                  className="absolute inset-0 bg-white opacity-0"
                  animate={{ 
                    opacity: [0, 0.1, 0],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <motion.img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 w-8"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              />
              <span className="ml-2 text-xl font-bold text-green-400">DevExy</span>
            </div>
            <div className="flex space-x-6">
              {['Github', 'Twitter', 'Discord', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-400 hover:text-white"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">&copy; 2024 DevExy, Inc. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;