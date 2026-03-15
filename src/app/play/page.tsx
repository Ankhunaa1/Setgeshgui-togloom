"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Default card symbols for the memory game - powers of 10
const DEFAULT_CARD_SYMBOLS = [
  "10⁰", "10¹", "10²", "10³", "10⁴", "10⁵", "10⁶", "10⁷", "10⁸", "10⁹",
  "10¹⁰", "10¹¹", "10¹²", "10¹³", "10¹⁴", "10¹⁵", "10¹⁶", "10¹⁷", "10¹⁸", "10¹⁹",
  "10²⁰", "10²¹", "10²²", "10²³", "10²⁴", "10²⁵", "10²⁶", "10²⁷", "10²⁸", "10²⁹",
  "10³⁰", "10³¹", "10³²", "10³³", "10³⁴", "10³⁵", "10³⁶", "10³⁷", "10³⁸", "10³⁹",
  "10⁴⁰", "10⁴¹", "10⁴²", "10⁴³", "10⁴⁴", "10⁴⁵", "10⁴⁶", "10⁴⁷", "10⁴⁸", "10⁴⁹",
  "10⁵⁰", "10⁵¹", "10⁵²", "10⁵³", "10⁵⁴", "10⁵⁵", "10⁵⁶", "10⁵⁷", "10⁵⁸", "10⁵⁹",
  "10⁶⁰", "10⁶¹", "10⁶²", "10⁶³", "10⁶⁴", "10⁶⁵", "10⁶⁶"
];

// Number of cards in the game (5x4 = 20 cards)
const TOTAL_CARDS = 20;

// Get card symbols from localStorage or use defaults
const getCardSymbols = (): string[] => {
  if (typeof window === "undefined") return DEFAULT_CARD_SYMBOLS;
  const stored = localStorage.getItem("cardSymbols");
  return stored ? JSON.parse(stored) : DEFAULT_CARD_SYMBOLS;
};

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Score {
  name: string;
  score: number;
  date: string;
}

function PlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name") || "Player";

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [cardSymbols, setCardSymbols] = useState<string[]>(DEFAULT_CARD_SYMBOLS);

  // Initialize the game
  useEffect(() => {
    // Load card symbols from localStorage
    const stored = localStorage.getItem("cardSymbols");
    if (stored) {
      setCardSymbols(JSON.parse(stored));
    }
    initializeGame();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !gameWon && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameWon) {
      setGameOver(true);
    }
  }, [timeLeft, gameWon, gameOver]);

  // Save score when game is won
  useEffect(() => {
    if (gameWon) {
      saveScore();
    }
  }, [gameWon]);

  const saveScore = () => {
    const newScore: Score = {
      name: name,
      score: score,
      date: new Date().toLocaleDateString(),
    };

    // Get existing scores
    const existingScores = localStorage.getItem("memoryGameScores");
    const scores: Score[] = existingScores ? JSON.parse(existingScores) : [];
    
    // Add new score
    scores.push(newScore);
    
    // Save back to localStorage
    localStorage.setItem("memoryGameScores", JSON.stringify(scores));
  };

  const initializeGame = () => {
    // Get available symbols from state or localStorage
    const availableSymbols = cardSymbols.length > 0 ? cardSymbols : getCardSymbols();
    
    // If we have more than 10 symbols, randomly select 10 unique ones each game
    let selectedSymbols: string[];
    if (availableSymbols.length > TOTAL_CARDS / 2) {
      // Shuffle and pick 10 unique symbols
      const shuffled = [...availableSymbols].sort(() => Math.random() - 0.5);
      selectedSymbols = shuffled.slice(0, TOTAL_CARDS / 2);
    } else {
      selectedSymbols = availableSymbols;
    }
    
    // Create pairs of cards (10 symbols = 20 cards)
    const symbols = [...selectedSymbols, ...selectedSymbols];
    // Shuffle the cards
    const shuffled = symbols
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setTimeLeft(60);
    setGameOver(false);
    setGameWon(false);
    setIsLocked(false);
    setScore(0);
  };

  const handleCardClick = (card: Card) => {
    // Ignore click if locked, already flipped, or matched
    if (isLocked || card.isFlipped || card.isMatched || gameOver || gameWon) {
      return;
    }

    // Flip the card
    const newCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, { ...card, isFlipped: true }];
    setFlippedCards(newFlippedCards);

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setIsLocked(true);
      const [first, second] = newFlippedCards;

      if (first.symbol === second.symbol) {
        // Match found - mark cards as matched and add score
        setTimeout(() => {
          const matchedCards = newCards.map((c) =>
            c.symbol === first.symbol ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setIsLocked(false);
          setScore(score + 10); // Add 10 points for each match

          // Check if all cards are matched
          if (matchedCards.every((c) => c.isMatched)) {
            // Bonus points for remaining time
            const timeBonus = timeLeft * 2;
            setScore(score + 10 + timeBonus);
            setGameWon(true);
          }
        }, 500);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          const resetCards = newCards.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, isFlipped: false }
              : c
          );
          setCards(resetCards);
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const goBack = () => {
    router.push("/");
  };

  const playAgain = () => {
    initializeGame();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">Memory Game</h1>
        <p className="text-xl text-white/80">Good luck, {name}!</p>
      </div>

      {/* Timer and Score */}
      <div className="mb-6 flex gap-6">
        <div className="rounded-full bg-white/90 px-8 py-3 text-2xl font-bold shadow-lg">
          <span className={timeLeft <= 10 ? "text-red-600" : "text-gray-800"}>
            ⏱️ {timeLeft}s
          </span>
        </div>
        <div className="rounded-full bg-white/90 px-8 py-3 text-2xl font-bold shadow-lg">
          <span className="text-purple-600">⭐ {score}</span>
        </div>
      </div>

      {/* Game Status */}
      {gameWon && (
        <div className="mb-4 rounded-xl bg-green-500 px-8 py-4 text-2xl font-bold text-white shadow-lg">
          🎉 You Won! 🎉 Score: {score}
        </div>
      )}
      {gameOver && !gameWon && (
        <div className="mb-4 rounded-xl bg-red-500 px-8 py-4 text-2xl font-bold text-white shadow-lg">
          😢 Time's Up!
        </div>
      )}

      {/* Card Grid - 4x5 layout */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`
              relative h-16 w-16 sm:h-20 sm:w-20 cursor-pointer perspective-1000
              ${card.isMatched ? "opacity-0" : "opacity-100"}
              ${card.isMatched ? "pointer-events-none" : ""}
              transition-opacity duration-500
            `}
          >
            <div
              className={`
                absolute h-full w-full transition-transform duration-500 preserve-3d
                ${card.isFlipped ? "rotate-y-180" : ""}
              `}
              style={{
                transformStyle: "preserve-3d",
                transform: card.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Card Back */}
              <div
                className="absolute h-full w-full rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg backface-hidden"
              >
                <div className="flex h-full items-center justify-center text-4xl text-white/50">
                  ❓
                </div>
              </div>

              {/* Card Front */}
              <div
                className="absolute h-full w-full rotate-y-180 rounded-xl bg-white shadow-lg backface-hidden"
              >
                <div className="flex h-full items-center justify-center text-2xl sm:text-3xl text-black">
                  {card.symbol}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
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

      {/* Score */}
      <div className="mt-4 text-white/80">
        <p>
          Matches:{" "}
          {cards.filter((c) => c.isMatched).length / 2} / {TOTAL_CARDS / 2}
        </p>
      </div>
    </div>
  );
}

export default function Play() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <PlayContent />
    </Suspense>
  );
}
