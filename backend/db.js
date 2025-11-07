import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname replacement untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'data', 'questions.json');

// baca data
export function readQuestions() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// tulis data
export function writeQuestions(questions) {
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
}
