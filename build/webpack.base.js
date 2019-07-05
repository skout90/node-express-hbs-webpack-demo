const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const globImporter = require('node-sass-glob-importer');
const HtmlWebpackCustomInjectPlugin = require("html-webpack-custominject-plugin");
const AutoDllPlugin = require("autodll-webpack-plugin");

const config = require("../config");
const htmlWebpackPlugins = require("./plugins/multi-html-webpack-plugin");

const publicPath = config.build.publicPath;
const isLocal = process.env.NODE_ENV === "local";

module.exports = {
  entry: {
    "home.index": ["./client/js/home/index.js"],

    "shared.404": ["./client/js/shared/404.js"],
    "shared.500": ["./client/js/shared/500.js"]
  },
  output: {
    filename: isLocal
      ? "js/[name]-[hash:8].js"
      : "js/[name]-[contenthash:8].js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: publicPath
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendors: {
  //         name: `chunk-vendors`,
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10,
  //         chunks: 'initial' // async 비동기 모듈 작동， initial 초기모듈 작동， all 모든 작업
  //       },
  //       // vue: {
  //       //   name: 'chuank-vue',
  //       //   test: /[\\/]node_modules[\\/]vue[\\/]/,
  //       //   priority: 10,
  //       //   chunks: 'initial'
  //       // },
  //       // common: {
  //       //   name: `chunk-common`,
  //       //   minChunks: 2,
  //       //   priority: -20,
  //       //   chunks: 'initial',
  //       //   reuseExistingChunk: true
  //       // }
  //     }
  //   },
  //   // runtimeChunk: {
  //   //   name: 'manifest'
  //   // }
  // },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": process.env.NODE_ENV
    }),
    // views 폴더를 조회해서 entry chunk 파일을 추가
    ...htmlWebpackPlugins,
    new HtmlWebpackCustomInjectPlugin(),
    // lib plugin을 chunk로 만들어 추가
    new AutoDllPlugin({
      context: path.join(__dirname, "../"),
      inject: true,
      filename: isLocal ? "[name]-[hash:8].js" : "[name]-[contenthash:8].js",
      path: "./lib",
      entry: {
        vendor: ["axios", "jquery", "core-js"]
      }
    }),
    new MiniCssExtractPlugin({
      filename: isLocal
        ? "css/[name]-[hash:8].css"
        : "css/[name]-[contenthash:8].css",
      chunkFilename: "[id].css"
    }),
    new webpack.ProgressPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "..", "client", "views", "partials"),
        to: path.resolve(__dirname, "..", "dist", "views", "partials")
      },
      {
        from: path.resolve(__dirname, "..", "client", "assets"),
        to: path.resolve(__dirname, "..", "dist", "assets")
      },
      {
        from: path.resolve(__dirname, "..", "client", "img"),
        to: path.resolve(__dirname, "..", "dist", "img")
      }
    ])
    // new CopyWebpackPlugin([{
    //   from: path.resolve(__dirname, '..',  'client', 'font'),
    //   to: path.resolve(__dirname, '..',  'dist', 'font')
    // }])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader?cacheDirectory=true"
          },
          {
            // 자동으로 HMR 코드를 추가해준다.
            // https://github.com/JaylanChen/express-template-reload
            loader: "express-template-reload",
            options: {
              enable: isLocal,
              name: "[name].hbs", // view이름
              jsRootDir: "client/js/",
              templateRootDir: "client/views/",
              //nameFormat: name => name.substr(name.indexOf('views/') + 6, name.length),
              jsHotAccept: true
            }
          }
        ]
        // exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          isLocal ? 'style-loader' : MiniCssExtractPlugin.loader,
          "css-loader"
        ],
        // exclude: /node_modules/
      },
      // {
      //     test: /\.less$/,
      //     use: extractTextPlugin.extract({
      //         fallback:"style-loader",
      //         use: ["css-loader", "less-loader"]
      //     })
      // },
      // {
      //     test: /\.(scss|sass)$/,
      //     use: extractTextPlugin.extract({
      //         fallback:"style-loader",
      //         use: ["css-loader", "sass-loader"]
      //     })
      // },
      {
        test: /\.(scss|sass)$/,
        // sass-loader => css-loader -> MiniCssExtractPlugin(css 파일로 추출)
        use: [
          isLocal ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              importer: globImporter()
            }
          }
        ]
        // exclude: /node_modules/
      },
      {
        test: /\.hbs$/,
        oneOf: [
          {
            resourceQuery: /client/,
            loader: "handlebars-loader",
            query: {
              helperDirs: [path.join(__dirname, "..", "utils", "hbs.helpers")],
              partialDirs: [path.join(__dirname, "..", "views", "partials")]
            }
          },
          {
            loader: "raw-loader"
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "images/[name]-[hash:8].[ext]",
            publicPath: publicPath
          }
        }
        // exclude: /node_modules/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "css/font/[name]-[hash:8].[ext]",
            publicPath: publicPath
          }
        }
        // exclude: /node_modules/,
      }
    ]
  }
};
