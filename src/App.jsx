import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateTest = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuestions([]);
    setShowResults(false);
  
    try {
      // Надсилаємо тему на сервер
      const response = await fetch("http://localhost:5000/generate-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });
  
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Помилка сервера");
      }
  
      const data = await response.json(); // Сервер повертає масив питань
      setQuestions(data);
  
    } catch (err) {
      console.error("Помилка генерації:", err);
      alert("Не вдалося згенерувати тест. Спробуй іншу тему або пізніше.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleAnswer = (qId, opt) => {
    setAnswers({ ...answers, [qId]: opt });
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  return (
    <div>
      <h1>AI Test Generator (Gemini)</h1>
      <p>Введи тему тесту:</p>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Наприклад: React або Алгоритми сортування"
      />
      <button onClick={generateTest} disabled={loading}>
        {loading ? "Генерується..." : "Згенерувати тест"}
      </button>

      {questions.length > 0 && (
        <div>
          <h2>Тест по темі: {topic}</h2>
          {questions.map((q, index) => (
            <div key={index}>
              <p>{q.question}</p>
              {q.options.map((opt, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={`q-${index}`}
                    checked={answers[index] === opt}
                    onChange={() => handleAnswer(index, opt)}
                  />
                  {opt}
                </label>
              ))}
              {showResults && (
                <p>
                  {answers[index] === q.correct
                    ? "✅ Правильно!"
                    : `❌ Неправильно. Правильна відповідь: ${q.correct}`}
                </p>
              )}
              <hr />
            </div>
          ))}
          {!showResults && (
            <button onClick={checkAnswers}>Перевірити відповіді</button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
