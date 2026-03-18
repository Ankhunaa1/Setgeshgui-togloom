"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handlePlay = () => {
    if (name.trim()) {
      router.push(`/play?name=${encodeURIComponent(name)}`);
    }
  };

  const handleQuiz = () => {
    if (name.trim()) {
      router.push(`/quiz?name=${encodeURIComponent(name)}`);
    }
  };

  const handleLeaderboard = () => {
    router.push("/leaderboard");
  };

  const handleAdmin = () => {
    router.push("/admin");
  };

  const handleNumbers = () => {
    router.push("/numbers");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans relative">
      <button
        onClick={handleAdmin}
        className="absolute top-6 left-6 rounded-full bg-purple-600 px-6 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-purple-700 shadow-lg"
      >
        ⚙️ Admin
      </button>

      <button
        onClick={handleLeaderboard}
        className="absolute bottom-6 left-6 rounded-full bg-yellow-500 px-6 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-yellow-600 shadow-lg"
      >
        🏆 Leaderboard
      </button>

      <button
        onClick={handleNumbers}
        className="absolute top-6 right-6 rounded-full bg-indigo-500 px-6 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-indigo-600 shadow-lg"
      >
        🔢 Тоо Тоолол
      </button>

      <main className="flex flex-col items-center gap-8 rounded-3xl bg-white/90 p-12 shadow-2xl backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-gray-800">Welcome!</h1>
        
        <div className="flex w-full flex-col items-center gap-2">
          <label htmlFor="name" className="text-lg font-medium text-gray-700">
            What's your name?
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full max-w-xs rounded-full border-2 border-gray-300 px-6 py-3 text-lg text-gray-800 outline-none transition-colors focus:border-purple-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handlePlay}
            disabled={!name.trim()}
            className="rounded-full bg-green-500 px-8 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Play
          </button>
          <button
            onClick={handleQuiz}
            disabled={!name.trim()}
            className="rounded-full bg-blue-500 px-8 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Quiz
          </button>
        </div>
      </main>
    </div>
  );
}
