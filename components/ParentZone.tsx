'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaShieldAlt, FaChartLine, FaClock, FaUserShield, FaCheckCircle } from 'react-icons/fa';

const parentFeatures = [
  {
    icon: <FaShieldAlt className="text-5xl" />,
    title: 'Learn Together',
    description: 'Explore the existing lessons with a parent or trusted adult. Open-ended AI chat is off by default.',
  },
  {
    icon: <FaChartLine className="text-5xl" />,
    title: 'Math Progress',
    description: 'Math lesson stars are saved in this browser when storage is available. An account dashboard is Coming Soon.',
  },
  {
    icon: <FaClock className="text-5xl" />,
    title: 'Screen Time Control',
    description: 'Coming Soon. For now, agree on breaks and learning time together; automatic limits are not available.',
  },
  {
    icon: <FaUserShield className="text-5xl" />,
    title: 'Privacy Awareness',
    description: 'Please avoid sharing personal details. Read the current storage and service information below.',
  },
];

const educationalBenefits = [
  'Read along with the available Superfox story',
  'Practice mathematical thinking and problem-solving',
  'Explore planets in the Space Explorer',
  'Create drawings and color pictures in Creative Studio',
  'Discuss friendship and kindness with a trusted adult',
  'Choose activities together to suit your child\'s needs',
];

export default function ParentZone() {
  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-superfox-blue mb-4 baloo">
            Parent Zone
          </h2>
          <p className="text-xl md:text-2xl text-gray-700">
            Information for parents about safety, learning, and progress
          </p>
        </motion.div>

        {/* Parent Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {parentFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-3xl p-8 shadow-xl text-center"
            >
              <div aria-hidden="true" className="text-superfox-orange mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 baloo">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Educational Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold text-gray-800 mb-6 baloo text-center">
              Educational Benefits
            </h3>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Superfox offers playful activities to practice learning skills.
              Explore together and choose the activities that suit your child.
            </p>
            <ul className="space-y-4">
              {educationalBenefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <FaCheckCircle aria-hidden="true" className="text-green-700 text-xl mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <section id="safety-privacy" aria-labelledby="safety-privacy-title" className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12 text-gray-700">
          <h3 id="safety-privacy-title" className="text-3xl font-bold text-gray-800 mb-6 baloo">Safety &amp; Privacy Today</h3>
          <div className="space-y-4 leading-relaxed">
            <p>Open-ended AI chat is disabled by default while child-safety checks and parental controls are developed. It must stay unavailable on the public site until those safeguards have been verified.</p>
            <p>Math progress and saved artwork use storage in this browser when available. Clearing browser data can erase them, and they do not sync between devices. This site currently has no accounts or verified parental-consent system.</p>
            <p>Hosting and font services may process connection information, such as an IP address. Please avoid entering names, contact details, passwords, or other identifying information in activities.</p>
            <p>Formal privacy, terms, and cookie policies are Coming Soon and require the owner&apos;s review. This information describes current behavior and is not a claim of legal compliance.</p>
          </div>
        </section>

        <section id="progress" aria-labelledby="parent-progress-title" className="bg-white rounded-3xl p-8 shadow-xl mb-12 text-center">
          <h3 id="parent-progress-title" className="text-3xl font-bold text-gray-800 mb-4 baloo">See Math Progress</h3>
          <p className="text-gray-700 mb-6">Use the same browser and device to view saved lesson stars. A parent dashboard and progress across devices are Coming Soon.</p>
          <Link href="/math-adventures" className="inline-block bg-superfox-blue text-slate-950 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:bg-blue-300">Open Math Adventures</Link>
        </section>

        <section id="faq" aria-labelledby="parent-faq-title" className="max-w-3xl mx-auto mb-12">
          <h3 id="parent-faq-title" className="text-3xl font-bold text-gray-800 mb-6 text-center baloo">Parent Questions</h3>
          <details className="bg-white rounded-2xl p-4 shadow mb-4">
            <summary className="min-h-12 py-3 font-bold text-gray-800 cursor-pointer">Does progress follow us to another device?</summary>
            <p className="text-gray-700 py-3">No. Math stars and artwork are stored locally in the current browser. Account syncing is Coming Soon.</p>
          </details>
          <details className="bg-white rounded-2xl p-4 shadow mb-4">
            <summary className="min-h-12 py-3 font-bold text-gray-800 cursor-pointer">Can I set automatic screen-time limits?</summary>
            <p className="text-gray-700 py-3">Automatic limits are Coming Soon. A trusted adult can help choose activities and decide when to take a break.</p>
          </details>
          <details className="bg-white rounded-2xl p-4 shadow">
            <summary className="min-h-12 py-3 font-bold text-gray-800 cursor-pointer">Which reading activities can we try?</summary>
            <p className="text-gray-700 py-3">Reading World lessons are Coming Soon. Visit the <a href="#stories" className="underline font-bold text-blue-800">Story Library</a> for the available story.</p>
          </details>
        </section>

        {/* Support is clearly unavailable until a real contact channel exists. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          id="support"
          className="text-center"
        >
          <h3 className="text-4xl font-bold text-gray-800 mb-6 baloo">
            Have Questions?
          </h3>
          <p className="text-xl text-gray-700 mb-8">
            A support contact form is Coming Soon. Please ask a trusted adult if you need help with an activity.
          </p>
          <span className="inline-block bg-gradient-to-r from-superfox-orange to-superfox-blue text-slate-950 font-bold py-4 px-8 rounded-full text-xl shadow-lg">Support — Coming Soon</span>
        </motion.div>
      </div>
    </section>
  );
}
