const commonPaths = require('./common-paths');
console.log(FgCyan = "\x1b[36m");
console.log("projectRoot: ", commonPaths.projectRoot, FgGreen = "\x1b[32m");
console.log("");
console.log("outputPath: ", commonPaths.outputPath, FgYellow = "\x1b[33m");
console.log("");
console.log("appEntry: ", commonPaths.appEntry, FgBlue = "\x1b[34m");
console.log("");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    vendor: ['semantic-ui-react']
  },
  output: {
    path: commonPaths.outputPath
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          formatter: require("eslint/lib/formatters/stylish"),
          eslintPath: require.resolve('eslint'),
          emitWarning: true
        }
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    }),
    new webpack.ProvidePlugin({
      _: "lodash",
      "React": "react",
      "ReactDOM": "react-dom",
      "Promise": "imports-loader?this=>global!exports-loader?global.Promise!es6-promise",
      "fetch": "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
    })
  ]
};
module.exports = config;