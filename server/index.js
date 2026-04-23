import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";
import { PDFParse } from "pdf-parse"; 
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Налаштовуємо multer для збереження файлу в оперативній пам'яті
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ендпоінт приймає FormData з полем 'pdfFile'
app.post("/generate-test", upload.single("pdfFile"), async (req, res) => {
  const { topic } = req.body;
  const file = req.file;

  // Перевіряємо, чи є тема або файл
  if (!topic && !file) {
    return res.status(400).json({ error: "Вкажіть тему або завантажте PDF файл" });
  }

  try {
    let contextText = "";

    // Якщо користувач завантажив файл, витягуємо з нього текст
    if (file) {
      const parser = new PDFParse({ data: file.buffer });
      const pdfData = await parser.getText();
      contextText = pdfData.text;
      await parser.destroy(); // Очищаємо пам'ять
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Формуємо промпт залежно від того, чи є текст з PDF
    const prompt = `
      Ти викладач. Твоє завдання створити 5 тестових запитань.
      ${file ? `Ось навчальний матеріал, на основі якого ТІЛЬКИ треба створити питання:\n\n${contextText}\n\n` : `Тема для запитань: "${topic}".`}
      
      Кожне запитання має мати 4 варіанти відповідей і одну правильну.
      Форматуй результат ТІЛЬКИ як валідний JSON масив об’єктів без форматування markdown (без \`\`\`json):
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
    res.status(500).json({ error: "Помилка генерації тесту. Можливо, сервери ШІ перевантажені, спробуйте пізніше." });
  }
});

app.listen(port, () => console.log(`Сервер запущено на http://localhost:${port}`));