const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    entry: {
        app: './src/whac_a_mole/main.js',
    },
    output: {
        filename: 'js/[name].[contenthash:7].js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'none',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'sass-loader' }
                ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ filename: 'whac_a_mole.html', template: './views/whac_a_mole.html' }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:7].css',
            chunkFilename: 'css/[name].[contenthash:7].css',
            ignoreOrder: false
        }),
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
                }
            }
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    mode: 'production'
}
