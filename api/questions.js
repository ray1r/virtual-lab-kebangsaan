import { readQuestions } from '../backend/db.js';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const questions = readQuestions();
    res.status(200).json(questions);
  } else if (req.method === 'POST') {
    // Serverless Vercel tidak bisa menulis file
    res.status(201).json({ message: 'Add question is disabled on Vercel' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
