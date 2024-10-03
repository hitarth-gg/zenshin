module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    // Example rules set to 'warn' instead of 'error'
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'react/prop-types': 'warn',
  },

}
