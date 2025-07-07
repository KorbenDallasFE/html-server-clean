FAA Digital ATIS API Full-Stack Dockerized App
# ATIS Snapshot Server 
Link: https://html-server-clean.onrender.com/

Мини-сервер для получения, кэширования и хранения авиационных сводок (ATIS) по ICAO-коду. Построен на Node.js, PostgreSQL и Redis с использованием Docker Compose и деплоем через Render.

## Функциональность

- Получение ATIS по ICAO-коду с внешнего API
- Сохранение снимков ATIS с хранением последних 5 для каждого кода
- Кэширование через Redis
- CI/CD через GitHub Actions
- Поддержка Pub/Sub (заготовка)

## Технологии

- Node.js (Express)
- PostgreSQL
- Redis
- Docker / Docker Compose
- GitHub Actions
- Render (хостинг)

## Запросы через форму в браузере
Отправить точный icao код любого крупного аэропорта США.
Форма ввода не чувствительна к регистру, для удобства срочного запроса raw данных.
Примеры ICAO-кодов: 
KATL (Atlanta) 
KLAX (Los Angeles) 
KMIA (Miami) 
KLAS (Las Vegas) 
...

