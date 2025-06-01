module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true, // 👈 вот это добавь
  },
  extends: [
    'eslint:recommended',
    'plugin:json/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // твои кастомные правила тут
  },
};

