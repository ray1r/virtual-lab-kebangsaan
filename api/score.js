export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { score, correct, total, timestamp } = req.body;
    console.log('Skor diterima:', { score, correct, total, timestamp });

    return res.status(200).json({ status: 'ok', message: 'Skor diterima' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
