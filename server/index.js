import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-test", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Тема не вказана" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Згенеруй 5 тестових запитань з теми "${topic}".
      Кожне запитання має мати 4 варіанти відповідей і одну правильну.
      Форматуй результат як JSON масив об’єктів:
      [
        {
          "question": "Текст питання",
          "options": ["варіант 1", "варіант 2", "варіант 3", "варіант 4"],
          "correct": "правильна відповідь текстом"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[([\s\S]*)\]/);

    if (!jsonMatch) throw new Error("Не знайдено JSON у відповіді");

    const questions = JSON.parse(jsonMatch[0]);
    res.json(questions);
  } catch (error) {
    console.error("Помилка генерації:", error);
    res.status(500).json({ error: "Помилка генерації тесту" });
  }
});

app.listen(port, () => console.log(`Сервер запущено на http://localhost:${port}`));