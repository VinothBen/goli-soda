require('babel-polyfill');
const commonPaths = require('./common-paths');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const Uglify = require("uglifyjs-webpack-plugin");

const config = {
  mode: 'production',
  entry: {
    app: ['babel-polyfill', `${commonPaths.appEntry}/index.js`]
  },
  output: {
    filename: 'static/[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: {
                    autoprefixer: {
                      browsers: 'last 2 versions'
                    }
                  }
                }
              }
            }
          ]
        })
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader", options: {
            sourceMap: false
          }
        }, {
          loader: "less-loader", options: {
            strictMath: true,
            noIeCompat: true,
            sourceMap: false
          }
        }]
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[hash]-[name].[ext]'
          }
        }]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles/styles.[hash].css',
      allChunks: true
    }),
    new CopyWebpackPlugin([
      { from: '/src/Images/*', to: '/dist/src/Images/', force: true }
    ], { debug: 'info' }
    )
  ],
  node: {
    fs: 'empty', 
    dns: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  externals: [
    {'./cptable': 'var cptable'},
    {'./jszip': 'jszip'}
  ]
};
module.exports = config;