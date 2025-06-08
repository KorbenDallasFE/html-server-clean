const express = require('express');
const fs = require('fs');
const path = require('path');

// Для определения __dirname (в CommonJS он уже есть, но на всякий случай)
const __dirname = path.resolve();

// Импорт роутера
const publishRouter = require('./routes/api/publish');

const app = express();

app.use(express.json()); // чтобы парсить JSON в POST-запросах

// Проверяем и создаём папку logs
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'server.log');

function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, logEntry);
}

// Middleware для логирования запросов
app.use((req, res, next) => {
  logToFile(`${req.method} ${req.url}`);
  next();
});

// Подключаем роут /api/publish
app.use('/api/publish', publishRouter);

// Запускаем сервер
const PORT = 3000;
app.listen(PORT, () => {
  logToFile(`Server is running on http://localhost:${PORT}`);
  console.log(`Server listening on http://localhost:${PORT}`);
});
