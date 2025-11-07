const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'questions.json');

function readQuestions() {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeQuestions(questions) {
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
}

module.exports = { readQuestions, writeQuestions };
