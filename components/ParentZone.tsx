'use client';

import { motion } from 'framer-motion';
import { FaShieldAlt, FaChartLine, FaClock, FaUserShield, FaCheckCircle } from 'react-icons/fa';

const parentFeatures = [
  {
    icon: <FaShieldAlt className="text-5xl" />,
    title: 'Safe & Secure',
    description: 'Kid-safe content with no ads or inappropriate material',
  },
  {
    icon: <FaChartLine className="text-5xl" />,
    title: 'Track Progress',
    description: 'Monitor your child\'s learning journey and achievements',
  },
  {
    icon: <FaClock className="text-5xl" />,
    title: 'Screen Time Control',
    description: 'Set healthy limits and manage usage time',
  },
  {
    icon: <FaUserShield className="text-5xl" />,
    title: 'Privacy First',
    description: 'Your child\'s data is protected and never shared',
  },
];

const educationalBenefits = [
  'Builds reading comprehension and literacy skills',
  'Develops mathematical thinking and problem-solving',
  'Encourages curiosity about science and nature',
  'Promotes creativity through art and storytelling',
  'Teaches social-emotional skills and empathy',
  'Supports age-appropriate cognitive development',
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
              <div className="text-superfox-orange mb-4 flex justify-center">
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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Benefits List */}
            <div>
              <h3 className="text-4xl font-bold text-gray-800 mb-6 baloo">
                Educational Benefits
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Superfox.net is designed by educators to provide age-appropriate,
                engaging content that supports your child&apos;s development.
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
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right side - Stats */}
            <div className="bg-gradient-to-br from-superfox-blue to-superfox-purple rounded-3xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-8 baloo text-center">
                Platform Statistics
              </h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">500+</div>
                  <div className="text-xl">Learning Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">200+</div>
                  <div className="text-xl">Interactive Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">50+</div>
                  <div className="text-xl">Educational Games</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">100%</div>
                  <div className="text-xl">Ad-Free & Safe</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-4xl font-bold text-gray-800 mb-6 baloo">
            Have Questions?
          </h3>
          <p className="text-xl text-gray-700 mb-8">
            We&apos;re here to help! Contact us anytime for support.
          </p>
          <button className="bg-gradient-to-r from-superfox-orange to-superfox-blue text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
}
