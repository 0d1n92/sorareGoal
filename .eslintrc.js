require('dotenv/config');
module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // Preferire le virgole finali nei multi-line object e array
    'comma-dangle': ['error', 'always-multiline'],

    // Utilizzare apici singoli per le stringhe
    quotes: ['error', 'single'],

    // Utilizzare 2 spazi per l'indentazione del codice
    indent: ['error', 2],

    // Richiedere i punti e virgola alla fine di ogni statement
    semi: ['error', 'always'],

    // Richiedere gli spazi tra le parentesi
    'space-in-parens': 'off',

    // Richiedere uno spazio tra una funzione e le sue parentesi graffe
    'space-before-function-paren': 'off',

    // Non consentire variabili non utilizzate
    'no-unused-vars': 'error',

    // Impedire l'uso di console.log in produzione
    'no-console':
      process.env.MODE === 'PROD'
        ? ['error', { allow: ['warn', 'error', 'info'] }]
        : 'warn',

    // Impedire l'uso di var e promuovere l'uso di const o let
    'no-var': 'error',
    'prefer-const': 'error',

    // Richiedere operatori di confronto rigorosi (=== e !==)
    eqeqeq: 'error',

    // Richiedere parentesi per i blocchi delle istruzioni di controllo
    curly: ['error', 'all'],

    // Impedire l'uso di costrutti di iterazione senza effetto collaterale
    'no-empty': 'error',

    // Richiedere commenti nei casi in cui le istruzioni sono vuote
    'no-empty-function': 'warn',

    // Impedire l'uso di costrutti di iterazione senza effetto collaterale
    'no-loop-func': 'error',

    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
