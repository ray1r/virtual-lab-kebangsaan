// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// helper read/write
function readDB(){
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}
function writeDB(obj){
  fs.writeFileSync(DB_PATH, JSON.stringify(obj, null, 2), 'utf8');
}

// serve static frontend if exists (optional)
const frontendPath = path.join(__dirname, '..', 'frontend');
if(fs.existsSync(frontendPath)){
  app.use(express.static(frontendPath));
}

// API: get questions
app.get('/api/questions', (req,res)=>{
  try{
    const db = readDB();
    res.json({questions: db.questions});
  }catch(e){
    res.status(500).json({error:'Cannot read DB'});
  }
});

// API: get question by id
app.get('/api/questions/:id', (req,res)=>{
  try{
    const db = readDB();
    const q = db.questions.find(x => x.id === req.params.id);
    if(!q) return res.status(404).json({error:'Not found'});
    res.json(q);
  }catch(e){
    res.status(500).json({error:'Cannot read DB'});
  }
});

// API: receive score
app.post('/api/score', (req,res)=>{
  try{
    const db = readDB();
    const payload = req.body;
    payload.id = 's_' + Date.now();
    db.scores.push(payload);
    writeDB(db);
    res.json({status:'ok'});
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Cannot write DB'});
  }
});

// health
app.get('/api/health', (req,res)=>res.json({status:'ok'}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`API running on port ${PORT}`));
