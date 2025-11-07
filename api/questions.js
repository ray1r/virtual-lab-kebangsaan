module.exports = (req, res) => {
  const questions = [
    {
      id: 1,
      question: "Apa arti gotong royong dalam kehidupan sehari-hari?",
      choices: [
        "Bekerja sama untuk kepentingan bersama",
        "Bersaing agar lebih unggul",
        "Bekerja sendiri tanpa bantuan orang lain",
        "Menunggu bantuan orang lain"
      ],
      answer: 0
    },
    {
      id: 2,
      question: "Toleransi berarti...",
      choices: [
        "Menolak perbedaan pendapat",
        "Menghormati dan menghargai perbedaan",
        "Menghindari orang lain",
        "Menyalahkan orang yang berbeda agama"
      ],
      answer: 1
    },
    {
      id: 3,
      question: "Contoh sikap nasionalisme adalah...",
      choices: [
        "Membanggakan produk luar negeri",
        "Menjaga dan menggunakan produk dalam negeri",
        "Tidak mau ikut upacara bendera",
        "Meremehkan budaya sendiri"
      ],
      answer: 1
    }
  ];

  res.status(200).json({ questions });
};

