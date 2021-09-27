module.exports = {
    'env': {
        'browser': true,
        'node': true,
        'commonjs': true,
        'es2021': true,
        'jest/globals': true
    },
    'plugins': ['jest'],
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};
