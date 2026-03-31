import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { content, Language, Question } from '../data';
import { playSound } from '../sounds';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Heart, HeartOff, Square } from 'lucide-react';

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

export default function QuizView({ lang, onBack }: { lang: Language, onBack: () => void, key?: string }) {
  const t = content[lang];
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [nameSaved, setNameSaved] = useState(false);
  const [showHighscores, setShowHighscores] = useState(false);

  const livesLeft = MAX_WRONG - wrongCount;

  useEffect(() => {
    const shuffledQuestions = [...t.questions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 15)
      .map(q => ({
        ...q,
        options: [...q.options].sort(() => 0.5 - Math.random())
      }));
    setQuestions(shuffledQuestions);
  }, [lang, t.questions]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentIndex].answer;

    if (isCorrect) {
      playSound('correct');
      setPoints(p => p + POINTS_CORRECT);
      setTimeout(() => {
        nextQuestion();
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
    }
  };

  const nextQuestion = () => {
    playSound('click');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
    } else {
      playSound('win');
      setIsFinished(true);
    }
  };

  const handleSaveName = () => {
    if (!playerName.trim()) return;
    playSound('pop');
    saveHighscore({
      name: playerName.trim(),
      points,
      date: new Date().toISOString(),
    });
    setNameSaved(true);
    setShowHighscores(true);
  };

  const resetQuiz = () => {
    playSound('click');
    const shuffledQuestions = [...t.questions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 15)
      .map(q => ({
        ...q,
        options: [...q.options].sort(() => 0.5 - Math.random())
      }));
    setQuestions(shuffledQuestions);
    setPoints(0);
    setWrongCount(0);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsFinished(false);
    setGameOver(false);
    setPlayerName('');
    setNameSaved(false);
    setShowHighscores(false);
  };

  const stopQuiz = () => {
    playSound('click');
    setIsFinished(true);
  };

  if (questions.length === 0) return null;

  const highscores = getHighscores();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[60vh]"
    >
      <div className="px-4 py-2 sm:px-6 sm:py-3 bg-white/50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-600 font-bold bg-white px-4 py-2 rounded-full shadow-sm touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{t.backBtn}</span>
          </motion.button>
          {!isFinished && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={stopQuiz}
              className="flex items-center gap-2 text-red-600 font-bold bg-red-50 px-4 py-2 rounded-full shadow-sm touch-manipulation border border-red-200"
            >
              <Square className="w-4 h-4 fill-red-600" />
              <span className="hidden sm:inline">{lang === 'de' ? 'Beenden' : 'Stop'}</span>
            </motion.button>
          )}
        </div>
        {!isFinished && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-amber-700 text-sm">{points}</span>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: MAX_WRONG }).map((_, i) => (
                i < livesLeft
                  ? <Heart key={i} className="w-5 h-5 text-red-400 fill-red-400" />
                  : <HeartOff key={i} className="w-5 h-5 text-slate-300" />
              ))}
            </div>
            <div className="text-sm font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm">
              {currentIndex + 1}/{questions.length}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-8 text-center leading-tight">
                {questions[currentIndex].q}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {questions[currentIndex].options.map((opt, i) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === questions[currentIndex].answer;
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
                      className={`relative p-6 rounded-2xl text-xl font-bold transition-all text-left flex justify-between items-center touch-manipulation ${btnClass}`}
                    >
                      {opt}
                      {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                      {showWrong && <XCircle className="w-6 h-6 text-red-600" />}
                    </motion.button>
                  );
                })}
              </div>

              {selectedAnswer && !gameOver && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-auto flex flex-col items-center gap-2"
                >
                  <div className="text-lg font-bold text-slate-500">
                    {selectedAnswer === questions[currentIndex].answer
                      ? <span className="text-green-600">+{POINTS_CORRECT} {lang === 'de' ? 'Punkte' : 'points'}</span>
                      : <span className="text-red-500">{POINTS_WRONG} {lang === 'de' ? 'Punkte' : 'points'}</span>
                    }
                  </div>
                  {selectedAnswer !== questions[currentIndex].answer && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextQuestion}
                      className="bg-indigo-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:bg-indigo-700 transition-colors touch-manipulation"
                    >
                      {currentIndex < questions.length - 1 ? t.nextQuestion : t.finishQuiz}
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              {!showHighscores ? (
                <>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block mb-4 text-7xl"
                  >
                    {gameOver ? '💥' : points >= 100 ? '🌟' : points >= 60 ? '🎉' : '👍'}
                  </motion.div>

                  <h2 className="text-4xl font-extrabold text-slate-800 mb-2">
                    {gameOver
                      ? (lang === 'de' ? 'Game Over!' : 'Game Over!')
                      : t.scoreTitle
                    }
                  </h2>

                  <p className="text-xl text-slate-600 font-medium mb-2">
                    {gameOver
                      ? (lang === 'de' ? '5 falsche Antworten!' : '5 wrong answers!')
                      : currentIndex < questions.length - 1
                        ? (lang === 'de'
                          ? `Quiz nach ${currentIndex + 1} von ${questions.length} Fragen beendet.`
                          : `Quiz stopped after ${currentIndex + 1} of ${questions.length} questions.`)
                        : (lang === 'de'
                          ? `Du hast alle Fragen beantwortet!`
                          : `You answered all questions!`)
                    }
                  </p>

                  <div className="flex justify-center items-center gap-3 mb-6">
                    <Trophy className="w-8 h-8 text-amber-500" />
                    <span className="text-4xl font-extrabold text-amber-600">{points}</span>
                    <span className="text-xl text-slate-500 font-bold">{lang === 'de' ? 'Punkte' : 'Points'}</span>
                  </div>

                  {!nameSaved ? (
                    <div className="max-w-sm mx-auto mb-6">
                      <label className="block text-left text-sm font-bold text-slate-600 mb-2">
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
                          className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-400 focus:outline-none text-lg font-medium"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSaveName}
                          disabled={!playerName.trim()}
                          className="bg-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
                        >
                          {lang === 'de' ? 'Speichern' : 'Save'}
                        </motion.button>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetQuiz}
                      className="bg-indigo-600 text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:bg-indigo-700 touch-manipulation"
                    >
                      {t.playAgain}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowHighscores(true)}
                      className="bg-amber-100 text-amber-800 text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:bg-amber-200 touch-manipulation"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5" />
                        {lang === 'de' ? 'Bestenliste' : 'Highscores'}
                      </span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onBack}
                      className="bg-slate-200 text-slate-800 text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:bg-slate-300 touch-manipulation"
                    >
                      {t.backBtn}
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Trophy className="w-8 h-8 text-amber-500" />
                    <h2 className="text-3xl font-extrabold text-slate-800">
                      {lang === 'de' ? 'Bestenliste' : 'Highscores'}
                    </h2>
                  </div>

                  {highscores.length > 0 ? (
                    <div className="max-w-md mx-auto mb-6 rounded-2xl overflow-hidden border border-slate-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-100 text-sm font-bold text-slate-600">
                            <th className="py-2.5 px-3 text-left">#</th>
                            <th className="py-2.5 px-3 text-left">{lang === 'de' ? 'Name' : 'Name'}</th>
                            <th className="py-2.5 px-3 text-right">{lang === 'de' ? 'Punkte' : 'Points'}</th>
                            <th className="py-2.5 px-3 text-right">{lang === 'de' ? 'Datum' : 'Date'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {highscores.map((entry, i) => (
                            <tr
                              key={i}
                              className={`border-t border-slate-100 ${
                                i === 0 ? 'bg-amber-50' : i === 1 ? 'bg-slate-50' : 'bg-white'
                              }`}
                            >
                              <td className="py-2.5 px-3 font-bold text-slate-500">
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                              </td>
                              <td className="py-2.5 px-3 font-bold text-slate-800">{entry.name}</td>
                              <td className="py-2.5 px-3 text-right font-extrabold text-amber-600">{entry.points}</td>
                              <td className="py-2.5 px-3 text-right text-sm text-slate-400">
                                {new Date(entry.date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-500 mb-6">
                      {lang === 'de' ? 'Noch keine Einträge.' : 'No entries yet.'}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetQuiz}
                      className="bg-indigo-600 text-white text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:bg-indigo-700 touch-manipulation"
                    >
                      {t.playAgain}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowHighscores(false)}
                      className="bg-slate-200 text-slate-800 text-lg font-bold py-3 px-6 rounded-full shadow-lg hover:bg-slate-300 touch-manipulation"
                    >
                      {t.backBtn}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
