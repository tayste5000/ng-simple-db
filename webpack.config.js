var path = require('path'),
    webpack = require("webpack"),
    libPath = path.join(__dirname, 'lib'),
    outPath = path.join(__dirname, 'dist');


var config = {
    entry: path.join(libPath, 'index.ts'),
    output: {
        path: path.join(outPath),
        filename: 'ng-simpledb.js'
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            exclude: [/\.(spec|e2e)\.ts$/,/(node_modules)/],
            loader: "ts-loader"
        }]
    },
    plugins: [
        // OccurenceOrderPlugin: Assign the module and chunk ids by occurrence count. : https://webpack.github.io/docs/list-of-plugins.html#occurenceorderplugin
        new webpack.optimize.OccurenceOrderPlugin(),

        new webpack.optimize.DedupePlugin(),

        new webpack.optimize.UglifyJsPlugin()
    ]
};

module.exports = config;