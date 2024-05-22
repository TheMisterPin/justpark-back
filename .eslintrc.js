module.exports = {
  env: {
    browser: false, // Remove browser environment
    es2021: true,
    node: true, // Add Node.js environment
    jest: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021, // Specify ECMAScript version
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'consistent-return': 'off',
    'linebreak-style': 'off', // Remove linebreak-style rule
    semi: 'off', // Remove semi rule
    '@typescript-eslint/semi': [
      'error',
      'never',
    ], // Add @typescript-eslint/semi rule
    indent: [
      'error',
      2,
      { SwitchCase: 1 },
    ],
    'no-trailing-spaces': 'error',
    'padded-blocks': [
      'error',
      { blocks: 'never', classes: 'never', switches: 'never' },
    ],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'function', next: 'function' },
      { blankLine: 'always', prev: '*', next: 'return' },
      {
        blankLine: 'always',
        prev: [
          'const',
          'let',
          'var',
        ],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: [
          'const',
          'let',
          'var',
        ],
        next: [
          'const',
          'let',
          'var',
        ],
      },
    ],
    quotes: [
      'error',
      'single',
    ],
    'import/prefer-default-export': 'off',
  },
}
