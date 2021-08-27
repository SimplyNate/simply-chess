module.exports = {
    root: true,

    env: {
        node: true,
    },

    parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser',
    },

    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        indent: ['error', 4],
        'comma-dangle': ['error', 'always-multiline'],
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always',
        }],
        'brace-style': ['error', 'stroustrup'],
    },

    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard',
        '@vue/typescript'
    ],
};
