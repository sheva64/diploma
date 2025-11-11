import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import TopicInput from "./components/TopicInput";
import QuestionsList from "./components/QuestionsList";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const App = () => {
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
      <h1>AI Test Generator</h1>
      <TopicInput
        topic={topic}
        setTopic={setTopic}
        generateTest={generateTest}
        loading={loading}
      />
      <QuestionsList
        topic={topic}
        questions={questions}
        answers={answers}
        handleAnswer={handleAnswer}
        showResults={showResults}
        checkAnswers={checkAnswers}
      />
    </div>
  );
}

export default App;
