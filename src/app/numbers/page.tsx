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
  // Mongolian number names
  const numberNames: { [key: number]: string } = {
    0: "Нэг",
    1: "Арав",
    2: "Зуу",
    3: "Мянга",
    4: "Түм",
    5: "Бум",
    6: "Сая",
    7: "Живаа",
    8: "Дүнчүүр",
    9: "Тэрбум",
    10: "Их тэрбум",
    11: "Наяд",
    12: "Их наяд",
    13: "Тавишгүй",
    14: "Их тавишгүй",
    15: "Тунамал",
    16: "Их тунамал",
    17: "Ингүүмэл",
    18: "Их ингүүмэл",
    19: "Хямралгүй",
    20: "Их хямралгүй",
    21: "Ялгаруулагч",
    22: "Их ялгаруулагч",
    23: "Өөр өөр",
    24: "Их өөр",
    25: "Хоён бодрогч",
    26: "Их хоён",
    27: "Хязгаар",
    28: "Их хязгаар",
    29: "Шигд",
    30: "Их шигд",
    31: "Үлэмж",
    32: "Их үлэмж",
    33: "Арвин",
    34: "Их арвин",
    35: "Сайтар",
    36: "Их сайтар",
    37: "Оноо одог",
    38: "Их оноо одог",
    39: "Тосон",
    40: "Их тосон",
    41: "Бэлэг тэмдэг",
    42: "Их бэлэг тэмдэг",
    43: "Чухал хэрэг",
    44: "Их чухал хэрэг",
    45: "Долоо мэдэхүй",
    46: "Их долоо мэдэхүй",
    47: "Тийн болгохуй",
    48: "Их тийн болгохуй",
    49: "Хүчир нудар",
    50: "Их хүчир нудар",
    51: "Арцалгуй",
    52: "Их арцалгуй",
    53: "Нэгтгэсэн",
    54: "Их нэгтгэсэн",
    55: "Баясгалтай",
    56: "Их баясгалтай",
    57: "Тийн",
    58: "Их тийн",
    59: "Төгсгүй",
    60: "Хэмжээлшгүй",
    61: "Хязгааргүй",
    62: "Багтаашгүй",
    63: "Үлэмж дундсахуй",
    64: "Стогцолгүй",
    65: "Үлэмж дуусашгүй",
    66: "Сэтгэшгүй"
  };
  
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
    name: numberNames[1] || ""
  });
  
  // Then add 10^0
  numbers.push({
    power: 0,
    value: `10${makePower(0)}`,
    name: numberNames[0] || ""
  });
  
  // Then add 10^2 to 10^66
  for (let i = 2; i <= 66; i++) {
    numbers.push({
      power: i,
      value: `10${makePower(i)}`,
      name: numberNames[i] || ""
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

