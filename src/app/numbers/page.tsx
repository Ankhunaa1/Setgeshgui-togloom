"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";

interface NumberEntry {
  power: number;
  value: string;
  name: string;
}

// Generate all powers of 10 - starting from 10^1, then 10^0, then 10^2 to 10^66
const generateNumbers = (): NumberEntry[] => {
  const numbers: NumberEntry[] = [];
  
  // Create superscript helper
  const superscriptDigits: { [key: string]: string } = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  
  const makePower = (i: number): string => {
    return i.toString().split('').map(d => superscriptDigits[d]).join('');
  };
  
  // First add 10^1
  numbers.push({
    power: 1,
    value: `10${makePower(1)}`,
    name: ""
  });
  
  // Then add 10^0
  numbers.push({
    power: 0,
    value: `10${makePower(0)}`,
    name: ""
  });
  
  // Then add 10^2 to 10^66
  for (let i = 2; i <= 66; i++) {
    numbers.push({
      power: i,
      value: `10${makePower(i)}`,
      name: ""
    });
  }
  
  return numbers;
};

const allNumbers = generateNumbers();

function NumbersContent() {
  const router = useRouter();
  const [numbers, setNumbers] = useState<NumberEntry[]>(allNumbers);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(numbers[index].name);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      const newNumbers = [...numbers];
      newNumbers[editingIndex].name = editValue;
      setNumbers(newNumbers);
      
      // Save to localStorage
      localStorage.setItem("numberNames", JSON.stringify(newNumbers));
      setEditingIndex(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const goBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">🔢 Тоо Тооллын Нэр 🧮</h1>
            <p className="text-purple-300">Монголын уламжлалт тоо тооллын нэрсийн жагсаалт</p>
          </div>
          <button
            onClick={goBack}
            className="rounded-full bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-500"
          >
            ← Буцах
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6 rounded-xl bg-white/10 p-4 text-white/80">
          <p>Энд та 10-ын 0-66 зэрэг хүртэлх тоо бүрийн нэрийг оруулна уу. Нэрсийг оруулахын тулд мөр дээр дарна уу.</p>
        </div>

        {/* Numbers Table */}
        <div className="overflow-hidden rounded-2xl bg-white/90 shadow-2xl">
          <div className="max-h-[70vh] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-purple-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-center font-bold">№</th>
                  <th className="px-4 py-3 text-center font-bold">Тэмдэг</th>
                  <th className="px-4 py-3 text-left font-bold">Нэр</th>
                </tr>
              </thead>
              <tbody>
                {numbers.map((num, index) => (
                  <tr
                    key={num.power}
                    className={`border-b border-purple-100 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-purple-50"
                    } hover:bg-purple-100 cursor-pointer`}
                    onClick={() => handleEdit(index)}
                  >
                    <td className="px-4 py-3 text-center font-semibold text-purple-600">
                      {num.power + 1}
                    </td>
                    <td className="px-4 py-3 text-center text-lg font-bold text-gray-800">
                      {num.value}
                    </td>
                    <td className="px-4 py-3 text-left">
                      {editingIndex === index ? (
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 rounded-lg border-2 border-purple-300 px-3 py-1 text-lg focus:border-purple-500 focus:outline-none"
                            placeholder="Нэр оруулах..."
                            autoFocus
                          />
                          <button
                            onClick={handleSave}
                            className="rounded-lg bg-green-500 px-4 py-1 font-semibold text-white hover:bg-green-600"
                          >
                            Хадгалах
                          </button>
                          <button
                            onClick={handleCancel}
                            className="rounded-lg bg-red-500 px-4 py-1 font-semibold text-white hover:bg-red-600"
                          >
                            Цуцлах
                          </button>
                        </div>
                      ) : (
                        <span className="text-lg font-medium text-gray-700">
                          {num.name || <span className="text-gray-400 italic">Дарж нэр оруулах...</span>}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 text-center text-white/80">
          <p>Нийт: {numbers.length} тоо</p>
        </div>
      </div>
    </div>
  );
}

export default function Numbers() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-white text-xl">Ачааллаж байна...</div>
      </div>
    }>
      <NumbersContent />
    </Suspense>
  );
}
