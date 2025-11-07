import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'data', 'questions.json');

// hanya baca
export function readQuestions() {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// dummy write (tidak akan menyimpan di serverless)
export function writeQuestions(questions) {
  console.warn('writeQuestions is disabled on Vercel');
}
