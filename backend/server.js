// backend/server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Path ke file soal
const __dirname = path.resolve();
const QUESTIONS_PATH = path.join(__dirname, "backend", "data", "questions.json");

// ============ ROUTES ============

// Ambil semua soal
app.get("/api/questions", (req, res) => {
  try {
    const data = fs.readFileSync(QUESTIONS_PATH, "utf-8");
    const questions = JSON.parse(data);
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memuat soal." });
  }
});

// Simpan skor pengguna
app.post("/api/score", (req, res) => {
  const { score, correct, total, answers, timestamp } = req.body;
  console.log("Skor diterima:", { score, correct, total, timestamp });
  // Di sini bisa ditambah: simpan ke database/file jika diinginkan
  res.json({ status: "ok", message: "Skor diterima" });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server API berjalan di http://localhost:${PORT}`);
});
