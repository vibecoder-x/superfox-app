'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-superfox-blue to-superfox-purple text-slate-950">
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
            <p>
              Making learning fun and exciting for kids everywhere!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4 baloo">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="inline-block min-h-12 py-3 underline hover:no-underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#learning" className="inline-block min-h-12 py-3 underline hover:no-underline">
                  Learning World
                </a>
              </li>
              <li>
                <a href="#stories" className="inline-block min-h-12 py-3 underline hover:no-underline">
                  Stories
                </a>
              </li>
              <li>
                <a href="#games" className="inline-block min-h-12 py-3 underline hover:no-underline">
                  Games
                </a>
              </li>
              <li>
                <a href="#about" className="inline-block min-h-12 py-3 underline hover:no-underline">
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
                <a href="#parent" className="inline-block min-h-12 py-3 underline hover:no-underline">
                  Parent Zone
                </a>
              </li>
              <li>
                <a href="#safety-privacy" className="inline-block min-h-12 py-3 underline hover:no-underline">
                  Safety & Privacy
                </a>
              </li>
              <li>
                <a href="#progress" className="inline-block min-h-12 py-3 underline hover:no-underline">
                  Track Progress
                </a>
              </li>
              <li>
                <a href="#faq" className="inline-block min-h-12 py-3 underline hover:no-underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#support" className="inline-block min-h-12 py-3 underline hover:no-underline">
                  Support status
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-bold mb-4 baloo">Stay Connected</h4>
            <p className="mb-4">
              Newsletter — Coming Soon. Email signup is not available yet.
            </p>

            {/* Social Media */}
            <div className="space-y-3">
              <motion.a
                href="https://x.com/superfoxnet"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 bg-white/90 hover:bg-white p-3 rounded-2xl transition-colors min-h-12"
              >
                <FaTwitter aria-hidden="true" className="text-xl shrink-0" />
                <span>Parents: Superfox on X <span className="text-sm">(opens a new tab)</span></span>
              </motion.a>
              <p className="flex items-center gap-3"><FaFacebook aria-hidden="true" /> Facebook — Coming Soon</p>
              <p className="flex items-center gap-3"><FaInstagram aria-hidden="true" /> Instagram — Coming Soon</p>
              <p className="flex items-center gap-3"><FaYoutube aria-hidden="true" /> YouTube — Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="mb-2">
            © {currentYear} Superfox.net. All rights reserved. Made with{' '}
            <FaHeart aria-label="love" className="inline text-red-800" /> for curious minds.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
            <span>Privacy Policy — Coming Soon</span>
            <span>Terms of Service — Coming Soon</span>
            <span>Cookie Policy — Coming Soon</span>
          </div>
          <a href="#safety-privacy" className="inline-block min-h-12 py-3 underline mt-2">Read current safety &amp; privacy information</a>
        </div>
      </div>
    </footer>
  );
}
