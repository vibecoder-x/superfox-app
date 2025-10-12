'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-superfox-blue to-superfox-purple text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src="/images/LOGO.png"
                alt="Superfox Logo"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold mb-2 baloo">Superfox.net</h3>
            <p className="text-white/80">
              Making learning fun and exciting for kids everywhere!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4 baloo">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-white/80 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#learning" className="text-white/80 hover:text-white transition-colors">
                  Learning World
                </a>
              </li>
              <li>
                <a href="#stories" className="text-white/80 hover:text-white transition-colors">
                  Stories
                </a>
              </li>
              <li>
                <a href="#games" className="text-white/80 hover:text-white transition-colors">
                  Games
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/80 hover:text-white transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* For Parents */}
          <div>
            <h4 className="text-xl font-bold mb-4 baloo">For Parents</h4>
            <ul className="space-y-2">
              <li>
                <a href="#parent-zone" className="text-white/80 hover:text-white transition-colors">
                  Parent Zone
                </a>
              </li>
              <li>
                <a href="#safety" className="text-white/80 hover:text-white transition-colors">
                  Safety & Privacy
                </a>
              </li>
              <li>
                <a href="#progress" className="text-white/80 hover:text-white transition-colors">
                  Track Progress
                </a>
              </li>
              <li>
                <a href="#faq" className="text-white/80 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#support" className="text-white/80 hover:text-white transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-bold mb-4 baloo">Stay Connected</h4>
            <p className="text-white/80 mb-4">
              Get updates on new stories and activities!
            </p>
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-superfox-orange hover:bg-superfox-yellow text-white p-2 rounded-full transition-colors">
                <FaEnvelope className="text-xl" />
              </button>
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
              >
                <FaFacebook className="text-xl" />
              </motion.a>
              <motion.a
                href="https://x.com/superfoxnet"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
              >
                <FaTwitter className="text-xl" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
              >
                <FaInstagram className="text-xl" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
              >
                <FaYoutube className="text-xl" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/80 mb-2">
            © {currentYear} Superfox.net. All rights reserved. Made with{' '}
            <FaHeart className="inline text-red-400" /> for curious minds.
          </p>
          <div className="flex justify-center gap-6 text-sm text-white/60">
            <a href="#privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
