import { readQuestions, writeQuestions } from '../backend/db.js';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Ambil semua pertanyaan
    const questions = readQuestions();
    res.status(200).json(questions);

  } else if (req.method === 'POST') {
    // Menambahkan pertanyaan baru
    const newQuestion = req.body;

    if (!newQuestion || !newQuestion.question || !newQuestion.choices || newQuestion.answer === undefined) {
      return res.status(400).json({ message: 'Invalid question format' });
    }

    const questions = readQuestions();
    newQuestion.id = questions.length ? questions[questions.length - 1].id + 1 : 1;
    questions.push(newQuestion);
    writeQuestions(questions);

    res.status(201).json({ message: 'Question added', question: newQuestion });

  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

