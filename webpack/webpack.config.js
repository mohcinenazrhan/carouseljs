const path = require('path');
const loaders = require('./loaders');
const plugins = require('./plugins');

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
    entry: ["./src/js/index.js", "./src/css/style.scss"],
    output: {
        path: path.resolve('dist'),
        filename: "js/[name].[hash].bundle.js"
    },
    devServer: {
        contentBase: path.join(__dirname, '../src'),
        watchContentBase: true
    },
    devtool: devMode ? "cheap-module-eval-source-map" : false,
    module: {
        rules: [
            loaders.JSLoader,
            loaders.ESLintLoader,
            loaders.CSSLoader,
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'imgs/[name].[ext]'
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-gifsicle')({
                                    interlaced: false
                                }),
                                require('imagemin-mozjpeg')({
                                    progressive: true,
                                    arithmetic: false
                                }),
                                require('imagemin-pngquant')({
                                    floyd: 0.5,
                                    speed: 2
                                }),
                                require('imagemin-svgo')({
                                    plugins: [{
                                        removeTitle: true
                                    },
                                    {
                                        convertPathData: false
                                    }
                                    ]
                                })
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        plugins.CleanWebpackPlugin,
        plugins.HTMLPlugin,
        plugins.ExtractTextPlugin,
        plugins.StyleLintPlugin
    ]
}