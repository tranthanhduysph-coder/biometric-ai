
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

export const Footer: React.FC = () => {
  const { t } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12 py-8 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          
          {/* Developer Info */}
          <div className="text-slate-700 dark:text-slate-300 text-base">
            {t('devBy')} <span className="font-bold text-slate-900 dark:text-white">{t('devName')}</span>
            <span className="mx-2 text-slate-400">|</span>
            {t('emailLabel')}: <a href="mailto:ttduy@sgu.edu.vn" className="text-indigo-600 dark:text-indigo-400 hover:underline">ttduy@sgu.edu.vn</a>
          </div>

          {/* AI Warning & Disclaimer Link */}
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {t('aiWarning')} 
            <button 
              onClick={() => setIsModalOpen(true)}
              className="ml-1 text-sky-600 dark:text-sky-400 font-medium hover:underline focus:outline-none"
            >
              {t('viewDisclaimer')}
            </button>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-400 dark:text-slate-500 pt-4 uppercase tracking-widest font-semibold">
            {t('copyright')}
          </div>
        </div>
      </footer>

      {/* Disclaimer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 relative animate-fade-in-up border border-slate-200 dark:border-slate-700">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Modal Content */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('disclaimerTitle')}
              </h3>
              
              <div className="text-left bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {t('disclaimerContent')}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
