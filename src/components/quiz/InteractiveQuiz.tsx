"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, XCircle, HelpCircle, ArrowRight, 
  RotateCcw, Trophy, Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: string;
  type: string;
  questionAr: string;
  questionEn: string;
  optionsAr?: string;
  optionsEn?: string;
  answer: string;
  explanationAr?: string;
  explanationEn?: string;
  points: number;
  difficulty: string;
}

interface InteractiveQuizProps {
  questions: Question[];
  language: "ar" | "en";
  onComplete?: (score: number, total: number) => void;
}

export function InteractiveQuiz({ questions, language, onComplete }: InteractiveQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const getQuestion = () => language === "ar" ? currentQuestion?.questionAr : currentQuestion?.questionEn;
  const getOptions = () => {
    const optionsStr = language === "ar" ? currentQuestion?.optionsAr : currentQuestion?.optionsEn;
    if (!optionsStr) return [];
    try {
      return JSON.parse(optionsStr);
    } catch {
      return [];
    }
  };
  const getExplanation = () => language === "ar" ? currentQuestion?.explanationAr : currentQuestion?.explanationEn;

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    
    if (answer === currentQuestion.answer) {
      setScore(prev => prev + currentQuestion.points);
    }
    
    setTimeout(() => setShowExplanation(true), 500);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      const finalScore = score + (selectedAnswer === currentQuestion.answer ? currentQuestion.points : 0);
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
      onComplete?.(finalScore, totalPoints);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsComplete(false);
  };

  if (isComplete) {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="mb-6">
          {isExcellent ? (
            <div className="relative inline-block">
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
              <div className="absolute -top-2 -right-2">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          ) : isGood ? (
            <Star className="w-24 h-24 text-blue-500 mx-auto" />
          ) : (
            <HelpCircle className="w-24 h-24 text-slate-400 mx-auto" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {language === "ar" ? "انتهى الاختبار!" : "Quiz Complete!"}
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          {language === "ar" 
            ? `حصلت على ${score} من ${totalPoints} نقطة`
            : `You scored ${score} out of ${totalPoints} points`
          }
        </p>

        <div className="mb-6">
          <Progress value={percentage} className="h-4" />
          <p className="text-lg font-bold mt-2" style={{
            color: isExcellent ? '#22c55e' : isGood ? '#3b82f6' : '#64748b'
          }}>
            {percentage}%
          </p>
        </div>

        <p className="text-lg mb-6">
          {isExcellent 
            ? (language === "ar" ? "ممتاز! أداء رائع! 🎉" : "Excellent! Great performance! 🎉")
            : isGood 
              ? (language === "ar" ? "جيد! استمر في التعلم! 👍" : "Good! Keep learning! 👍")
              : (language === "ar" ? "تحتاج لمزيد من المراجعة 📚" : "You need more review 📚")
          }
        </p>

        <Button onClick={handleRestart} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          {language === "ar" ? "إعادة الاختبار" : "Retry Quiz"}
        </Button>
      </motion.div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <p className="text-slate-500 dark:text-slate-400">
          {language === "ar" ? "لا توجد أسئلة متاحة" : "No questions available"}
        </p>
      </div>
    );
  }

  const options = getOptions();
  const isCorrect = selectedAnswer === currentQuestion.answer;
  const isWrong = selectedAnswer && !isCorrect;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-500">
          <span>
            {language === "ar" 
              ? `السؤال ${currentIndex + 1} من ${totalQuestions}`
              : `Question ${currentIndex + 1} of ${totalQuestions}`
            }
          </span>
          <span>{language === "ar" ? `${score} نقطة` : `${score} points`}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            {/* Difficulty Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentQuestion.difficulty === 'easy' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : currentQuestion.difficulty === 'hard'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {language === "ar" 
                  ? currentQuestion.difficulty === 'easy' ? 'سهل' : currentQuestion.difficulty === 'hard' ? 'صعب' : 'متوسط'
                  : currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)
                }
              </span>
              <span className="text-xs text-slate-400">
                {currentQuestion.points} {language === "ar" ? "نقاط" : "points"}
              </span>
            </div>

            {/* Question */}
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
              {getQuestion()}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {options.map((option: string, index: number) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentQuestion.answer;
                
                let bgClass = "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700";
                if (selectedAnswer) {
                  if (isCorrectOption) {
                    bgClass = "bg-green-100 dark:bg-green-900/30 border-green-500";
                  } else if (isSelected && isWrong) {
                    bgClass = "bg-red-100 dark:bg-red-900/30 border-red-500";
                  }
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={`w-full p-4 rounded-xl text-start transition-all border-2 ${bgClass} ${isSelected ? "border-2" : "border-transparent"}`}
                    whileHover={!selectedAnswer ? { scale: 1.01 } : {}}
                    whileTap={!selectedAnswer ? { scale: 0.99 } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedAnswer && isCorrectOption
                          ? "bg-green-500 text-white"
                          : selectedAnswer && isSelected && isWrong
                            ? "bg-red-500 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}>
                        {selectedAnswer && isCorrectOption ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : selectedAnswer && isSelected && isWrong ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </span>
                      <span className="flex-1 text-slate-700 dark:text-slate-200">
                        {option}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && getExplanation() && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-6 p-4 rounded-xl ${
                    isCorrect 
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium mb-1 ${
                        isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                      }`}>
                        {isCorrect 
                          ? (language === "ar" ? "إجابة صحيحة!" : "Correct!")
                          : (language === "ar" ? "إجابة خاطئة" : "Incorrect")
                        }
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {getExplanation()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            {selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-end"
              >
                <Button onClick={handleNext} className="gap-2">
                  {currentIndex < totalQuestions - 1 
                    ? (language === "ar" ? "السؤال التالي" : "Next Question")
                    : (language === "ar" ? "إنهاء الاختبار" : "Finish Quiz")
                  }
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
