"use strict";

const path = require('path');
const webpack = require('webpack');

const staticDir = path.join(__dirname, 'js/build');
const srcDir = path.join(__dirname, 'js/src');

function buildBabelRule(...additionalPlugins) {
    const babelRule = {
        test: /\.js$/,
        use: [
            {
                // Use Babel to transpile ES2015 + ES2017 async syntax
                loader: 'babel-loader',
                options: JSON.stringify({
                    presets: [
                        ['es2015', {modules: false}],
                        'react'
                    ],
                    plugins: [
                        ...additionalPlugins,
                        'transform-object-rest-spread',
                        'transform-async-to-generator',
                        'transform-runtime',
                        'transform-function-bind'
                    ]
                })
            }
        ],
        include: srcDir
    };

    return babelRule;
}

const babelRule = buildBabelRule();

const cssRule = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
    include: srcDir
};

const scssRule = {
    test: /\.scss$/,
    use: [ 'style-loader', 'css-loader?minimize&-autoprefixer', 'resolve-url-loader', 'sass-loader?sourceMap' ]
};

const urlRule = {
    test: /\.(svg|jpg|gif|png)$/,
    use: [
        {
            loader: 'url-loader',
            options: JSON.stringify({
                "limit": 16384
            })
        }
    ],
    include: srcDir
};

const fileRule = {
    test: /\.(ttf|eot|woff|woff2)(\?[a-z0-9]+)?$/,
    loaders: ['file-loader'],
    include: srcDir
};

// Inject node prod/dev mode into "process.env.NODE_ENV" to optimize output
// https://webpack.github.io/docs/list-of-plugins.html#defineplugin
const envPlugin = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
});

const namedModulesPlugin = new webpack.NamedModulesPlugin();

const esLintRule = {
    enforce: 'pre',
    test: /\.js$/,
    use: [ 'eslint-loader' ],
    include: srcDir
};

const baseConfig = {

    context: srcDir,

    entry: {
        "main": [
            'core-js/shim',
            './shims/custom-event',
            'whatwg-fetch',
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
        envPlugin
    ],

    module: {
        rules: [
            babelRule,
            cssRule,
            scssRule,
            urlRule,
            fileRule
        ]
    },

    node: {
        console: true,
        fs: 'empty'
    }

};

const prodConfig = Object.assign({}, baseConfig, {

    devtool: 'source-map',

    plugins: [ envPlugin ]

});

const devConfig = Object.assign({}, baseConfig, {

    // quick sourcemaps in dev
    devtool: 'eval',

    module: {
        rules: [
            esLintRule,
            babelRule, // babelRuleReactHotLoader (disabling for now)
            cssRule,
            scssRule,
            urlRule,
            fileRule
        ]
    },

    output: Object.assign({}, baseConfig.output, {
        pathinfo: true
    }),

    plugins: [ envPlugin, namedModulesPlugin ]

});

module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
