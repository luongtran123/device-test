const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ROOT_DIR = path.resolve(__dirname);
const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');
const EXCLUDE_MATCH = new RegExp(/node_modules|dist/);

console.log('env:' + process.env.NODE_ENV);
let config = {
  entry:{
    index: path.join(SRC_DIR,'/js/index.js')
  },
  output: {
    filename: '[name].js?[chunkhash]',
    path: DIST_DIR,
    clean: true
  },
   experiments: {
    topLevelAwait: true
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: EXCLUDE_MATCH,
        use: ['babel-loader']
      },
      {
        test: /\.html$/,
        exclude: EXCLUDE_MATCH,
        use: [
          {
            loader:'html-loader',
            options:{
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        exclude: EXCLUDE_MATCH,
        options: {
          name: '[name].[ext]?[contenthash]',
          esModule: false,
          outputPath: 'images',
        },
      },
      {
        test: /\.scss$/,
        exclude: EXCLUDE_MATCH,
        use:[
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
              loader: 'sass-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                    require('autoprefixer')
                  ]
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
        '~': ROOT_DIR
    },
    extensions: ['.js']
  },
  watchOptions: {
      ignored: EXCLUDE_MATCH
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name].css?[chunkhash]"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['index'],
      'meta': {
        'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no', //Note for this mockup: shrink-to-fit is used to include ios 9-9.2 users ios 9.3 users not needed but wont cause damage
      }
    })
  ]
};

const isProd = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() == 'production';
config = isProd ?
  {...config,...{
    mode: 'production', 
    devtool: false,
  }} 
  :
  {...config, ...{
    mode: 'development', //important: optimises for development
    devtool: 'inline-source-map', //enables visual studio debugging
  }}
module.exports = config;
