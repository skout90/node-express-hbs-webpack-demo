const webpack = require("webpack");
const merge = require("webpack-merge");
const config = require("../config");
const path = require("path");

const webpackBaseConfig = require("./webpack.base");

const hotMiddlewareScript = "webpack-hot-middleware/client?reload=true";
// webpack.base.conf의 entry에 대한 hot-reload 상대 경로 셋팅
Object.keys(webpackBaseConfig.entry).forEach(function(name) {
  //webpackBaseConfig.entry[name] = ['./dev-client'].concat(webpackBaseConfig.entry[name])
  webpackBaseConfig.entry[name] = [hotMiddlewareScript].concat(
    webpackBaseConfig.entry[name]
  );
});

module.exports = merge(webpackBaseConfig, {
  mode: "development",
  devtool: "eval",
  devServer: {
    contentBase: path.join(__dirname, "..", "dist"),
    hot: true,
    historyApiFallback: true,
    noInfo: false,
    host: "0.0.0.0",
    port: config.appPort,
    overlay: {
      errors: true
    }
  },
  plugins: [
    // HMR : 자동 브라우저 리로딩
    new webpack.HotModuleReplacementPlugin(),
    // HMR을 사용할 때 모듈의 상대 경로가 표시됩니다
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});
