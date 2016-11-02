var path = require('path'),
  webpack = require("webpack"),
  libPath = path.join(__dirname, '/'),
  wwwPath = path.join(__dirname, 'build'),
  pkg = require('./package.json'),
  HtmlWebpackPlugin = require('html-webpack-plugin-common-hash'),
  BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
  ngAnnotatePlugin = require('ng-annotate-webpack-plugin'),
  CommonsChunkPlugin = new require("webpack/lib/optimize/CommonsChunkPlugin"),
  extractTestPlugin = require("extract-text-webpack-plugin"),
  extractCSS = require("extract-text-webpack-plugin"),
  extractSASS = require("extract-text-webpack-plugin"),
  extractLESS = require("extract-text-webpack-plugin"),
  copyWebpackPlugin = require('copy-webpack-plugin')
 // helpers = require('../helpers/helper.path.js');

const chalk = require('chalk');
const crypto = require('crypto');

systemConfig = {};
//systemConfig.imagePath = '~' + helpers.root('..//assets//images/');


var customHash = getHashCode();

var config = {

  entry: {
    system: `./init/system.init.js`
  },
  debug: true,
  devtool: '#eval-source-maps',
  output: {
    path: path.join(wwwPath),
    filename: '[name].[hash:6].js',
    chunkFilename: "[id].[hash:6].js",
    hash: true
  },
  recursive: true,
  resolve: {
    modules: [
      path.resolve('./'),
      path.resolve('./node_modules')
    ],
    extensions: ['.js', '.ts', '.html', '.scss']
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|html|json|ts)$/,
        loader: 'string-replace',
        query: {
          multiple: [
            {search: "{{rootPath}}", replace: '', flags: 'g'}
          ]
        }
      }
    ],
    loaders: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|temp_scrips)/,
        loader: "babel?presets[]=es2015"
      }, {
        test: /\.ts(x?)$/,
        exclude: /(node_modules|temp_scrips)/,
        loader: 'babel-loader?presets[]=es2015!ts-loader'
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'file?name=[path][name]-[hash:6].[ext]' // inline base64 URLs for <=10kb images, direct URLs for the rest*/
      }, {
        test: /\.(html|md)$/,
        loaders: ["html?" + JSON.stringify({attrs: ["img:src", "img:ng-src"]})]
      }, {
        test: /\.(svg|woff|woff2|ttf|eot|ico|otf)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=[path][name].[ext]'
        /*}, {
         test: /\.(png|jpg)$/,
         loader: 'file?name=[path][name]-[hash:6].[ext]' // inline base64 URLs for <=10kb images, direct URLs for the rest*/
      }, {
        test: /\.css$/,
        loader: extractCSS.extract("style-loader", "css-loader!autoprefixer")
      }, {
        test: /\.scss$/,
        exclude: [/\.global\.scss$/],
        loaders: ['raw-loader', 'sass-loader']
      }, {
        test: /\.global\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.sass$/,
        loader: extractCSS.extract("style-loader", "css-loader!sass-loader!autoprefixer")
      }, {
        test: /\.less$/,
        loader: extractCSS.extract("style-loader", "css-loader!less-loader")
      }, {
        test: /\.json$/,
        exclude: /(node_modules)/,
        loader: "json-loader"
      }]
  },
  plugins: [
    // HtmlWebpackPlugin: Simplifies creation of HTML files to serve your webpack bundles : https://www.npmjs.com/package/html-webpack-plugin
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        files: ["./**/*.html"],
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        https: true,
        proxy: 'https://localhost:3100/'
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: true
      }
    ),
    new HtmlWebpackPlugin({
      chunks: ['system'],
      filename: 'index.html',
      package: pkg,
      template: `./init/system.html`,
      commonFileName: '',
      systemConfig: systemConfig
    }),
    new ngAnnotatePlugin({
      add: true
      // other ng-annotate options here
    }),
    new extractCSS("[name]." + customHash + ".css", {
      allChunks: false

    }),

    new copyWebpackPlugin([
      {
        from: 'distributions',
        to: 'distributions'
      },
    ])
  ]
};

function getHashCode() {
  return crypto.randomBytes(20).toString('hex').substring(0, 6);
}

module.exports = config;
