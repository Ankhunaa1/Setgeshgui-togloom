// Shared game configuration
// This file is used by both admin and game pages

// Default quiz questions
export const DEFAULT_QUESTIONS = [
  {
    id: 1,
    question: "What is the capital of France?",
    answers: ["London", "Paris", "Berlin", "Madrid"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "What is 2 + 2?",
    answers: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "What is the largest ocean on Earth?",
    answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3,
  },
  {
    id: 5,
    question: "Who wrote 'Romeo and Juliet'?",
    answers: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: "What is the chemical symbol for gold?",
    answers: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
  },
  {
    id: 7,
    question: "How many continents are there?",
    answers: ["5", "6", "7", "8"],
    correctAnswer: 2,
  },
  {
    id: 8,
    question: "What is the fastest land animal?",
    answers: ["Lion", "Cheetah", "Leopard", "Tiger"],
    correctAnswer: 1,
  },
];

// Default card symbols for the memory game - powers of 10
export const DEFAULT_CARD_SYMBOLS = [
  "10⁰", "10¹", "10²", "10³", "10⁴", "10⁵", "10⁶", "10⁷", "10⁸", "10⁹",
  "10¹⁰", "10¹¹", "10¹²", "10¹³", "10¹⁴", "10¹⁵", "10¹⁶", "10¹⁷", "10¹⁸", "10¹⁹",
  "10²⁰", "10²¹", "10²²", "10²³", "10²⁴", "10²⁵", "10²⁶", "10²⁷", "10²⁸", "10²⁹",
  "10³⁰", "10³¹", "10³²", "10³³", "10³⁴", "10³⁵", "10³⁶", "10³⁷", "10³⁸", "10³⁹",
  "10⁴⁰", "10⁴¹", "10⁴²", "10⁴³", "10⁴⁴", "10⁴⁵", "10⁴⁶", "10⁴⁷", "10⁴⁸", "10⁴⁹",
  "10⁵⁰", "10⁵¹", "10⁵²", "10⁵³", "10⁵⁴", "10⁵⁵", "10⁵⁶", "10⁵⁷", "10⁵⁸", "10⁵⁹",
  "10⁶⁰", "10⁶¹", "10⁶²", "10⁶³", "10⁶⁴", "10⁶⁵", "10⁶⁶"
];
