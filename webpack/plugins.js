const path = require('path');
const _ExtractTextPlugin = require('extract-text-webpack-plugin');
const _HTMLPlugin = require('html-webpack-plugin');
const _CleanWebpackPlugin = require('clean-webpack-plugin');
const _StyleLintPlugin = require('stylelint-webpack-plugin');
const _MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== 'production'

// the path(s) that should be cleaned
const pathsToClean = devMode ? [] : ['dist']

// the clean options to use
const cleanOptions = {
  root: path.resolve(__dirname, '../'),
  exclude:  ['shared.js'],
  verbose:  true,
  dry:      false
}

let ExtractTextPlugin = null
if (devMode) {
    ExtractTextPlugin = new _MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
    });
}
else {
    ExtractTextPlugin = new _ExtractTextPlugin('css/[name].[hash].bundle.css');
}

const HTMLPlugin = new _HTMLPlugin({
    template: './src/index.html',
    minify: devMode ? false : { collapseWhitespace: true, removeComments: true }
});
const CleanWebpackPlugin = new _CleanWebpackPlugin(pathsToClean, cleanOptions);
const StyleLintPlugin = new _StyleLintPlugin({
    configFile: path.resolve(__dirname, 'stylelint.config.js'),
    context: path.resolve(__dirname, '../src/css'),
    files: ['**/*.s?(a|c)ss', '**/*.css'],
    failOnError: false,
    emitErrors: true,
    quiet: false,
    syntax: "scss"
});

module.exports = {
    HTMLPlugin,
    ExtractTextPlugin,
    CleanWebpackPlugin,
    StyleLintPlugin
};