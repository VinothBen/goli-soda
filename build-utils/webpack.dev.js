require('babel-polyfill');
const commonPaths = require('./common-paths');
const webpack = require('webpack');
const port = parseInt(process.env.PORT, 10) || 3000;
const config = {
  mode: 'development',
  entry: {
    app: ['babel-polyfill',`${commonPaths.appEntry}/index.js`]
  },
  output: {
    filename: '[name].[hash].js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              camelCase: true,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader", options: {
            sourceMap: true
          }
        }, {
          loader: "less-loader", options: {
            strictMath: true,
            noIeCompat: true,
            sourceMap: true
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
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    hot: true,
    compress: true,
  },
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