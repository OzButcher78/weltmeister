/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, BookOpen, Map, Gamepad2, Trophy } from 'lucide-react';
import { content, Language } from './data';
import { playSound } from './sounds';
import LearnView from './components/LearnView';
import QuizView from './components/QuizView';
import ContinentQuizView from './components/ContinentQuizView';
import LegalView from './components/LegalView';

type ViewState = 'menu' | 'learn' | 'continentQuiz' | 'quiz' | 'highscores' | 'impressum' | 'datenschutz' | 'nutzungsbedingungen';

const HIGHSCORE_KEY = 'weltMeisterHighscores';

interface HighscoreEntry {
  name: string;
  points: number;
  date: string;
}

function getHighscores(): HighscoreEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HIGHSCORE_KEY) || '[]');
  } catch {
    return [];
  }
}

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
    <div className="min-h-dvh bg-gradient-to-br from-sky-300 via-blue-300 to-indigo-400 font-sans text-slate-800 overflow-hidden flex flex-col safe-top">
      {/* Header */}
      <header className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 flex justify-between items-center relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('menu')}
          className="flex items-center gap-1.5 sm:gap-2 bg-white/30 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-white shadow-sm text-sm sm:text-base"
        >
          <Globe className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block" />
          <span className="hidden sm:inline">{t.title}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLang}
          className="bg-white/30 backdrop-blur-md px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-white shadow-sm flex items-center gap-1 sm:gap-2 text-xs sm:text-base"
        >
          <span>{lang === 'de' ? 'DE 🌐 EN' : 'EN 🌐 DE'}</span>
        </motion.button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative flex items-start justify-center px-2 pt-1 pb-2 sm:px-3 sm:pb-3 md:px-4 md:pb-4">
        <AnimatePresence mode="wait">
          {view === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 inline-block"
              >
                🌍
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-1.5 sm:mb-2 tracking-tight">
                {t.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 mb-5 sm:mb-8 font-medium">
                {t.subtitle}
              </p>

              <div className="flex flex-col gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('learn')}
                  className="flex items-center justify-center gap-2.5 sm:gap-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg sm:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg shadow-green-200 touch-manipulation"
                >
                  <BookOpen className="w-5 h-5 sm:w-7 sm:h-7" />
                  {t.learnBtn}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('continentQuiz')}
                  className="flex items-center justify-center gap-2.5 sm:gap-3 bg-gradient-to-r from-cyan-400 to-teal-500 text-white text-lg sm:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg shadow-cyan-200 touch-manipulation"
                >
                  <Map className="w-5 h-5 sm:w-7 sm:h-7" />
                  {t.continentQuizBtn}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('quiz')}
                  className="flex items-center justify-center gap-2.5 sm:gap-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-lg sm:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg shadow-purple-200 touch-manipulation"
                >
                  <Gamepad2 className="w-5 h-5 sm:w-7 sm:h-7" />
                  {t.quizBtn}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('highscores')}
                  className="flex items-center justify-center gap-2.5 sm:gap-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-lg sm:text-xl font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg shadow-amber-200 touch-manipulation"
                >
                  <Trophy className="w-5 h-5 sm:w-7 sm:h-7" />
                  {lang === 'de' ? 'Bestenliste' : 'Highscores'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {view === 'learn' && <LearnView key="learn" lang={lang} onBack={() => navigate('menu')} />}
          {view === 'continentQuiz' && <ContinentQuizView key="continentQuiz" lang={lang} onBack={() => navigate('menu')} />}
          {view === 'quiz' && <QuizView key="quiz" lang={lang} onBack={() => navigate('menu')} />}

          {view === 'highscores' && (
            <motion.div
              key="highscores"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 text-center"
            >
              <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                  {lang === 'de' ? 'Bestenliste' : 'Highscores'}
                </h2>
              </div>

              {(() => {
                const scores = getHighscores();
                return scores.length > 0 ? (
                  <div className="mb-4 sm:mb-6 rounded-2xl overflow-hidden border border-slate-200">
                    <table className="w-full text-sm sm:text-base">
                      <thead>
                        <tr className="bg-slate-100 text-xs sm:text-sm font-bold text-slate-600">
                          <th className="py-2 px-2 sm:py-2.5 sm:px-3 text-left">#</th>
                          <th className="py-2 px-2 sm:py-2.5 sm:px-3 text-left">{lang === 'de' ? 'Name' : 'Name'}</th>
                          <th className="py-2 px-2 sm:py-2.5 sm:px-3 text-right">{lang === 'de' ? 'Punkte' : 'Points'}</th>
                          <th className="py-2 px-2 sm:py-2.5 sm:px-3 text-right">{lang === 'de' ? 'Datum' : 'Date'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scores.map((entry, i) => (
                          <tr
                            key={i}
                            className={`border-t border-slate-100 ${
                              i === 0 ? 'bg-amber-50' : i === 1 ? 'bg-slate-50' : 'bg-white'
                            }`}
                          >
                            <td className="py-2 px-2 sm:py-2.5 sm:px-3 font-bold text-slate-500">
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                            </td>
                            <td className="py-2 px-2 sm:py-2.5 sm:px-3 font-bold text-slate-800 truncate max-w-[100px] sm:max-w-none">{entry.name}</td>
                            <td className="py-2 px-2 sm:py-2.5 sm:px-3 text-right font-extrabold text-amber-600">{entry.points}</td>
                            <td className="py-2 px-2 sm:py-2.5 sm:px-3 text-right text-xs sm:text-sm text-slate-400">
                              {new Date(entry.date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 mb-4 sm:mb-6 text-base sm:text-lg">
                    {lang === 'de' ? 'Noch keine Einträge. Spiele ein Quiz!' : 'No entries yet. Play a quiz!'}
                  </p>
                );
              })()}

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('quiz')}
                  className="bg-indigo-600 text-white text-base sm:text-lg font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-full shadow-lg hover:bg-indigo-700 touch-manipulation"
                >
                  {t.quizBtn}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('menu')}
                  className="bg-slate-200 text-slate-800 text-base sm:text-lg font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-full shadow-lg hover:bg-slate-300 touch-manipulation"
                >
                  {t.backBtn}
                </motion.button>
              </div>
            </motion.div>
          )}

          {(view === 'impressum' || view === 'datenschutz' || view === 'nutzungsbedingungen') && (
            <LegalView key={view} lang={lang} page={view} onBack={() => navigate('menu')} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="px-2 py-0.5 sm:px-4 sm:py-1.5 text-center text-white/80 text-[10px] sm:text-sm font-medium relative z-10 safe-bottom">
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-4 mb-0.5 sm:mb-1.5">
          <button onClick={() => navigate('impressum')} className="hover:text-white transition-colors touch-manipulation">
            {t.legal.impressum.title}
          </button>
          <span className="hidden sm:inline">|</span>
          <button onClick={() => navigate('datenschutz')} className="hover:text-white transition-colors touch-manipulation">
            {t.legal.datenschutz.title}
          </button>
          <span className="hidden sm:inline">|</span>
          <button onClick={() => navigate('nutzungsbedingungen')} className="hover:text-white transition-colors touch-manipulation">
            {t.legal.nutzungsbedingungen.title}
          </button>
        </div>
        <p>&copy; 2026 Dieter Balmer</p>
      </footer>
    </div>
  );
}
