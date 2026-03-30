/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, BookOpen, Gamepad2 } from 'lucide-react';
import { content, Language } from './data';
import { playSound } from './sounds';
import LearnView from './components/LearnView';
import QuizView from './components/QuizView';
import LegalView from './components/LegalView';

type ViewState = 'menu' | 'learn' | 'quiz' | 'impressum' | 'datenschutz' | 'nutzungsbedingungen';

export default function App() {
  const [view, setView] = useState<ViewState>('menu');
  const [lang, setLang] = useState<Language>('de');

  const t = content[lang];

  const navigate = (newView: ViewState) => {
    playSound('click');
    setView(newView);
  };

  const toggleLang = () => {
    playSound('pop');
    setLang(lang === 'de' ? 'en' : 'de');
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-sky-300 via-blue-300 to-indigo-400 font-sans text-slate-800 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="px-4 py-2 flex justify-between items-center relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('menu')}
          className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-2 rounded-full font-bold text-white shadow-sm"
        >
          <Globe className="w-6 h-6" />
          <span className="hidden sm:inline">{t.title}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLang}
          className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-full font-bold text-white shadow-sm flex items-center gap-2"
        >
          <span>{lang === 'de' ? 'DE 🌐 EN' : 'EN 🌐 DE'}</span>
        </motion.button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex items-start justify-center p-2 sm:p-4">
        <AnimatePresence mode="wait">
          {view === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="text-8xl mb-6 inline-block"
              >
                🌍
              </motion.div>
              <h1 className="text-4xl font-extrabold text-indigo-600 mb-2 tracking-tight">
                {t.title}
              </h1>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                {t.subtitle}
              </p>

              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('learn')}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg shadow-green-200"
                >
                  <BookOpen className="w-7 h-7" />
                  {t.learnBtn}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('quiz')}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg shadow-purple-200"
                >
                  <Gamepad2 className="w-7 h-7" />
                  {t.quizBtn}
                </motion.button>
              </div>
            </motion.div>
          )}

          {view === 'learn' && <LearnView key="learn" lang={lang} onBack={() => navigate('menu')} />}
          {view === 'quiz' && <QuizView key="quiz" lang={lang} onBack={() => navigate('menu')} />}
          
          {(view === 'impressum' || view === 'datenschutz' || view === 'nutzungsbedingungen') && (
            <LegalView key={view} lang={lang} page={view} onBack={() => navigate('menu')} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="px-4 py-2 text-center text-white/80 text-sm font-medium relative z-10">
        <div className="flex justify-center gap-4 mb-2">
          <button onClick={() => navigate('impressum')} className="hover:text-white transition-colors">
            {t.legal.impressum.title}
          </button>
          <span>|</span>
          <button onClick={() => navigate('datenschutz')} className="hover:text-white transition-colors">
            {t.legal.datenschutz.title}
          </button>
          <span>|</span>
          <button onClick={() => navigate('nutzungsbedingungen')} className="hover:text-white transition-colors">
            {t.legal.nutzungsbedingungen.title}
          </button>
        </div>
        <p>&copy; 2026 Dieter Balmer</p>
      </footer>
    </div>
  );
}
