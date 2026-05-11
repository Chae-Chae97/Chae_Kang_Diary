const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: "맥북 백엔드 서버 준비 완료! 💻" });
});

app.listen(PORT, () => {
  console.log(`✅ http://localhost:${PORT} 에서 서버 실행 중`);
});