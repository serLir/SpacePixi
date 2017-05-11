"use strict";

const webpack = require('webpack');
const path = require('path');

const NODE_ENV = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
const DEV_ENV = true;

module.exports = {
    context: path.resolve(__dirname, 'app'),

    entry: {
        main: './js/main'
    },

    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].js',
        library: '[name]'
    },

    watch: DEV_ENV,

    watchOptions: {
        aggregateTimeout: 100
    },

    devtool: DEV_ENV ? 'source-map' : null,

    plugins: [
        //new webpack.NoEmitOnErrorsPlugin()
        new webpack.NoErrorsPlugin()
        //new webpack.DefinePlugin({
        //    NODE_ENV: JSON.stringify(NODE_ENV)
        //})
    ],

    module: {
        loaders: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'app'),
            loader: 'babel-loader'
        }, {
            test: /\.(png|jpg|svg|)$/,
            loader: 'file?name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            //include: path.resolve(__dirname, 'app'),
            loader: 'style-loader!css-loader!sass-loader'
        }, {
            test: /\.html$/,
            loader: "underscore-template-loader"
        }]
    }

};

if (!DEV_ENV) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
}