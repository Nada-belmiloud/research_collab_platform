import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            className={`relative bg-white w-full ${maxWidth} rounded-2xl shadow-2xl border border-white/20 overflow-hidden`}
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b border-brand-navy/5">
              <h3 className="text-lg font-bold text-brand-navy tracking-tight">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-brand-navy/5 transition-all group"
              >
                <X className="w-5 h-5 text-brand-navy/40 group-hover:text-brand-navy" />
              </button>
            </div>
            <div className="p-6 pt-6 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
