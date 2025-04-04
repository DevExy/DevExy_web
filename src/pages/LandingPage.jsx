import React from 'react';
import { ArrowRight, Check, Code, Terminal, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-black text-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-900 shadow-md">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex justify-center items-center h-full">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="h-7 w-7" />
                <span className="text-xl font-bold text-green-400">DevExy</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-white">Features</a>
              <a href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</a>
              <a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a>
              <a href="#contact" className="text-gray-400 hover:text-white">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-2sm text-green-400 font-bold bg-gray-800 hover:bg-green-300 hover:text-gray-900 px-3 py-2 rounded-md">
                Sign In
              </button>
              <button className="text-2sm text-green-400 font-bold bg-gray-800 hover:bg-green-300 hover:text-gray-900 px-3 py-2 rounded-md">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Streamline Your Development
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-400">
              A powerful platform for developers to test, manage, and conquer requirements with ease.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button className="inline-flex items-center px-6 py-3 rounded-md text-white bg-gray-700 hover:bg-gray-600">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="inline-flex items-center px-6 py-3 rounded-md text-white bg-gray-800 hover:bg-gray-700">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-gray-900">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Tools for Dev Mastery</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              Everything you need to test and manage your project requirements efficiently.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8 shadow-lg">
                <div className="-mt-6">
                  <span className="inline-flex items-center justify-center p-3 bg-gray-700 rounded-md shadow-md">
                    <Zap className="h-6 w-6 text-white" />
                  </span>
                  <h3 className="mt-8 text-lg font-medium text-white">Blazing Fast Testing</h3>
                  <p className="mt-5 text-base text-gray-400">
                    Run tests at lightning speed with optimized workflows.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8 shadow-lg">
                <div className="-mt-6">
                  <span className="inline-flex items-center justify-center p-3 bg-gray-700 rounded-md shadow-md">
                    <Code className="h-6 w-6 text-white" />
                  </span>
                  <h3 className="mt-8 text-lg font-medium text-white">Code-Centric</h3>
                  <p className="mt-5 text-base text-gray-400">
                    Built by developers, for developers—manage code with precision.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-800 rounded-lg px-6 pb-8 shadow-lg">
                <div className="-mt-6">
                  <span className="inline-flex items-center justify-center p-3 bg-gray-700 rounded-md shadow-md">
                    <Terminal className="h-6 w-6 text-white" />
                  </span>
                  <h3 className="mt-8 text-lg font-medium text-white">CLI Integration</h3>
                  <p className="mt-5 text-base text-gray-400">
                    Seamless command-line tools for ultimate control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-16 bg-black">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Loved by Developers</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              Hear from devs who've leveled up their workflow.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="text-gray-300 italic">
                "DevExy made testing a breeze. My team's productivity is through the roof."
              </p>
              <div className="mt-4 flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">Jane Doe</h3>
                  <p className="text-sm text-gray-400">Senior Dev, CodeZap</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="text-gray-300 italic">
                "Managing requirements used to be a nightmare. Now it's my favorite part."
              </p>
              <div className="mt-4 flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-white font-bold">JS</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-white">John Smith</h3>
                  <p className="text-sm text-gray-400">Lead Engineer, DevPeak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16 bg-gray-900">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Pricing for Every Dev</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              Pick a plan that suits your coding needs.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-gray-700 rounded-lg shadow-md divide-y divide-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white">Solo</h3>
                <p className="mt-4 text-sm text-gray-400">For indie devs and small projects.</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-white">$19</span>
                  <span className="text-base font-medium text-gray-400">/mo</span>
                </p>
                <button className="mt-8 block w-full bg-gray-700 text-white rounded-md py-2 text-sm font-semibold hover:bg-gray-600">
                  Get Started
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-white">What's included:</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">Basic testing tools</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">1 user</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">Email support</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border border-gray-700 rounded-lg shadow-md divide-y divide-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white">Team</h3>
                <p className="mt-4 text-sm text-gray-400">For collaborative dev teams.</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-white">$79</span>
                  <span className="text-base font-medium text-gray-400">/mo</span>
                </p>
                <button className="mt-8 block w-full bg-gray-700 text-white rounded-md py-2 text-sm font-semibold hover:bg-gray-600">
                  Get Started
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-white">What's included:</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">Advanced testing suite</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">10 users</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">Priority support</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">CLI access</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border border-gray-700 rounded-lg shadow-md divide-y divide-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-medium text-white">Enterprise</h3>
                <p className="mt-4 text-sm text-gray-400">For large-scale dev operations.</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-white">$249</span>
                  <span className="text-base font-medium text-gray-400">/mo</span>
                </p>
                <button className="mt-8 block w-full bg-gray-700 text-white rounded-md py-2 text-sm font-semibold hover:bg-gray-600">
                  Contact Sales
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-white">What's included:</h4>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">Full testing suite</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">Unlimited users</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">Dedicated support</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-white" />
                    <p className="ml-3 text-base text-gray-400">Custom API access</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 bg-black">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Let's Code Together</h2>
            <p className="mt-4 text-lg text-gray-400">
              Got questions or ideas? Reach out—we're all ears.
            </p>
          </div>

          <div className="mt-12 bg-gray-800 p-8 rounded-lg shadow-lg">
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="mt-1 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  className="mt-1 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center items-center h-full">
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="h-7 w-7" />
                <span className="text-xl font-bold text-gray-400">DevExy</span>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-400">
                © {new Date().getFullYear()} DevExy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;