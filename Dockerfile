# Базовый образ
FROM node:18

# Рабочая директория в контейнере
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект
COPY . .

# Экспонируем порт
EXPOSE 3000

# Команда запуска
CMD ["node", "server.js"]

