var path = require('path');
var webpack = require('webpack');

var APP_IDENTIFIER = process.env.ALLIHOOPA_APP_IDENTIFIER;
var API_KEY = process.env.ALLIHOOPA_API_KEY;

if (!APP_IDENTIFIER || !API_KEY) {
    throw new Error('Please set the ALLIHOOPA_APP_IDENTIFIER and ALLIHOOPA_API_KEY environment variables before building this example');
}

module.exports = {
    entry: './src/index.ts',

    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'example.js',
        umdNamedDefine: true,
        publicPath: '/build/',
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                loader: 'tslint-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: [
            path.resolve('./src'),
            path.resolve('./node_modules'),
        ],
        extensions: [ '.js', '.ts'],
    },
    plugins: [
        new webpack.DefinePlugin({
            ALLIHOOPA_APP_IDENTIFIER: JSON.stringify(APP_IDENTIFIER),
            ALLIHOOPA_API_KEY: JSON.stringify(API_KEY),
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: true,
                    failOnHint: true,
                },
            },
        }),
    ],
};
