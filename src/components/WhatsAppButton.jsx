import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/27663492811?text=Hi%20Brooklyn%2C%20I%27d%20like%20to%20inquire%20about%20your%20photography%20services.%20Could%20you%20tell%20me%20more%3F"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors duration-300"
      aria-label="Contact on WhatsApp"
      title="Message us on WhatsApp"
    >
      <MessageCircle size={24} className="md:w-7 md:h-7" />
    </motion.a>
  );
}