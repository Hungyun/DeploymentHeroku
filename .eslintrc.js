module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: 'airbnb',
    parserOptions: {
        ecmaVersion: 13,
    },
    rules: {
        indent: [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        quotes: [
            'error',
            'single',
        ],
        semi: [
            'error',
            'never',
        ],
    },
}
