"use strict";

const path = require('path');
const webpack = require('webpack');

const staticDir = path.join(__dirname, 'js/build');
const srcDir = path.join(__dirname, 'js/src');

const baseConfig = {

    context: srcDir,

    entry: {
        "main": [
            "./entry"
        ]
    },

    output: {
        path: staticDir,
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js",
        publicPath: '/js/build/',
        libraryTarget: 'var',
        library: "TodoMvcLiveResourceReact"
    },

    plugins: [
        // Inject node prod/dev mode into "process.env.NODE_ENV" to optimize output
        // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: [
                    {
                        // Use Babel to transpile ES2015 + ES2017 async syntax
                        loader: 'babel',
                        query: {
                            presets: [
                                ['es2015', {modules: false}],
                                'react'
                            ],
                            plugins: [
                                'transform-object-rest-spread',
                                'transform-async-to-generator',
                                'transform-runtime',
                                'transform-function-bind'
                            ]
                        }
                    }
                ],
                include: srcDir
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: srcDir
            },
            {
                test: /\.scss$/,
                loaders: [ 'style', 'css', 'resolve-url', 'sass?sourceMap' ]
            },
            {
                test: /\.(svg|jpg|gif|png)$/,
                loaders: [
                    {
                        loader: 'url',
                        query: {
                            "limit": 16384
                        }
                    }
                ],
                include: srcDir
            },
            {
                test: /\.(ttf|eot|woff|woff2)(\?[a-z0-9]+)?$/,
                loaders: ['file'],
                include: srcDir
            }
        ]
    },

    externals: {
        liveresource: "LiveResource"
    }
};

Object.keys(baseConfig.entry).forEach(e => {
    const entry = baseConfig.entry[e];
    entry.unshift(
        'core-js/shim',
        './shims/custom-event',
        'whatwg-fetch'
    );
});

const prodConfig = Object.assign({}, baseConfig, {

    // Use 'source-map' in prod mode, generate source maps
    devtool: 'source-map',

});

const devConfig = Object.assign({}, baseConfig, {

    // Seems to give good results in all browsers for now.
    devtool: 'eval',

    module: Object.assign({}, baseConfig.module, {
        preLoaders: [
            {
                test: /\.js$/,
                loaders: [
                    {
                        loader: 'eslint'
                    }
                ],
                include: srcDir
            }
        ]
    }),

    output: Object.assign({}, baseConfig.output, {
        pathinfo: true
    }),

    plugins: [
        ...baseConfig.plugins,
        new webpack.NamedModulesPlugin()
    ]

});

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
