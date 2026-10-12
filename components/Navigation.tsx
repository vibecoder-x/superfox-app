'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { FaBars, FaTimes, FaRocket, FaBook, FaGamepad, FaHeart, FaUserFriends } from 'react-icons/fa';

interface NavigationProps {
  onNavigate?: (section: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: <FaRocket />, color: 'from-blue-400 to-blue-500' },
  { id: 'learning', label: 'Learning World', icon: <FaRocket />, color: 'from-green-400 to-green-500' },
  { id: 'stories', label: 'Stories', icon: <FaBook />, color: 'from-purple-400 to-purple-500' },
  { id: 'games', label: 'Mini Games', icon: <FaGamepad />, color: 'from-orange-400 to-orange-500' },
  { id: 'about', label: 'About Superfox', icon: <FaHeart />, color: 'from-pink-400 to-pink-500' },
  { id: 'parent', label: 'Parent Zone', icon: <FaUserFriends />, color: 'from-indigo-400 to-indigo-500' },
];

export default function Navigation({ onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pendingNavigation = useRef<(() => void) | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const trigger = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // The full-screen menu is modal: prevent keyboard and pointer access behind it.
    const siblings = Array.from(menu.parentElement?.children ?? [])
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== menu)
      .map(element => ({ element, inert: element.inert }));
    siblings.forEach(({ element }) => { element.inert = true; });
    menu.querySelector<HTMLButtonElement>('button')?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMenuOpen(false);
      }
      if (event.key !== 'Tab') return;
      const controls = Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const handleResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      siblings.forEach(({ element, inert }) => { element.inert = inert; });
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      const navigate = pendingNavigation.current;
      pendingNavigation.current = null;
      if (navigate) navigate();
      else trigger?.focus();
    };
  }, [isMenuOpen]);

  const handleMenuClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const element = document.getElementById(sectionId);
    if (element) {
      event.preventDefault();
      const navigate = () => {
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
        element.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' });
        window.history.replaceState(null, '', `#${sectionId}`);
      };
      if (isMenuOpen) {
        // Focus can move only after the modal's background inert state is restored.
        pendingNavigation.current = navigate;
        setIsMenuOpen(false);
      } else {
        navigate();
      }
    } else {
      setIsMenuOpen(false);
    }
    onNavigate?.(sectionId);
  };

  return (
    <>
      <motion.nav
        aria-label="Main navigation"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 shadow-xl z-50 border-b-4 border-superfox-orange"
      >
        <div className="container mx-auto px-4 xl:px-6 py-3">
          <div className="flex items-center justify-between lg:justify-center lg:gap-4 xl:gap-8">
            <motion.a
              href="#home"
              aria-label="Superfox home"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-2xl px-3 py-2 shadow-lg bg-white shrink-0"
              onClick={event => handleMenuClick(event, 'home')}
            >
              <div className="relative w-28 h-12 xl:w-36 xl:h-14">
                <Image src="/images/menulogo.png" alt="Superfox" fill className="object-contain" priority />
              </div>
            </motion.a>

            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              {menuItems.slice(1).map((item, index) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={event => handleMenuClick(event, item.id)}
                  className={`relative flex flex-col items-center gap-1 px-3 xl:px-4 py-2 rounded-2xl bg-gradient-to-br ${item.color} text-slate-950 font-bold shadow-lg hover:shadow-2xl transition-all duration-300 group`}
                >
                  <span aria-hidden="true" className="text-2xl text-white">{item.icon}</span>
                  <span className="text-xs baloo whitespace-nowrap">{item.label}</span>
                  <motion.span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 text-yellow-300 opacity-0 group-hover:opacity-100"
                    animate={reduceMotion ? undefined : { rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >✨</motion.span>
                </motion.a>
              ))}
            </div>

            <motion.button
              ref={menuButtonRef}
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-haspopup="dialog"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden bg-gradient-to-r from-superfox-orange to-yellow-400 text-slate-950 p-3 rounded-2xl shadow-xl min-h-12 min-w-12"
            >
              <FaBars aria-hidden="true" className="text-2xl" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-navigation-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 z-[60] lg:hidden overflow-y-auto overscroll-contain"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col items-center min-h-full relative">
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsMenuOpen(false)}
                className="self-end bg-white text-gray-800 p-3 rounded-2xl shadow-xl min-h-12 min-w-12"
              ><FaTimes aria-hidden="true" className="text-2xl" /></button>
              <div className="mb-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-2">
                  <Image src="/images/superfox.png" alt="" fill className="object-contain drop-shadow-2xl" />
                </div>
                <h2 id="mobile-navigation-title" className="text-4xl font-bold text-slate-950 baloo">Let&apos;s Explore!</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={event => handleMenuClick(event, item.id)}
                    className={`bg-gradient-to-br ${item.color} text-slate-950 rounded-3xl px-6 py-4 shadow-xl flex items-center justify-center gap-4 min-h-20`}
                  >
                    <span aria-hidden="true" className="text-3xl text-white">{item.icon}</span>
                    <span className="text-xl font-bold baloo">{item.label}</span>
                  </motion.a>
                ))}
              </div>
              <motion.div
                aria-hidden="true"
                animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="mt-6 text-5xl"
              >🦊</motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div aria-hidden="true" className="h-24" />
    </>
  );
}
