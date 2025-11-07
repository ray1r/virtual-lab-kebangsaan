import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname replacement untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// path ke JSON
const filePath = path.join(__dirname, 'data', 'questions.json');

export function readQuestions() {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read questions.json:', err.message);
    return [];
  }
}

// dummy write untuk serverless / local
export function writeQuestions(questions) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
    console.log('Questions saved');
  } catch (err) {
    console.error('Failed to write questions.json:', err.message);
  }
}

