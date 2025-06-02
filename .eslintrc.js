module.exports = {
  env: {
    node: true,    // разрешаем require, module и т.п.
    jest: true     // разрешаем test, expect и т.д.
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "script",  // CommonJS, а не ES Module
  },
  rules: {
    // сюда можно добавить твои правила
  },
};

