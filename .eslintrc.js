module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier'],
  env: {
    browser: true,
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    'react/jsx-fragments': 'off',
    'consistent-return': ['error', { treatUndefinedAsUnspecified: true }],
  },
};
