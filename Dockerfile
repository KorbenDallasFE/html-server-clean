# 1) Базовый образ: Node.js Alpine (маленький, быстрый)
FROM node:18-alpine

# 2) Рабочая директория в контейнере
WORKDIR /app

# 3) Копируем package.json & package-lock.json (или yarn.lock)
COPY package*.json ./

# 4) Устанавливаем зависимости (production + dev для CI)
RUN npm install

# 5) Копируем весь проект
COPY . .

# 6) По умолчанию запускаем index.js (например)
CMD ["node", "index.js"]

