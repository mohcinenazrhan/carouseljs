module.exports = {
    syntax: 'postcss-scss',
    plugins: {
        'postcss-import': {},
        'postcss-preset-env': {
            browsers: 'last 2 versions',
        },
        'cssnano': { preset: 'default' }
    }
};