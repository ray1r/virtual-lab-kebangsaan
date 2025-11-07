import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Path relatif ke file db.js sendiri
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File JSON di folder data
const filePath = path.join(__dirname, 'data', 'questions.json');

// Debug path
console.log('DB Path:', filePath);

// Data default jika JSON tidak ada / kosong
const defaultQuestions = [
  {
    id: 1,
    question: "Apa arti gotong royong dalam kehidupan sehari-hari?",
    choices: [
      "Bekerja sama untuk kepentingan bersama",
      "Bersaing agar lebih unggul",
      "Bekerja sendiri tanpa bantuan orang lain",
      "Menunggu bantuan orang lain"
    ],
    answer: 0
  }
];

export function readQuestions() {
  try {
    if (!fs.existsSync(filePath)) {
      console.log('questions.json tidak ditemukan, menggunakan default data');
      return defaultQuestions;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.length ? parsed : defaultQuestions;
  } catch (err) {
    console.error('Error reading questions.json:', err.message);
    return defaultQuestions;
  }
}

// writeQuestions tetap ada, tapi di Vercel tidak akan bekerja
export function writeQuestions(questions) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
  } catch (err) {
    console.error('Error writing questions.json:', err.message);
  }
}
