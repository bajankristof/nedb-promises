module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 13,
    },
    rules: {
        'indent': [ 'error', 4 ],
        'linebreak-style': [ 'error', 'unix' ],
        'quotes': [ 'error', 'single' ],
        'semi': [ 'error', 'always' ],
        'comma-dangle': [ 'error', 'always-multiline' ],
        'quote-props': [ 'error', 'consistent-as-needed' ],
        'no-multiple-empty-lines': [ 'error' ],
        'space-before-function-paren': [ 'error', { anonymous: 'never', named: 'never', asyncArrow: 'always' } ],
        'default-case-last': [ 'error' ],
    },
};
