const plugins = require('./plugins');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== 'production'

const JSLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env']
        }
    }
};
const ESLintLoader = {
    test: /\.js$/,
    enforce: 'pre',
    exclude: /node_modules/,
    use: {
        loader: 'eslint-loader',
        options: {
            configFile: __dirname + '/.eslintrc',
            fix: true
        },
    }
};

let use

if (devMode) {
    use = [
        'css-hot-loader',
        { loader: 'style-loader', options: { sourceMap: true } },
        {
            loader: 'css-loader',
            options: { importLoaders: 1, sourceMap: true  },
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true, 
                config: {
                    path: __dirname + '/postcss.config.js'
                }
            },
        },
        { loader: 'sass-loader', options: { sourceMap: true } }
    ]
}
else {
    use = ['css-hot-loader'].concat(plugins.ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    minimize: true
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    config: {
                        path: __dirname + '/postcss.config.js'
                    }
                },
            },
            'sass-loader'
        ]
    }))
}

const CSSLoader = {
    test: /\.s?css$/,
    use
};

module.exports = {
    JSLoader,
    ESLintLoader,
    CSSLoader
};