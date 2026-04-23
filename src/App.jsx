import { useState } from "react";
import TopicInput from "./components/TopicInput";
import QuestionsList from "./components/QuestionsList";

const App = () => {
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null); // Стейт для PDF-файлу
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateTest = async () => {
    // Перевірка, щоб не відправити порожній запит
    if (!topic.trim() && !file) return;
    
    setLoading(true);
    setQuestions([]);
    setShowResults(false);
  
    try {
      // Використовуємо FormData для відправки файлу та тексту на сервер
      const formData = new FormData();
      if (topic) formData.append("topic", topic);
      if (file) formData.append("pdfFile", file);

      const response = await fetch("http://localhost:5000/generate-test", {
        method: "POST",
        body: formData, // Відправляємо FormData
      });
  
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Помилка сервера");
      }
  
      const data = await response.json();
      setQuestions(data);
  
    } catch (err) {
      console.error("Помилка генерації:", err);
      alert("Не вдалося згенерувати тест. " + err.message);
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
    <div className="app-container">
      <h1>AI Test Generator</h1>
      <TopicInput
        topic={topic}
        setTopic={setTopic}
        file={file}
        setFile={setFile}
        generateTest={generateTest}
        loading={loading}
      />
      
      {/* Показуємо список питань тільки якщо вони є */}
      {questions.length > 0 && (
        <QuestionsList
          topic={file ? file.name : topic} // Якщо є файл, показуємо його назву як тему
          questions={questions}
          answers={answers}
          handleAnswer={handleAnswer}
          showResults={showResults}
          checkAnswers={checkAnswers}
        />
      )}
    </div>
  );
}
export default App;