import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { content, Language, Question } from '../data';
import { playSound } from '../sounds';
import { ArrowLeft, CheckCircle2, XCircle, Trophy } from 'lucide-react';

export default function QuizView({ lang, onBack }: { lang: Language, onBack: () => void, key?: string }) {
  const t = content[lang];
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Combine continent and ocean questions
    const allQuestions = [...t.questions];
    
    const shuffledQuestions = allQuestions
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
      setScore(s => s + 1);
    } else {
      playSound('wrong');
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
      // Save score
      const history = JSON.parse(localStorage.getItem('weltMeisterScores') || '[]');
      history.push({ score: score + (selectedAnswer === questions[currentIndex].answer ? 1 : 0), total: questions.length, date: new Date().toISOString() });
      localStorage.setItem('weltMeisterScores', JSON.stringify(history));
    }
  };

  if (questions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[60vh]"
    >
      <div className="p-4 sm:p-6 bg-white/50 border-b border-slate-100 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 font-bold bg-white px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">{t.backBtn}</span>
        </motion.button>
        {!isFinished && (
          <div className="text-lg font-bold text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm">
            {currentIndex + 1} / {questions.length}
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
                      className={`relative p-6 rounded-2xl text-xl font-bold transition-all text-left flex justify-between items-center ${btnClass}`}
                    >
                      {opt}
                      {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                      {showWrong && <XCircle className="w-6 h-6 text-red-600" />}
                    </motion.button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-auto flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="bg-indigo-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    {currentIndex < questions.length - 1 ? t.nextQuestion : t.finishQuiz}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block mb-6 text-8xl"
              >
                {score === questions.length ? '🌟' : score >= questions.length * 0.8 ? '🎉' : score >= questions.length * 0.5 ? '👍' : '💪'}
              </motion.div>
              <h2 className="text-5xl font-extrabold text-slate-800 mb-4">{t.scoreTitle}</h2>
              <p className="text-2xl text-slate-600 font-medium mb-10">
                {t.scoreMessage(score, questions.length)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playSound('click');
                    const shuffledQuestions = [...t.questions]
                      .sort(() => 0.5 - Math.random())
                      .slice(0, 15)
                      .map(q => ({
                        ...q,
                        options: [...q.options].sort(() => 0.5 - Math.random())
                      }));
                    setQuestions(shuffledQuestions);
                    setScore(0);
                    setCurrentIndex(0);
                    setSelectedAnswer(null);
                    setIsFinished(false);
                  }}
                  className="bg-indigo-600 text-white text-xl font-bold py-4 px-8 rounded-full shadow-lg hover:bg-indigo-700"
                >
                  {t.playAgain}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="bg-slate-200 text-slate-800 text-xl font-bold py-4 px-8 rounded-full shadow-lg hover:bg-slate-300"
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
