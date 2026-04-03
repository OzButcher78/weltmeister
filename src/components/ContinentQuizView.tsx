import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { content, Language } from '../data';
import { playSound } from '../sounds';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Heart, HeartOff, Square } from 'lucide-react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { getContinentId } from '../continentMap';
import worldData from '../world.json';

interface HighscoreEntry {
  name: string;
  points: number;
  date: string;
}

const POINTS_CORRECT = 10;
const POINTS_WRONG = -5;
const MAX_WRONG = 5;
const HIGHSCORE_KEY = 'weltMeisterHighscores';

function getHighscores(): HighscoreEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HIGHSCORE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHighscore(entry: HighscoreEntry) {
  const scores = getHighscores();
  scores.push(entry);
  scores.sort((a, b) => b.points - a.points);
  localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(scores.slice(0, 10)));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ContinentQuizView({ lang, onBack }: { lang: Language, onBack: () => void }) {
  const t = content[lang];

  const [continentOrder, setContinentOrder] = useState(() => shuffle(t.continents));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  const livesLeft = MAX_WRONG - wrongCount;
  const target = continentOrder[currentIndex];

  const options = useMemo(() => {
    const others = t.continents.filter(c => c.id !== target.id);
    const distractors = shuffle(others).slice(0, 3);
    return shuffle([target, ...distractors]).map(c => c.name);
  }, [currentIndex, target, t.continents]);

  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    const correct = answer === target.name;
    if (correct) {
      playSound('correct');
      setPoints(p => p + POINTS_CORRECT);
      setTimeout(() => {
        if (currentIndex < continentOrder.length - 1) {
          setCurrentIndex(i => i + 1);
          setSelectedAnswer(null);
        } else {
          playSound('win');
          setIsFinished(true);
        }
      }, 1000);
    } else {
      playSound('wrong');
      setPoints(p => Math.max(0, p + POINTS_WRONG));
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      if (newWrongCount >= MAX_WRONG) {
        setTimeout(() => {
          playSound('wrong');
          setGameOver(true);
          setIsFinished(true);
        }, 1200);
        return;
      }
      setTimeout(() => {
        if (currentIndex < continentOrder.length - 1) {
          setCurrentIndex(i => i + 1);
          setSelectedAnswer(null);
        } else {
          setIsFinished(true);
        }
      }, 1000);
    }
  }, [selectedAnswer, target, currentIndex, continentOrder.length, wrongCount]);

  const handleSaveName = () => {
    if (!playerName.trim()) return;
    playSound('pop');
    saveHighscore({
      name: playerName.trim(),
      points,
      date: new Date().toISOString(),
    });
    setNameSaved(true);
  };

  const resetQuiz = () => {
    setContinentOrder(shuffle(t.continents));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setPoints(0);
    setWrongCount(0);
    setIsFinished(false);
    setGameOver(false);
    setPlayerName('');
    setNameSaved(false);
    playSound('click');
  };

  const stopQuiz = () => {
    playSound('click');
    setIsFinished(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-white/50 border-b border-slate-100 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 text-indigo-600 font-bold bg-white px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-sm touch-manipulation text-xs sm:text-base"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{t.backBtn}</span>
          </motion.button>
          {!isFinished && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={stopQuiz}
              className="flex items-center gap-1 sm:gap-2 text-red-600 font-bold bg-red-50 px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-sm touch-manipulation border border-red-200 text-xs sm:text-base"
            >
              <Square className="w-3 h-3 sm:w-4 sm:h-4 fill-red-600" />
              <span className="hidden sm:inline">{lang === 'de' ? 'Beenden' : 'Stop'}</span>
            </motion.button>
          )}
        </div>
        {!isFinished && (
          <div className="flex items-center gap-1 sm:gap-4">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-50 px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full border border-amber-200">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
              <span className="font-bold text-amber-700 text-[10px] sm:text-sm">{points}</span>
            </div>
            <div className="hidden sm:flex items-center gap-0.5">
              {Array.from({ length: MAX_WRONG }).map((_, i) => (
                i < livesLeft
                  ? <Heart key={i} className="w-5 h-5 text-red-400 fill-red-400" />
                  : <HeartOff key={i} className="w-5 h-5 text-slate-300" />
              ))}
            </div>
            <div className="flex sm:hidden items-center gap-0.5 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200">
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
              <span className="font-bold text-red-500 text-[10px]">{livesLeft}</span>
            </div>
            <div className="text-[10px] sm:text-sm font-bold text-slate-500 bg-white px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-full shadow-sm">
              {currentIndex + 1}/{continentOrder.length}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-3 py-2 sm:p-6 md:p-10 flex-1 flex flex-col justify-center overflow-y-auto">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              {/* Map */}
              <div className="relative w-full aspect-[2/1] bg-sky-100 rounded-2xl overflow-hidden border-2 border-white shadow-inner mb-2 sm:mb-4">
                <ComposableMap projectionConfig={{ scale: 140 }} width={800} height={400} style={{ width: "100%", height: "100%" }}>
                  <Geographies geography={worldData}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const continentId = getContinentId(geo.properties.name);
                        const isTarget = continentId === target.id;
                        const continent = t.continents.find(c => c.id === continentId);
                        const fill = isTarget ? target.hexColor : (continent ? '#E2E8F0' : '#EAEAEC');

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            style={{
                              default: { fill, stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                              hover: { fill, stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                              pressed: { fill, stroke: '#FFF', strokeWidth: 0.5, outline: 'none' },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </div>

              {/* Question */}
              <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold text-slate-800 mb-2 sm:mb-4 text-center leading-tight">
                {t.continentQuizTitle}
              </h2>

              {/* Options 2x2 grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-4">
                {options.map((opt, i) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === target.name;
                  const showCorrect = selectedAnswer && isCorrect;
                  const showWrong = isSelected && !isCorrect;

                  let btnClass = "bg-white border-2 border-slate-200 hover:border-indigo-400 text-slate-700";
                  if (showCorrect) btnClass = "bg-green-100 border-2 border-green-500 text-green-800";
                  if (showWrong) btnClass = "bg-red-100 border-2 border-red-500 text-red-800";
                  if (selectedAnswer && !isSelected && isCorrect) btnClass = "bg-green-50 border-2 border-green-400 text-green-700";

                  return (
                    <motion.button
                      key={i}
                      whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
                      whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(opt)}
                      disabled={selectedAnswer !== null}
                      className={`relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl text-sm sm:text-lg font-bold transition-all text-center flex justify-center items-center gap-1 touch-manipulation ${btnClass}`}
                    >
                      {opt}
                      {showCorrect && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />}
                      {showWrong && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Point feedback */}
              {selectedAnswer && !gameOver && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <div className="text-sm sm:text-lg font-bold text-slate-500">
                    {selectedAnswer === target.name
                      ? <span className="text-green-600">+{POINTS_CORRECT} {lang === 'de' ? 'Punkte' : 'points'}</span>
                      : <span className="text-red-500">{POINTS_WRONG} {lang === 'de' ? 'Punkte' : 'points'}</span>
                    }
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-3 sm:py-6"
            >
              <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">
                {gameOver ? '😢' : points === 70 ? '🌟' : points >= 50 ? '🎉' : points >= 30 ? '👍' : '💪'}
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 mb-2 sm:mb-3">
                {gameOver
                  ? (lang === 'de' ? 'Spiel vorbei!' : 'Game Over!')
                  : t.scoreTitle}
              </h2>

              <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-600">{points}</span>
                <span className="text-lg sm:text-xl text-slate-500 font-bold">{lang === 'de' ? 'Punkte' : 'Points'}</span>
              </div>

              {!nameSaved ? (
                <div className="max-w-sm mx-auto mb-4 sm:mb-6 px-2 sm:px-0">
                  <label className="block text-left text-xs sm:text-sm font-bold text-slate-600 mb-1.5 sm:mb-2">
                    {lang === 'de' ? 'Dein Name für die Bestenliste:' : 'Your name for the highscore board:'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      placeholder={lang === 'de' ? 'Name eingeben...' : 'Enter name...'}
                      maxLength={20}
                      className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none text-base sm:text-lg font-medium"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveName}
                      disabled={!playerName.trim()}
                      className="bg-amber-500 text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
                    >
                      {lang === 'de' ? 'Speichern' : 'Save'}
                    </motion.button>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetQuiz}
                  className="bg-indigo-600 text-white text-base sm:text-xl font-bold py-2.5 sm:py-4 px-6 sm:px-12 rounded-full shadow-lg hover:bg-indigo-700 transition-colors touch-manipulation"
                >
                  {t.playAgain}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="bg-slate-200 text-slate-700 text-base sm:text-xl font-bold py-2.5 sm:py-4 px-6 sm:px-12 rounded-full shadow-lg hover:bg-slate-300 transition-colors touch-manipulation"
                >
                  {t.backBtn}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
