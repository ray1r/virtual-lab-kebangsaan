const { readQuestions, writeQuestions } = require('../backend/db');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    // Ambil semua pertanyaan dari file
    const questions = readQuestions();
    res.status(200).json(questions);

  } else if (req.method === 'POST') {
    // Menambahkan pertanyaan baru
    const newQuestion = req.body; // pastikan JSON dikirim di body
    const questions = readQuestions();

    // Beri id otomatis
    newQuestion.id = questions.length ? questions[questions.length - 1].id + 1 : 1;
    questions.push(newQuestion);

    writeQuestions(questions);
    res.status(201).json({ message: 'Question added', question: newQuestion });

  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};


