var webpack = require('webpack');
var path = require('path');
var failPlugin = require('webpack-fail-plugin');

module.exports = function(env) {
    if (!env) {
        env = {};
    }

    var plugins = [
        failPlugin,
    ];
    var externals = {};

    var entryPoints = [
        './src/index-bundle.js',
        './src/ui-bundle.js',
    ];

    var outputBasename = 'allihoopa-standalone';
    if (env.externalReact) {
        outputBasename = 'allihoopa';
        externals = {
            'react': 'React',
            'react-dom': 'ReactDOM',
        };
    } else if (env.headless) {
        outputBasename = 'allihoopa-headless';

        entryPoints = [
            './src/index-bundle.js',
        ]
    }

    if (env.versionTag) {
        outputBasename += `-${env.versionTag}`;
    }

    var outputFilename = `${outputBasename}.js`;
    if (env.production) {
        outputFilename = `${outputBasename}.min.js`;
        plugins.push(new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            },
        }));
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false,
                dead_code: true,
            },
        }));
    }

    plugins.push(new webpack.LoaderOptionsPlugin({
        options: {
            tslint: {
                emitErrors: true,
                failOnHint: true,
            },
        }
    }));

    return {
        entry: entryPoints,
        output: {
            path: path.join(__dirname, '/dist'),
            filename: outputFilename,
            library: 'allihoopa',
            libraryTarget: 'umd',
            umdNamedDefine: true,
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
            extensions: [ '.js', '.ts', '.tsx'],
        },
        plugins: plugins,
        externals: externals,
    };
};
