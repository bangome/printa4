const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const ace = require('atlassian-connect-express');

// 앱 초기화
const app = express();
const addon = ace(app);

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Atlassian Connect Express 라우트 설정
app.use(addon.middleware());

// 앱 라우트
app.get('/', (req, res) => {
  res.redirect('/pdf-export');
});

// PDF 내보내기 페이지 라우트
app.get('/pdf-export', addon.authenticate(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 설치 라우트
app.post('/installed', (req, res) => {
  console.log('App installed!');
  res.status(204).send();
});

// API 라우트
const apiRoutes = require('./routes');
app.use('/api', addon.authenticate(), apiRoutes);

// 서버 시작
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; 