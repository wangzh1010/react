const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// var Px2remWebpackPlugin = require('px2rem-webpack-plugin')
module.exports = {
    entry: {
        main: './src/whac_a_mole/main.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/pages')
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 3000,
        hot: true,
        open: false,
        openPage: 'pages',
        index: 'whac_a_mole.html'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: { loader: 'babel-loader' }
            },
            {
                test: /\.scss$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
            },
            {
                test: /\.(jpg|png|ico)$/,
                use: {
                    loader: 'url-loader'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: 'pages/whac_a_mole.html', template: 'views/whac_a_mole.html' }),
        // new Px2remWebpackPlugin({ originScreenWidth: 750, maxWidth: 750 }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /node_modules/,
                    name: 'vendors',
                    priority: 5
                },
                commonJS: {
                    test: /common/,
                    name: 'common',
                    priority: 1,
                    enforce: true
                },
                testJS: {
                    test: /cases/,
                    name: 'test',
                    priority: 1,
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    mode: 'development'
}
