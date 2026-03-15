"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Score {
  name: string;
  score: number;
  date: string;
}

export default function Leaderboard() {
  const router = useRouter();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    // Load scores from localStorage
    const savedScores = localStorage.getItem("memoryGameScores");
    if (savedScores) {
      const parsedScores: Score[] = JSON.parse(savedScores);
      // Sort by score descending
      const sortedScores = parsedScores.sort((a, b) => b.score - a.score);
      // Keep top 10
      setScores(sortedScores.slice(0, 10));
    }
  }, []);

  const goBack = () => {
    router.push("/");
  };

  const clearLeaderboard = () => {
    if (confirm("Are you sure you want to clear the leaderboard?")) {
      localStorage.removeItem("memoryGameScores");
      setScores([]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">🏆 Leaderboard 🏆</h1>
        <p className="text-xl text-white/80">Top 10 Players</p>
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur-sm">
        {scores.length === 0 ? (
          <div className="py-8 text-center text-gray-600">
            <p className="text-xl">No scores yet!</p>
            <p className="mt-2">Play a game to get on the leaderboard.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {scores.map((score, index) => (
              <li
                key={index}
                className={`
                  flex items-center justify-between rounded-xl p-4
                  ${index === 0 ? "bg-yellow-100" : ""}
                  ${index === 1 ? "bg-gray-100" : ""}
                  ${index === 2 ? "bg-orange-100" : ""}
                `}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold
                      ${index === 0 ? "bg-yellow-500 text-white" : ""}
                      ${index === 1 ? "bg-gray-500 text-white" : ""}
                      ${index === 2 ? "bg-orange-500 text-white" : ""}
                      ${index > 2 ? "bg-purple-500 text-white" : ""}
                    `}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {score.name}
                    </p>
                    <p className="text-sm text-gray-500">{score.date}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {score.score}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={goBack}
          className="rounded-full bg-gray-500 px-6 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-gray-600"
        >
          ← Back
        </button>
        {scores.length > 0 && (
          <button
            onClick={clearLeaderboard}
            className="rounded-full bg-red-500 px-6 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-red-600"
          >
            🗑️ Clear
          </button>
        )}
      </div>
    </div>
  );
}
