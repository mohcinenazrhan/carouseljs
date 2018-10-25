const path = require('path');
const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = {
    entry: "./src/js/index.js",
    output: {
        path: path.resolve('dist'),
        filename: "js/[name].[hash].bundle.js"
    },
    devServer: {
        contentBase: path.join(__dirname, '../src'),
        watchContentBase: true
    },
    module: {
        rules: [
            loaders.JSLoader,
            loaders.ESLintLoader,
            loaders.CSSLoader
        ]
    },
    plugins: [
        plugins.CleanWebpackPlugin,
        plugins.HTMLPlugin,
        plugins.ExtractTextPlugin,
        plugins.StyleLintPlugin
    ]
}