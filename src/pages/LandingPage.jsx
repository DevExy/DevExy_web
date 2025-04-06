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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const navbarVariants = {
    transparent: { backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(10px)" },
    solid: { backgroundColor: "rgb(0, 0, 0)" }
  };

  // Enhanced particle system
  const ParticleField = () => {
    const particles = Array(50).fill().map((_, index) => {
      const size = Math.random() * 5 + 2;
      const depth = Math.random();
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = 20 + Math.random() * 40;
      const delay = Math.random() * 5;

      return (
        <motion.div
          key={index}
          className="absolute rounded-full bg-green-500"
          style={{
            width: size,
            height: size,
            x: `${x}%`,
            y: `${y}%`,
            opacity: 0.2 + depth * 0.4,
            filter: `blur(${(1 - depth) * 3}px)`,
            zIndex: Math.floor(depth * 10)
          }}
          animate={{
            x: [`${x}%`, `${x + (Math.random() * 15 - 7)}%`],
            y: [`${y}%`, `${y + (Math.random() * 15 - 7)}%`],
            opacity: [0.2 + depth * 0.4, 0.4 + depth * 0.4, 0.2 + depth * 0.4],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration, ease: "easeInOut", repeat: Infinity, delay, repeatType: "reverse" }}
        />
      );
    });
    return <div className="absolute inset-0 overflow-hidden">{particles}</div>;
  };

  // Floating code snippets
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
            className="absolute text-green-400/20 font-mono text-base"
            style={{
              top: `${20 + idx * 25}%`,
              left: idx % 2 === 0 ? '10%' : '75%',
              transform: `rotate(${idx % 2 === 0 ? -5 : 5}deg)`
            }}
            animate={{ opacity: [0.1, 0.3, 0.1], x: [0, idx % 2 === 0 ? 15 : -15, 0] }}
            transition={{ duration: 12 + idx * 2, ease: "easeInOut", repeat: Infinity, delay: idx * 3 }}
          >
            {snippet}
          </motion.div>
        ))}
      </div>
    );
  };

  // Light beam effect
  const LightBeams = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-full h-full opacity-15 bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.4),transparent_70%)]"
        animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.03, 1] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );

  // Navigation handlers
  const handleSignIn = () => navigate("/login");
  const handleSignUp = () => navigate("/register");

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <motion.nav
        className="fixed w-full z-50 shadow-lg"
        initial="transparent"
        animate={scrollY > 50 ? "solid" : "transparent"}
        variants={navbarVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <motion.img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-8"
                whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
              />
              <motion.span
                className="text-2xl font-bold text-green-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                DevExy
              </motion.span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Features', 'Testimonials'].map((item, index) => (
                <motion.a
                  key={item}
                  href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-green-400 relative"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
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
                className="text-sm font-medium text-green-400 bg-black border border-green-400 px-4 py-2 rounded-md"
                whileHover={{ scale: 1.05, backgroundColor: "#16a34a", color: "white" }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={handleSignUp}
                className="text-sm font-medium text-black bg-green-400 px-4 py-2 rounded-md"
                whileHover={{ scale: 1.05, backgroundColor: "#22c55e" }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div ref={heroRef} className="min-h-screen flex items-center bg-black relative overflow-hidden">
        <LightBeams />
        <ParticleField />
        <CodeSnippets />

        <motion.div style={{ y, opacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            className="text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-light text-white tracking-wide mt-10"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Streamline Your <br />
              Development
              <motion.span
                className="absolute -inset-10 bg-green-500/10 rounded-full filter blur-3xl z-0"
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
              />
            </motion.h1>
            <motion.p
              className="mt-6 max-w-2xl text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Empowering developers with tools to test, manage, and excel.
            </motion.p>
            <motion.div
              className="mt-10 flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                onClick={handleSignUp}
                className="px-6 py-3 rounded-md text-black bg-green-400 font-medium"
                whileHover={{ scale: 1.05, backgroundColor: "#22c55e" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5 inline" />
              </motion.button>
              <motion.button
                className="px-6 py-3 rounded-md text-green-400 bg-black border border-green-400 font-medium"
                whileHover={{ scale: 1.05, backgroundColor: "#16a34a", color: "white" }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Code Panel */}
        <motion.div
          className="hidden lg:block absolute right-16 top-30 z-10 mr-20" 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="w-[576px] h-[432px] rounded-lg bg-black border border-green-400/30 p-6 font-mono text-md text-green-400 shadow-lg overflow-hidden">
            <div className="flex items-center mb-4 space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-400/40"></div>
            </div>
            <motion.div
              className="relative"
              initial={{ y: 0 }}
              animate={{ y: -120 }} // Adjusted for larger height and content
              transition={{ duration: 20, repeat: Infinity, repeatType: "loop" }}
            >
              <p><span className="text-green-300">import</span> DevExy <span className="text-green-300">from</span> <span className="text-green-500">'devExy'</span>;</p>
              <p> </p>
              <p><span className="text-green-300">const</span> test = <span className="text-green-300">new</span> DevExy.<span className="text-green-500">Test</span>();</p>
              <p> </p>
              <p><span className="text-green-300">async function</span> <span className="text-green-500">runTests</span>() {`{`}</p>
              <p>  <span className="text-green-300">await</span> test.configure();</p>
              <p>  <span className="text-green-300">const</span> results = <span className="text-green-300">await</span> test.run();</p>
              <p>  <span className="text-green-300">return</span> results.optimize();</p>
              <p>{`}`}</p>
              <p> </p>
              <p>runTests().then(<span className="text-green-500">console</span>.log);</p>
              <p> </p>
              <p><span className="text-gray-400">// Output: Optimized execution!</span></p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-white">Developer Tools Redefined</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
              Precision-engineered solutions for modern development workflows.
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
              { icon: <Zap className="h-6 w-6 text-green-400" />, title: "TestLab", description: "Compact suite for Unit, Integration, and Stress testing workflows." },
              { icon: <Terminal className="h-6 w-6 text-green-400" />, title: "ReqTrack", description: "Tracks evolving Requirements, Stakeholder Inputs, and Project Goals effectively." },
              { icon: <Code className="h-6 w-6 text-green-400" />, title: "Diagram Mastery", description: "Generates Architecture, Workflow, and System diagrams for your project" },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <div className="bg-black border border-green-400/20 rounded-lg p-6 shadow-lg hover:border-green-400 transition-colors">
                  <motion.span className="inline-flex items-center justify-center p-3 bg-green-400/10 rounded-md">
                    {feature.icon}
                  </motion.span>
                  <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-20 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-white">Trusted by Professionals</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
              Real feedback from developers who’ve transformed their workflow.
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
              { quote: "DevExy turned testing into a superpower for my team.", name: "Jane Doe", title: "Senior Dev, CodeZap", initials: "JD" },
              { quote: "Requirement management has never been this smooth.", name: "John Smith", title: "Lead Engineer, DevPeak", initials: "JS" }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-black border border-green-400/20 rounded-lg p-6 shadow-lg"
                variants={fadeIn}
              >
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-400 flex items-center justify-center">
                    <span className="text-black font-bold">{testimonial.initials}</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                  <Check className="ml-auto h-5 w-5 text-green-400" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-green-400/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <a key={social} href="#" className="text-gray-300 hover:text-green-400">
                  {social}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            © 2025 DevExy, Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;