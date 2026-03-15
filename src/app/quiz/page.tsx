"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DEFAULT_QUESTIONS } from "@/lib/gameConfig";

const QUESTIONS_PER_GAME = 8;

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

// Store for user's answers (question index -> answer index)
interface UserAnswers {
  [questionIndex: number]: number;
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name") || "Player";

  const [allQuestions, setAllQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);

  // Load questions from localStorage and select 8 random questions
  useEffect(() => {
    const stored = localStorage.getItem("quizQuestions");
    const storedQuizData = localStorage.getItem("quizData");
    
    let availableQuestions: Question[] = DEFAULT_QUESTIONS;
    if (stored) {
      availableQuestions = JSON.parse(stored);
    }

    // Check if we have a saved quiz session
    if (storedQuizData) {
      const quizData = JSON.parse(storedQuizData);
      // Check if the quiz was started with the same name and questions
      if (quizData.name === name && quizData.questions) {
        setQuizQuestions(quizData.questions);
        setUserAnswers(quizData.userAnswers || {});
        setCurrentQuestion(quizData.currentQuestion || 0);
        setIsCalculated(quizData.isCalculated || false);
        setAllQuestions(availableQuestions);
        return;
      }
    }

    // Select 8 random questions
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, QUESTIONS_PER_GAME);
    setQuizQuestions(selected);
    setAllQuestions(availableQuestions);
    
    // Save the quiz start data
    saveQuizData(selected, {}, 0, false);
  }, [name]);

  // Save quiz data to localStorage
  const saveQuizData = (questions: Question[], answers: UserAnswers, current: number, calculated: boolean) => {
    localStorage.setItem("quizData", JSON.stringify({
      name,
      questions,
      userAnswers: answers,
      currentQuestion: current,
      isCalculated: calculated,
      timestamp: Date.now()
    }));
  };

  // Handle answer selection - allows changing answer anytime
  const handleAnswer = (answerIndex: number) => {
    const newAnswers = { ...userAnswers, [currentQuestion]: answerIndex };
    setUserAnswers(newAnswers);
    setSelectedAnswer(answerIndex);
    saveQuizData(quizQuestions, newAnswers, currentQuestion, isCalculated);
  };

  // Clear selected answer
  const clearAnswer = () => {
    const newAnswers = { ...userAnswers };
    delete newAnswers[currentQuestion];
    setUserAnswers(newAnswers);
    setSelectedAnswer(null);
    saveQuizData(quizQuestions, newAnswers, currentQuestion, isCalculated);
  };

  // Calculate final score
  const calculateScore = () => {
    let finalScore = 0;
    quizQuestions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setIsCalculated(true);
    saveQuizData(quizQuestions, userAnswers, currentQuestion, true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      setSelectedAnswer(userAnswers[nextQ] !== undefined ? userAnswers[nextQ] : null);
      saveQuizData(quizQuestions, userAnswers, nextQ, isCalculated);
    } else {
      calculateScore();
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQ = currentQuestion - 1;
      setCurrentQuestion(prevQ);
      setSelectedAnswer(userAnswers[prevQ] !== undefined ? userAnswers[prevQ] : null);
      saveQuizData(quizQuestions, userAnswers, prevQ, isCalculated);
    }
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(userAnswers[index] !== undefined ? userAnswers[index] : null);
    saveQuizData(quizQuestions, userAnswers, index, isCalculated);
  };

  const goBack = () => {
    router.push("/");
  };

  const playAgain = () => {
    // Clear old quiz data and start fresh
    localStorage.removeItem("quizData");
    
    // Select 8 new random questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, QUESTIONS_PER_GAME);
    setQuizQuestions(selected);
    setUserAnswers({});
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCalculated(false);
    saveQuizData(selected, {}, 0, false);
  };

  // Get current question data
  const currentQ = quizQuestions[currentQuestion];
  const questionText = currentQ ? currentQ.question : `Question ${currentQuestion + 1}`;
  const answerTexts = currentQ ? currentQ.answers : ["Answer A", "Answer B", "Answer C", "Answer D"];

  if (showResult) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans p-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">🎉 Quiz Complete!</h1>
          <p className="text-xl text-white/80">Great job, {name}!</p>
        </div>

        <div className="rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-sm">
          <p className="text-center text-2xl text-gray-800">
            Your Score: <span className="font-bold text-purple-600">{score}</span> / {quizQuestions.length}
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={goBack}
            className="rounded-full bg-gray-500 px-6 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-gray-600"
          >
            ← Back
          </button>
          <button
            onClick={playAgain}
            className="rounded-full bg-green-500 px-6 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-green-600"
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">Quiz</h1>
        <p className="text-xl text-white/80">Good luck, {name}!</p>
      </div>

      {/* Progress */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {quizQuestions.map((_, index) => (
          <button
            key={index}
            onClick={() => handleQuestionClick(index)}
            className={`
              h-3 w-8 rounded-full transition-colors cursor-pointer
              ${index < currentQuestion ? "bg-green-500" : ""}
              ${index === currentQuestion ? "bg-yellow-400" : ""}
              ${index > currentQuestion ? "bg-white/30" : ""}
              ${userAnswers[index] !== undefined ? "ring-2 ring-green-400" : ""}
            `}
          />
        ))}
      </div>

      {/* Question Counter */}
      <div className="mb-4 rounded-full bg-white/90 px-6 py-2 text-lg font-semibold text-gray-800">
        Question {currentQuestion + 1} of {quizQuestions.length}
      </div>

      {/* Question Card */}
      <div className="mb-8 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">
          {questionText}
        </h2>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {answerTexts.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`
                rounded-xl border-2 p-4 text-lg font-medium transition-all
                ${selectedAnswer === index 
                  ? "border-purple-500 bg-purple-100 text-purple-800" 
                  : "border-gray-300 bg-white text-gray-700 hover:border-purple-400 hover:bg-purple-50"
                }
              `}
            >
              <span className="mr-2 font-bold">
                {String.fromCharCode(65 + index)}.
              </span>
              {answer}
            </button>
          ))}
        </div>

        {/* Clear Answer Button */}
        {selectedAnswer !== null && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={clearAnswer}
              className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              ✕ Clear Answer
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="rounded-full bg-gray-500 px-6 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="rounded-full bg-green-500 px-6 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-green-600"
        >
          {currentQuestion === quizQuestions.length - 1 ? "Finish" : "Next →"}
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={goBack}
        className="mt-6 text-white/80 hover:text-white"
      >
        ← Exit Quiz
      </button>
    </div>
  );
}

export default function Quiz() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
