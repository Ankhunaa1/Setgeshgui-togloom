"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_CARD_SYMBOLS, DEFAULT_QUESTIONS } from "@/lib/gameConfig";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

export default function Admin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cards" | "quiz">("cards");
  const [cardSymbols, setCardSymbols] = useState<string[]>(DEFAULT_CARD_SYMBOLS);
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedSymbols = localStorage.getItem("cardSymbols");
    const storedQuestions = localStorage.getItem("quizQuestions");

    if (storedSymbols) {
      setCardSymbols(JSON.parse(storedSymbols));
    }
    if (storedQuestions) {
      const parsed = JSON.parse(storedQuestions);
      setQuestions(parsed);
    }
  }, []);

  // Save card symbols
  const saveCardSymbols = () => {
    localStorage.setItem("cardSymbols", JSON.stringify(cardSymbols));
    showSaved();
  };

  // Save quiz questions
  const saveQuestions = () => {
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Handle card symbol change
  const updateCardSymbol = (index: number, value: string) => {
    const newSymbols = [...cardSymbols];
    newSymbols[index] = value;
    setCardSymbols(newSymbols);
  };

  // Add new card symbol
  const addCardSymbol = () => {
    setCardSymbols([...cardSymbols, "❓"]);
  };

  // Remove card symbol
  const removeCardSymbol = (index: number) => {
    if (cardSymbols.length > 2) {
      const newSymbols = cardSymbols.filter((_, i) => i !== index);
      setCardSymbols(newSymbols);
    }
  };

  // Update question
  const updateQuestion = (field: string, value: string | number) => {
    const newQuestions = [...questions];
    const index = selectedQuestionIndex;
    if (field === "question") {
      newQuestions[index].question = value as string;
    } else if (field.startsWith("answer")) {
      const answerIndex = parseInt(field.replace("answer", ""));
      newQuestions[index].answers[answerIndex] = value as string;
    } else if (field === "correctAnswer") {
      newQuestions[index].correctAnswer = value as number;
    }
    setQuestions(newQuestions);
  };

  // Add new question
  const addQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id), 0) + 1;
    const newQuestions = [
      ...questions,
      {
        id: newId,
        question: "New Question",
        answers: ["Answer A", "Answer B", "Answer C", "Answer D"],
        correctAnswer: 0,
      },
    ];
    setQuestions(newQuestions);
    setSelectedQuestionIndex(newQuestions.length - 1);
  };

  // Remove current question
  const removeQuestion = () => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== selectedQuestionIndex);
      setQuestions(newQuestions);
      if (selectedQuestionIndex >= newQuestions.length) {
        setSelectedQuestionIndex(Math.max(0, newQuestions.length - 1));
      }
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    }
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (selectedQuestionIndex < questions.length - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    if (confirm("Are you sure you want to reset all data to defaults?")) {
      setCardSymbols(DEFAULT_CARD_SYMBOLS);
      setQuestions(DEFAULT_QUESTIONS);
      setSelectedQuestionIndex(0);
      localStorage.removeItem("cardSymbols");
      localStorage.removeItem("quizQuestions");
      showSaved();
    }
  };

  // Get current question
  const currentQuestion = questions[selectedQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-purple-300">Manage your game content</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/")}
              className="rounded-full bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-500"
            >
              ← Back to Home
            </button>
            <button
              onClick={resetToDefaults}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Reset Defaults
            </button>
          </div>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-4 rounded-lg bg-green-500 px-6 py-3 text-white font-semibold">
            ✓ Changes saved successfully!
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("cards")}
            className={`rounded-xl px-6 py-3 text-lg font-semibold transition ${
              activeTab === "cards"
                ? "bg-purple-500 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            🃏 Card Symbols
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`rounded-xl px-6 py-3 text-lg font-semibold transition ${
              activeTab === "quiz"
                ? "bg-purple-500 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            ❓ Quiz Questions
          </button>
        </div>

        {/* Card Symbols Tab */}
        {activeTab === "cards" && (
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Memory Game Symbols</h2>
                <p className="text-purple-300">
                  These symbols are used in the memory card game. Use emojis for best results.
                </p>
              </div>
              <button
                onClick={addCardSymbol}
                className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
              >
                + Add Symbol
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {cardSymbols.map((symbol, index) => (
                <div key={index} className="relative">
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => updateCardSymbol(index, e.target.value)}
                    maxLength={2}
                    className="w-full rounded-xl bg-white/20 px-4 py-3 text-center text-2xl text-white placeholder-white/50 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    onClick={() => removeCardSymbol(index)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                  <div className="mt-2 text-center text-sm text-purple-300">
                    Card {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-purple-300">
                Current: {cardSymbols.length} symbols (game uses 20 cards in 4x5 grid)
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={saveCardSymbols}
                className="rounded-full bg-purple-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-purple-600 hover:scale-105"
              >
                Save Card Symbols
              </button>
            </div>
          </div>
        )}

        {/* Quiz Questions Tab */}
        {activeTab === "quiz" && (
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
            {/* Question Navigation */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Quiz Questions</h2>
                <p className="text-purple-300">
                  Manage questions. Use arrows to navigate between questions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevQuestion}
                  disabled={selectedQuestionIndex === 0}
                  className="rounded-full bg-white/20 px-4 py-2 text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ← Prev
                </button>
                <span className="text-white font-semibold">
                  {selectedQuestionIndex + 1} / {questions.length}
                </span>
                <button
                  onClick={nextQuestion}
                  disabled={selectedQuestionIndex === questions.length - 1}
                  className="rounded-full bg-white/20 px-4 py-2 text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Question Dots */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedQuestionIndex(index)}
                  className={`h-3 w-8 rounded-full transition-colors ${
                    index === selectedQuestionIndex
                      ? "bg-yellow-400"
                      : index < selectedQuestionIndex
                      ? "bg-green-500"
                      : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* Current Question Editor */}
            {currentQuestion && (
              <div className="relative rounded-xl bg-white/5 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-white">
                    Question {selectedQuestionIndex + 1}
                  </span>
                  <button
                    onClick={removeQuestion}
                    disabled={questions.length <= 1}
                    className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete Question
                  </button>
                </div>

                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-purple-300">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.question}
                    onChange={(e) => updateQuestion("question", e.target.value)}
                    className="w-full rounded-lg bg-white/20 px-4 py-2 text-white placeholder-white/50 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currentQuestion.answers.map((answer, aIndex) => (
                    <div key={aIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`question-correct`}
                        checked={currentQuestion.correctAnswer === aIndex}
                        onChange={() => updateQuestion("correctAnswer", aIndex)}
                        className="h-4 w-4 accent-purple-500"
                      />
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) =>
                          updateQuestion(`answer${aIndex}`, e.target.value)
                        }
                        className={`flex-1 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                          currentQuestion.correctAnswer === aIndex
                            ? "bg-green-500/30 ring-2 ring-green-400"
                            : "bg-white/20 focus:ring-purple-400"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={addQuestion}
                className="rounded-full bg-green-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-green-600"
              >
                + Add New Question
              </button>
              <button
                onClick={saveQuestions}
                className="rounded-full bg-purple-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-purple-600 hover:scale-105"
              >
                Save All Questions
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-purple-300">
                Total questions: {questions.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
