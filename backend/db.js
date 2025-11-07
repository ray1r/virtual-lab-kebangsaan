import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'backend', 'data', 'questions.json');

// baca data
export function readQuestions() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// tulis data
export function writeQuestions(questions) {
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
}
